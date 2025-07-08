import { render, screen, waitFor } from "@testing-library/react";
import ThemePopover from "../ThemePopover";

describe("ThemePopover", () => {
  it("renders without crashing", () => {
    render(
      <ThemePopover
        iconclasses="test-icon-class"
        placement="top"
        tooltipclasses="test-tooltip-class"
        tooltipdataheader="Test Header"
      />
    );
    waitFor(() => { 
        expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    });
  });

  it("applies the correct icon classes", () => {
    render(
      <ThemePopover
        iconclasses="test-icon-class"
        placement="top"
        tooltipclasses="test-tooltip-class"
        tooltipdataheader="Test Header"
      />
    );
    waitFor(() => { 
        expect(screen.getByRole("img", { hidden: true }).parentElement).toHaveClass("test-icon-class");
    });
  });

  it("applies the correct tooltip classes", () => {
    render(
      <ThemePopover
        iconclasses="test-icon-class"
        placement="top"
        tooltipclasses="test-tooltip-class"
        tooltipdataheader="Test Header"
      />
    );
    waitFor(() => { 
        expect(screen.getByRole("tooltip")).toHaveClass("test-tooltip-class");
    });
  });

  it("renders the ReferenceTooltip component", () => {
    render(
      <ThemePopover
        iconclasses="test-icon-class"
        placement="top"
        tooltipclasses="test-tooltip-class"
        tooltipdataheader="Test Header"
      />
    );
    waitFor(() => { 
        expect(screen.getByText(/ReferenceTooltip/i)).toBeInTheDocument();
    });
  });
});