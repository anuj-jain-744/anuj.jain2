import React from "react";
import { render, screen } from "@testing-library/react";
import Enhancement from "./Enhancement";

describe("Enhancement Component", () => {
  const mockFooterData = {
    blocks: {
      mobile_slider: {
        mobile_app_images: [
          {}, // Placeholder for index 0
          { app_image_url: "google-play-url" },
          { app_image_url: "app-store-url" },
          { app_image_url: "app-gallery-url" },
        ],
      },
    },
  };

  const mockMockData = {
    experience: "Great Experience",
    download: "Download Now",
    "download-app": "Get the App",
  };

  it("renders the component with mock data", () => {
    render(
      <Enhancement
        flag={true}
        footerData={mockFooterData}
        mockData={mockMockData}
      />
    );

    // Check if mockData content is rendered
    expect(screen.getByText("Great Experience")).toBeInTheDocument();
    expect(screen.getByText("Download Now")).toBeInTheDocument();
    expect(screen.getByText("Get the App")).toBeInTheDocument();

    // Check if images are rendered with correct src attributes
    expect(screen.getByAltText("Google Play")).toHaveAttribute(
      "src",
      "google-play-url"
    );
    expect(screen.getByAltText("App Store")).toHaveAttribute(
      "src",
      "app-store-url"
    );
    expect(screen.getByAltText("App Gallery")).toHaveAttribute(
      "src",
      "app-gallery-url"
    );
  });

  it("applies the correct class based on the flag prop", () => {
    const { container: containerWithFlagFalse } = render(
      <Enhancement
        flag={false}
        footerData={mockFooterData}
        mockData={mockMockData}
      />
    );
  
    // Check if the class is applied correctly when flag is false
    expect(containerWithFlagFalse.querySelector(".right-card-containerr")).not.toHaveClass(
      "background-color-none"
    );
  
    const { container: containerWithFlagTrue } = render(
      <Enhancement
        flag={true}
        footerData={mockFooterData}
        mockData={mockMockData}
      />
    );
  
    // Check if the class is applied correctly when flag is true
    expect(containerWithFlagTrue.querySelector(".right-card-containerr")).toHaveClass(
      "background-color-none"
    );
  });

  it("applies the correct class based on the flag prop", () => {
    const { container: containerWithFlagFalse } = render(
      <Enhancement
        flag={false}
        footerData={mockFooterData}
        mockData={mockMockData}
      />
    );

    // Check if the class is applied correctly when flag is false
    expect(containerWithFlagFalse.querySelector(".right-card-containerr")).not.toHaveClass(
      "background-color-none"
    );

    const { container: containerWithFlagTrue } = render(
      <Enhancement
        flag={true}
        footerData={mockFooterData}
        mockData={mockMockData}
      />
    );

    // Check if the class is applied correctly when flag is true
    expect(containerWithFlagTrue.querySelector(".right-card-containerr")).toHaveClass(
      "background-color-none"
    );
  });
  it("renders placeholder images when footerData is missing", () => {
    render(
      <Enhancement
        flag={true}
        footerData={{}}
        mockData={mockMockData}
      />
    );

    // Check if images are rendered without src attributes
    expect(screen.getByAltText("Google Play")).not.toHaveAttribute("src");
    expect(screen.getByAltText("App Store")).not.toHaveAttribute("src");
    expect(screen.getByAltText("App Gallery")).not.toHaveAttribute("src");
  });
});