import { render, screen } from "@testing-library/react";
import AdditionalVehicle from ".";

describe("AdditionalVehicle", () => {
  test("renders the AdditionalVehicle component", () => {
    render(<AdditionalVehicle />);
    
    // Check if the text 'AdditionalVehicle' is present in the document
    const textElement = screen.getByText('AdditionalVehicle');
    expect(textElement).toBeInTheDocument();
  });
});
