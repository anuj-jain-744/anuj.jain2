export const getModelIcon = (model: string | undefined | null, vehicleMakeId: string | number | undefined | null, modelImage: {image: string, model: string, id: string}[]) => {
    const defaultModelName = "default";
    const modelName = model?.toLowerCase() || "";
    let modelIcon = modelImage?.find((item) => item.model.toLowerCase() === modelName || item.id == vehicleMakeId);
    if(!modelIcon || !model) {
        modelIcon = modelImage?.find((item) => item.model.toLowerCase() === defaultModelName);
    }
    return modelIcon?.image;
}