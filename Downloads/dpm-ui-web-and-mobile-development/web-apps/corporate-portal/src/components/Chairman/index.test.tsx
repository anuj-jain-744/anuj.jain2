import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Chairman } from "./index";


describe('Chairman Component', () => {

  const mockData = [{
    title: "Sulaiman Abdullah Al Kadi",
    designation: "Chairman of the Board",
    content: "The strategic goal of the company is to position itself as one of the leading insurance companies in the Saudi Market, providing all classes of Shariah-compliant insurance products which include Motor, General, Health and Protection & Savings products, to all cross-sections of society, serving our major corporate clients as well as individual valued customers all around the Kingdom",
    image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image 1.png",
    image_alt: "Sulaiman  Abdullah Al Kadi",
    weight: "0",
    member_role_name: "Chairman"
  }];
  test("Render Chairman title  Designation and description", async () => {

    render(<Chairman ChairmanData={mockData} />);

    const titleElement = screen.getByTestId('ceo-title');
    expect(titleElement).toHaveTextContent(mockData[0].title.trim());

    const designationElement = screen.getByTestId('ceo-designation');
    expect(designationElement).toHaveTextContent(mockData[0].designation.trim());

    const descriptionElement = screen.getByTestId('ceo-content');
    expect(descriptionElement).toHaveTextContent(mockData[0].content.trim());

  });

  test("Render Chairman Image", () => {

    render(<Chairman ChairmanData={mockData} />);
    const imageElement = screen.getByTestId('chairman-img')
    expect(imageElement).toHaveAttribute('src', mockData[0].image_url);
  });

})


