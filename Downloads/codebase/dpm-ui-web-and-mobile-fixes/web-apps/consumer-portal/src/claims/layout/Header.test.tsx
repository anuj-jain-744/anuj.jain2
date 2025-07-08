import React from "react";
import { render } from "@testing-library/react";
import Header from "./Header"; // Adjust the path based on your folder structure

describe("Header Component", () => {
  it("should render title correctly", () => {
    const { getByText } = render(
      <Header title="Test Title" src="" alt="" className="" titleclassName="" cardclassName="" />
    );
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("should render the Card.Header correctly", () => {
    const { container } = render(
      <Header title="Test Title" src="" alt="" className="" titleclassName="" cardclassName="" />
    );
    expect(container.querySelector(".register-card-header")).toBeInTheDocument();
  });

  it("should render title with correct className", () => {
    const { container } = render(
      <Header title="Test Title" src="" alt="" className="" titleclassName="walaa-medium-500" cardclassName="" />
    );
    expect(container.querySelector(".walaa-medium-500")).toBeInTheDocument();
  });

  it("should render a title inside the div with title-colored class", () => {
    const { container } = render(
      <Header title="Test Title" src="" alt="" className="" titleclassName="" cardclassName="" />
    );
    expect(container.querySelector(".title-colored")).toBeInTheDocument();
  });

  it("should not render the commented-out Card.Title section", () => {
    const { container } = render(
      <Header title="Test Title" src="" alt="" className="" titleclassName="" cardclassName="" />
    );
    const cardTitle = container.querySelector("Card.Title");
    expect(cardTitle).not.toBeInTheDocument();
  });
});
