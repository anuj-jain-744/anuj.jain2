import React, { useState, useEffect } from "react";
import { DateObject } from "react-multi-date-picker";
const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
    (
        {
            value,
            onFocus,
            onBlur,
            onChange,
            onKeyDown,
            className,
            openCalendar,
            handleValueChange, ...rest
        },
        ref
    ) => {
        const [inputVal, setInputVal] = useState("");
        useEffect(() => {
            if (value instanceof DateObject && value.isValid) {
                const formatted = value.format("MM/YYYY");
                setInputVal(formatted);
            } else if (typeof value === "string") {
                setInputVal(value);
            } else {
                setInputVal("");
            }
        }, [value]);
        const formatWithSlashes = (val: string) => {
            const digits = val.replace(/\D/g, "").slice(0, 6); // Max 6 digits: MMYYYY
            if (digits.length >= 3) {
                return `${digits.slice(0, 2)}/${digits.slice(2)}`;
            }
            return digits;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            const formatted = formatWithSlashes(raw);
            setInputVal(formatted);
            onChange?.({ ...e, target: { ...e.target, value: formatted } });
        };

        return (
            <input
                ref={ref}
                inputMode="numeric"
                pattern="\d{2}/\d{4}"
                placeholder={rest.placeholder || ""}
                value={inputVal}
                className={`${className} dob-datepicker`}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                        e.preventDefault();
                    }
                    onKeyDown?.(e);
                }}
                {...rest}
            />
        );
    }
);
export default CustomDateInput;
