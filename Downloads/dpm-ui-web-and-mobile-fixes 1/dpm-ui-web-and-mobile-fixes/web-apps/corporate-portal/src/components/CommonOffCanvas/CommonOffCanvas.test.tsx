import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommonOffCanvas from "./index";
import { PLACEMENTS } from "../../constant";
import '@testing-library/jest-dom';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("CommonOffCanvas", () => {
  const mockSetShowCanvas = jest.fn();
  const mockTitle = "Test Title";
  const mockChildren = <div>Test Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with the correct content", () => {
    render(
      <CommonOffCanvas
        placement={PLACEMENTS.START}
        title={mockTitle}
        showCanvas={true}
        setShowCanvas={mockSetShowCanvas}
      >
        {mockChildren}
      </CommonOffCanvas>
    );

    expect(screen.getByText(mockTitle)).toBeInTheDocument();

    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("calls setShowCanvas with false when the close button is clicked", () => {
    render(
      <CommonOffCanvas
        placement={PLACEMENTS.START}
        title={mockTitle}
        showCanvas={true}
        setShowCanvas={mockSetShowCanvas}
      >
        {mockChildren}
      </CommonOffCanvas>
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(mockSetShowCanvas).toHaveBeenCalledWith(false);
  });

  it("does not render the off-canvas when showCanvas is false", () => {
    render(
      <CommonOffCanvas
        placement={PLACEMENTS.START}
        title={mockTitle}
        showCanvas={false}
        setShowCanvas={mockSetShowCanvas}
      >
        {mockChildren}
      </CommonOffCanvas>
    );

    expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();

    expect(screen.queryByText("Test Children")).not.toBeInTheDocument();
  });
});