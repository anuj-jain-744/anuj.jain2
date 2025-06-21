import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdditionalDriverModal from "./index";
import '@testing-library/jest-dom';

// Mock the child component
jest.mock("../../Motor/QuoteAndBuy/VehicleDetails/VehilceDetailsCard/BottomSection", () => {
  return ({ languageData, onPopShow, handleClose, setShowAddDriverModal }: any) => (
    <div data-testid="bottom-section">
      Mocked BottomSection
      <button onClick={handleClose}>Open Add Driver Modal</button>
    </div>
  );
});

// Mock SVG import
jest.mock("assets/QuoteAndBuy/closeIcon.svg", () => "close-icon.svg");

describe("AdditionalDriverModal", () => {
  const mockOnHide = jest.fn();
  const mockOpenAddDriverModal = jest.fn();
  const languageData = { additional_drivers: "Additional Drivers" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when show is true", () => {
    render(
      <AdditionalDriverModal
        show={true}
        onHide={mockOnHide}
        languageData={languageData}
        openAddDriverModal={mockOpenAddDriverModal}
      />
    );

    expect(screen.getByText("Additional Drivers")).toBeInTheDocument();
    expect(screen.getByTestId("bottom-section")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /close icon/i })).toBeInTheDocument();
  });

  it("does not render modal content when show is false", () => {
    const { container } = render(
      <AdditionalDriverModal
        show={false}
        onHide={mockOnHide}
        languageData={languageData}
        openAddDriverModal={mockOpenAddDriverModal}
      />
    );

    // Should not render modal text
    expect(container.querySelector(".modal.show")).not.toBeInTheDocument();
  });

  it("calls onHide when close icon is clicked", () => {
    render(
      <AdditionalDriverModal
        show={true}
        onHide={mockOnHide}
        languageData={languageData}
        openAddDriverModal={mockOpenAddDriverModal}
      />
    );

    const closeIcon = screen.getByRole("img", { name: /close icon/i });
    fireEvent.click(closeIcon);

    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it("calls openAddDriverModal when BottomSection button is clicked", () => {
    render(
      <AdditionalDriverModal
        show={true}
        onHide={mockOnHide}
        languageData={languageData}
        openAddDriverModal={mockOpenAddDriverModal}
      />
    );

    const openBtn = screen.getByText("Open Add Driver Modal");
    fireEvent.click(openBtn);

    expect(mockOpenAddDriverModal).toHaveBeenCalledTimes(1);
  });
});
