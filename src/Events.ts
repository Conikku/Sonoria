// circular depency hell, just use events and function instead
export const ZoomScaleUpdateEvent = new Instance("BindableEvent");

export const NodesChanged = new Instance("BindableEvent");
export const GetCanvasFrame = new Instance("BindableFunction");
