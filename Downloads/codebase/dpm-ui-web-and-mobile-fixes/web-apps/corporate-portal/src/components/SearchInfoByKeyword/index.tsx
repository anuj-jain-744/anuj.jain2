import { useEffect, useState } from "react";
import { callAPI, getFullUrl } from "@dpm/shared-module";
import "./index.scss";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import SearchPagination from "./SearchPagination";
import SearchFilter from "./SearchFilter";
import ShowResult from "./ShowResult";
import HighlighterBanner from "../HighlighterBanner";
import { VITE_CONTENT_BASE_URI } from "../../constant";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface SearchInfoProps {
  setLoading: (val: boolean) => void;
  paramField: string | null;
  navigateTo?: (url: string) => void;
}

export interface placeholders {
  apply_filter: string;
  clear_all: string;
  filters: string;
  claims: string;
  policy: string;
  faqs: string;
  faq_topics: string;
  no_result_found: string;
  total_records: string;
  other_searches: string;
  popular_keyword_searches: string;
  search: string;
  search_results_for: string;
  we_could_not_find_what_you: string;
  filter_type: {
    value: string;
  }[],
}

interface resultData {
  title: string;
  body: string;
  link: string;
  type:string;
}

interface FetchSearchDataParams {
  setSearchResult: (data: any) => void;
  searchkey: string;
}

interface FetchDataParams {
  setSearchInfoData: (data: any) => void;
  setPlaceHolders: (data: any) => void;
}

export const fetchSearchData = async ({setSearchResult, searchkey}: FetchSearchDataParams):Promise<void> => {
  try {
    if (searchkey && searchkey !== "") {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", `search-en/"${searchkey}"`);
      const respData = await callAPI("get", fullUrl);
      setSearchResult(respData);
    }
  } catch (ex) {
    console.log(ex, "errror");
  }
};

export const fetchData = async ({setSearchInfoData, setPlaceHolders}: FetchDataParams):Promise<void> => {
  try {
    const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", "search-keywords");
    const respData = await callAPI("get", fullUrl);
    setSearchInfoData(respData);
    setPlaceHolders(respData?.common)
  } catch (ex) {
    console.log(ex, "errror");
  }
};

