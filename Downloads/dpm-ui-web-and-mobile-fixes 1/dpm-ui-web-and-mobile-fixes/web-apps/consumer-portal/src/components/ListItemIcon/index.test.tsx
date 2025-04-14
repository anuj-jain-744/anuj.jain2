import { render, screen } from "@testing-library/react";
import ListItemIcon from "./index"; // Assuming ListItemIcon component is in the same directory

// Mock the TypographyAndIcon component since we are not testing it here
jest.mock("components/ThemeComponents/TypographyAndIcon", () => {
  return {
    __esModule: true,
    default: ({ text }: { text: string }) => <div>{text}</div>, // Simple mock that renders the text
  };
});

describe("ListItemIcon", () => {
  it("should render the DoneIcon and the title correctly", () => {
    const title = "Sample Title";

    // Render the component with the title prop
    render(<ListItemIcon title={title} />);

    // Verify that the DoneIcon is rendered
    const doneIcon = screen.getByRole("img", { name: /done/i });
    expect(doneIcon).toBeInTheDocument();

    // Verify that the TypographyAndIcon component is rendered with the correct title text
    const typographyText = screen.getByText(title);
    expect(typographyText).toBeInTheDocument();
  });

  it("should pass the title prop correctly to TypographyAndIcon", () => {
    const title = "Test Title";

    // Render the component with the title prop
    render(<ListItemIcon title={title} />);

    // Verify that TypographyAndIcon is rendered with the correct text
    const typographyText = screen.getByText(title);
    expect(typographyText).toBeInTheDocument();
  });
});
