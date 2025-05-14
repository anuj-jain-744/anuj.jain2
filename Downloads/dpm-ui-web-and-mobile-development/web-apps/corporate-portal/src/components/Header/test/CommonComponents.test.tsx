import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "react-bootstrap";
import LanguageSelectDropdown from "../LanguageSelectDropdown";
import ContactUsDropdown from "../ContactUsDropdown";

const mockNavigateTo = jest.fn();


describe("src/components/Header/LanguageSelectDropdown.tsx", () => {
    const mockLanguageContent = [
        { label: "English", subLabel: "EN", image: "english.png" },
        { label: "Arabic", subLabel: "AR", image: "arabic.png" },
      ];
      
      const mockHandleLanguageSelect = jest.fn();
    it("renders the language options correctly", () => {
    render(
      <LanguageSelectDropdown
        languageContent={mockLanguageContent}
        setSelectedLanguage={mockHandleLanguageSelect}
        selectedLanguage="English"
      />
    );

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Arabic")).toBeInTheDocument();
  });

  it("calls handleLanguageSelect when a language is clicked", () => {
    render(
      <LanguageSelectDropdown
        languageContent={mockLanguageContent}
        setSelectedLanguage={mockHandleLanguageSelect}
        selectedLanguage="English"
      />
    );

    fireEvent.click(screen.getByText("Arabic"));
    expect(mockHandleLanguageSelect).toHaveBeenCalledWith("Arabic");
  });

  it("applies the active class to the selected language", () => {
    render(
      <LanguageSelectDropdown
        languageContent={mockLanguageContent}
        setSelectedLanguage={mockHandleLanguageSelect}
        selectedLanguage="Arabic"
      />
    );

    expect(screen.getByText("Arabic").closest('.dropdown-item')).toHaveClass("active");
  });
});

describe("src/components/Header/ContactUsDropdown.tsx", () => {
   

    const defaultProps = {
      attributes: {
        class: ["call"],
      },
      link_content: "<p>Contact us</p>",
      idx: 1,
      menuUrl: "https://example.com",
      linkName: "Example Link",
      navigateTo: mockNavigateTo
    };

    it("renders the link content when class is 'call'", () => {
      render(<ContactUsDropdown {...defaultProps} />);
      const content = screen.getByText("Contact us", { selector: "p" });
      expect(content).toBeInTheDocument();
    });

    it("renders the link name when class is not 'call'", () => {
      const props = {
        ...defaultProps,
        attributes: {
          class: ["email"],
        },
      };
      render(<ContactUsDropdown {...props} />);
      const linkName = screen.getByText("Example Link");
      expect(linkName).toBeInTheDocument();
    });
  });


