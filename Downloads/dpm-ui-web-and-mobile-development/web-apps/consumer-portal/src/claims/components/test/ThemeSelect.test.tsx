import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeSelect from "../ThemeSelect";

describe("ThemeSelect Component", () => {
    test("renders with given name", () => {
        render(<ThemeSelect name="Test Name" />);
        expect(screen.getByText("Test Name")).toBeInTheDocument();
    });

    test("calls onChangehandler when an option is selected", () => {
        const handleChange = jest.fn();
        render(<ThemeSelect name="Test Name" onChangehandler={handleChange} />);

        const selectElement = screen.getByRole("combobox");

        fireEvent.change(selectElement, { target: { value: "1" } });

        waitFor(() => {
            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange).toHaveBeenCalledWith(expect.any(Object)); // Ensure it receives an event object
         });
    });

    test("renders the correct options", () => {
        render(<ThemeSelect name="Test Name" />);

        const options = screen.getAllByRole("option");
        expect(options.length).toBeGreaterThan(0); // Ensure options exist

        // Optionally, check for specific values if the list is predefined
        expect(options.map((opt) => opt.textContent)).toEqual(["Test Name", "One", "Two", "Three"]);
    });
});