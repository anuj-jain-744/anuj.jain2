import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import "./style.scss";

interface IThemeMultiSelect {
  placeholder?: string;
  selectionLimit: number;
  showCheckbox: boolean;
  isLoading: boolean;
  data: null | { id: number; name: string }[];
  changeHandler?: (data: null | { id: number; name: string }[] | []) => void;
}

const ThemeMultiSelect: React.FC<IThemeMultiSelect> = ({
  placeholder,
  selectionLimit,
  showCheckbox,
  isLoading,
  data,
  changeHandler,
}) => {
  // garage list Data
  const [dataState, setDataState] = useState<
    null | { id: number; name: string }[]
  >(data);
  // change in data state
  const [isDatachange, setIsDatachange] = useState(false);
  // selected list
  const [selectedList, setSelectedList] = useState<
    null | [] | { id: number; name: string }[]>([]);

  useEffect(() => {
    setDataState(null);
    setDataState(data);
    // reset selected list to empty
    changeHandler && changeHandler([]);
    onSelect([]);
    onRemove([]);
    setIsDatachange(true);
    setSelectedList([]);
  }, [data]);

  //selected list
  const onSelect = (
    selectedList: null | [] | { id: number; name: string }[]
  ) => {
    changeHandler && changeHandler(selectedList);
    setSelectedList(selectedList);
    setIsDatachange(false);
  };

  //remove list
  const onRemove = (
    selectedFinalList: null | [] | { id: number; name: string }[]
  ) => {
    changeHandler && changeHandler(selectedFinalList);
  };

  //selected list decorator
  const onSelectDecorator = (data: string) => {
    return data !== null && data?.length > 0 ? (
      <div className='selected-item'>
        <span className="selected-item-text">{data}</span>
      </div>
    ) : (
      <div className="selected-item">
        <span className="selected-item-text"></span>
      </div>
    );
  };

  return (
    <div className= {`${isDatachange && 'show-no-values'} Multiselect-cust`}>
      <Multiselect
        placeholder={placeholder ?? ""}
        showCheckbox={showCheckbox}
        options={dataState ?? []} // Options to display in the dropdown
        displayValue="name" // Property name to display in the dropdown options
        selectedValues={selectedList} // Preselected value to persist in dropdown
        onSelect={onSelect} // Function will trigger on select event
        onRemove={onRemove} // Function will trigger on remove event
        selectionLimit={selectionLimit}
        loading={isLoading}
        disable={!dataState}
        selectedValueDecorator={onSelectDecorator}
      />
    </div>
  );
};

export default ThemeMultiSelect;