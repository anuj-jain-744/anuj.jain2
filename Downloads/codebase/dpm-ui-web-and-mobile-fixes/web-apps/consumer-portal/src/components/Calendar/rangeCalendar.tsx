import React, { useRef, useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import arabic from "react-date-object/calendars/arabic";
import arabicEn from "react-date-object/locales/arabic_en";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./index.scss";

interface RangeCalendarProps {
    values: DateObject[];
    setValues: (values: DateObject[]) => void;
    className?: string;
    isHijriOn?: boolean;
    headerText?: string;
    shouldShowHeader?: boolean;
    footerButtonText?: string;
    onStartDateSelection?: ((date: DateObject[]) => void);
    customProps?: { [key: string]: any };
}

function CalendarHeader({ headerText }: { headerText: string }) {
    return <div className='rmdp_range_calendar-header'>{headerText}</div>;
}



export const RangeCalendar = ({
    values = [],
    setValues,
    className = '',
    footerButtonText = 'Apply',
    isHijriOn = false,
    customProps = {},
    headerText,
    shouldShowHeader = false,
    onStartDateSelection
}: RangeCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState<DateObject>(new DateObject());
    const datePickerRef = useRef<any>(null);

    const today = new DateObject();

    const handleValuesChange = () => {       
        if (datePickerRef.current) {
            datePickerRef.current.closeCalendar(); // Close the calendar programmatically
        }
    }

    const { minDate, maxDate } = customProps;

    const isPrevDisabled = () => {
        if (!minDate) return false;
        const prevMonth = new Date(currentMonth.year, currentMonth.month.index - 1, 1);
        const minMonth = new Date((minDate as DateObject).year, (minDate as DateObject).month.index, 1);
        return prevMonth.getTime() < minMonth.getTime();
    };


    const isNextDisabled = () => {
        if (!maxDate) return false;
        const nextMonth = new Date(currentMonth.year, currentMonth.month.index + 1, 1);
        const maxMonth = new Date((maxDate as DateObject).year, (maxDate as DateObject).month.index, 1);
        return nextMonth.getTime() > maxMonth.getTime();
    };

    const isSameDay = (dateRange: DateObject[]): boolean => {
        const [rangeStart, rangeEnd] = dateRange
        const startDate = rangeStart.toDate();
        const endDate = rangeEnd.toDate();
        return (
            startDate.getFullYear() === endDate.getFullYear() &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate()
        );
    };

    return (
        <div className={`${className ? className : "pt-1 range-picker"}`} >
            <DatePicker
                className="rmdp_range_calendar"
                data-testid="rmdp_range_calendar"
                plugins={shouldShowHeader ? [
                    <CalendarHeader position="top" headerText={headerText ?? ''} />
                ] : []}
                renderButton={(direction: string, handleClick: () => void) => {
                    const isDisabled = direction === "left" ? isPrevDisabled() : isNextDisabled();
                    return (
                        <button onClick={handleClick} className={`button-icon ${isDisabled ? "disabled" : "enabled"}`}>
                            {direction === "right" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </button>
                    )
                }}
                range
                onOpen={() => setCurrentMonth(today)}
                arrow={false}
                ref={datePickerRef}
                dateSeparator=" | "
                format="DD/MM/YYYY"
                disableMonthPicker
                onChange={(e) => {
                    onStartDateSelection?.(e);
                    setValues(e)
                }}
                value={values}
                disableYearPicker
                zIndex={999999}
                shadow={false}
                calendar={isHijriOn ? arabic : undefined}
                locale={isHijriOn ? arabicEn : undefined}
                onMonthChange={(date: DateObject) => {
                    setCurrentMonth(date);
                }}
                mapDays={({ date }) => {
                    const isToday =
                        date.year === today.year &&
                        date.month.index === today.month.index &&
                        date.day === today.day;
                    const [start, end] = values;
                    const dateTime = date.toDate().getTime();
                    const startTime = start?.toDate().getTime();
                    const endTime = end?.toDate().getTime();
                    const isInRange =
                        startTime !== undefined &&
                        endTime !== undefined &&
                        dateTime >= startTime &&
                        dateTime <= endTime;
                    const isStartOfWeek = date.weekDay.index === 0; // Sunday
                    const isEndOfWeek = date.weekDay.index === 6;   // Saturday
                    const classes = [];
                    if (isToday) {
                        classes.push("rmdp_range_calendar-today");
                    }

                    if (isInRange && (isStartOfWeek || isEndOfWeek)) {
                        classes.push(isStartOfWeek ? "rounded-week-start-border" : "rounded-week-end-border");
                    }
                    if (!endTime) {
                        classes.push("rmdp-range-selection-start")
                    }

                    return {
                        className: classes.join(" "),
                    };
                }}
                render={
                    <div className='rmdp_range_calendar-input_container' data-testid="date-input-container" tabIndex={0} role='button' onClick={() => datePickerRef.current?.openCalendar()}><input
                        placeholder="Start Date  |  End Date"
                        readOnly
                        type='text'
                        value={values.map(date => date.format("DD/MM/YYYY")).join("  |  ")}
                    />
                        <CalendarMonthOutlinedIcon />
                    </div>
                }
                {...customProps}
            >
                <hr className='hr-line' />
                <div className="rmdp_range_calendar-footer">
                    <button
                        disabled={values.length !== 2 || isSameDay(values)}
                        className='footer-apply_btn'
                        onClick={() => handleValuesChange()}
                        role="button"
                        name="apply"
                        data-testid="apply"
                    >
                        {footerButtonText}
                    </button>
                </div>
            </DatePicker>
        </div>
    );
};

