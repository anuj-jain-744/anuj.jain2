import React from "react";
import { render, screen } from "@testing-library/react";
import SuccessClaim from "./SuccessClaim";
import { DataContext } from "../../../DataContext";

const mockDataContextValue = {
  motor_claim_no: "MC123456",
};

const mockSuccessData = {
  claimNo: "CL123456",
};

describe("SuccessClaim Component", () => {
  test("renders motor claim number from DataContext", () => {
    render(
      <DataContext.Provider value={mockDataContextValue}>
        <SuccessClaim SuccessData={mockSuccessData} />
      </DataContext.Provider>
    );
    expect(screen.getByText("MC123456")).toBeInTheDocument();
  });

  test("renders claim number from SuccessData", () => {
    render(
      <DataContext.Provider value={mockDataContextValue}>
        <SuccessClaim SuccessData={mockSuccessData} />
      </DataContext.Provider>
    );
    expect(screen.getByText("CL123456")).toBeInTheDocument();
  });
});