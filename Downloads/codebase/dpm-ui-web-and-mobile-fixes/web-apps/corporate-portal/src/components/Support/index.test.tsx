import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Support, SupportDataProps } from "./index";

// Mock dependencies
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(() => ({ currentLanguage: "en" })),
  sanitizeHtml: (html: string) => html,
}));

jest.mock("./CarouselSlider", () => ({ data }: any) => (
  <div data-testid="carousel-item">{data.title}</div>
));

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 375, // simulate mobile
});

describe("Support component", () => {
  const mockNavigateTo = jest.fn();
  const supportData: SupportDataProps[] = [
    {
      title: "Help Center",
      desc: "Support description",
      contact: "contact@example.com",
      icon: "icon.png",
      tinyicon: "tinyicon.png",
      link: "/support",
    },
  ];

  it("renders component with provided title and description", () => {
    const { getByText } = render(
      <Support
        title="Support Title"
        description="Support Description"
        supportData={supportData}
        navigateTo={mockNavigateTo}
      />
    );

    expect(getByText(/Support Title/i)).toBeInTheDocument();
    expect(getByText(/Support Description/i)).toBeInTheDocument();
  });

  it("renders support cards when carouselFlag is true", () => {
    const { getByText } = render(
      <Support
        title="Support Title"
        description="desc"
        supportData={supportData}
        navigateTo={mockNavigateTo}
        carouselSetFlag={true}
      />
    );

    expect(getByText("Help Center")).toBeInTheDocument();
  });

  it("calls navigateTo on card click", () => {
    const { getByRole } = render(
      <Support
        title="Support Title"
        description="desc"
        supportData={supportData}
        navigateTo={mockNavigateTo}
        carouselSetFlag={true}
      />
    );

    fireEvent.click(getByRole("link"));
    expect(mockNavigateTo).toHaveBeenCalledWith("/support");
  });
});
