export function IsAxisX(axisType: string) {
    return axisType === "X" || axisType === "XY" || axisType === "XZ" || axisType === "XYZ" || axisType == "Vector3";
}

export function IsAxisY(axisType: string) {
    return axisType === "Y" || axisType === "XY" || axisType === "YZ" || axisType === "XYZ" || axisType == "Vector3";
}

export function IsAxisZ(axisType: string) {
    return axisType === "Z" || axisType === "XZ" || axisType === "YZ" || axisType === "XYZ" || axisType == "Vector3";
}

export function IsVector3(axisType: string) {
    return axisType == "Vector3";
}