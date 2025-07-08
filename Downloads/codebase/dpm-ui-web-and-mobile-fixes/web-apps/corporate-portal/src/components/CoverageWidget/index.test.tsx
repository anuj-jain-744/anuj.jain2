import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CoverageWidget } from "../CoverageWidget";

describe("CoverageWidget", () => {
  it("renders correctly with provided content", () => {
    const content = {
      title: "Coverage Report",
      subtitle: [{ left: "Header 1", right: "Header 2" }],
      comparr: [
        { left: "Data 1", right: "Data 2" },
        { left: "Data 3", right: "Data 4" },
      ],
    };

    const { getByText } = render(<CoverageWidget content={content} />);

    expect(getByText("Coverage Report")).toBeInTheDocument();
    expect(getByText("Header 1")).toBeInTheDocument();
    expect(getByText("Header 2")).toBeInTheDocument();
    expect(getByText("Data 1")).toBeInTheDocument();
    expect(getByText("Data 2")).toBeInTheDocument();
    expect(getByText("Data 3")).toBeInTheDocument();
    expect(getByText("Data 4")).toBeInTheDocument();
  });

  it("renders correctly with missing subtitle and comparr", () => {
    const content = {
      title: "Coverage Report",
    };

    const { getByText } = render(<CoverageWidget content={content} />);

    expect(getByText("Coverage Report")).toBeInTheDocument();
    expect(() => getByText("Header")).toThrow();
  });

  it("renders empty table when no headers or body content is provided", () => {
    const content = {
      title: "Coverage Report",
      subtitle: [],
      comparr: [],
    };

    const { getByText } = render(<CoverageWidget content={content} />);

    expect(getByText("Coverage Report")).toBeInTheDocument();
    expect(() => getByText("Header")).toThrow();
    expect(() => getByText("Data")).toThrow();
  });
});
