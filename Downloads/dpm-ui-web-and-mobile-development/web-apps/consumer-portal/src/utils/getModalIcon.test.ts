import { getModelIcon } from './getModelIcon';

describe('getModelIcon', () => {
  const modelImages = [
    { image: 'default-icon.png', model: 'default' },
    { image: 'modelA-icon.png', model: 'modelA' },
    { image: 'modelB-icon.png', model: 'modelB' },
  ];

  it('should return the correct icon for a given model', () => {
    expect(getModelIcon('modelA', modelImages)).toBe('modelA-icon.png');
    expect(getModelIcon('modelB', modelImages)).toBe('modelB-icon.png');
  });

  it('should return the default icon if the model is undefined', () => {
    expect(getModelIcon(undefined, modelImages)).toBe('default-icon.png');
  });

  it('should return the default icon if the model is null', () => {
    expect(getModelIcon(null, modelImages)).toBe('default-icon.png');
  });

  it('should return the default icon if the model is not found', () => {
    expect(getModelIcon('modelC', modelImages)).toBe('default-icon.png');
  });

  it('should return undefined if the default model is not found in the model images', () => {
    const modelImagesWithoutDefault = [
      { image: 'modelA-icon.png', model: 'modelA' },
      { image: 'modelB-icon.png', model: 'modelB' },
    ];
    expect(getModelIcon('modelC', modelImagesWithoutDefault)).toBeUndefined();
  });
});