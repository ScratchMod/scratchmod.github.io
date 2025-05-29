import Mods from "./mods.js";
import "./tree.js";

function printTree(mod, indent = 0) {
    console.log('  '.repeat(indent) + '- ' + mod.name);
    for (const key in mod.children) {
        printTree(mod.children[key], indent + 1);
    }
}
printTree(Mods.Scratch);

const treeContainer = document.getElementById("tree-container");
const svg = document.getElementById("connections");

function createButton(mod, depth) {
    const btn = document.createElement("button");
    btn.textContent = mod.name;
    btn.className = "mod-button";

    const scale = 1 - 0.15 * depth;
    btn.style.fontSize = 18 * scale + "px";
    btn.style.padding = 12 * scale + "px " + 20 * scale + "px";
    return btn;
}

function createInfoPanel(mod) {
    const info = document.createElement("div");
    info.className = "mod-info";

    const favicon = document.createElement("img");
    try {
        const url = new URL(mod.link);
        favicon.src = url.origin + "/favicon.ico";
    } catch {
        favicon.src = "";
    }

    const link = document.createElement("a");
    link.href = mod.link;
    link.target = "_blank";
    link.textContent = mod.name;

    info.appendChild(favicon);
    info.appendChild(link);
    return info;
}

function getLevels(root) {
    const levels = [];
    function traverse(node, depth) {
        if (!levels[depth]) levels[depth] = [];
        levels[depth].push(node);
        for (const key in node.children) {
            traverse(node.children[key], depth + 1);
        }
    }
    traverse(root, 0);
    return levels;
}

const levels = getLevels(Mods.Scratch);
const nodePositions = new Map();

function buildTree() {
    treeContainer.innerHTML = "";
    levels.forEach((nodes, depth) => {
        const levelDiv = document.createElement("div");
        levelDiv.className = "tree-level";

        nodes.forEach((mod) => {
            const nodeDiv = document.createElement("div");
            nodeDiv.className = "mod-node";

            const btn = createButton(mod, depth);
            const info = createInfoPanel(mod);

            btn.addEventListener("click", () => {
                info.style.display = info.style.display === "block" ? "none" : "block";
            });

            nodeDiv.appendChild(btn);
            nodeDiv.appendChild(info);
            levelDiv.appendChild(nodeDiv);

            nodePositions.set(mod, nodeDiv);
        });
        treeContainer.appendChild(levelDiv);
    });
}

function drawConnections() {
    const rect = treeContainer.getBoundingClientRect();
    svg.style.width = rect.width + "px";
    svg.style.height = rect.height + "px";
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);
    svg.style.top = rect.top + window.scrollY + "px";
    svg.style.left = rect.left + window.scrollX + "px";

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    levels.forEach((nodes, depth) => {
        if (depth === levels.length - 1) return;

        nodes.forEach((parentMod) => {
            const parentDiv = nodePositions.get(parentMod);
            if (!parentDiv) return;
            const parentRect = parentDiv.getBoundingClientRect();

            for (const key in parentMod.children) {
                const childMod = parentMod.children[key];
                const childDiv = nodePositions.get(childMod);
                if (!childDiv) continue;
                const childRect = childDiv.getBoundingClientRect();

                const startX = parentRect.left + parentRect.width / 2 - rect.left;
                const startY = parentRect.bottom - rect.top;

                const endX = childRect.left + childRect.width / 2 - rect.left;
                const endY = childRect.top - rect.top;

                const path = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );
                const curveOffset = 20;
                const d = `M${startX},${startY} 
                    C${startX},${startY + curveOffset} 
                    ${endX},${endY - curveOffset} 
                    ${endX},${endY}`;

                path.setAttribute("d", d);
                path.setAttribute("stroke", "#2a7ae2");
                path.setAttribute("stroke-width", "2");
                path.setAttribute("fill", "none");

                svg.appendChild(path);
            }
        });
    });
}

function onResizeOrLoad() {
    drawConnections();
}

buildTree();
window.requestAnimationFrame(() => {
    drawConnections();
});

window.addEventListener("resize", onResizeOrLoad);
window.addEventListener("scroll", onResizeOrLoad);