import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { AxisType, CalculationType1, NodeOperationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { MixedNode } from "./MixedNode";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { number } from "@rbxts/react/src/prop-types";

export class Rotation extends MixedNode {
    static className = "Rotation";

    nodeFields = {
        nodeOperationType: new StateField(NodeOperationType, NodeOperationType.Set, [NodeOperationType.Multiply]),
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform, [
            CalculationType1.UniformConnected,
            CalculationType1.RandomConncted,
        ]),
        axisType: new StateField(AxisType, AxisType.XYZ),
        Vector3: new ConnectableVector3Field(0,0,0),
        rangeX: new ConnectableVector2Field(0, 0),
        rangeY: new ConnectableVector2Field(0, 0),
        rangeZ: new ConnectableVector2Field(0, 0),
    };

    storedValueVectorX = new Map<number, number>();
    storedValueVectorY = new Map<number, number>();
    storedValueVectorZ = new Map<number, number>();
    

    GetRotation(calculationType: string, data: ParticleData, rotationField: ConnectableVector3Field, storedValues: Map<number, number>, riety: string) {
        if (calculationType === CalculationType1.Uniform) {
            const da = rotationField.GetSimpleVector3(data);
            if (riety == "x") {
                return da.x
            }
            else if (riety == "y") {
                return da.y
            }
            else {
                return da.z
            }
        }
        const storedRotation = storedValues.get(data.particleId);
        if (storedRotation !== undefined) return storedRotation;
        
        if (riety == "x") {
            const range = this.nodeFields.rangeX.GetSimpleVector2(data);
            const rotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            storedValues.set(data.particleId, rotation);
            return rotation;
        }
        else if (riety == "y") {
            const range = this.nodeFields.rangeY.GetSimpleVector2(data);
            const rotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            storedValues.set(data.particleId, rotation);
            return rotation;
        }
        else {
            const range = this.nodeFields.rangeZ.GetSimpleVector2(data);
            const rotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            storedValues.set(data.particleId, rotation);
            return rotation;
        }
    }

    Run(data: ParticleData, dt = 1) {
        const nodeOperationType = this.nodeFields.nodeOperationType.GetState();
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();

        let [x,y,z] = [0, 0, 0];
        const val = this.nodeFields.Vector3.GetVector3(data)
        
        x = this.GetRotation(calculationType, data, this.nodeFields.Vector3, this.storedValueVectorX, "x")
        y = this.GetRotation(calculationType, data, this.nodeFields.Vector3, this.storedValueVectorX, "y")
        z = this.GetRotation(calculationType, data, this.nodeFields.Vector3, this.storedValueVectorX, "z")

        if (nodeOperationType === NodeOperationType.Set) {
            data.rotation = CFrame.Angles(math.rad(x), math.rad(y), math.rad(z));
            return;
        }

        data.rotation = data.rotation.mul(CFrame.Angles(math.rad(x * dt), math.rad(y * dt), math.rad(z * dt)));
    }

    GetClassName(): string {
        return Rotation.className;
    }
}
