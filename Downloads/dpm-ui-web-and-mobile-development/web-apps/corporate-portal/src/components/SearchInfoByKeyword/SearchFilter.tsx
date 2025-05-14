import ThemeButton from "../ThemeButton";
import ThemeCheckButton from "../ThemeCheckButton";

interface SearchFilterProps {
  title: string;
  options: string[];
  selectOptions: string[];
  setSelectOptions: (val: any) => void;
  clearButtonTitle: string;
  applyFilterTitle: string;
  popularSearchKeyword: string;
  handleSearchResult: (val: string) => void;
  frequentlySearch: string[];
  otherSearch: string[];
  isSearched: boolean;
  setSearchInput: (val: string) => void;
  handleFilterOptions: (val: string[]) => void;
}

const SearchFilter = ({
  title,
  options,
  selectOptions,
  clearButtonTitle,
  applyFilterTitle,
  setSelectOptions,
  popularSearchKeyword,
  handleSearchResult,
  frequentlySearch,
  otherSearch,
  isSearched,
  setSearchInput,
  handleFilterOptions
}: SearchFilterProps) => {

  const handleOnchange = (isChecked: boolean, currentVal: string) => {
    setSelectOptions((prevVal: any) => {
      if (isChecked)
        return [...prevVal, currentVal]
      else {
        return prevVal.filter((filterVal: string) => filterVal !== currentVal)
      }
    });
  }
 
  return (
    <div className="filter-container"> 
      <div>
        <div className="filter-tittle walaa-medium-500">{title}</div>
        <div className="filter-options">
          {options && options.length > 0 && options.map((val: string, index: number) => (
            <ThemeCheckButton 
              key={index} 
              index={index}
              value={val} 
              isSearched={isSearched}
              selectOptions={selectOptions}
              handleOnchange={handleOnchange}              
            />
          ))}
        </div>
        <div className="filter-button-group">
          <ThemeButton
            name={clearButtonTitle}
            handleClick={() => {
              setSelectOptions([]);
              handleFilterOptions([]);
            }}
            className="filter-buttons walaa-medium-500"
            disabled={selectOptions.length === 0}
          />
          <ThemeButton
            name={applyFilterTitle}
            handleClick={() => {
              handleFilterOptions(selectOptions);
            }}
            className="filter-buttons walaa-medium-500"
            disabled={!(selectOptions.length !== 0 && isSearched)}
          />
        </div>
      </div>
      <div>
        <div className="filter-tittle">{popularSearchKeyword}</div>
        <div className="filter-search-keyword">
          {[...frequentlySearch, ...otherSearch].map((val: string, index: number) => (
            <ThemeButton
              key={index}
              className="chip-button"
              name={val}
              handleClick={() => {
                setSearchInput(val);
                handleSearchResult(val);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchFilter;
