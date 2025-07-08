import { render, screen } from "@testing-library/react";
import VehicalContent, { VehicleItem } from "../VehicalContent"; // Adjust the path as needed
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getModelIcon } from "utils/getModelIcon";

// Mock the useQuoteAndBuyContext hook
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

// Mock the getModelIcon function
jest.mock("utils/getModelIcon", () => ({
  getModelIcon: jest.fn(),
}));

describe("VehicalContent Component", () => {
  const mockVehicleData: VehicleItem[] = [
    { label: "Make", value: "Toyota" },
    { label: "Model", value: "Corolla" },
    { label: "Year", value: "2021" },
  ];

  const mockContextData = {
    vehicleDetailsResponseData: {
      vehicleMakeTextEn: "Toyota",
      vehicleMakeId: "123",
    },
    makeModelResponse: [{ id: "123", name: "Toyota" }],
  };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockContextData);
    (getModelIcon as jest.Mock).mockReturnValue("mock-icon-url");
  });

  it("renders the vehicle logo with the correct icon", () => {
    render(<VehicalContent vehicleData={mockVehicleData} />);

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mock-icon-url");
  });

  it("renders the correct labels and values", () => {
    render(<VehicalContent vehicleData={mockVehicleData} />);

    // Check labels
    expect(screen.getByText("Make")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();

    // Check values
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("Corolla")).toBeInTheDocument();
    expect(screen.getByText("2021")).toBeInTheDocument();
  });

  it("does not render anything if vehicleData is empty", () => {
    render(<VehicalContent vehicleData={[]} />);

    expect(screen.queryByText("Make")).not.toBeInTheDocument();
    expect(screen.queryByText("Model")).not.toBeInTheDocument();
    expect(screen.queryByText("Year")).not.toBeInTheDocument();
  });
  
});