import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import EnhanceExperience from "./EnhanceExperience";

const mockReducer = (state: any) => state;

describe("EnhanceExperience Component", () => {
  it("renders the component with Redux data", () => {
    const initialState = {
      dashbaordLanguageData: {
        languageData: {
          sidebar_image2_title: "Enhance Your Experience",
          sidebar_image2_desc: "Make the most of your journey with our features",
          sidebar_image2: "sidebar-image.jpg",
        },
      },
      footerMenuLanguage: {
        languageData: {
          blocks: {
            download: {
              title: "Download Our App",
              data: [
                { image: "google-play.png" },
                { image: "app-store.png" },
                { image: "app-gallery.png" },
              ],
            },
          },
        },
      },
    };

    const store = createStore(mockReducer, initialState);

    const { getByText, getByAltText } = render(
      <Provider store={store}>
        <EnhanceExperience />
      </Provider>
    );

    // Test header text
    expect(getByText("Enhance Your Experience")).toBeInTheDocument();
    expect(
      getByText("Make the most of your journey with our features")
    ).toBeInTheDocument();

    // Test sidebar image
    expect(getByAltText("Sidebar image")).toHaveAttribute(
      "src",
      "sidebar-image.jpg"
    );

    // Test download section
    expect(getByText("Download Our App")).toBeInTheDocument();
    expect(getByAltText("Google Play")).toHaveAttribute(
      "src",
      "google-play.png"
    );
    expect(getByAltText("App Store")).toHaveAttribute(
      "src",
      "app-store.png"
    );
    expect(getByAltText("App Gallery")).toHaveAttribute(
      "src",
      "app-gallery.png"
    );
  });
});
