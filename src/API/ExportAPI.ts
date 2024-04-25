import { ReplicatedStorage } from "@rbxts/services";

export const API_VERSION = 70;

let APIFolder = ReplicatedStorage.FindFirstChild("CrescentVFX_API");

if (APIFolder === undefined) {
	APIFolder = new Instance("Folder");
	APIFolder.Name = "CrescentVFX_API";
	APIFolder.Parent = ReplicatedStorage;
}

function CreateAPI() {
	for (const child of APIFolder!.GetChildren()) {
		if (child.Name === "API_VERSION") continue;
		child.Destroy();
	}

	const API = script.Parent!.Clone();
	API.Parent = APIFolder;
	API.FindFirstChild("Readme")!.Parent = APIFolder;

	const include = script.Parent!.Parent!.FindFirstChild("include")!.Clone();
	include.Parent = APIFolder;
}

export default function ExportAPI() {
	const previousVersion = APIFolder!.FindFirstChild("API_VERSION") as NumberValue | undefined;
	if (previousVersion !== undefined) {
		if (previousVersion.Value === API_VERSION) return;

		previousVersion.Value = API_VERSION;
		CreateAPI();
		return;
	}

	const version = new Instance("NumberValue");
	version.Name = "API_VERSION";
	version.Value = API_VERSION;
	version.Parent = APIFolder;

	CreateAPI();
}
