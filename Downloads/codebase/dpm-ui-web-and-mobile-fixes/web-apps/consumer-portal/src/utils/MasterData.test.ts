import { getCodeDesc } from './MasterData';

describe('getCodeDesc', () => {
  const masterData = {
    model: {
      content: [
        { codeId: 1, codeDesc: 'Description 1' },
        { codeId: 2, codeDesc: 'Description 2' },
        { codeId: 3, codeDesc: 'Description 3' },
      ],
    },
  };

  it('should return the correct description for a valid codeID', () => {
    expect(getCodeDesc(masterData, 1)).toBe('Description 1');
    expect(getCodeDesc(masterData, 2)).toBe('Description 2');
    expect(getCodeDesc(masterData, 3)).toBe('Description 3');
  });

  it('should return null for an invalid codeID', () => {
    expect(getCodeDesc(masterData, 4)).toBeNull();
  });

  it('should return null if masterData is null or undefined', () => {
    expect(getCodeDesc(null, 1)).toBeNull();
    expect(getCodeDesc(undefined, 1)).toBeNull();
  });

  it('should return null if masterData.model is null or undefined', () => {
    const masterDataWithNullModel = { model: null };
    const masterDataWithUndefinedModel = { model: undefined };

    expect(getCodeDesc(masterDataWithNullModel, 1)).toBeNull();
    expect(getCodeDesc(masterDataWithUndefinedModel, 1)).toBeNull();
  });

  it('should return null if masterData.model.content is null or undefined', () => {
    const masterDataWithNullContent = { model: { content: null } };
    const masterDataWithUndefinedContent = { model: { content: undefined } };

    expect(getCodeDesc(masterDataWithNullContent, 1)).toBeNull();
    expect(getCodeDesc(masterDataWithUndefinedContent, 1)).toBeNull();
  });

  it('should return null if masterData.model.content is an empty array', () => {
    const masterDataWithEmptyContent = { model: { content: [] } };

    expect(getCodeDesc(masterDataWithEmptyContent, 1)).toBeNull();
  });
});