import React from "react";
import { render, screen } from "@testing-library/react";
import ChangetoVehSeqNo from "./index";
import ValidateSeqNoCard from "./ValidateSeqNoCard";
import { LanguageData } from "types/languageData";

jest.mock("./ValidateSeqNoCard", () => {
  return jest.fn(() => <div data-testid="ValidateSeqNoCard-mock" />);
});

describe("ChangetoVehSeqNo component", () => {
  const mockChangeHandler = jest.fn();
  const mockFullDataHandler = jest.fn();
  const mockLanguageData: LanguageData = {
    change_to_vehicle_sequence: "Change to Vehicle Sequence No",
  } as LanguageData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main container and header with language data text", () => {
    render(
      <ChangetoVehSeqNo
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="card-data"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );

    const container = screen.getByText(mockLanguageData.change_to_vehicle_sequence);
    expect(container).toBeInTheDocument();

    const mainDiv = screen.getByText(mockLanguageData.change_to_vehicle_sequence).closest("div");
    expect(mainDiv).toHaveClass("header-body");
  });

  it("renders ValidateSeqNoCard with correct props", () => {
    render(
      <ChangetoVehSeqNo
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={true}
        customCardData="custom-data"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );

    expect(ValidateSeqNoCard).toHaveBeenCalledWith(
      expect.objectContaining({
        languageData: mockLanguageData,
        isValidateSeqBtnDisable: true,
        changeHandler: mockChangeHandler,
        fullDataHandler: mockFullDataHandler,
        customCardData: "custom-data",
      }),
      {}
    );

    expect(screen.getByTestId("ValidateSeqNoCard-mock")).toBeInTheDocument();
  });

  it("renders empty header text gracefully when languageData.change_to_vehicle_sequence is empty or missing", () => {
  const emptyLanguageData = {} as LanguageData;

  render(
    <ChangetoVehSeqNo
      changeHandler={jest.fn()}
      isValidateSeqBtnDisable={false}
      customCardData="empty-test"
      fullDataHandler={jest.fn()}
      languageData={emptyLanguageData}
    />
  );

  const headerDiv = screen.getByText("", { selector: ".header-body" });
  expect(headerDiv).toBeInTheDocument();

  expect(screen.getByTestId("ValidateSeqNoCard-mock")).toBeInTheDocument();
});

  it("renders correctly when languageData is undefined", () => {
    render(
      <ChangetoVehSeqNo
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="test"
        fullDataHandler={mockFullDataHandler}
        languageData={undefined}
      />
    );

    expect(screen.queryByText(/change_to_vehicle_sequence/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("ValidateSeqNoCard-mock")).toBeInTheDocument();

    expect(ValidateSeqNoCard).toHaveBeenCalledWith(
      expect.objectContaining({
        languageData: undefined,
      }),
      {}
    );
  });
});
