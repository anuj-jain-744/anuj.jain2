//searchInput.tsx


import { ChangeEvent, FC, useEffect, useState, useRef } from "react";
import { OrgSearch, OrgClearSearch } from "../../assets/Header";
import { Button, Form } from "react-bootstrap";
import "./index.scss";
import ThemeButton from "../ThemeButton";
import { callAPI, getFullUrl } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "../../constant";
import ShowChipButton from "./ShowChipButtons";
import ShowOptions from "./ShowOptions";

interface placeholder {
  search: string;
  popular_keyword_searches:string;
  other_searches: string;
  most_popular?: string;
}

interface searchInputProps {
  searchInput: string;
  setSearchInput: (e: string) => void;
  placeholders: placeholder;
  frequentlySearch?: string[];
  otherSearch?: string[];
  handleSearchResult: (val: string) => void;
  submitButtonName?: string;
  navigateTo?: (url: string) => void;
  defaultPage?: boolean;
}

const SearchInput = ({
  searchInput,
  setSearchInput,
  placeholders,
  frequentlySearch,
  otherSearch,
  handleSearchResult,
  submitButtonName,
  navigateTo,
  defaultPage=true,
}: searchInputProps) => {

  const [hideKeyword, setHideKeywords] = useState<boolean>(false);
  const [hideOptions, setHideOptions] = useState<boolean>(false);
  const [debouncedValue, setDebouncedValue] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setHideKeywords(false);
    setHideOptions(true);
  }

  const handleSearchIconClick = () => {
    setSearchInput("");
    setHideKeywords(false);
    setHideOptions(false);
  };

  const handleOptions = (option: string, isSearched?:boolean) => {
    if(!defaultPage) {
      handleNavigation(option);
      return;
    }
    setSearchInput(option);
    setHideKeywords(false);
    setHideOptions(false);
    if(isSearched) {
      handleSearchResult(option);
    }
  }

  const handleSubmitButton = () => {
    handleSearchResult(searchInput);
    setHideKeywords(false);
    setHideOptions(false);
  };

  const fetchOptions = async () => {
    const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", `search-autocomplete-en/${searchInput}`);
    const respData:unknown = await callAPI("get", fullUrl);
    const options = Array.isArray(respData)? respData.map((val: { title: string; }) => val?.title): [];
    setOptions(options.filter((val: string, index: number) => options.indexOf(val) === index && val));
  }

  const handleNavigation = (value: string) => {
    navigateTo && navigateTo(`/search?search=${value}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [searchInput]);

  useEffect(() => {
    if (debouncedValue) {
      fetchOptions();
    }
  }, [debouncedValue]);
  useEffect(()=>{
    function handlerEvent(event:React.MouseEvent) {
      event.preventDefault()
      if(!modalRef.current?.contains(event.target as HTMLButtonElement)) {
        handleSearchIconClick();
      }
    }
    window.addEventListener('click',handlerEvent as unknown as EventListener);
    return () => window.removeEventListener('click', handlerEvent as unknown as EventListener);
  },[])
  return (
    <div className="search-wrapper">
      <div className="search-input-container" ref={modalRef}>
      <Form.Control
          type="text"
          data-testid="search-input"
          value={searchInput}
          onChange={handleSearchInput}
          placeholder={placeholders?.search}
          className="search-input walaa-regular-400"
          onClick={() => {
            setHideKeywords((val) => !val);
            setHideOptions(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              !defaultPage ? handleNavigation(searchInput) : handleSubmitButton()
            }
          }}
        />
        {searchInput !== "" && <img
          src={OrgClearSearch}
          data-testid="clear-input-icon"
          className="close-icon"
          onClick={handleSearchIconClick}
          alt="clearIcon"
        />}
        {searchInput === "" && (
          <img
            src={OrgSearch}
            data-testid="search-input-icon"
            className="search-icon"
            alt="searchIcon"
            onClick={() => {
              setHideKeywords((val) => !val);
              setHideOptions(false);
            }}
          />
        )}

        {hideKeyword && <div className="search-chips">
          <div className="search-chips-container">
            {frequentlySearch && frequentlySearch?.length > 0 && (
              <ShowChipButton
                title={placeholders?.most_popular?? ""}
                keywords={frequentlySearch}
                handleOptions={handleOptions}
              />
            )}
            {otherSearch && otherSearch?.length > 0 && (
              <ShowChipButton
                title={placeholders?.other_searches}
                keywords={otherSearch}
                handleOptions={handleOptions}
              />
            )}
          </div>
        </div>}
        {!hideKeyword && hideOptions && searchInput !== "" && options && options.length > 0 && (
          <ShowOptions 
            options={options} 
            handleOptions={handleOptions} 
            searchInput={searchInput}            
          />
        )}
      </div>
      {submitButtonName && <ThemeButton
        className="submit-button walaa-medium-500 submit-rtl-button"
        disabled={searchInput === ""}
        name={submitButtonName}
        handleClick={() =>
          !defaultPage ? handleNavigation(searchInput) : handleSubmitButton()
        }
      />}
    </div>
  );
};

export default SearchInput;