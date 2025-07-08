import { render, screen } from "@testing-library/react";
import SafeSecure from "./index";

describe("SafeSecure Component", () => {
  it("renders the SafeSecure component correctly", () => {
    render(<SafeSecure />);

    // Check if the image is rendered with the correct alt text
    const imageElement = screen.getByAltText("safe-secure-icon");
    expect(imageElement).toBeInTheDocument();

    // Check if the content text is rendered
    const contentElement = screen.getByText(
      "Safe and Secure Payments. Easy servicing. 100% Authentic products."
    );
    expect(contentElement).toBeInTheDocument();
  });
});