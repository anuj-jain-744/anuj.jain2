import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomCardLeft from ".";
import data from "../Mock/data.json"

//change handler return accept fn
const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  return event
};

//final data receive handler accept fn
const fullDataHandler = (customID: string) => {
  return customID;
};

describe("CustomCardLeft", () => {
  it("1. load component", () => {
    render(
      <CustomCardLeft
        isValidateSeqBtnDisable={true}
        changeHandler={onChangeHandler}
        fullDataHandler={() => fullDataHandler("123")}
        customCardData={data?.data?.policyLob[0]?.policyRisk}
      />
    );

    expect(screen.getByTestId("CustomCardLeft-test")).toBeInTheDocument();
  });

  it("2. load custom card No. value", () => {
    render(
      <CustomCardLeft
        isValidateSeqBtnDisable={true}
        changeHandler={onChangeHandler}
        fullDataHandler={() => fullDataHandler("123")}
        customCardData={data?.data?.policyLob[0]?.policyRisk}
      />
    );
    // expect(screen.getByTestId("CustomCardLeft-test")).toBeInTheDocument();
    expect(screen.getByText('9797080880')).toBeInTheDocument()
  });
  it("3. handle the fullDataHandler method", () => {
    const fullDataHandlerMock = jest.fn();
    render(
      <CustomCardLeft
        isValidateSeqBtnDisable={true}
        changeHandler={onChangeHandler}
        fullDataHandler={() => fullDataHandlerMock("9797080880")}
        customCardData={data?.data?.policyLob[0]?.policyRisk}
      />
    );
    expect(screen.getByTestId('validateSeqNoCard-dataHandler')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('validateSeqNoCard-dataHandler'));
    expect(fullDataHandlerMock).toHaveBeenCalledWith(data?.data?.policyLob[0]?.policyRisk[0].vehicleCustomID);
    expect(fullDataHandlerMock).toHaveBeenCalledTimes(1);
  });
});
