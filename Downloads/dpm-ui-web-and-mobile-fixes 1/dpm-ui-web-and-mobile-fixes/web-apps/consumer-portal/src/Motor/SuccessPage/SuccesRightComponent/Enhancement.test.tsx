// Enhancement.test.tsx
import { render, screen } from "@testing-library/react";
import Enhancement from "./Enhancement";

// Mock the props for the test
const mockFooterData = {
  blocks: {
    mobile_slider: {
      mobile_app_images: [
        { app_image_url: "" }, // Assuming index 0 is a non-relevant entry
        { app_image_url: "google-play-image-url" }, // Google Play Image
        { app_image_url: "app-store-image-url" }, // App Store Image
        { app_image_url: "app-gallery-image-url" }, // App Gallery Image
      ],
    },
  },
};

const mockData = {
  experience: "Experience the best services",
  download: "Download our app now for a better experience.",
  "download-app": "Download the app from the following stores",
};

describe("Enhancement Component", () => {
  it("renders correctly with all props", () => {
    render(<Enhancement flag={false} footerData={mockFooterData} mockData={mockData} />);

    // Test if the text content appears correctly
    expect(screen.getByText(mockData.experience)).toBeInTheDocument();
    expect(screen.getByText(mockData.download)).toBeInTheDocument();
    expect(screen.getByText(mockData["download-app"])).toBeInTheDocument();

    // Test if the images are rendered correctly
    const googlePlayImage = screen.getByAltText("Google Play");
    const appStoreImage = screen.getByAltText("App Store");
    const appGalleryImage = screen.getByAltText("App Gallery");

    expect(googlePlayImage).toHaveAttribute("src", "google-play-image-url");
    expect(appStoreImage).toHaveAttribute("src", "app-store-image-url");
    expect(appGalleryImage).toHaveAttribute("src", "app-gallery-image-url");
  });

  it("applies background-color-none class when flag is true", () => {
    const { container } = render(<Enhancement flag={true} footerData={mockFooterData} mockData={mockData} />);
    
    // Check if the 'background-color-none' class is added when flag is true
    expect(container.firstChild).toHaveClass("background-color-none");
  });

  it("does not apply background-color-none class when flag is false", () => {
    const { container } = render(<Enhancement flag={false} footerData={mockFooterData} mockData={mockData} />);
    
    // Ensure that the 'background-color-none' class is not added when flag is false
    expect(container.firstChild).not.toHaveClass("background-color-none");
  });

  it("renders without crashing when no mockData is provided", () => {
    render(<Enhancement flag={false} footerData={mockFooterData} />);

    // Test if the component still renders without crashing
    expect(screen.getByText("Download the app from the following stores")).toBeInTheDocument();
  });

  it("renders with empty content when mockData is missing fields", () => {
    const partialMockData = {
        experience: "Experience the best services",
        download: "", // Provide a string value for the download field
        "download-app": "", // Provide a string value for the download-app field
    };

    render(<Enhancement flag={false} footerData={mockFooterData} mockData={partialMockData} />);

    // Expect the "Experience the best services" to be in the document
    expect(screen.getByText("Experience the best services")).toBeInTheDocument();

    // Ensure that missing fields do not throw errors and are not rendered
    expect(screen.queryByText("Download our app now for a better experience.")).toBeNull();
    expect(screen.queryByText("Download the app from the following stores")).toBeNull();
  });
});