export const SearchInfoByKeyword = ({ setLoading, paramField, navigateTo }: SearchInfoProps) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearched, setIssearched] = useState<boolean>(false);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [filterOption, setFilterOption] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [searchInfoData, setSearchInfoData] = useState<any>({});
  const [placeHolders, setPlaceHolders] = useState<placeholders | null>(null);
  const [searchResult, setSearchResult] = useState<resultData[]>([]);
  const [showData, setShowData] = useState<resultData[]>([]);
  
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 786);
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const handleFilterToggle = (e: React.MouseEvent<HTMLDivElement>) => {  
    e.stopPropagation();  
    setIsFilterVisible(prev => !prev);
  };

  const handleFilterCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    setIsFilterVisible(false);
  };

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Search", route: "/search" },
  ];

  const getCurrentPageData = (currentPage: number, itemPerPage: number, filterOption: string[]) => {
    if(searchResult) {
      const startIndex = (currentPage - 1) * itemPerPage;
      const endIndex = (startIndex + itemPerPage);
      let data = searchResult;
      if(filterOption.length > 0)
        data = searchResult.filter(val => filterOption.includes(val?.type))
      setShowData(data.slice(startIndex, endIndex));
    }
  }

  useEffect(() => {
    getCurrentPageData(currentPage, itemPerPage, filterOption);
  }, [currentPage, itemPerPage, searchResult, filterOption]);

  const handleSearchResult = async (searchkey: string) => {
    setLoading(true);
    await fetchSearchData({setSearchResult, searchkey});
    setSearchInput(searchkey);
    setLoading(false);
    setIssearched(true);
    setCurrentPage(1);
    setItemPerPage(10);
  }

  useEffect(() => {
    setSearchInput(paramField ?? "")
    handleSearchResult(paramField ?? "");
  }, [])

  const handleFilterOptions = (selectOptions: string[]) => {
    setFilterOption(selectOptions);
    setIssearched(true);
    setCurrentPage(1);
    setItemPerPage(10);
    getCurrentPageData(1, 10, selectOptions);
  }

  useEffect(() => {
    fetchData({setSearchInfoData, setPlaceHolders});
  }, []);

  const handleSelectedOptions=(e:React.MouseEvent<HTMLButtonElement>,index:number) => {
    e.stopPropagation();
    setSelectOptions(prev => prev.filter((_, i) => i !== index)); // Remove the clicked option
  }

  return (
    <div>
      <HighlighterBanner
        showInput={true}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        placeholders={placeHolders}
        frequentlySearch={searchInfoData?.data?.popular}
        otherSearch={searchInfoData?.data?.others}
        handleSearchResult={handleSearchResult}
        submitButtonName={placeHolders?.search}
        breadcrumbsData={breadcrumbData}
        navigateTo={navigateTo}
      />
      <div className="filter-result-container">

          {isResponsive && (
          <div className="responsive-filter-input"> 
        
              <div className="filter-click" onClick={handleFilterToggle}>
                  <div className="selected-filters">
                    <div className="main-ftr-til walaa-medium-500">Filters</div>
                    <div className="filter-list"> 
                      {selectOptions.map((option, index) => (
                        <div className="selected-ftr" key={index}>
                          {option}
                          <button
                            className="close-button"
                            onClick={(e)=>handleSelectedOptions(e,index)}
                          > &times;  </button>
                        </div>
                      ))}
                    </div>
                    <KeyboardArrowDownOutlinedIcon className="down-arrow" />
                  </div> 
                </div>
 
              <div className={`search-filter-container ${isFilterVisible ? 'visible' : ''}`}>
                <div className="navbar-overlay"></div>
                <CancelOutlinedIcon className="close-filter" onClick={handleFilterCloseClick}/>
                <SearchFilter
                  title={placeHolders?.filters ?? ""}
                  options={(placeHolders?.filter_type || []).map(val => val?.value)}
                  selectOptions={selectOptions}
                  setSelectOptions={setSelectOptions}
                  clearButtonTitle={placeHolders?.clear_all ?? ""}
                  applyFilterTitle={placeHolders?.apply_filter ?? ""}
                  popularSearchKeyword={placeHolders?.popular_keyword_searches ?? ""}
                  handleSearchResult={handleSearchResult}
                  otherSearch={searchInfoData?.data?.others ?? []}
                  frequentlySearch={searchInfoData?.data?.popular ?? []}
                  isSearched={isSearched}
                  setSearchInput={setSearchInput}
                  handleFilterOptions={handleFilterOptions}
                /> 
              </div>
             
          </div>
          )}

        {isSearched && searchResult && (
          <SearchPagination
            currentPage={currentPage}
            itemPerPage={itemPerPage}
            setItemPerPage={setItemPerPage}
            setCurrentPage={setCurrentPage}
            searchInput={searchInput}
            showingResultFor={placeHolders?.search_results_for ?? ""}
            totalCount={searchResult.length}
            totalCountPlaceholder={placeHolders?.total_records || ""}
          />
        )}
        <div className="filter-result"> 
          <SearchFilter
            title={placeHolders?.filters ?? ""}
            options={(placeHolders?.filter_type || []).map(val => val?.value)}
            selectOptions={selectOptions}
            setSelectOptions={setSelectOptions}
            clearButtonTitle={placeHolders?.clear_all ?? ""}
            applyFilterTitle={placeHolders?.apply_filter ?? ""}
            popularSearchKeyword={placeHolders?.popular_keyword_searches ?? ""}
            handleSearchResult={handleSearchResult}
            otherSearch={searchInfoData?.data?.others ?? []}
            frequentlySearch={searchInfoData?.data?.popular ?? []}
            isSearched={isSearched}
            setSearchInput={setSearchInput}
            handleFilterOptions={handleFilterOptions}
          />
          <ShowResult
            resultData={showData}
            noResultPlacehoder={{
              noResultTitle: placeHolders?.no_result_found ?? "",
              noResultSubTitle: placeHolders?.we_could_not_find_what_you ?? ""
            }}
          />
        </div>
        {isSearched && searchResult && (
          <SearchPagination
            currentPage={currentPage}
            itemPerPage={itemPerPage}
            setItemPerPage={setItemPerPage}
            setCurrentPage={setCurrentPage}
            searchInput={""}
            showingResultFor={""}
            totalCount={searchResult.length}
            totalCountPlaceholder={placeHolders?.total_records || ""}
          />
        )}
      </div>
    </div>
  )
}
