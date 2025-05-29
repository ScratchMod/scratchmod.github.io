import Mods from "./mods.js";
import "./tree.js";

function printTree(mod, indent = 0) {
    console.log("  ".repeat(indent) + "- " + mod.name);
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
        try {
            const url = new URL(mod.link);
            favicon.src = url.origin + "/static/favicon.ico";
        } catch {
            favicon.src = "";
        }
    }

    const link = document.createElement("a");
    link.href = mod.link;
    link.target = "_blank";
    link.textContent = mod.name;

    info.appendChild(favicon);
    info.appendChild(link);
    return info;
}

let nextX = 0;
const nodePositions = new Map(); // mod => {x, y}
function layoutTree(mod, depth = 0) {
    const children = Object.values(mod.children || {});
    const x = nextX++;
    nodePositions.set(mod, { x, y: depth });

    children.forEach(child => layoutTree(child, depth + 1));
    return { x, y: depth };
}

function buildTree() {
    treeContainer.innerHTML = "";
    nextX = 0;
    nodePositions.clear();

    layoutTree(Mods.Scratch);

    nodePositions.forEach((pos, mod) => {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "mod-node";
        nodeDiv.style.position = "absolute";
        nodeDiv.style.left = (pos.x * 200) + "px";
        nodeDiv.style.top = (pos.y * 150) + "px";

        const btn = createButton(mod, pos.y);
        const info = createInfoPanel(mod);

        btn.addEventListener("click", () => {
            info.style.display = info.style.display === "block" ? "none" : "block";
        });

        nodeDiv.appendChild(btn);
        nodeDiv.appendChild(info);
        treeContainer.appendChild(nodeDiv);

        nodePositions.set(mod, nodeDiv);
    });

    updateContainerSize();
}

function updateContainerSize() {
    let maxX = 0, maxY = 0;
    nodePositions.forEach(div => {
        if (!(div instanceof HTMLElement)) return;
        const right = div.offsetLeft + div.offsetWidth;
        const bottom = div.offsetTop + div.offsetHeight;
        if (right > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
    });
    treeContainer.style.width = maxX + "px";
    treeContainer.style.height = maxY + "px";
}

function drawConnections() {
    const rect = treeContainer.getBoundingClientRect();
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);
    svg.style.width = rect.width + "px";
    svg.style.height = rect.height + "px";
    svg.style.top = rect.top + window.scrollY + "px";
    svg.style.left = rect.left + window.scrollX + "px";

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    nodePositions.forEach((parentEl, parentMod) => {
        if (!(parentEl instanceof HTMLElement)) return;

        for (const key in parentMod.children) {
            const childMod = parentMod.children[key];
            const childEl = nodePositions.get(childMod);
            if (!(childEl instanceof HTMLElement)) continue;

            const startX = parentEl.offsetLeft + parentEl.offsetWidth / 2;
            const startY = parentEl.offsetTop + parentEl.offsetHeight;

            const endX = childEl.offsetLeft + childEl.offsetWidth / 2;
            const endY = childEl.offsetTop;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
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
}

let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;

const wrapper = document.getElementById("tree-wrapper");

wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomAmount = -e.deltaY * 0.001;
    scale += zoomAmount;
    scale = Math.min(Math.max(0.2, scale), 3);
    updateTransform();
});

wrapper.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
    treeContainer.style.cursor = "grabbing";
});
window.addEventListener("mouseup", () => {
    isDragging = false;
    treeContainer.style.cursor = "grab";
});
window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    originX = e.clientX - startX;
    originY = e.clientY - startY;
    updateTransform();
});

function updateTransform() {
    const transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    drawConnections();
}

buildTree();
window.requestAnimationFrame(() => {
    drawConnections();
    updateTransform();
});

window.addEventListener("resize", drawConnections);
window.addEventListener("scroll", drawConnections);