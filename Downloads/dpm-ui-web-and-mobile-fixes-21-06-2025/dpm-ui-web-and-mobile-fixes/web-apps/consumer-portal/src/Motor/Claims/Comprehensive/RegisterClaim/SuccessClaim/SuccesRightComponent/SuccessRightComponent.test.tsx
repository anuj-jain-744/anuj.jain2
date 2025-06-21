import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SuccesRightComponent from "./index";
import { callAPI } from "@dpm/shared-module";
import mockData from "./../success.json";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
}));

const mockFooterData = {
  blocks: {
    mobile_slider: {
      mobile_app_images: [
        { app_image_url: "https://example.com/image0.png" },
        { app_image_url: "https://example.com/google-play.png" },
        { app_image_url: "https://example.com/app-store.png" },
        { app_image_url: "https://example.com/app-gallery.png" },
      ],
    },
  },
};

beforeEach(() => {
  (callAPI as jest.Mock).mockResolvedValue(mockFooterData);
});

test("renders SuccesRightComponent with footer data", async () => {
  render(<SuccesRightComponent />);

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );

  expect(screen.getByText(mockData["experience"])).toBeInTheDocument();
  expect(screen.getByText(mockData["download"])).toBeInTheDocument();
  expect(screen.getByText(mockData["download-app"])).toBeInTheDocument();

  const googlePlayImage = screen.getByRole("img", { name: /google play/i });
  const appStoreImage = screen.getByRole("img", { name: /app store/i });
  const appGalleryImage = screen.getByRole("img", { name: /app gallery/i });

  expect(googlePlayImage).toHaveAttribute(
    "src",
    "https://example.com/google-play.png"
  );
  expect(appStoreImage).toHaveAttribute(
    "src",
    "https://example.com/app-store.png"
  );
  expect(appGalleryImage).toHaveAttribute(
    "src",
    "https://example.com/app-gallery.png"
  );
});
