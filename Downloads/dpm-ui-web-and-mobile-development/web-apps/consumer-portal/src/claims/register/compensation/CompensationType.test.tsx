import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CompensationType from "./CompensationType";
import { DataContext } from "../../../DataContext";

const mockData = {
  compensation_type: "Compensation Type",
  bank_transfer: "Bank Transfer",
  damage_repair: "Damage Repair",
};

const mockOnChangehandler = jest.fn();

describe("CompensationType Component", () => {
  beforeEach(() => {
    render(
      <DataContext.Provider value={mockData}>
        <CompensationType onChangehandler={mockOnChangehandler} />
      </DataContext.Provider>
    );
  });

  test("renders compensation type title", () => {
    expect(screen.getByText(mockData.compensation_type)).toBeInTheDocument();
  });

  test("renders bank transfer radio button", () => {
    expect(screen.getByLabelText(mockData.bank_transfer)).toBeInTheDocument();
  });

  test("renders damage repair radio button", () => {
    expect(screen.getByLabelText(mockData.damage_repair)).toBeInTheDocument();
  });

  test("calls onChangehandler when bank transfer radio button is clicked", () => {
    fireEvent.click(screen.getByLabelText(mockData.bank_transfer));
    expect(mockOnChangehandler).toHaveBeenCalled();
  });

  test("calls onChangehandler when damage repair radio button is clicked", () => {
    fireEvent.click(screen.getByLabelText(mockData.damage_repair));
    expect(mockOnChangehandler).toHaveBeenCalled();
  });
});