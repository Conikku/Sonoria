import { GetAllSystems } from "Services/NodeSystemService";
import type { NodeSystem } from "./NodeSystem";
import type { RenderNode } from "./Nodes/Render/RenderNode";
import type { SpawnNode } from "./Nodes/Spawn/SpawnNode";

export interface Src {
    value: string;
}

export default function ExportAsScript() {
    const convertedFiles: ModuleScript[] = [];

    for (const system of GetAllSystems()) {
        let passedChecks = true;

        if (system.data.system.spawnNode === undefined) {
            warn(`${system.data.systemName} is missing a spawn node.`);
            passedChecks = false;
        }

        if (system.data.system.renderNode === undefined) {
            warn(`${system.data.systemName} is missing a render node.`);
            passedChecks = false;
        }

        if (!passedChecks) continue;

        const convertedFile = CreateScript(tostring(system.data.id), system.data.system);
        convertedFile.Name = tostring(system.data.systemName);
        convertedFiles.push(convertedFile);
    }

    return convertedFiles;
}

function CreateScript(name: string, nodeSystem: NodeSystem) {
    const newScript = new Instance("ModuleScript");
    newScript.Name = name;

    const src = { value: "" };

    src.value += "--[[\n";
    src.value += "    Auto generated script.\n";
    src.value += "    Call .Start() to run the VFX.\n";
    src.value += "    Call .Stop() to stop the VFX.\n";
    src.value += "]]\n\n";

    src.value += "local VFXScript = {}\n\n";

    src.value += 'local ReplicatedStorage = game:GetService("ReplicatedStorage")\n';
    src.value += "local APIFolder = ReplicatedStorage.Sonoria_API.API\n";
    src.value += "local TS = require(ReplicatedStorage.Sonoria_API.include.RuntimeLib)\n\n";

    src.value += 'local NodeSystem = TS.import(script, APIFolder, "NodeSystem").NodeSystem\n';
    src.value += "local nodeSystem = NodeSystem.new()\n\n";

    (nodeSystem.spawnNode as SpawnNode).GetAutoGenerationCode(src);
    src.value += "\n\n";

    for (const node of nodeSystem.initializeNodes) {
        node.GetAutoGenerationCode(src);
        src.value += "\n\n";
    }

    for (const node of nodeSystem.updateNodes) {
        node.GetAutoGenerationCode(src);
        src.value += "\n\n";
    }

    (nodeSystem.renderNode as RenderNode).GetAutoGenerationCode(src);
    src.value += "\n\n";

    src.value += "function VFXScript.Start()\n";
    src.value += "    nodeSystem:Run()\n";
    src.value += "end\n\n";

    src.value += "function VFXScript.SetColorRamp(includeType: \"id\"|\"time\", include: \"all\"|number, color3: Color3)\n"
    src.value += "    local updateNodes = nodeSystem.NodeGroups[2].Nodes\n"
    src.value += "    local h, s, v = color3:ToHSV()\n"
    src.value += "    \n"
    src.value += "    for i, node in updateNodes do\n"
    src.value += "        if node:GetClassName() ~= \"SetColorOverLife\" then continue end\n"
    src.value += "        local ramp = node.nodeFields.ramp\n"
    src.value += "        \n"
    src.value += "        if include == \"all\" then\n"
    src.value += "            table.clear(ramp.colorPoints)\n"
    src.value += "            ramp.FieldChanged:Fire()\n"
    src.value += "            ramp.startPoint.color.SetHSV(h, s, v)\n"
    src.value += "            ramp.endPoint.color.SetHSV(h, s, v)\n"
    src.value += "            continue\n"
    src.value += "        end\n"
    src.value += "        \n"
    src.value += "        if includeType == \"time\" and include == 0 then\n"
    src.value += "            ramp.startPoint.color.SetHSV(h, s, v)\n"
    src.value += "            continue\n"
    src.value += "        elseif includeType == \"time\" and include == 1 then\n"
    src.value += "            ramp.endPoint.color.SetHSV(h, s, v)\n"
    src.value += "            continue\n"
    src.value += "        end\n"
    src.value += "        \n"
    src.value += "        local currentPoint\n"
    src.value += "        for i, point in ramp.colorPoints do\n"
    src.value += "            if point[includeType] == include then\n"
    src.value += "                currentPoint = point\n"
    src.value += "            end\n"
    src.value += "        end\n"
    src.value += "        \n"
    src.value += "        if not currentPoint then\n"
    src.value += "            if includeType == \"id\" then\n"
    src.value += "                warn(\"Can't add point while includeType is \\\"id\\\"\") ; continue\n"
    src.value += "            end\n"
    src.value += "            ramp:AddPoint(include, Vector3.new(color3.R, color3.G, color3.B))\n"
    src.value += "        else\n"
    src.value += "            currentPoint.color.SetHSV(h, s, v)\n"
    src.value += "        end\n"
    src.value += "    end\n"
    src.value += "end\n\n"

    src.value += "function VFXScript.Stop()\n";
    src.value += "    nodeSystem:Stop()\n";
    src.value += "end\n\n";

    src.value += "return VFXScript";

    newScript.Source = src.value;
    return newScript;
}
