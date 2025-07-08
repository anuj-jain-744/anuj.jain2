import { render, screen } from "@testing-library/react";
import NoteRight from "./index";
import idea from "assets/Claims/Idea.svg";

describe("NoteRight Component", () => {
  const mockLangData = {
    please_note: "Please note:",
    popup_body_content_two: [
      { value: "First point" },
      { value: "Second point" },
      { value: "Third point" },
      { value: "Fourth point with link" },
    ],
    https_motorclaims_walaa_co: "https://motorclaims.walaa.co",
    walaa_com: "Walaa Website",
  };

  it("renders the header content correctly", () => {
    render(<NoteRight langData={mockLangData} />);
    expect(screen.getByText(mockLangData.please_note)).toBeInTheDocument();
    const logo = screen.getByAltText("claim_reg_det");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", idea);
  });

  it("renders the popup body content correctly", () => {
    render(<NoteRight langData={mockLangData} />);

    mockLangData.popup_body_content_two.forEach((item, index) => {
      expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });

    const link = screen.getByText(mockLangData.walaa_com);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", mockLangData.https_motorclaims_walaa_co);
    expect(link).toHaveAttribute("target", "_blank");
  });
});