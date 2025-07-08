import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import RelatedUrls from "../RelatedUrls";
 
 

jest.mock("@mui/icons-material/East", () => ({
  __esModule: true,
  default: () => <div data-testid="east-icon">East Icon</div>
}));

describe("RelatedUrls Component", () => {

  const defaultProps = {
    relatedUrlContent: [
      {
        page_title: "Example Page 1",
        page_link: "https://example.com/page1"
      },
      {
        page_title: "Example Page 2",
        page_link: "https://example.com/page2"
      }
    ]
  };
 
  test("renders list of related URLs with given props", () => {
    render(<RelatedUrls {...defaultProps} />);
    
    expect(screen.getByText("Example Page 1")).toBeInTheDocument();
    expect(screen.getByText("Example Page 2")).toBeInTheDocument();
    expect(screen.getAllByText("East Icon").length).toBe(2);  
  });

  test("renders nothing if relatedUrlContent is empty", () => {
    render(<RelatedUrls relatedUrlContent={[]} />);
    expect(screen.queryByText("Example Page 1")).toBeNull();
    expect(screen.queryByText("Example Page 2")).toBeNull();
  });

  test("renders nothing if relatedUrlContent is not provided", () => {
    render(<RelatedUrls relatedUrlContent={[]} />);
    expect(screen.queryByText("Example Page 1")).toBeNull();
    expect(screen.queryByText("Example Page 2")).toBeNull();
  });

});
