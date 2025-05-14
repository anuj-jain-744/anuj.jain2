import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewDetails from "./ViewDetails";

describe("ViewDetails component", () => {
    const mockDetailsData = [
        { id: 1, itemname: "Item 1" },
        { id: 2, itemname: "Item 2" },
        { id: 3, itemname: "Item 3" },
    ];
    const mockLabel = "Details";

    test("renders View Details button", () => {
        render(<ViewDetails DetailsData={mockDetailsData} label={mockLabel} />);
        const viewDetailsButton = screen.getByText("View Details");
        expect(viewDetailsButton).toBeInTheDocument();
    });

    test("opens modal on button click", () => {
        render(<ViewDetails DetailsData={mockDetailsData} label={mockLabel} />);
        const viewDetailsButton = screen.getByText("View Details");
        fireEvent.click(viewDetailsButton);
        const modalTitle = screen.getByText(mockLabel);
        expect(modalTitle).toBeInTheDocument();
    });

    test("renders list items in modal", () => {
        render(<ViewDetails DetailsData={mockDetailsData} label={mockLabel} />);
        const viewDetailsButton = screen.getByText("View Details");
        fireEvent.click(viewDetailsButton);
        mockDetailsData.forEach((item) => {
            const listItem = screen.getByText(item.itemname);
            expect(listItem).toBeInTheDocument();
        });
    });
});
