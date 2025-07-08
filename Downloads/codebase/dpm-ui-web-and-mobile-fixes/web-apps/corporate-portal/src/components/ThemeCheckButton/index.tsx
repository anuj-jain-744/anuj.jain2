import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";

interface ThemeCheckButton {
    value: string;
    isSearched: boolean;
    selectOptions: string[];
    handleOnchange: (isChecked: boolean, value: string) => void;
    index:number
}
           
export default function ThemeCheckButton ({value, isSearched, selectOptions, handleOnchange, index}:ThemeCheckButton )  {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    useEffect(() => {
        setIsChecked(selectOptions.includes(value))
    }, [selectOptions]);

    return (
        <Form.Check
            type="checkbox"
            label={value}
            value={value}
            data-testid={`filter-check${index}`}
            disabled={!isSearched}
            className="filter-checkbox walaa-regular-400"
            aria-label="select filter"
            checked={isChecked}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleOnchange(e.target.checked, value);
            }}
        />
    )
}