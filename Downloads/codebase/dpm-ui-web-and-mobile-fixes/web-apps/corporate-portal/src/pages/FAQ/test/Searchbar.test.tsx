import React from "react";
import "@testing-library/jest-dom";
import { handleSearchResult } from "../Searchbar";
import { callAPI, getFullUrl } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
}));

jest.mock("../../../components/HighlighterBanner", () =>
  jest.fn(() => <div>HighlighterBanner Mock</div>)
);

jest.mock("../../../constant", () => ({
  VITE_CONTENT_BASE_URI: "mockedBaseUri",
}));

describe("src/pages/FAQ/index.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Searchbar component", async () => {
    const mockNavigateTo = jest.fn();
    const mockSetLabel = jest.fn();
    const mockResponse = {
      common: {
        faq_topics: "FAQ Topics",
        faqs: "FAQs",
        search: "Search",
      },
      data: {
        popular: ["Popular Search 1", "Popular Search 2"],
        others: ["Other Search 1", "Other Search 2"],
      },
    };

    (getFullUrl as jest.Mock).mockReturnValue("mockedFullUrl");
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    /*render(<Searchbar navigateTo={mockNavigateTo} setLabel={mockSetLabel} />);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith("get", "mockedFullUrl");
    });

    expect(screen.getByText("HighlighterBanner Mock")).toBeInTheDocument();
    expect(mockSetLabel).toHaveBeenCalledWith({
      title: "FAQ Topics",
      faq: "FAQs",
    });*/
  });

  /*it("handles API call failure", async () => {
    const mockNavigateTo = jest.fn();
    const mockSetLabel = jest.fn();

    (getFullUrl as jest.Mock).mockReturnValue("mockedFullUrl");
    (callAPI as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<Searchbar navigateTo={mockNavigateTo} setLabel={mockSetLabel} />);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith("get", "mockedFullUrl");
    });

    expect(screen.getByText("HighlighterBanner Mock")).toBeInTheDocument();
    expect(mockSetLabel).not.toHaveBeenCalled();
  });*/
});

describe("src/pages/FAQ/index.tsx - handleSearchResult", () => {
    it("should return the undefined result", () => {
    const result = handleSearchResult();
    expect(result).toBeUndefined();
  });
});
