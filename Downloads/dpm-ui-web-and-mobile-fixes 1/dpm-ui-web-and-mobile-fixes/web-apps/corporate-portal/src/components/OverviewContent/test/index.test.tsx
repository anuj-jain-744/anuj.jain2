import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OverviewContent } from "../index";

describe("OverviewContent Component", () => {
  const mockOverviewCont = "Overview Content";
  const mockOverviewImg = "mock-image-url.jpg";

  it("renders without crashing", () => {
    const { container } = render(
      <OverviewContent
        overviewCont={mockOverviewCont}
        overviewImg={mockOverviewImg}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
