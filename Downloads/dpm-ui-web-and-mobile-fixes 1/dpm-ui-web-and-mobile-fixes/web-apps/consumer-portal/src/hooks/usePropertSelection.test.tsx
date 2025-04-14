import { renderHook, act } from '@testing-library/react-hooks';
import { usePropertySelection } from './usePropertSelection';
import { commonKeywords } from '../constant';
import { TyperFormAddressSelection, TypePropertyType } from 'context/PHQuoteBuyContext';

describe('usePropertySelection', () => {
  const mockSetterHook = jest.fn();
  const mockSetShowPropertyMap = jest.fn();
  const mockResetFormValue: TyperFormAddressSelection = { /* mock values */ };
  const mockResetPropertyCoodinates: TypePropertyType = { /* mock values */ };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset form value and show property map when key is propertyNoLabel', () => {
    const { result } = renderHook(() =>
      usePropertySelection(
        mockSetterHook,
        mockResetFormValue,
        mockResetPropertyCoodinates,
        mockSetShowPropertyMap
      )
    );

    act(() => {
      result.current.handlePropertySelection(commonKeywords.propertyNoLabel, 'testValue');
    });

    expect(mockSetShowPropertyMap).toHaveBeenCalledWith(mockResetPropertyCoodinates);
    expect(mockSetterHook).toHaveBeenCalledWith(expect.any(Function));

    const setterCallback = mockSetterHook.mock.calls[0][0];
    expect(setterCallback({})).toEqual(mockResetFormValue);
  });

  it('should update form value when key is not propertyNoLabel', () => {
    const { result } = renderHook(() =>
      usePropertySelection(
        mockSetterHook,
        mockResetFormValue,
        mockResetPropertyCoodinates,
        mockSetShowPropertyMap
      )
    );

    const key = 'someOtherKey';
    const value = 'testValue';

    act(() => {
      result.current.handlePropertySelection(key, value);
    });

    expect(mockSetShowPropertyMap).not.toHaveBeenCalled();
    expect(mockSetterHook).toHaveBeenCalledWith(expect.any(Function));

    const setterCallback = mockSetterHook.mock.calls[0][0];
    expect(setterCallback({})).toEqual({ [key]: value });
  });
});