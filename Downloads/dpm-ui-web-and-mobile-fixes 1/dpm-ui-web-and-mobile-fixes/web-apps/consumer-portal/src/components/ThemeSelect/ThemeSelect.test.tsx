import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSelect from ".";
import { DataContext } from "DataContext";

describe("ThemeSelect Component", () => {
    const mockData = [
        { id: 1, name: "Option 1" },
        { id: 2, name: "Option 2" },
    ];

    const mockContextValue = {
        select: "Select an option",
    };

    it("renders without crashing", () => {
        render(
            <DataContext.Provider value={mockContextValue}>
                <ThemeSelect name="test" isLoading={false} data={mockData} />
            </DataContext.Provider>
        );
        expect(screen.getByText("Select an option...")).toBeInTheDocument();
    });

    it("displays options correctly", () => {
        render(
            <DataContext.Provider value={mockContextValue}>
                <ThemeSelect name="test" isLoading={false} data={mockData} />
            </DataContext.Provider>
        );
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("calls onChangehandler when an option is selected", () => {
        const mockOnChangeHandler = jest.fn();
        render(
            <DataContext.Provider value={mockContextValue}>
                <ThemeSelect
                    name="test"
                    onChangehandler={mockOnChangeHandler}
                    isLoading={false}
                    data={mockData}
                />
            </DataContext.Provider>
        );
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "1" },
        });
        expect(mockOnChangeHandler).toHaveBeenCalled();
    });

    it("disables select when data is not provided", () => {
        render(
            <DataContext.Provider value={mockContextValue}>
                <ThemeSelect name="test" isLoading={false} data={null} />
            </DataContext.Provider>
        );
        expect(screen.getByRole("combobox")).toBeDisabled();
    });
});