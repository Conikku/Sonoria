import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { ParticlePlane as ParticlePlaneAPI, ParticlePlaneFieldNames } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import NumberField from "Components/NodeFields/NumberField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";

export function CreateParticlePlane() {
	return AddNode(new ParticlePlaneAPI(500), (data: NodeData) => {
		return <ParticlePlane key={`node_${data.node.id}`} data={data} />;
	});
}

function ParticlePlane({ data }: { data: NodeData }) {
	const zoomScale = GetZoomScale();

	return (
		<Node
			Name="Particle Plane"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as ParticlePlaneAPI).nodeFields.assetId}
				NodeFieldName={ParticlePlaneFieldNames.assetId}
				Label={CapitalizeFirstLetter(ParticlePlaneFieldNames.assetId)}
				TextToInputRatio={0.3}
				AllowConnection={false}
			/>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout Padding={new UDim(0, 5 * zoomScale)} />

				<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Sprite Sheet"} />
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout Padding={new UDim(0, 5 * zoomScale)} />
					<uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />

					<Vector2Field
						NodeId={data.node.id}
						NodeField={(data.node as ParticlePlaneAPI).nodeFields.imageSize}
						NodeFieldName={ParticlePlaneFieldNames.imageSize}
						ValueLabels={["Width", "Height"]}
						TextToInputRatios={[0.25, 0.25]}
					/>
					<NumberField
						NodeId={data.node.id}
						NodeField={(data.node as ParticlePlaneAPI).nodeFields.spriteSheetRows}
						NodeFieldName={ParticlePlaneFieldNames.spriteSheetRows}
						Label={"Rows"}
						TextToInputRatio={0.65}
						AllowConnection={false}
					/>
					<NumberField
						NodeId={data.node.id}
						NodeField={(data.node as ParticlePlaneAPI).nodeFields.spriteSheetColumns}
						NodeFieldName={ParticlePlaneFieldNames.spriteSheetColumns}
						Label={"Columns"}
						TextToInputRatio={0.65}
						AllowConnection={false}
					/>
					<NumberField
						NodeId={data.node.id}
						NodeField={(data.node as ParticlePlaneAPI).nodeFields.spriteSheetFrameCount}
						NodeFieldName={ParticlePlaneFieldNames.spriteSheetFrameCount}
						Label={"Frame Count"}
						TextToInputRatio={0.65}
						AllowConnection={false}
					/>
				</Div>
			</Div>
		</Node>
	);
}
