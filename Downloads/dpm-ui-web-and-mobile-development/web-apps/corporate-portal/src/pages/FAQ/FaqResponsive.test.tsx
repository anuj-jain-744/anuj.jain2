// FaqResponsive.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { FaqResponsive } from "./FaqResponsive";

// Mock components
jest.mock("./Searchbar", () => ({
  Searchbar: () => <div>Mocked Searchbar</div>,
}));

jest.mock("../../components/Accordians", () => ({
  Accordians: () => <div>Mocked Accordians</div>,
}));

describe("FaqResponsive Component", () => {
  const mockCategories = [
    { class: "category1", name: "Category 1" },
    { class: "category2", name: "Category 2" },
  ];

  const mockAccordianData = {
    "Category 1": [{ qns: "Question 1", ans: "Answer 1" }],
    "Category 2": [{ qns: "Question 2", ans: "Answer 2" }],
  };

  const mockNavigateTo = jest.fn();

  test("renders FaqResponsive with correct components", () => {
    render(
      <FaqResponsive
            tabItems={mockCategories}
            categories={mockCategories}
            accordianData={mockAccordianData}
            activeTabItem={{ index: 0 }}
            navigateTo={mockNavigateTo} 
            activeResTab={[]} 
            handleSelectTab={function (item: any, index: number): void {
                throw new Error("Function not implemented.");
            } }      />
    );

    // Check if Searchbar is rendered
    expect(screen.getByText("Mocked Searchbar")).toBeInTheDocument();

    // Check if the dropdown button is rendered
    expect(screen.getByTestId("dropdownToogleClick-button")).toBeInTheDocument();

    // Check if the first category is displayed in the dropdown
    expect(screen.getByText("Category 1")).toBeInTheDocument();
  });

  test("changes active tab when dropdown item is clicked", () => {
    render(
      <FaqResponsive
            tabItems={mockCategories}
            categories={mockCategories}
            accordianData={mockAccordianData}
            activeTabItem={{ index: 0 }}
            navigateTo={mockNavigateTo} 
            activeResTab={[]} 
            handleSelectTab={function (item: any, index: number): void {
                throw new Error("Function not implemented.");
            } }      />
    );

    // Check initial active tab content
    expect(screen.getByText("Category 1")).toBeInTheDocument();

    // Click on second category in the dropdown
    const dropdownItem = screen.getAllByTestId("dropdownToogleClick")[1];
    fireEvent.click(dropdownItem);

    // Check if active tab content has changed to Category 2
    expect(screen.getByText("Category 2")).toBeInTheDocument();
  });

  test("renders Accordians component when a tab is active", () => {
    render(
      <FaqResponsive
            tabItems={mockCategories}
            categories={mockCategories}
            accordianData={mockAccordianData}
            activeTabItem={{ index: 0 }}
            navigateTo={mockNavigateTo} 
            activeResTab={[]} 
            handleSelectTab={function (item: any, index: number): void {
                throw new Error("Function not implemented.");
            } }      />
    );

    // Ensure Accordians is rendered
    expect(screen.getByText("Mocked Accordians")).toBeInTheDocument();
  });
});
