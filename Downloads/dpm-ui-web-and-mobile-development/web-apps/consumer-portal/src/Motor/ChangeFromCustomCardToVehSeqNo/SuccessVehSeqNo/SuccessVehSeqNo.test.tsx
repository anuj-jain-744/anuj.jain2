import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SuccessVehSeqNo from ".";
import data from "../Mock/data.json";

const { policyNumber, effectiveDate } = data?.data?.policyBasic || {};
const validateSeqValue = "9797080880";
describe("SuccessVehSeqNo", () => {
  it("1. load component", () => {
    window.scrollTo = jest.fn();
    render(
      <SuccessVehSeqNo
        customCardValue={
          data?.data?.policyLob[0]?.policyRisk[0]?.vehicleCustomID
        }
        effectiveDate={effectiveDate}
        policyNumber={policyNumber}
        validateSeqValue={validateSeqValue}
      />
    );

    expect(
      screen.getByTestId("SuccessVehSeqNo-test")
    ).toBeInTheDocument();
  });

  it("2. check for success text", () => {
    render(
      <SuccessVehSeqNo
        customCardValue={
          data?.data?.policyLob[0]?.policyRisk[0]?.vehicleCustomID
        }
        effectiveDate={effectiveDate}
        policyNumber={policyNumber}
        validateSeqValue={validateSeqValue}
      />
    );

    const customcardno = screen.getByText(/You have successful changed/i)
    expect(customcardno).toBeInTheDocument();
  });
});
