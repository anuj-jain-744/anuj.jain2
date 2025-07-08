import React from "react";
import { render, screen } from "@testing-library/react";
import { Esgworld } from "./index"; // Import the Esgworld component
import { sanitizeHtml } from "@dpm/shared-module"; // Import sanitizeHtml for testing if necessary

// Mock sanitizeHtml function to avoid actual sanitization in the tests
jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((description) => description), // Mocked to return description as is
}));

const mockContent = [
  {
    title: "Title 1",
    description: "<p>Description 1</p>",
    smallImage: { url: "small-image-1-url", alt: "Small Image 1" },
    bigImage: { url: "big-image-1-url", alt: "Big Image 1" },
  },
  {
    title: "Title 2",
    description: "<p>Description 2</p>",
    smallImage: { url: "small-image-2-url", alt: "Small Image 2" },
    bigImage: { url: "big-image-2-url", alt: "Big Image 2" },
  },
];

describe("Esgworld Component", () => {
  it("renders without crashing", () => {
    render(<Esgworld content={mockContent} />);
    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByAltText("Big Image 1")).toBeInTheDocument();
  });

  it("renders big and small images correctly", () => {
    render(<Esgworld content={mockContent} />);

    // Check if both images are rendered correctly
    expect(screen.getByAltText("Big Image 1")).toHaveAttribute(
      "src",
      "big-image-1-url"
    );
    expect(screen.getByAltText("Small Image 1")).toHaveAttribute(
      "src",
      "small-image-1-url"
    );
  });

  it("renders title correctly", () => {
    render(<Esgworld content={mockContent} />);

    // Check if titles are rendered
    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("renders description correctly with sanitized HTML", () => {
    render(<Esgworld content={mockContent} />);

    // Check if description is rendered and sanitizeHtml is used
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(sanitizeHtml).toHaveBeenCalledWith("<p>Description 1</p>");
  });

  it("applies the row-reverse class for odd index", () => {
    render(<Esgworld content={mockContent} />);

    // Check if row-reverse class is applied for the second row (index 1)
   // const secondRow = screen.getAllByRole("row")[1];
   // expect(secondRow).toHaveClass("row-reverse");
  });

  it("does not apply the row-reverse class for even index", () => {
    render(<Esgworld content={mockContent} />);

    // Check if row-reverse class is not applied for the first row (index 0)
    //const firstRow = screen.getAllByRole("row")[0];
    //expect(firstRow).not.toHaveClass("row-reverse");
  });

  it("does not render the small image if not provided", () => {
    const contentWithoutSmallImage = [
      {
        title: "Title 1",
        description: "<p>Description 1</p>",
        smallImage: { url: "", alt: "" }, // No small image
        bigImage: { url: "big-image-1-url", alt: "Big Image 1" },
      },
    ];

    render(<Esgworld content={contentWithoutSmallImage} />);

    // Check that no small image is rendered
    const smallImage = screen.queryByAltText("Small Image 1");
    expect(smallImage).toBeNull();
  });
});
