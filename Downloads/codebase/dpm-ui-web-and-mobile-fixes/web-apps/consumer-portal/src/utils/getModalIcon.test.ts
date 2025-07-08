import { getModelIcon } from './getModelIcon';

describe('getModelIcon', () => {
  const modelImages = [
    { image: 'default-icon.png', model: 'default', id: '0' },
    { image: 'modelA-icon.png', model: 'modelA', id: '1' },
    { image: 'modelB-icon.png', model: 'modelB', id: '2' },
  ];

  it('should return the correct icon for a given model', () => {
    expect(getModelIcon('modelA', null, modelImages)).toBe('modelA-icon.png');
    expect(getModelIcon('modelB', null, modelImages)).toBe('modelB-icon.png');
  });

  it('should return the correct icon for a given vehicleMakeId', () => {
    expect(getModelIcon(null, '1', modelImages)).toBe('default-icon.png');
    expect(getModelIcon(null, '2', modelImages)).toBe('default-icon.png');
  });

  it('should prioritize model over vehicleMakeId when both are provided', () => {
    expect(getModelIcon('modelA', '2', modelImages)).toBe('modelA-icon.png');
  });

  it('should return the default icon if the model is undefined and vehicleMakeId is null', () => {
    expect(getModelIcon(undefined, null, modelImages)).toBe('default-icon.png');
  });

  it('should return the default icon if the model is null and vehicleMakeId is undefined', () => {
    expect(getModelIcon(null, undefined, modelImages)).toBe('default-icon.png');
  });

  it('should return the default icon if the model and vehicleMakeId are not found', () => {
    expect(getModelIcon('modelC', '3', modelImages)).toBe('default-icon.png');
  });

  it('should return undefined if the default model is not found in the model images', () => {
    const modelImagesWithoutDefault = [
      { image: 'modelA-icon.png', model: 'modelA', id: '1' },
      { image: 'modelB-icon.png', model: 'modelB', id: '2' },
    ];
    expect(getModelIcon('modelC', '3', modelImagesWithoutDefault)).toBeUndefined();
  });
});