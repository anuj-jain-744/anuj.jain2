import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HighlighterWidget } from "./index";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

jest.mock("utils/icons", () => ({
  IconsSet: {
    meeting: "mock-icon-url",
  },
}));

describe("src/components/HighlighterWidget", () => {
  it("renders correctly with title and children", () => {
    const { getByText, getByAltText } = render(
      <HighlighterWidget title="Test Title" iconsClass="meeting">
        <div>Test Child</div>
      </HighlighterWidget>
    );

    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByAltText("Test Title")).toHaveAttribute("src", "mock-icon-url");
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("renders CardContent correctly", () => {
    const { getByText } = render(
      <HighlighterWidget.CardContent
        label="Test Label"
        details="Test Details"
        Icon={InfoOutlinedIcon}
        infoWindow={true}
      />
    );

    expect(getByText("Test Label")).toBeInTheDocument();
    expect(getByText("Test Details")).toBeInTheDocument();
    expect(getByText("Test Details").previousSibling).toBeInstanceOf(
      SVGElement
    );
    expect(getByText("Test Details").nextSibling).toBeInstanceOf(SVGElement);
  });

  it("renders ContentSeparator correctly", () => {
    const { container } = render(<HighlighterWidget.ContentSeparator />);
    expect(container.firstChild).toHaveClass("content-separator-wrapper");
  });
});
