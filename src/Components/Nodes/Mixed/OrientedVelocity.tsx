// API/Components/Nodes/Mixed/OrientatedVelocity.tsx

import React from "@rbxts/react";
import { OrientedVelocity as OrientedVelocityAPI } from "API/Nodes/Mixed/OrientedVelocity";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateOrientatedVelocity() {
    return AddNode(new OrientedVelocityAPI(), (data: NodeData) => {
        return (
            <OrientatedVelocity
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function OrientatedVelocity({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Orientated Velocity"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as OrientedVelocityAPI).nodeFields.direction}
                NodeFieldName={"direction"}
                Label="Direction"
            />

            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as OrientedVelocityAPI).nodeFields.speed}
                NodeFieldName={"speed"}
                Label="Speed"
                AllowNegative={false}
            />

            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as OrientedVelocityAPI).nodeFields.upVector}
                NodeFieldName={"upVector"}
                Label="Up Vector"
            />
        </Node>
    );
}
