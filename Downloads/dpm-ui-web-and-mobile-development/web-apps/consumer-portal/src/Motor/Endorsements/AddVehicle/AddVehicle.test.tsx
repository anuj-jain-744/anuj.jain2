import { render, screen } from "@testing-library/react";
import AddVehicle from ".";
import AdditionalVehicle from "./AdditionalVehicle";

// Mock the AdditionalVehicle component since we want to test AddVehicle component functionality
jest.mock("./AdditionalVehicle", () => jest.fn(() => <div>Mocked AdditionalVehicle</div>));

describe("AddVehicle", () => {
  test("renders AddVehicle component and passes props to AdditionalVehicle", () => {
    const props = { vehicleType: "Car", vehicleId: 123 };

    render(<AddVehicle {...props} />);

    // Check if the AddVehicle renders AdditionalVehicle component correctly
    expect(AdditionalVehicle).toHaveBeenCalledWith(props, expect.any(Object)); // Ensure the correct props are passed

    // Check if AddVehicle component itself renders the AdditionalVehicle with the mocked output
    const textElement = screen.getByText(/Mocked AdditionalVehicle/i);
    expect(textElement).toBeInTheDocument();
  });
});
