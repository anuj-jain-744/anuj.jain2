import { PaginationButton } from "../PaginationButton";
import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

interface SearchPaginationProps {
    searchInput: string;
    showingResultFor: string;
    totalCount: number;
    itemPerPage: number;
    currentPage: number;
    setCurrentPage: any;
    totalCountPlaceholder:string;
    setItemPerPage: (val: number) => void;
}
const SearchPagination = ({
    totalCount,
    showingResultFor,
    searchInput,
    itemPerPage,
    setItemPerPage,
    currentPage,
    setCurrentPage,
    totalCountPlaceholder
}: SearchPaginationProps) => {
    const totalPages = Math.ceil(totalCount/itemPerPage);
    
    return (
        <div className="filter-pagination">
            <h4 data-testid={`search-result`} className="result-search walaa-medium-500">{searchInput ? `${showingResultFor} ${searchInput}` : `` }</h4> 
            {totalCount > 0 && <div className="search-pagination">
                <Form.Select
                    data-testid={`pagination-option`}
                    className="pagination-option"
                    value={itemPerPage}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setItemPerPage(parseInt(e.target.value));
                    }}
                >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </Form.Select>
                <p className="search-total-result">
                    {totalCountPlaceholder.replace(":total", totalCount+"")}
                </p>
                <PaginationButton
                    carouselState={{
                        totalPages: totalPages,
                        currentSlide: currentPage-1,
                    }} 
                    next={() => setCurrentPage((prev: number) => Math.min(prev+1, totalPages) )}
                    previous={() => setCurrentPage((prev: number) => Math.max(prev-1, 1))}
                />
            </div>}
        </div>
    )
}

export default SearchPagination;
