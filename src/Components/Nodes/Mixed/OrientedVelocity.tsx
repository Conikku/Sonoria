export class OrientedVelocity extends MixedNode {
    static className = "OrientedVelocity";

    nodeFields = {
        parentReference: new ConnectableVector3Field(0, 0, 0),
        speed: new ConnectableNumberField(1),
        upVector: new ConnectableVector3Field(0, 1, 0),
    };

    Run(data: ParticleData) {
        const lookVector = this.nodeFields.parentReference.GetVector3(data);
        const speed = this.nodeFields.speed.GetNumber(data);
        data.velocityNormal = lookVector.mul(speed);
    }
}
