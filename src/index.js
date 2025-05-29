import Mods from "./tree.js";

function printTree(mod, indent = 0) {
    console.log('  '.repeat(indent) + '- ' + mod.name);
    for (const key in mod.children) {
        printTree(mod.children[key], indent + 1);
    }
}
printTree(Mods.Scratch);

function createModNode(mod) {
    const container = document.createElement('div');
    container.className = 'mod-node';

    const button = document.createElement('button');
    button.className = 'mod-button';
    button.textContent = mod.name;

    const info = document.createElement('div');
    info.className = 'mod-info';

    const favicon = document.createElement('img');
    try {
        const url = new URL(mod.link);
        favicon.src = url.origin + '/favicon.ico';
    } catch {
        favicon.src = '';
    }

    const link = document.createElement('a');
    link.href = mod.link;
    link.target = '_blank';
    link.textContent = mod.name;

    info.appendChild(favicon);
    info.appendChild(link);
    info.style.display = 'none';

    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'children-container';

    button.addEventListener('click', () => {
        const isVisible = childrenContainer.style.display === 'block';
        childrenContainer.style.display = isVisible ? 'none' : 'block';
        info.style.display = isVisible ? 'none' : 'inline-flex';
    });

    for (const key in mod.children) {
        const childNode = createModNode(mod.children[key]);
        childrenContainer.appendChild(childNode);
    }

    container.appendChild(button);
    container.appendChild(info);
    container.appendChild(childrenContainer);

    return container;
}

const treeRoot = document.getElementById('mod-tree');
treeRoot.appendChild(createModNode(Mods.Scratch));