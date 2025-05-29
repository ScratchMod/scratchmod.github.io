import Mods from "./mods";

Mods.Scratch.children = {
    TurboWarp: Mods.Turbowarp,
    OpenBlock: Mods.OpenBlock,
    GandiIDE: Mods.Cocrea,
    Cognimates: Mods.Cognimates,
    Smalruby: Mods.Smalruby,
    E_icques: Mods.E_icques,
    Bricklife: Mods.Bricklife,
}

Mods.Turbowarp.children = {
    PenguinMod: Mods.Penguinmod,
    AmpMod: Mods.Ampmod,
    MistWarp: Mods.Mistwarp,
    Unsandboxed: Mods.Unsandboxed,
    MyScratchBlocks: Mods.MyScratchBlocks,
    NitroBolt: Mods.NitroBolt,
    ShredMod: Mods.Shredmod,
    NuclearMod: Mods.Nuclearmod,
    BlockScript: Mods.BlockScript,
}

Mods.Shredmod.children = {
    RocketBlocks: Mods.RocketBlocks,
}

Mods.Penguinmod.children = {
    SnailIDE: Mods.SnailIDE,
    ElectraMod: Mods.Electramod,
    Plungermod: Mods.Plungermod,
    OrangeMod: Mods.Orangemod,
    FalconMod: Mods.Falconmod,
    ZypheraMod: Mods.Zypheramod,
    EspressoBlocks: Mods.Espressoblocks,
    ZincCoding: Mods.ZincCoding,
    HiddenBlocks: Mods.Hiddenblocks,
    DinosaurMod: Mods.Dinosaurmod,
}

Mods.SnailIDE.children = {
    CircleIDE: Mods.CircleIDE,
    BananaMod: Mods.Bananamod,
    CrabsProgramming: Mods.CrabsProgramming,
    BatsCoding: Mods.Batscoding,
}

export default Mods;