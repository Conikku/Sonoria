import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand, RoundDecimal } from "API/Lib";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetRotationZRandom } from "../AutoGeneration/InitializeNodes/AutoGenSetRotationZRandom";
import { InitializeNode } from "./InitializeNode";

export const SetRotationZRandomName = "SetRotationZRandom";
export const SetRotationZRandomFieldNames = {
    range: "range",
};

export class SetRotationZRandom extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        range: ConnectableVector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            range: new ConnectableVector2Field(0, 0),
        };
    }

    Initialize(data: ParticleData) {
        const range = this.nodeFields.range.GetVector2(data);
        const zRotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);

        data.rotation = new Vector3(data.rotation.X, data.rotation.Y, zRotation);
    }

    GetNodeName(): string {
        return SetRotationZRandomName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetRotationZRandom(this);
    }
}
