import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Info from "./info";
import { sanitizeHtml } from "@dpm/shared-module";
import { waitFor } from "@testing-library/react";

jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((html) => html),
}));

describe("Info component", () => {
  const popUpContent = "<p>This is info content</p>";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders info icon", () => {
    render(<Info popUpData={popUpContent} />);
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("opens modal with sanitized content when icon clicked", () => {
    render(<Info popUpData={popUpContent} />);
    
    fireEvent.click(screen.getByTestId("info-icon"));
    
    expect(screen.getByTestId("info-head")).toBeInTheDocument();
    const modalBody = screen.getByTestId("info-body");
    expect(modalBody).toBeInTheDocument();
    expect(modalBody.innerHTML).toBe(popUpContent);
    expect(sanitizeHtml).toHaveBeenCalledWith(popUpContent);
  });

  it("closes modal when close button clicked", async () => {
    render(<Info popUpData={popUpContent} />);
    fireEvent.click(screen.getByTestId("info-icon"));
  
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
  
    await waitFor(() => {
      expect(screen.queryByTestId("info-head")).not.toBeInTheDocument();
    });
  });
});
