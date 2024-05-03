import { BurstSpawn } from "API/Nodes/Spawn/BurstSpawn";

export function AutoGenBurstSpawn(node: BurstSpawn) {
    const className = `BurstSpawn${node.id}`;
    const varName = `burstSpawn${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Spawn", "BurstSpawn").BurstSpawn \n`;
    src += `local ${varName} = ${className}.new() \n`;
    src += `${varName}.nodeFields.amount.SetNumber(${node.nodeFields.amount.GetNumber()}) \n`;
    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
