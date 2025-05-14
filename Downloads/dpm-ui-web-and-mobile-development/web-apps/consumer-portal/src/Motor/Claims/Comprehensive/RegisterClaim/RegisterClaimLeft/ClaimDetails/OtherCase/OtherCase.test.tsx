import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OtherCase from ".";
import { DataContext } from "DataContext";
import { comprehensiveOD, lossDate } from "../../../../../../../constant";

const mockData = {
    registration_details: "Registration Details",
    date_of_loss: "Date of Loss",
    select_date: "Select Date",
    estimate_details: "Estimate Details",
    loss_type: "Loss Type",
    accident_type: "Accident Type",
    estimated_amount_in_sar: "Estimated Amount in SAR",
    enter_estimated_amount: "Enter Estimated Amount",
    taqdeer_no_optional: "Taqdeer No (Optional)",
    enter: "Enter ",
    description_of_loss: "Description of Loss",
    date_is_not_in_correct_for: "Date is not in correct format",
    vehicle_claim_types: [{ key: 1, value: "Type 1" }],
    accident_claim_types: [{ key: 1, value: "Type 1" }],
};

const renderComponent = (props = {}) => {
    return render(
        <DataContext.Provider value={mockData}>
            <OtherCase
                onChangehandler={jest.fn()}
                errorValue=""
                estimateErrorValue=""
                onLossDateChangehandler={jest.fn()}
                type={comprehensiveOD}
                {...props}
            />
        </DataContext.Provider>
    );
};

describe("OtherCase Component", () => {
    test("renders registration details", () => {
        renderComponent();
        expect(screen.getByText(mockData.registration_details)).toBeInTheDocument();
    });

    test("renders date of loss", () => {
        renderComponent();
        expect(screen.getByText(mockData.date_of_loss)).toBeInTheDocument();
    });

    test("renders estimate details", () => {
        renderComponent();
        expect(screen.getByText(mockData.estimate_details)).toBeInTheDocument();
    });

    test("renders loss type", () => {
        renderComponent();
        expect(screen.getByText(mockData.loss_type)).toBeInTheDocument();
    });

    test("renders estimated amount in SAR", () => {
        renderComponent();
        expect(screen.getByText(mockData.estimated_amount_in_sar)).toBeInTheDocument();
    });

    test("renders taqdeer no optional", () => {
        renderComponent();
        expect(screen.getByText(mockData.taqdeer_no_optional)).toBeInTheDocument();
    });

    test("renders description of loss", () => {
        renderComponent();
        expect(screen.getByText(mockData.description_of_loss)).toBeInTheDocument();
    });

    test("handles estimated amount change correctly", () => {
        const onChangehandler = jest.fn();
        renderComponent({ onChangehandler });

        const amountInput = screen.getByPlaceholderText(mockData.enter_estimated_amount);
        fireEvent.change(amountInput, { target: { value: "1000" } });

        expect(onChangehandler).toHaveBeenCalled();
    });

    test("handles taqdeer no change correctly", () => {
        const onChangehandler = jest.fn();
        renderComponent({ onChangehandler });

        const taqdeerInput = screen.getByPlaceholderText(mockData.enter + mockData.taqdeer_no_optional);
        fireEvent.change(taqdeerInput, { target: { value: "12345" } });

        expect(onChangehandler).toHaveBeenCalled();
    });
});