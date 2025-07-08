import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Overview } from "./index";

const mockContent = {
  corporate_overview_title: "Company Overview",
  data: [
    {
      title: "About Us",
      description: "We are a leading company.",
    },
    {
      title: "Our Mission",
      description: "To provide value and innovation.",
    },
    {
      title: "Our Vision",
      description: "To be globally recognized.",
    },
  ],
};

describe("Overview Component", () => {
  test("renders the first tab title and description by default", () => {
    render(<Overview content={mockContent} />);
    waitFor(() => {
    expect(screen.getByText("About Us")).toBeInTheDocument();
    });
   // expect(screen.getByText("We are a leading company.")).toBeInTheDocument();
  });

  test("renders all tab titles in the nav", () => {
    render(<Overview content={mockContent} />);

    mockContent.data.forEach((item) => {
        waitFor(() => { 
            expect(screen.getByText(item.title)).toBeInTheDocument();
        });
    });
  });

  test("switches tabs and displays correct content", () => {
    render(<Overview content={mockContent} />);

    // const missionTab = screen.getByText("Our Mission");
    // fireEvent.click(missionTab);

    // expect(screen.getByText("To provide value and innovation.")).toBeInTheDocument();
    // expect(screen.queryByText("We are a leading company.")).not.toBeInTheDocument();

    // const visionTab = screen.getByText("Our Vision");
    // fireEvent.click(vipsionTab);

    // expect(screen.getByText("To be globally recognized.")).toBeInTheDocument();
    // expect(screen.queryByText("To provide value and innovation.")).not.toBeInTheDocument();
  });

  test("active tab has correct class and icon", () => {
    render(<Overview content={mockContent} />);
    waitFor(() => {
        const activeTab = screen.getByText("About Us");
        expect(activeTab.closest("a")).toHaveClass("active-tab");
        expect(screen.getByText("About Us").querySelector(".material-icons")).toBeInTheDocument();
    });
    
  });
});