import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetCanvasData } from "Services/CanvasService";
import { StyleColors } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { NodeSystemData, RemoveNodeSystem, UpdateSystemData } from "../../Services/NodeSystemService";
import Div from "../Div";
import {
	SYSTEM_BORDER_THICKNESS,
	SYSTEM_HEADER_HEIGHT,
	SYSTEM_LIST_PADDING,
	SYSTEM_PADDING,
	SYSTEM_WIDTH,
} from "../SizeConfig";
import NodeGroup from "./NodeGroup";

// FIXME: some weird bug with deleting and overriding node position

interface Props {
	data: NodeSystemData;
}

export default function NodeSystem({ data }: Props) {
	const zoomScale = GetZoomScale();

	const mouseOffsetRef = useRef(new Vector2(0, 0));
	const canvasData = useRef(GetCanvasData());

	const onMouseButton1Down = (element: TextButton) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

		RunService.BindToRenderStep("MoveSystem", Enum.RenderPriority.Input.Value, () => {
			const mousePosition = GetMousePositionOnCanvas();
			const newAnchorPoint = mousePosition.add(mouseOffsetRef.current).div(zoomScale);

			if (data.anchorPoint !== newAnchorPoint) {
				UpdateSystemData(data.id, (systemData) => {
					systemData.anchorPoint = newAnchorPoint;
					return systemData;
				});
			}
		});
	};

	const onMouseButton1Up = () => {
		RunService.UnbindFromRenderStep("MoveSystem");
	};

	const onMouseButton2Down = () => {
		RemoveNodeSystem(data.id);
	};

	const getPosition = () => {
		const offsetFromCenter = data.anchorPoint.mul(zoomScale).add(new Vector2(SYSTEM_WIDTH * 0.5 * zoomScale, 0));
		const canvasPosition = new Vector2(canvasData.current.Position.X.Offset, canvasData.current.Position.Y.Offset);
		const position = canvasPosition.add(offsetFromCenter);
		return UDim2.fromOffset(position.X, position.Y);
	};

	return (
		<textbutton
			Size={UDim2.fromOffset(SYSTEM_WIDTH * zoomScale, 0)}
			AutomaticSize={"Y"}
			AnchorPoint={new Vector2(0.5, 0)}
			Position={getPosition()}
			BackgroundTransparency={1}
			Text={""}
			Active={true}
			Event={{
				InputBegan: (element, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Down(element);
					} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
						onMouseButton2Down();
					}
				},
				InputEnded: (_, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						onMouseButton1Up();
					}
				},
			}}
		>
			<Div>
				<uipadding
					PaddingLeft={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingRight={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingTop={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
					PaddingBottom={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
				/>
				<Div>
					<uistroke
						Color={StyleColors.FullWhite}
						Thickness={SYSTEM_BORDER_THICKNESS * zoomScale}
						Transparency={0.75}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, StyleColors.SpawnGroup),
									new ColorSequenceKeypoint(1, StyleColors.EndGroup),
								])
							}
							Rotation={90}
						/>
					</uistroke>
					<uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
					<uipadding
						PaddingBottom={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingLeft={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingRight={new UDim(0, SYSTEM_PADDING * zoomScale)}
						PaddingTop={new UDim(0, SYSTEM_PADDING * zoomScale)}
					/>
					<uilistlayout
						Padding={new UDim(0, SYSTEM_LIST_PADDING * zoomScale)}
						HorizontalAlignment={"Center"}
					/>

					<BasicTextLabel
						Size={new UDim2(1, 0, 0, SYSTEM_HEADER_HEIGHT * zoomScale)}
						Text={`VFX System (${data.id})`}
					/>

					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Spawn}
						GradientStart={StyleColors.SpawnGroup}
						GradientEnd={StyleColors.InitializeGroup}
						NodeSystem={data}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Initialize}
						GradientStart={StyleColors.InitializeGroup}
						GradientEnd={StyleColors.UpdateGroup}
						NodeSystem={data}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Update}
						GradientStart={StyleColors.UpdateGroup}
						GradientEnd={StyleColors.RenderGroup}
						NodeSystem={data}
					/>
					<NodeGroup
						SystemId={data.id}
						NodeGroup={NodeGroups.Render}
						GradientStart={StyleColors.RenderGroup}
						GradientEnd={StyleColors.EndGroup}
						NodeSystem={data}
					/>
				</Div>
			</Div>
		</textbutton>
	);
}
