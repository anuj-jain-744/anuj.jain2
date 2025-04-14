import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CompreEstimation from "./CompreEstimation";
import { DataContext } from "../../../../DataContext";

const mockData = {
  estimated_amount: "Estimated Amount",
  walaa_liability: "Walaa Liability",
  is_walaa_liability_correct: "Is Walaa Liability Correct?",
  yes: "Yes",
  no: "No",
};

const mockValidationData = {
  estimatedAmount: "SAR 2000",
  liability: "75%",
};

describe("CompreEstimation", () => {
  it("renders correctly with provided data", () => {
    const changeHandler = jest.fn();

    render(
      <DataContext.Provider value={mockData}>
        <CompreEstimation
          changeHandler={changeHandler}
          validationData={mockValidationData}
        />
      </DataContext.Provider>
    );

    expect(screen.getByText("Estimated Amount")).toBeInTheDocument();
    expect(screen.getByText("SAR 2000")).toBeInTheDocument();
    expect(screen.getByText("Walaa Liability")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Is Walaa Liability Correct?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls changeHandler on change", () => {
    const changeHandler = jest.fn();

    render(
      <DataContext.Provider value={mockData}>
        <CompreEstimation
          changeHandler={changeHandler}
          validationData={mockValidationData}
        />
      </DataContext.Provider>
    );

    fireEvent.change(screen.getByRole("radiogroup"));
    expect(changeHandler).toHaveBeenCalled();
  });

  it("toggles selected state on button click", () => {
    const changeHandler = jest.fn();

    render(
      <DataContext.Provider value={mockData}>
        <CompreEstimation
          changeHandler={changeHandler}
          validationData={mockValidationData}
        />
      </DataContext.Provider>
    );

    const yesButton = screen.getByText("Yes");
    const noButton = screen.getByText("No");

    fireEvent.click(noButton);
    expect(noButton).toHaveClass("selected selected-2");
    expect(yesButton).toHaveClass("not-selected");

    fireEvent.click(yesButton);
    expect(yesButton).toHaveClass("selected");
    expect(noButton).toHaveClass("not-selected");
  });
});