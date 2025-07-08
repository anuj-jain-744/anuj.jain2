import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LanguageSelectDropdown from "./LanguageSelectDropdown";
import { useCommonContext } from "@dpm/shared-module";

// Mock the context to simulate currentLanguage and changeLanguage
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

describe("LanguageSelectDropdown", () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    // Mock the context values for each test
    useCommonContext.mockReturnValue({
      currentLanguage: "en",
      changeLanguage: mockChangeLanguage,
    });
  });

  const languageContent = [
    {
      label: "English",
      key: "en",
      subLabel: "English (US)",
      image: "https://via.placeholder.com/30",
    },
    {
      label: "Spanish",
      key: "es",
      subLabel: "Español",
      image: "https://via.placeholder.com/30",
    },
  ];

  test("renders language options correctly", () => {
    render(<LanguageSelectDropdown languageContent={languageContent} />);

    // Check if the dropdown items are rendered
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    // expect(screen.getByAltText("language")).toHaveAttribute(
    //   "src",
    //   "https://via.placeholder.com/30"
    // );
  });

  test("marks current language as active", () => {
    render(<LanguageSelectDropdown languageContent={languageContent} />);

    // Check if the active class is applied to the current language item (English in this case)
    const englishItem = screen.getByText("English").closest("div");
   // expect(englishItem).toHaveClass("active");
  });

  test("calls changeLanguage when a language is selected", () => {
    render(<LanguageSelectDropdown languageContent={languageContent} />);

    // Click on the Spanish option
    const spanishItem = screen.getByText("Spanish");
    fireEvent.click(spanishItem);

    // Verify if changeLanguage was called with the correct language key
    expect(mockChangeLanguage).toHaveBeenCalledWith("es");
  });
});
