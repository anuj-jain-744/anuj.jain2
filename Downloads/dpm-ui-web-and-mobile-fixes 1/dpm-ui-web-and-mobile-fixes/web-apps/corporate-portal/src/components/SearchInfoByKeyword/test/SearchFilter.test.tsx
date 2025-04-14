import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import SearchFilter from "../SearchFilter";
import { ThemeButtonProps } from "../../ThemeButton";

jest.mock('../../../constant', () => ({
  VITE_CONTENT_BASE_URI: 'http://34.166.69.105/walaa/web/',
}));


describe("SearchFilter Component", () => {
  const mockSetSearchInput = jest.fn();
  const mockHandleSearchResult = jest.fn();
  const mockSelectOptions = jest.fn();
  const mockHandleFilterOptions = jest.fn();

  const items = ["Claim", "Product"];
  it("renders correctly with given all props", () => {
    const clearButtonName = "Clear Filter";
    const applyFilterName = "Apply Filter";
    const frequentlySearch = ["Motor", "Claimed", "Others"];
    render(
      <SearchFilter
        title={"FilteredData"}
        options={items}
        selectOptions={[]}
        clearButtonTitle={clearButtonName}
        applyFilterTitle={applyFilterName}
        setSelectOptions={mockSelectOptions}
        popularSearchKeyword={"Popular Search Keyword"}
        handleSearchResult={mockHandleSearchResult}
        frequentlySearch={frequentlySearch}
        otherSearch={["Other", "test"]}
        isSearched={true}
        setSearchInput={mockSetSearchInput}
        handleFilterOptions={mockHandleFilterOptions}
      />
    );
    items.forEach((item, index) => {
      const checkBox = screen.getByTestId(`filter-check${index}`);
      expect(checkBox).toBeInTheDocument();
    });

    let updatedPage:any = [];
    const checkBox = screen.getByTestId(`filter-check0`);
    expect(checkBox).toBeInTheDocument();   
    fireEvent.click(checkBox);

    expect(mockSelectOptions).toHaveBeenCalledWith(expect.any(Function));

    updatedPage = mockSelectOptions.mock.calls[0][0]([]);
    expect(updatedPage).toStrictEqual(["Claim"]);
  });

  it("renders correctly with given all unchecked props", () => {
    const clearButtonName = "Clear Filter";
    const applyFilterName = "Apply Filter";
    const frequentlySearch = ["Motor", "Claimed", "Others"];
    const mockSelection = [items[0]]
    render(
      <SearchFilter
        title={"FilteredData"}
        options={items}
        selectOptions={mockSelection}
        clearButtonTitle={clearButtonName}
        applyFilterTitle={applyFilterName}
        setSelectOptions={mockSelectOptions}
        popularSearchKeyword={"Popular Search Keyword"}
        handleSearchResult={mockHandleSearchResult}
        frequentlySearch={frequentlySearch}
        otherSearch={["Other", "test"]}
        isSearched={true}
        setSearchInput={mockSetSearchInput}
        handleFilterOptions={mockHandleFilterOptions}
      />
    );
    const checkBox = screen.getByTestId(`filter-check0`);
    expect(checkBox).toBeInTheDocument();   
    fireEvent.change(checkBox);
    // fireEvent.click(checkBox);
    expect(checkBox).toBeChecked();  
    fireEvent.change(checkBox); 
  });

  it("renders correctly with given clear button and filter button", () => {
    const clearButtonName = "Clear Filter";
    const applyFilterName = "Apply Filter";
    const frequentlySearch = ["Motor", "Claimed", "Others"];
    const otherSearch = ["Other", "test"];
    render(<SearchFilter
      title={"FilteredData"}
      options={items}
      selectOptions={["Claim"]}
      clearButtonTitle={clearButtonName}
      applyFilterTitle={applyFilterName}
      setSelectOptions={mockSelectOptions}
      popularSearchKeyword={"Popular Search Keyword"}
      handleSearchResult={mockHandleSearchResult}
      frequentlySearch={frequentlySearch}
      otherSearch={otherSearch}
      isSearched={true}
      setSearchInput={mockSetSearchInput}
      handleFilterOptions={mockHandleFilterOptions}
    />);

    const clearButton = screen.getByTestId(`themeButton${clearButtonName.replace(" ", "")}`);
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(mockSelectOptions).toHaveBeenCalled();

    const applyButton = screen.getByTestId(`themeButton${applyFilterName.replace(" ", "")}`)
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).toBeInTheDocument();
    fireEvent.click(applyButton);
    expect(mockHandleFilterOptions).toHaveBeenCalled();

    frequentlySearch.forEach((item) => {
      const frequentlyButton = screen.getByTestId(`themeButton${item.replace(" ", "")}`)
      expect(frequentlyButton).toBeInTheDocument();;
      fireEvent.click(frequentlyButton);
    });

    otherSearch.forEach((item) => {
      const otherButton = screen.getByTestId(`themeButton${item.replace(" ", "")}`);
      expect(otherButton).toBeInTheDocument();
      fireEvent.click(otherButton);
    });
  });

});