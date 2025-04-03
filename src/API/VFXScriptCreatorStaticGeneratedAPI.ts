const fn_SetColorRamp = [
    "function VFXScript.SetColorRamp(includeType: \"id\"|\"time\", include: \"all\"|number, color3: Color3)",
    "    local updateNodes = nodeSystem.NodeGroups[2].Nodes",
    "    local h, s, v = color3:ToHSV()",
    "    ",
    "    for i, node in updateNodes do",
    "        if node:GetClassName() ~= \"SetColorOverLife\" then continue end",
    "        local ramp = node.nodeFields.ramp",
    "        ",
    "        if include == \"all\" then",
    "            table.clear(ramp.colorPoints)",
    "            ramp.FieldChanged:Fire()",
    "            ramp.startPoint.color.SetHSV(h, s, v)",
    "            ramp.endPoint.color.SetHSV(h, s, v)",
    "            continue",
    "        end",
    "        ",
    "        if includeType == \"time\" and include == 0 then",
    "            ramp.startPoint.color.SetHSV(h, s, v)",
    "            continue",
    "        elseif includeType == \"time\" and include == 1 then",
    "            ramp.endPoint.color.SetHSV(h, s, v)",
    "            continue",
    "        end",
    "        ",
    "        local currentPoint",
    "        for i, point in ramp.colorPoints do",
    "            if point[includeType] == include then",
    "                currentPoint = point",
    "            end",
    "        end",
    "        ",
    "        if not currentPoint then",
    "            if includeType == \"id\" then",
    "                warn(\"Can't add point while includeType is \\\"id\\\"\") ; continue",
    "            end",
    "            ramp:AddPoint(include, Vector3.new(color3.R, color3.G, color3.B))",
    "        else",
    "            currentPoint.color.SetHSV(h, s, v)",
    "        end",
    "    end",
    "end"
]

const fn_Start = [
    "function VFXScript.Start()",
    "    nodeSystem:Run()",
    "end"
]

const fn_Stop = [
    "function VFXScript.Stop()",
    "    nodeSystem:Stop()",
    "end"
]

export let Functions = [ //order matters, first is `fn_Start` and last is `fn_Stop`
    fn_Start,
    fn_SetColorRamp,
    fn_Stop
]