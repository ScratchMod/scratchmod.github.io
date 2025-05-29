import Mods from "./tree";

function printTree(mod, indent = 0) {
    console.log('  '.repeat(indent) + '- ' + mod.name);
    for (const key in mod.children) {
        printTree(mod.children[key], indent + 1);
    }
}
printTree(Mods.Scratch);