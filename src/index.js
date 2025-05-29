import Mods from "./mods.js";
import "./tree.js";

document.addEventListener("DOMContentLoaded", () => {
    function printTree(mod, indent = 0) {
        console.log("  ".repeat(indent) + "- " + mod.name);
        for (const key in mod.children) {
            printTree(mod.children[key], indent + 1);
        }
    }
    printTree(Mods.Scratch);

    const treeContainer = document.getElementById("tree-container");
    const svg = document.getElementById("connections");

    const nodeCoords = new Map();
    const nodeElements = new Map();

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
    const nodePositions = new Map();

    function layoutTree(mod, depth = 0) {
        const children = Object.values(mod.children || {});
        let x = nextX;

        const childPositions = children.map(child => layoutTree(child, depth + 1));
        if (childPositions.length > 0) {
            x = childPositions.reduce((sum, pos) => sum + pos.x, 0) / childPositions.length;
        } else {
            x = nextX++;
        }

        nodePositions.set(mod, { x, y: depth });
        nodeCoords.set(mod, { x, y: depth });
        return { x, y: depth };
    }

    function buildTree() {
        const allNodes = Array.from(treeContainer.children).filter(child => child.tagName !== "svg");
        for (const node of allNodes) {
            treeContainer.removeChild(node);
        }

        nextX = 0;
        nodePositions.clear();

        layoutTree(Mods.Scratch);

        let maxRight = 0;
        let maxBottom = 0;

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
            nodeElements.set(mod, nodeDiv);

            const rightEdge = pos.x * 200 + nodeDiv.offsetWidth;
            const bottomEdge = pos.y * 150 + nodeDiv.offsetHeight;

            if (rightEdge > maxRight) maxRight = rightEdge;
            if (bottomEdge > maxBottom) maxBottom = bottomEdge;
        });

        treeContainer.style.width = (maxRight + 40) + "px";
        treeContainer.style.height = (maxBottom + 40) + "px";
    }

    function drawConnections() {
        const group = document.getElementById("connections-group");
        while (group.firstChild) group.removeChild(group.firstChild);

        nodeCoords.forEach((pos, mod) => {
            const parentX = pos.x * 200 + 100;
            const parentY = pos.y * 150 + 25;

            for (const key in mod.children) {
                const childMod = mod.children[key];
                const childPos = nodeCoords.get(childMod);
                if (!childPos) continue;

                const childX = childPos.x * 200 + 100;
                const childY = childPos.y * 150 + 25;

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const curveOffset = 20;
                const d = `M${parentX},${parentY + 20} C${parentX},${parentY + 20 + curveOffset} ${childX},${childY - 20 - curveOffset} ${childX},${childY - 20}`;
                path.setAttribute("d", d);
                path.setAttribute("stroke", "#2a7ae2");
                path.setAttribute("stroke-width", "2");
                path.setAttribute("fill", "none");

                group.appendChild(path);
            }
        });

        const rect = treeContainer.getBoundingClientRect();
        svg.setAttribute("width", treeContainer.clientWidth);
        svg.setAttribute("height", treeContainer.clientHeight);
        svg.style.width = treeContainer.clientWidth + "px";
        svg.style.height = treeContainer.clientHeight + "px";
        svg.style.top = 0;
        svg.style.left = 0;
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
        drawConnections();
    });

    function updateTransform() {
        treeContainer.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    
        /*const group = document.getElementById("connections-group");
        if (group) {
            group.setAttribute("transform", `translate(${originX},${originY}) scale(${scale})`);
        }*/
        drawConnections();
    }

    buildTree();
    window.requestAnimationFrame(() => {
        drawConnections();
        updateTransform();
    });

    window.addEventListener("resize", drawConnections);
    window.addEventListener("scroll", drawConnections);

    drawConnections();
});