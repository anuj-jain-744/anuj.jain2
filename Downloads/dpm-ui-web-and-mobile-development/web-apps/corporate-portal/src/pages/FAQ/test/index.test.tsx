import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { scrollToElement } from "@dpm/shared-module";

import { FAQScreen } from "../index";
import { IconsSet } from "../../../utils/icons";
import { Tabs } from "../../../components/Tabs";
import { Accordians } from "../../../components/Accordians";
import { Searchbar } from "../Searchbar";

const mockCategories = [
  { name: "Medical Insurance", class: "some-class" },
  { name: "Motor Insurance", class: "some-class" },
];

const mockAccordianData = {
  "Medical Insurance": [{ qns: "Question 1", ans: "Answer 1" }],
  "Motor Insurance": [{ qns: "Question 2", ans: "Answer 2" }],
};

jest.mock("../../../utils/icons", () => ({
  IconsSet: {
    "some-class": "some-icon-path",
  },
}));

jest.mock("../../../components/Tabs", () => ({
  Tabs: jest.fn(({ handleSelectTab }) => (
    <div onClick={() => handleSelectTab(mockCategories[1], 1)}>Tabs Mock</div>
  )),
}));

jest.mock("../../../components/Accordians", () => ({
  Accordians: jest.fn(() => <div>Accordians Mock</div>),
}));

jest.mock("../Searchbar", () => ({
  Searchbar: jest.fn(() => <div>Searchbar Mock</div>),
}));

jest.mock("@dpm/shared-module", () => ({
    scrollToElement: jest.fn(),
  }));

describe("FAQScreen Component", () => {
  const mockNavigateTo = jest.fn();

  it("renders FAQScreen component", () => {
    render(
      <FAQScreen
        categories={mockCategories}
        accordianData={mockAccordianData}
        navigateTo={mockNavigateTo}
      />
    );

    expect(screen.getByText("Searchbar Mock")).toBeInTheDocument();
    expect(screen.getByText("Tabs Mock")).toBeInTheDocument();
    expect(screen.getByText("Accordians Mock")).toBeInTheDocument();
  });

  it("handles tab selection", () => {
    render(
      <FAQScreen
        categories={mockCategories}
        accordianData={mockAccordianData}
        navigateTo={mockNavigateTo}
      />
    );

    const tabItem = screen.getByText("Tabs Mock");
    fireEvent.click(tabItem);

    expect(screen.getByText("Accordians Mock")).toBeInTheDocument();
  });

  it("displays the correct category and FAQ", () => {
    render(
      <FAQScreen
        categories={mockCategories}
        accordianData={mockAccordianData}
        navigateTo={mockNavigateTo}
      />
    );

    expect(screen.getByText("Medical Insurance")).toBeInTheDocument();
    expect(screen.getByText("Accordians Mock")).toBeInTheDocument();
  });

  it("calls scrollToElement on tab selection", () => {
    render(
      <FAQScreen
        categories={mockCategories}
        accordianData={mockAccordianData}
        navigateTo={mockNavigateTo}
      />
    );
  
    const tabItem = screen.getByText("Tabs Mock");
    fireEvent.click(tabItem);
  
    expect(scrollToElement).toHaveBeenCalledWith("accordian-faq", -60);
  });

});