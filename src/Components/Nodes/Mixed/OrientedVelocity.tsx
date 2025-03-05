// src/API/Nodes/Mixed/OrientedVelocity.ts

import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import { MixedNode } from "./MixedNode";

export class OrientedVelocity extends MixedNode {
    static className = "OrientedVelocity";

    nodeFields = {
        direction: new ConnectableVector3Field(0, 0, 0),
        speed: new ConnectableNumberField(1),
        upVector: new ConnectableVector3Field(0, 1, 0),
    };

    Run(data: ParticleData) {
        const direction = this.nodeFields.direction.GetVector3(data);
        const speed = this.nodeFields.speed.GetNumber(data);
        
        if (direction.Magnitude > 0) {
            const velocity = direction.mul(speed);
            data.velocityNormal = new Vector3(velocity.X, velocity.Y, velocity.Z);
        }
    }

    GetClassName(): string {
        return OrientedVelocity.className;
    }
}
