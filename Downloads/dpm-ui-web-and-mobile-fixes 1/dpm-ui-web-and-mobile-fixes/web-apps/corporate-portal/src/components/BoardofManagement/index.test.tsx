import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { CeoSection } from "./index";


describe('CEOsection Component', () => {

  const mockData = {
    title: "Johnson Varughese ",
    designation: "Chief Executive Officer",
    content: "Walaa Cooperative Insurance Co.’s capital hike aims to support growth plans in all activities and maintain good solvency in line with current levels,said company CEO Johnson Varughese. In addition, the move aims to maintain the company’s rating.",
    image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/johnson 1.png",
    image_alt: "johnson",
    weight: "0",
    member_role_name: "CEO"
  };
  test("Render CEO name and Designation", async () => {

    render(<CeoSection ceoData={mockData} />);
    expect(screen.getByText(mockData.title.trim())).toBeInTheDocument();
    expect(screen.getByText(mockData.designation.trim())).toBeInTheDocument();
  });

  test("Render CEO Image", () => {

    render(<CeoSection ceoData={mockData} />);
    const imageElement = screen.getByTestId('ceo-img')
    expect(imageElement).toHaveAttribute('src', mockData.image_url);
  });

})


