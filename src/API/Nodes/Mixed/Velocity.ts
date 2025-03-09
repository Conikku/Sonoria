import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { AxisType, CalculationType1, NodeOperationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { MixedNode } from "./MixedNode";
import { node } from "@rbxts/react/src/prop-types";

export class Velocity extends MixedNode {
    static className = "Velocity";

    nodeFields = {
        nodeOperationType: new StateField(NodeOperationType, NodeOperationType.Set, [NodeOperationType.Multiply]),
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform, [
            CalculationType1.UniformConnected,
            CalculationType1.RandomConncted,
        ]),
        axisType: new StateField(AxisType, AxisType.XYZ),
        velocity: new ConnectableVector3Field(0, 0, 0)
    };

    private GetVelocity(
        data: ParticleData,
        vectorField: ConnectableVector3Field,
        val: string,
    ) {
        const vec = vectorField.GetSimpleVector3(data)
        if (val === "x") 
            return vec.x;
        else if (val === "y")
            return vec.y;
        else
            return vec.z;
    }

    Run(data: ParticleData, dt: number) {
        const nodeOperationType = this.nodeFields.nodeOperationType.GetState();
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();

        let [x, y, z] = [0, 0, 0];
        x = this.GetVelocity(data, this.nodeFields.velocity, "x")
        y = this.GetVelocity(data, this.nodeFields.velocity, "y")
        z = this.GetVelocity(data, this.nodeFields.velocity, "z")

        if (nodeOperationType === NodeOperationType.Set) {
            data.velocityNormal = new Vector3(x, y, z);
            return;
        }

        const oldVelocity = data.velocityNormal;
        data.velocityNormal = new Vector3(oldVelocity.X + x * dt, oldVelocity.Y + y * dt, oldVelocity.Z + z * dt);
    }

    GetClassName(): string {
        return Velocity.className;
    }
}
