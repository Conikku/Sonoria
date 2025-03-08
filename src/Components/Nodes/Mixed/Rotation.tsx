import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType1 } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { Rotation as RotationAPI } from "API/Nodes/Mixed/Rotation";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRotation() {
    return AddNode(new RotationAPI(), (data: NodeData) => {
        return (
            <Rotation
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Rotation({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const calculationTypeRef = useRef((data.node as RotationAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as RotationAPI).nodeFields.axisType);

    useEffect(() => {
        const connection1 = calculationTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        const connection2 = axisTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    const isUniform = () => {
        return calculationTypeRef.current.GetState() === CalculationType1.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType1.Random;
    };

    const axisType = axisTypeRef.current.GetState();

    return (
        <Node
            Name="Rotation"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={(data.node as RotationAPI).nodeFields.nodeOperationType} />
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as RotationAPI).nodeFields.Vector3}
                NodeFieldName={"vector3"}
                Label={"Vector3"}
             />
        </Node>
    );
}
