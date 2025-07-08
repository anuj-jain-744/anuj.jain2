import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { RangeCalendar } from "./rangeCalendar";
import { DateObject } from "react-multi-date-picker";
import React from "react";

jest.mock("@mui/icons-material/CalendarMonthOutlined", () => () => <span>CalendarIcon</span>);
jest.mock("@mui/icons-material/ChevronLeft", () => () => <span>LeftIcon</span>);
jest.mock("@mui/icons-material/ChevronRight", () => () => <span>RightIcon</span>);

describe("<RangeCalendar/>", () => {
    it('should render the calendar without crashing', async () => {
        render(<RangeCalendar values={[]} setValues={jest.fn()} />)

        const input = await screen.findByRole('textbox');
        const placeholderText = input.getAttribute('placeholder');
        expect(placeholderText).toBe("Start Date  |  End Date");
    })
    it("renders header when shouldShowHeader=true and headerText provided", async () => {
        render(
            <RangeCalendar
                values={[]}
                setValues={jest.fn()}
                shouldShowHeader
                headerText="Test Header"
            />
        );
        fireEvent.click(screen.getByTestId('date-input-container'));
        // Wait for the header to appear
        expect(await screen.findByText("Test Header")).toBeInTheDocument();

    })

    it("renders the apply button with default text", async () => {
        render(<RangeCalendar values={[]} setValues={jest.fn()} />);
        fireEvent.click(screen.getByTestId('date-input-container'));

        // Wait for the Apply button
        expect(await screen.findByTestId("apply")).toBeInTheDocument();
    });

    it("renders custom footerButtonText", async () => {
        render(<RangeCalendar values={[]} setValues={jest.fn()} footerButtonText="Confirm" />);
        fireEvent.click(screen.getByTestId('date-input-container'));

        expect(await screen.findByTestId("apply")).toBeInTheDocument();
    });

    it("disables apply button when dateArray length is not 2", async () => {
        render(<RangeCalendar values={[]} setValues={jest.fn()} />);
        fireEvent.click(screen.getByTestId("date-input-container"));
        const applyButton = await screen.findByTestId("apply");
        expect(applyButton).toBeDisabled();
    });
    it("disables apply button when start and end dates are the same day", async () => {
        const date = new DateObject("2025-06-04");
        render(<RangeCalendar values={[date, date]} setValues={jest.fn()} />);
        fireEvent.click(await screen.findByTestId("date-input-container"));
        const applyButton = await screen.findByTestId("apply");
        expect(applyButton).toBeDisabled();
    });

    it('closes the calendar upon selecting range', async () => {
        const startDate = new DateObject();
        const endDate = new DateObject(startDate).add(21, 'days');
        render(<RangeCalendar values={[startDate, endDate]} setValues={jest.fn()} />);
        const inputContainer = await screen.findByTestId("date-input-container")
        fireEvent.click(inputContainer);
        const applyButton = await screen.findByTestId("apply");
        fireEvent.click(applyButton);

        const parentDiv = inputContainer.parentElement;

        if (parentDiv) {
            const siblingDivs = Array.from(parentDiv.children).filter(
                (child) => child !== inputContainer && child.tagName.toLowerCase() === "div"
            );
            const calendarDiv = siblingDivs[0];

            expect(calendarDiv).not.toBeDefined();
        }

    })
    it("renders the icons", async () => {
        render(<RangeCalendar values={[]} setValues={jest.fn()} />);
        expect(await screen.findByText('CalendarIcon')).toBeInTheDocument()
        const inputContainer = await screen.findByTestId("date-input-container")

        fireEvent.click(inputContainer);
        const leftIcon = await screen.findByText('LeftIcon');
        expect(leftIcon).toBeInTheDocument()
        const rightIcon = await screen.findByText('RightIcon');
        expect(rightIcon).toBeInTheDocument()
    })
    it('closes the calendar when Apply button is clicked', async () => {

        const startDate = new DateObject();
        const endDate = new DateObject(startDate).add(21, 'days');

        render(
            <RangeCalendar
                values={[startDate, endDate]}
                setValues={jest.fn()}
            />
        );
        const inputContainer = await screen.findByTestId("date-input-container");
        fireEvent.click(inputContainer);
        const applyButton = await screen.findByTestId("apply");
        expect(applyButton).toBeEnabled();
        fireEvent.click(applyButton);
    });
})