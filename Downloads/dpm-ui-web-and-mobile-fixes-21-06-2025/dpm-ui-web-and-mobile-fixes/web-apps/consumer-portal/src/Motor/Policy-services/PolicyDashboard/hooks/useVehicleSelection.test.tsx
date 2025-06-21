import { renderHook, act } from '@testing-library/react-hooks';
import useVehicleSelection from './useVehicleSelection';

describe('useVehicleSelection', () => {
  const mockVehicleDetails: any[] = [
    {
      registrationPlateNo: "ABC123",
      chassisNo: "CH123456789",
      typeOfChassis: "Sedan",
      vehicleMake: "Nissan",
      vehicleModel: "Altima",
      vehicleSequenceNo: "1",
      vehicleColor: "Red",
      transmission: "Automatic"
    },
    {
      registrationPlateNo: "XYZ789",
      chassisNo: "CH987654321",
      typeOfChassis: "SUV",
      vehicleMake: "Mercedes",
      vehicleModel: "GLE",
      vehicleSequenceNo: "2",
      vehicleColor: "Black",
      transmission: "Automatic"
    },
  ];

  it('initializes with null values when no vehicle details are provided', () => {
    const { result } = renderHook(() => useVehicleSelection(null));

    expect(result.current.selectedVehicle).toBeNull();
    expect(result.current.vehicleValue).toBeNull();
  });

  it('selects the first vehicle when vehicle details are provided', () => {
    const { result } = renderHook(() => useVehicleSelection(mockVehicleDetails));

    expect(result.current.selectedVehicle).toBe("1");
    expect(result.current.vehicleValue).toEqual(mockVehicleDetails[0]);
  });

  it('updates selected vehicle when handleVehicleClick is called', () => {
    const { result } = renderHook(() => useVehicleSelection(mockVehicleDetails));

    act(() => {
      result.current.handleVehicleClick(1);
    });

    expect(result.current.selectedVehicle).toBe("2");
    expect(result.current.vehicleValue).toEqual(mockVehicleDetails[1]);
  });

  it('does not update selected vehicle if index is out of bounds', () => {
    const { result } = renderHook(() => useVehicleSelection(mockVehicleDetails));

    act(() => {
      result.current.handleVehicleClick(5);
    });

    expect(result.current.selectedVehicle).toBe("1");
  });
});