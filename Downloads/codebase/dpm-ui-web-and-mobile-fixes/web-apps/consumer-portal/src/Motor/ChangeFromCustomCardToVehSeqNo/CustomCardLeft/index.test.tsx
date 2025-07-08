import React from "react";
import { render, screen } from "@testing-library/react";
import CustomCardLeft from "./index";
import ChangetoVehSeqNo from "./ChangetoVehSeqNo/index";
import { LanguageData } from "types/languageData";

jest.mock("./ChangetoVehSeqNo", () => {
  return jest.fn(() => <div data-testid="ChangetoVehSeqNo-mock" />);
});

describe("CustomCardLeft component", () => {
  const mockChangeHandler = jest.fn();
  const mockFullDataHandler = jest.fn();
  const mockLanguageData: LanguageData = {
    language: "en",
  } as LanguageData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main container div", () => {
    render(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="data"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );
    expect(screen.getByTestId("CustomCardLeft-test")).toBeInTheDocument();
  });

  it("renders ChangetoVehSeqNo with correct props", () => {
    render(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={true}
        customCardData="custom"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );
    expect(ChangetoVehSeqNo).toHaveBeenCalledWith(
      expect.objectContaining({
        languageData: mockLanguageData,
        isValidateSeqBtnDisable: true,
        changeHandler: mockChangeHandler,
        fullDataHandler: mockFullDataHandler,
        customCardData: "custom",
      }),
      {}
    );
  });

  it("handles undefined languageData prop without errors", () => {
    render(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="test"
        fullDataHandler={mockFullDataHandler}
        languageData={undefined}
      />
    );
    expect(screen.getByTestId("CustomCardLeft-test")).toBeInTheDocument();
    expect(ChangetoVehSeqNo).toHaveBeenCalledWith(
      expect.objectContaining({
        languageData: undefined,
      }),
      {}
    );
  });

  it("re-renders correctly when props change", () => {
    const { rerender } = render(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="initial"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );

    rerender(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={true}
        customCardData="updated"
        fullDataHandler={mockFullDataHandler}
        languageData={undefined}
      />
    );

    expect(ChangetoVehSeqNo).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isValidateSeqBtnDisable: true,
        customCardData: "updated",
        languageData: undefined,
      }),
      {}
    );
  });

  it("passes changeHandler and fullDataHandler functions correctly", () => {
    render(
      <CustomCardLeft
        changeHandler={mockChangeHandler}
        isValidateSeqBtnDisable={false}
        customCardData="check-handlers"
        fullDataHandler={mockFullDataHandler}
        languageData={mockLanguageData}
      />
    );

    const props = (ChangetoVehSeqNo as jest.Mock).mock.calls[0][0];
    props.changeHandler({ target: { value: "test" } } as React.ChangeEvent<HTMLInputElement>);
    props.fullDataHandler("some-id");

    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
    expect(mockFullDataHandler).toHaveBeenCalledTimes(1);
  });
});
