import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeMultiSelect from ".";

describe("ThemeMultiSelect Component", () => {
    const mockChangeHandler = jest.fn();
    const mockData = [
        { id: 1, name: "Option 1" },
        { id: 2, name: "Option 2" },
    ];

    it("renders without crashing", () => {
        render(
            <ThemeMultiSelect
                placeholder="Select an option"
                selectionLimit={2}
                showCheckbox={true}
                isLoading={false}
                data={mockData}
                changeHandler={mockChangeHandler}
            />
        );
        expect(screen.getByPlaceholderText("Select an option")).toBeInTheDocument();
    });

    it("displays options correctly", () => {
        render(
            <ThemeMultiSelect
                placeholder="Select an option"
                selectionLimit={2}
                showCheckbox={true}
                isLoading={false}
                data={mockData}
                changeHandler={mockChangeHandler}
            />
        );
        fireEvent.click(screen.getByPlaceholderText("Select an option"));
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("calls changeHandler on select", () => {
        render(
            <ThemeMultiSelect
                placeholder="Select an option"
                selectionLimit={2}
                showCheckbox={true}
                isLoading={false}
                data={mockData}
                changeHandler={mockChangeHandler}
            />
        );
        fireEvent.click(screen.getByPlaceholderText("Select an option"));
        fireEvent.click(screen.getByText("Option 1"));
        expect(mockChangeHandler).toHaveBeenCalledWith([{ id: 1, name: "Option 1" }]);
    });
});