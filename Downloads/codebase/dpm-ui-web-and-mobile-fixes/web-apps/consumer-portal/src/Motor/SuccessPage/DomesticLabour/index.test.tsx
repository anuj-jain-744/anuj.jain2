import React from "react";
import { render, screen } from "@testing-library/react";
import DomesticLabourCard from "./index";
import { LanguageData } from "types/languageData";
import { DomesticCardProps } from "components/PaymentOptions/types/cmsPayment";

describe("DomesticLabourCard Component", () => {
  const mockLanguageData: LanguageData = {
    boost_your_domestic_image_url: "mock-image-url",
    boost_your_domestic_labour: "Boost Domestic Labour",
    add_domestic_labour_insura: "Add Domestic Labour Insurance",
    check_on_domestic_insuranc: "Check Domestic Insurance",
  };

  const mockDomesticCardData: DomesticCardProps = {
    sidebar_image: "mock-sidebar-image-url",
    sidebar_image_title: "Sidebar Image Title",
    sidebar_image_desc: "Sidebar Image Description",
    sidebar_image_buttontext: "Sidebar Button Text",
  };

  it("renders with domesticCardData props", () => {
    render(
      <DomesticLabourCard
        data={null}
        domesticCardData={mockDomesticCardData}
      />
    );

    // Check if the image is rendered
    const image = screen.getByTestId("domestic-img");
    expect(image).toHaveAttribute("src", mockDomesticCardData.sidebar_image);

    // Check if the title is rendered
    expect(screen.getByText(mockDomesticCardData.sidebar_image_title)).toBeInTheDocument();

    // Check if the description is rendered
    expect(screen.getByText(mockDomesticCardData.sidebar_image_desc)).toBeInTheDocument();

    // Check if the button text is rendered
    expect(screen.getByText(mockDomesticCardData.sidebar_image_buttontext)).toBeInTheDocument();
  });

  it("renders with data props when domesticCardData is not provided", () => {
    render(
      <DomesticLabourCard
        data={mockLanguageData}
        domesticCardData={undefined}
      />
    );

    // Check if the image is rendered
    const image = screen.getByTestId("domestic-img");
    expect(image).toHaveAttribute("src", mockLanguageData.boost_your_domestic_image_url);

    // Check if the title is rendered
    expect(screen.getByText(mockLanguageData.boost_your_domestic_labour)).toBeInTheDocument();

    // Check if the description is rendered
    expect(screen.getByText(mockLanguageData.add_domestic_labour_insura)).toBeInTheDocument();

    // Check if the button text is rendered
    expect(screen.getByText(mockLanguageData.check_on_domestic_insuranc)).toBeInTheDocument();
  });

  it("renders empty button text when no data is provided", () => {
    render(<DomesticLabourCard data={null} domesticCardData={null} />);
  
    // Check if the button is rendered with the correct title attribute
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "");
  });
});