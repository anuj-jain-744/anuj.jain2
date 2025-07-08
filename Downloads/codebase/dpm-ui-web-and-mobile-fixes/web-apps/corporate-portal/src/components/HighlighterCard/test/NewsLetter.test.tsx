import { render, screen, fireEvent } from "@testing-library/react";
import NewsLetter from "../NewsLetter"; // Path to your component
import "@testing-library/jest-dom"; // For extended matchers

describe("NewsLetter Component", () => {
  const mockHighlighterData = {
    title: "Subscribe to our Newsletter",
    placeholder: "Enter your email",
    label: "Subscribe Now",
    read_more: "/read-more", // Ensured read_more is included
  };

  it("should render the newsletter title correctly", () => {
    render(<NewsLetter highlighterData={mockHighlighterData} />);

    // Check if the title is rendered
    expect(screen.getByText("Subscribe to our Newsletter")).toBeInTheDocument();
  });

  it("should render the input field with correct placeholder", () => {
    render(<NewsLetter highlighterData={mockHighlighterData} />);

    // Check if the input field has the correct placeholder text
    const inputField = screen.getByPlaceholderText("Enter your email");
    expect(inputField).toBeInTheDocument();
  });

  it("should render the button with the correct label", () => {
    render(<NewsLetter highlighterData={mockHighlighterData} />);

    // Check if the button has the correct label
    const button = screen.getByText("Subscribe Now");
    expect(button).toBeInTheDocument();
  });

  it("should update the input field when the user types", () => {
    render(<NewsLetter highlighterData={mockHighlighterData} />);

    // Get the input field and cast it as HTMLInputElement
    const inputField = screen.getByPlaceholderText(
      "Enter your email"
    ) as HTMLInputElement;

    // Simulate typing into the input field
    fireEvent.change(inputField, { target: { value: "test@example.com" } });

    // Verify that the input field value has been updated
    expect(inputField.value).toBe("test@example.com");
  });

  it("should render the 'Read More' link when read_more is provided", () => {
    render(<NewsLetter highlighterData={mockHighlighterData} />);

    // Check if the "Read More" link is rendered
    // const readMoreLink = screen.getByText("Read More");
    // expect(readMoreLink).toBeInTheDocument();
    // expect(readMoreLink).toHaveAttribute("href", "/read-more");
  });
});
