import { render, screen, fireEvent } from "@testing-library/react";
import RegisterLink from "../RegisterLinks"; // Adjust path if necessary
import "@testing-library/jest-dom"; // For extended matchers

describe("RegisterLink Component", () => {
  const mockNavigateTo = jest.fn();

  const mockCardContent = {
    register_label: "Register Now",
    indvidual_button_link: "/individual",
    enterprise_button_link: "/enterprise",
    indvidual_button_text: "Individual Plan",
    enterprise_button_text: "Enterprise Plan",
  };

  it("should render the register label", () => {
    render(
      <RegisterLink cardContent={mockCardContent} navigateTo={mockNavigateTo} />
    );

    // Check if the register label is rendered correctly
    expect(screen.getByText("Register Now")).toBeInTheDocument();
  });

  it("should render the individual and enterprise buttons", () => {
    render(
      <RegisterLink cardContent={mockCardContent} navigateTo={mockNavigateTo} />
    );

    // Check if both buttons are rendered
    expect(screen.getByText("Individual Plan")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Plan")).toBeInTheDocument();
  });

  it("should call navigateTo with the correct URL when the Individual button is clicked", () => {
    render(
      <RegisterLink cardContent={mockCardContent} navigateTo={mockNavigateTo} />
    );

    const individualButton = screen.getByText("Individual Plan");

    // Simulate a click on the individual button
    fireEvent.click(individualButton);

    // Ensure navigateTo is called with the correct URL
    expect(mockNavigateTo).toHaveBeenCalledWith("/individual");
  });

  it("should call navigateTo with the correct URL when the Enterprise button is clicked", () => {
    render(
      <RegisterLink cardContent={mockCardContent} navigateTo={mockNavigateTo} />
    );

    const enterpriseButton = screen.getByText("Enterprise Plan");

    // Simulate a click on the enterprise button
    fireEvent.click(enterpriseButton);

    // Ensure navigateTo is called with the correct URL
    expect(mockNavigateTo).toHaveBeenCalledWith("/enterprise");
  });
});
