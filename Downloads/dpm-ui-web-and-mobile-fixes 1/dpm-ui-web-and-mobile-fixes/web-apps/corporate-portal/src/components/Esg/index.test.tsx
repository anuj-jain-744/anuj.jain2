import React from "react";
import { render } from "@testing-library/react";
import { Esg } from "./index";

describe("Esg Component", () => {
  const content = {
    introduction_title: "Introduction Title",
    introduction_image: { url: "image-url", alt: "Image Alt" },
    introduction_description: "Introduction Description",
  };

  it("renders the component with correct content", () => {
    const { getByText, getByAltText } = render(<Esg content={content} />);

    expect(getByText(content.introduction_title)).toBeInTheDocument();
    expect(getByText(content.introduction_description)).toBeInTheDocument();
    expect(getByAltText(content.introduction_image.alt)).toBeInTheDocument();
  });
});
