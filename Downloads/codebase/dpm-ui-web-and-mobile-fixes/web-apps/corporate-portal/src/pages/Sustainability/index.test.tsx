import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SustaibabilityPage } from "./index";

jest.mock("components/Esg", () => ({
  Esg: () => <div data-testid="Esg" />,
}));

jest.mock("components/Esgworld", () => ({
  Esgworld: () => <div data-testid="Esgworld" />,
}));

jest.mock("components/EsgWalaa", () => ({
  EsgScreen: () => <div data-testid="EsgScreen" />,
}));

jest.mock("components/CustomCarousel", () => ({
  CustomCarousel: ({ title }: { title: string }) => (
    <div data-testid="CustomCarousel">{title}</div>
  ),
}));

const mockNavigateTo = jest.fn();

jest.mock("./listOfReports", () => ({
  ListOfReports: ({ navigateTo, commonKeywords }: any) => (
    <div data-testid="ListOfReports">
      <ul>
        {commonKeywords.map((kw: string, i: number) => (
          <li key={i}>{kw}</li>
        ))}
      </ul>

      <button onClick={() => navigateTo("/test-url")}>Go to report</button>
    </div>
  ),
}));

describe("SustaibabilityPage", () => {
  const mockProps = {
    content: {
      commonKeywords: ["sustainability", "climate"],
      data: {
        news_label: "Label",
        news_description: "Description",
        our_commitment_title: "Commitment Title",
        our_commitment_image_url: "image.jpg",
        our_commitment_description: "Commitment Description",
        esg_world_title: "World Title",
        esg_world_description: "World Description",
        esg_world_images: { url: "img.png", alt: "alt" },
        leading_insurance_title: "Leading Title",
        leading_insurance_description: "Leading Desc",
        leading_insurance_image: { url: "lead.png", alt: "alt" },
        walaa_goals_title: "Goals Title",
        walaa_goals: [{ id: 1, title: "Goal 1" }],
        esg_data_title: "ESG Title",
        esg_data_description: "ESG Description",
        sustainabilitySection: {},
      },
      financialYears: ["2021", "2022"],
      reportData: [],
      reportTypes: ["PDF"],
    },
    esgContent: [{ title: "ESG Metric" }],
    newsData: {
      data: {
        news_list: [],
      },
    },
    navigateTo: mockNavigateTo,
  };

  beforeEach(() => {
    mockNavigateTo.mockClear();
  });

  it("renders all subcomponents correctly", () => {
    render(<SustaibabilityPage {...mockProps} />);

    expect(screen.getByTestId("Esg")).toBeInTheDocument();
    expect(screen.getByTestId("CustomCarousel")).toHaveTextContent("Goals Title");
    expect(screen.getByTestId("Esgworld")).toBeInTheDocument();
    expect(screen.getByTestId("EsgScreen")).toBeInTheDocument();
    expect(screen.getByTestId("ListOfReports")).toBeInTheDocument();
  });

  it("renders common keywords inside ListOfReports", () => {
    render(<SustaibabilityPage {...mockProps} />);
    mockProps.content.commonKeywords.forEach((keyword) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it("calls navigateTo function when ListOfReports button is clicked", () => {
    render(<SustaibabilityPage {...mockProps} />);
    const button = screen.getByText("Go to report");

    fireEvent.click(button);

    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith("/test-url");
  });
});
