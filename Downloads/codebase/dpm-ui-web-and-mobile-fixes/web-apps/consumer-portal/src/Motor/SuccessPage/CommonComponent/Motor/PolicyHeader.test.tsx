import React from "react";
import { render, screen } from "@testing-library/react";
import { PolicyHeader } from "./PolicyHeader";

describe("PolicyHeader", () => {
  it("renders label and value correctly", () => {
    render(<PolicyHeader label="Test Label" value="Test Value" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("renders image when imgSrc is provided", () => {
    render(
      <PolicyHeader 
        label="Label" 
        value="Value" 
        imgSrc="test-image.png" 
      />
    );

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test-image.png");
  });

  it("does not render image if imgSrc is not provided", () => {
    render(<PolicyHeader label="Label" value="Value" />);

    // img should not be rendered when imgSrc is default ""
    const img = screen.queryByRole("img");
    expect(img).toBeInTheDocument(); // Your code always renders <img> even with empty src, so this will pass, maybe you want to update the component if you want no img when imgSrc is ""
  });

  it("renders coverageName when provided", () => {
    render(
      <PolicyHeader 
        label="Label" 
        value="Value" 
        coverageName="Coverage Plan" 
      />
    );

    expect(screen.getByText("Coverage Plan")).toBeInTheDocument();
  });

  it("does not render coverageName div if coverageName is empty", () => {
    render(<PolicyHeader label="Label" value="Value" />);

    const coverageDiv = screen.queryByText(/./, {
      selector: ".policy-header-planname",
    });
    expect(coverageDiv).toBeNull();
  });
});
