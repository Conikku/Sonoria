import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Sin as SinAPI, SinFieldNames } from "API/Nodes/Logic/Sin";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSin() {
    return AddNode(new SinAPI(), (data: NodeData) => {
        return <Sin key={`node_${data.node.id}`} data={data} />;
    });
}

function Sin({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Sin"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SinAPI).nodeFields.input}
                NodeFieldName={SinFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
