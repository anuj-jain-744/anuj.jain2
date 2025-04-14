import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TypographyAndIcon } from "./index";

describe("TypographyAndIcon Component", () => {
  it("renders text correctly", () => {
    const text = "Hello World";
    render(<TypographyAndIcon text={text} />);

    // Check if the text is rendered correctly
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders required asterisk when 'required' prop is passed", () => {
    const text = "Name";
    render(<TypographyAndIcon text={text} required={true} />);

    // Check if the asterisk (*) is rendered in red color for required fields
    expect(screen.getByText("*")).toHaveStyle("color: red");
  });

  it("does not render required asterisk when 'required' prop is not passed", () => {
    const text = "Name";
    render(<TypographyAndIcon text={text} required={false} />);

    // Check that the asterisk is not present when 'required' is false
    const asterisk = screen.queryByText("*");
    expect(asterisk).toBeNull();
  });

  it("renders icon when 'isIcon' is true", () => {
    const text = "Icon Label";
    const iconclasses = "icon-class";

    render(
      <TypographyAndIcon text={text} isIcon={true} iconclasses={iconclasses} />
    );

    // Check if the icon class is applied (though not yet implemented, we're checking the class name)
    const icon = screen.getByText(text).nextElementSibling;
    expect(icon).toHaveClass(iconclasses);
  });

  it("does not render icon when 'isIcon' is false", () => {
    const text = "No Icon";
    render(<TypographyAndIcon text={text} isIcon={false} />);

    // Ensure no icon is rendered if 'isIcon' is false
    const icon = screen.queryByText("icon");
    expect(icon).toBeNull();
  });

  it("renders tooltip data when 'tooltip' and 'tooltipdataheader' are passed", () => {
    const text = "Tooltip Text";
    const tooltipdataheader = "This is a tooltip";

    render(
      <TypographyAndIcon
        text={text}
        tooltip={true}
        tooltipdataheader={tooltipdataheader}
      />
    );

    // Check if the tooltip header is displayed
    expect(screen.getByText(tooltipdataheader)).toBeInTheDocument();
  });

  it("does not render tooltip when 'tooltip' is not passed", () => {
    const text = "No Tooltip";
    render(<TypographyAndIcon text={text} />);

    // Ensure no tooltip is rendered if 'tooltip' is not passed
    const tooltip = screen.queryByText("This is a tooltip");
    expect(tooltip).toBeNull();
  });
});
