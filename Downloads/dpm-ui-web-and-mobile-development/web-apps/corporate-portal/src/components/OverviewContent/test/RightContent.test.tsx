import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RightContent from "../RightContent";

describe("RightContent Component", () => {
  const mockOverviewImg = "https://example.com/image.png";

  it("renders the component with the provided overviewImg", () => {
    render(<RightContent overviewImg={mockOverviewImg} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", mockOverviewImg);
    expect(image).toHaveAttribute("alt", "motor");
    expect(image).toHaveAttribute("title", "motor");
  });

  it("renders without crashing", () => {
    const { container } = render(
      <RightContent overviewImg={mockOverviewImg} />
    );
    expect(container).toBeInTheDocument();
  });
});
