export const getModelIcon = (model: string | undefined | null, modelImage: {image: string, model: string}[]) => {
    const defaultModelName = "default";
    let modelName = model;
    if(!model) {
        modelName = defaultModelName;
    }
    let modelIcon = modelImage.find((item) => item.model === modelName);
    if(!modelIcon) {
        modelIcon = modelImage.find((item) => item.model === defaultModelName);
    }
    return modelIcon?.image;
}