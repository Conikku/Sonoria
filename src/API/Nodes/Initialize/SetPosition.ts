import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetPosition } from "../AutoGeneration/InitializeNodes/AutoGenSetPosition";
import { InitializeNode } from "./InitializeNode";

export const SetPositionName = "SetPosition";
export const SetPositionFieldNames = {
    position: "position",
};

export class SetPosition extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        position: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            position: new ConnectableVector3Field(0, 0, 0),
        };
    }

    Initialize(data: ParticleData) {
        const vector3 = this.nodeFields.position.GetVector3(data);
        data.particle.Position = new Vector3(vector3.x, vector3.y, vector3.z);
    }

    GetNodeName(): string {
        return SetPositionName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetPosition(this);
    }
}
