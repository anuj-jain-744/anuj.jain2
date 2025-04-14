import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import HighlighterBanner from "./index";

jest.mock('../../constant', () => ({
  VITE_CONTENT_BASE_URI: 'http://34.166.69.105/walaa/web/',
}));


describe("HighlighterBanner Component", () => {
  const mockNavigateTo = jest.fn();
  const mockSetSearchInput = jest.fn();
  const mockHandleSearchResult = jest.fn();

  const items = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Contact", route: "/contact" },
  ];

  it("renders correctly with given all props", () => {
    render(<HighlighterBanner
      showInput={true}
      searchInput={""}
      setSearchInput={mockSetSearchInput}
      placeholders={{
        "apply_filter": "Apply Filter",
        "claims": "Claims",
        "clear_all": "Clear All",
        "faqs": "FAQs",
        "faq_topics": "FAQ Topics",
        "filters": "Filters",
        "no_result_found": "No result found",
        "total_records": "of :total records",
        "other_searches": "Other Searches",
        "policy": "Policy",
        "popular_keyword_searches": "Popular Keyword Searches",
        "search": "Search",
        "search_results_for": "Search results for",
        "we_could_not_find_what_you": "We could not find what you are searching for.",
        "filter_type" : [{
          value: "Product"
        }]
      }}
      frequentlySearch={[
        "motor",
        "other",
        "wala"
      ]}
      otherSearch={[
        "walaa",
        "ordi",
        "news"
      ]}
      title={"test"}
      handleSearchResult={mockHandleSearchResult}
      submitButtonName={"test"}
      breadcrumbsData={items}
      navigateTo={mockNavigateTo}
    />);

    items.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    const bannerVeriation = screen.getByTestId('bannerVeriation');
    expect(bannerVeriation).toHaveClass('image-input-height');

    const bannerTitle = screen.getByTestId('bannerTitle');
    expect(bannerTitle).toHaveClass('content-header');
  });

  it("Check classAplly props", () => {
    render(<HighlighterBanner
      showInput={true}
      searchInput={""}
      setSearchInput={mockSetSearchInput}
      placeholders={{
        "apply_filter": "Apply Filter",
        "claims": "Claims",
        "clear_all": "Clear All",
        "faqs": "FAQs",
        "faq_topics": "FAQ Topics",
        "filters": "Filters",
        "no_result_found": "No result found",
        "total_records": "of :total records",
        "other_searches": "Other Searches",
        "policy": "Policy",
        "popular_keyword_searches": "Popular Keyword Searches",
        "search": "Search",
        "search_results_for": "Search results for",
        "we_could_not_find_what_you": "We could not find what you are searching for.",
        "filter_type" : [{
          value: "Product"
        }]
      }}
      frequentlySearch={[
        "motor",
        "other",
        "wala"
      ]}
      otherSearch={[
        "walaa",
        "ordi",
        "news"
      ]}
      title={"test"}
      handleSearchResult={mockHandleSearchResult}
      submitButtonName={"test"}
      breadcrumbsData={items}
      navigateTo={mockNavigateTo}
      classApply="test-class"
    />);

    items.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    const bannerTitle = screen.getByTestId('bannerTitle');
    expect(bannerTitle).toHaveClass('test-class');
  });
  it("check image class when showInput is false", () => {
    render(
      <HighlighterBanner
        showInput={false}
        searchInput={""}
        setSearchInput={mockSetSearchInput}
        placeholders={{
          "apply_filter": "Apply Filter",
          "claims": "Claims",
          "clear_all": "Clear All",
          "faqs": "FAQs",
          "faq_topics": "FAQ Topics",
          "filters": "Filters",
          "no_result_found": "No result found",
          "total_records": "of :total records",
          "other_searches": "Other Searches",
          "policy": "Policy",
          "popular_keyword_searches": "Popular Keyword Searches",
          "search": "Search",
          "search_results_for": "Search results for",
          "we_could_not_find_what_you": "We could not find what you are searching for.",
          "filter_type" : [{
            value: "Product"
          }]
        }}
        frequentlySearch={[
          "motor",
          "other",
          "wala"
        ]}
        otherSearch={[
          "walaa",
          "ordi",
          "news"
        ]}
        title={"test"}
        handleSearchResult={mockHandleSearchResult}
        submitButtonName={"test"}
        breadcrumbsData={items}
        navigateTo={mockNavigateTo}
      />
    );

    const bannerVeriation = screen.getByTestId('bannerVeriation');
    expect(bannerVeriation).toHaveClass('image-title-height');
  });
});