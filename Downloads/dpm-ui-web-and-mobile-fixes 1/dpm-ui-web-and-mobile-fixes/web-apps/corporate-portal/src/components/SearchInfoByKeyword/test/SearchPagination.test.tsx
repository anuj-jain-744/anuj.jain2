import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import SearchPagination from "../SearchPagination";


describe("SearchPagination Component", () => {
  it("renders correctly with given all props", () => {
    const mockSearchInput = "test";
    const mockShowingResultFor = "Showing Result For";
    const mockSetCurrentPage = jest.fn();
    const mockSetItemPerPage = jest.fn();
    const mockTotalCount = 20;
    const currentPage = 1;
    const totalCountPlaceholder = "of :total records"
    render(
      <SearchPagination
        searchInput={mockSearchInput}
        showingResultFor={mockShowingResultFor}
        totalCount={mockTotalCount}
        itemPerPage={10}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        setItemPerPage={mockSetItemPerPage}
        totalCountPlaceholder={totalCountPlaceholder}
      />
    );
    const selectElement = screen.getByTestId("pagination-option");
    fireEvent.change(selectElement, { target: {value: 20}});
    expect(mockSetItemPerPage).toHaveBeenCalledWith(20);

    const selectNextButton = screen.getByTestId("carouselButtonNext");
    fireEvent.click(selectNextButton);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function));
    let updatedPage = mockSetCurrentPage.mock.calls[0][0](currentPage);
    expect(updatedPage).toBe(2);

    expect(screen.getByText(`${mockShowingResultFor} ${mockSearchInput}`)).toBeInTheDocument();
    expect(screen.getByText(`${totalCountPlaceholder.replace(":total", mockTotalCount+"")}`)).toBeInTheDocument();

  });
  it("renders correctly with given all props", () => {
    const mockSearchInput = "";
    const mockShowingResultFor = "Showing Result For";
    const mockSetCurrentPage = jest.fn();
    const mockSetItemPerPage = jest.fn();
    const mockTotalCount = 20;
    const totalCountPlaceholder = "of :total records"
    render(
      <SearchPagination
        searchInput={mockSearchInput}
        showingResultFor={mockShowingResultFor}
        totalCount={mockTotalCount}
        itemPerPage={10}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        setItemPerPage={mockSetItemPerPage}
        totalCountPlaceholder={totalCountPlaceholder}
      />
    );
    expect(screen.getByTestId("search-result")).toBeInTheDocument();
  });
  it("renders correctly with given all previous button", () => {
    const mockSearchInput = "";
    const mockShowingResultFor = "Showing Result For";
    const mockSetCurrentPage = jest.fn();
    const mockSetItemPerPage = jest.fn();
    const mockTotalCount = 20;
    const currentPage = 1;
    const totalCountPlaceholder = "of :total records"
    render(
      <SearchPagination
        searchInput={mockSearchInput}
        showingResultFor={mockShowingResultFor}
        totalCount={mockTotalCount}
        itemPerPage={10}
        currentPage={currentPage}
        setCurrentPage={mockSetCurrentPage}
        setItemPerPage={mockSetItemPerPage}
        totalCountPlaceholder={totalCountPlaceholder}
      />
    );
     
    const selectpreviousButton = screen.getByTestId("carouselButtonPrevious");
    fireEvent.click(selectpreviousButton);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function));
    let updatedPage = mockSetCurrentPage.mock.calls[0][0](currentPage);
    expect(updatedPage).toBe(1);

  });
});
