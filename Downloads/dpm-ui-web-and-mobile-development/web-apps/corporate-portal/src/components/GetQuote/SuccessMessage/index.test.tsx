// SuccessMessage.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SuccessMessage from "./index";

jest.mock("../../../assets/GetQuoteForm/Popups Status.svg", () => "success-image-path");
jest.mock("../../../assets/GetQuoteForm/Close.svg", () => "close-image-path");

describe("SuccessMessage Component", () => {
  const successMessage = "Your request was successful!";

  test("renders the component with the success message", () => {
    render(<SuccessMessage successMessage={successMessage} />);

    // Check if the success message is displayed
    expect(screen.getByText(successMessage)).toBeInTheDocument();

    // Check if the success image is rendered
    const successImage = screen.getByAltText("Success");
    expect(successImage).toHaveAttribute("src", "success-image-path");

    // Check if the close image is rendered
    const closeImage = screen.getByAltText("Close");
    expect(closeImage).toHaveAttribute("src", "close-image-path");
  });

  test("hides the component when the close button is clicked", () => {
    render(<SuccessMessage successMessage={successMessage} />);

    // Ensure the component is initially visible
    expect(screen.getByText(successMessage)).toBeInTheDocument();

    // Click the close button
    const closeButton = screen.getByAltText("Close");
    fireEvent.click(closeButton);

    // Ensure the component is no longer visible
    expect(screen.queryByText(successMessage)).not.toBeInTheDocument();
  });
});