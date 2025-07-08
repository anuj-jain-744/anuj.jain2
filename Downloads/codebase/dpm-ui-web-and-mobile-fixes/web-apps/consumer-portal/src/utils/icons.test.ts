import { IconsSet } from './icons';
import { WarningIcon } from '../assets';

describe('IconsSet', () => {
  it('should contain the correct icon mappings', () => {
    expect(IconsSet.warning).toBe(WarningIcon);
  });

  it('should return undefined for non-existent keys', () => {
    expect(IconsSet['nonExistentKey']).toBeUndefined();
  });
});