import { act, fireEvent, render, screen } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";

import '@testing-library/jest-dom';

import SearchInput from ".";
import ShowOptions from "./ShowOptions";

jest.mock('../../constant', () => ({
  VITE_CONTENT_BASE_URI: 'http://34.166.69.105/walaa/web/',
}));

describe("SearchInput component", () => {
  it("SearchInput pass all props with empty searchInput", async () => {
    const mockSearchInput = "";
    const mockSetSearchInput = jest.fn();
    const mockHandleSearchResult = jest.fn();
    const mockPlaceHolder = {
      search: "Search Place",
      popular_keyword_searches: "Popular Keyword Searches",
      other_searches: "Other Searches",
    };
    const mockSubmitButton = "testSearch";
    const mockFrequentlySearch = ["walaa", "motor"];
    const mockOtherSearch = ["Other"];

    render(
      <SearchInput 
        searchInput={mockSearchInput}
        setSearchInput={mockSetSearchInput} 
        placeholders={mockPlaceHolder}
        handleSearchResult={mockHandleSearchResult}   
        frequentlySearch={mockFrequentlySearch}
        otherSearch={mockOtherSearch}
        submitButtonName={mockSubmitButton}
      />
    );

    const searchInput = screen.getByPlaceholderText(mockPlaceHolder?.search) as HTMLInputElement;
    expect(searchInput?.value).toBe('');
    await UserEvent.type(searchInput, "Motor");


  });

  it("SearchInput pass all props with searchInput", async () => {
    const mockSearchInput = "Test";
    const mockSetSearchInput = jest.fn();
    const mockHandleSearchResult = jest.fn();
    const mockPlaceHolder = {
      search: "Search Place",
      popular_keyword_searches: "Popular Keyword Searches",
      other_searches: "Other Searches",
    };
    const mockSubmitButton = "test Search";
    const mockFrequentlySearch = ["walaa", "motor"];
    const mockOtherSearch = ["Other"];

    render(
      <SearchInput 
        searchInput={mockSearchInput}
        setSearchInput={mockSetSearchInput} 
        placeholders={mockPlaceHolder}
        handleSearchResult={mockHandleSearchResult}   
        frequentlySearch={mockFrequentlySearch}
        otherSearch={mockOtherSearch}
        submitButtonName={mockSubmitButton}
      />
    );
    const clearIcon = screen.getByTestId("clear-input-icon");
    fireEvent.click(clearIcon);

    const testSearch = screen.getByTestId("themeButtontestSearch");
    fireEvent.click(testSearch);
  });

  it("SearchInput related to show the frequentlySearch chip buttons", async () => {
    const mockSearchInput = "";
    const mockSetSearchInput = jest.fn();
    const mockHandleSearchResult = jest.fn();
    const mockPlaceHolder = {
      search: "Search Place",
      popular_keyword_searches: "Popular Keyword Searches",
      other_searches: "Other Searches",
    };
    const mockSubmitButton = "test Search";
    const mockFrequentlySearch = ["walaa", "motor"];
    const mockOtherSearch = ["Other"];

    render(
      <SearchInput 
        searchInput={mockSearchInput}
        setSearchInput={mockSetSearchInput} 
        placeholders={mockPlaceHolder}
        handleSearchResult={mockHandleSearchResult}   
        frequentlySearch={mockFrequentlySearch}
        otherSearch={mockOtherSearch}
        submitButtonName={mockSubmitButton}
      />
    );

    act(() => {
      const searchIcon = screen.getByTestId("search-input-icon");
      fireEvent.click(searchIcon);
    });

    expect(screen.getByText(mockPlaceHolder?.other_searches)).toBeInTheDocument();
   // expect(screen.getByText(mockPlaceHolder?.popular_keyword_searches)).toBeInTheDocument();
    const chipButtonOther = screen.getByTestId("themeButtonOther");
    expect(chipButtonOther).toBeInTheDocument();
    fireEvent.click(chipButtonOther);

  });

  it("SearchInput related to show the frequentlySearch chip buttons", async () => {
    const mockSearchInput = "";
    const mockSetSearchInput = jest.fn();
    const mockHandleSearchResult = jest.fn();
    const mockPlaceHolder = {
      search: "Search Place",
      popular_keyword_searches: "Popular Keyword Searches",
      other_searches: "Other Searches",
    };
    const mockSubmitButton = "test Search";
    const mockFrequentlySearch = ["walaa", "motor"];
    const mockOtherSearch = ["Other"];

    render(
      <SearchInput 
        searchInput={mockSearchInput}
        setSearchInput={mockSetSearchInput} 
        placeholders={mockPlaceHolder}
        handleSearchResult={mockHandleSearchResult}   
        frequentlySearch={mockFrequentlySearch}
        otherSearch={mockOtherSearch}
        submitButtonName={mockSubmitButton}
        defaultPage={false}
      />
    );

    act(() => {
      const searchIcon = screen.getByTestId("search-input-icon");
      fireEvent.click(searchIcon);
    });

    const chipButtonOther = screen.getByTestId("themeButtonOther");
    expect(chipButtonOther).toBeInTheDocument();
    fireEvent.click(chipButtonOther);

  });

  it("ShowOptions check heighlighted options", async () => {
    const mockOptions = ["Walaa", "Walaa Data"]
    const mockHandleOptions = jest.fn();
    const searchInput = "Walaa"
    render(
      <ShowOptions 
        options={mockOptions} 
        handleOptions={mockHandleOptions}
        searchInput={searchInput}       
      />
    );

    mockOptions.forEach((val, index) => {
      const spanHighlighted = screen.getByTestId(`span-highlighted-${index}`);
      fireEvent.click(spanHighlighted);
    });
    expect(mockHandleOptions).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText(searchInput).length).toBe(2);
  });
});
