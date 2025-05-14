import { DataContext } from "DataContext";
import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { OPTION_DEFAULT } from "../../constant";
import "./style.scss";

type ISelectType = {
  name: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  data?: null | { id: number; name: string }[];
  isLoading: boolean;
  defaultValue?: string | null;
};
function ThemeSelect({ name, onChangehandler, isLoading, data, defaultValue }: ISelectType) {
  const [isData, setData] = useState(data);
  // isDataExist is a boolean value to check if the default value is matching with the data
  const [isDataExist, setIsDataExist] = useState(false);

  //cms content
  const { select } = useContext(DataContext) ?? { select: "" };

  useEffect(() => {
    setData(data);
    // check if default value is matching with the data
    setIsDataExist(!!isData?.find((item) => item?.name === defaultValue));
  }, [data]);
  return (
    <div className="theme-select">
      <Form.Select data-testid="data-selectid" onChange={onChangehandler} disabled={!isData}>
        <option id={OPTION_DEFAULT}>{isDataExist ? defaultValue : select + '...'}</option>
        {isData?.map((item) => {
          return (
            <option key={item?.id} id={item?.id?.toString()}>
              {item?.name}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
}

export default ThemeSelect;