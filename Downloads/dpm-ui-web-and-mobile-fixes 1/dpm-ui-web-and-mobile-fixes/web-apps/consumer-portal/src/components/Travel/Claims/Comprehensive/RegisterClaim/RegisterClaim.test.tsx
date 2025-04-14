import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterClaim from ".";

const ClaimsInfo = {
  refNo: "RD0202231954",
  ownerId: "2526837972",
  SourceType: 2,
};

const claimCheckData = {
  status: null,
  referenceNo: "1729623190426",
  sequenceNo: "600367710",
  claimRequestType: "OD",
  caseReportId: null,
  ownerId: null,
  vehicleOwnerDob: null,
  vehicleOwnerDobArabicH: null,
  liability: "100",
  mobileNo: "966551025396",
  feedback: null,
};

describe("RegisterClaim", () => {
  it("1. load component", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
      />
    );

    expect(screen.getByTestId("registerclaim-test")).toBeInTheDocument();
  });

  it("2. Damage Repair match", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
      />
    );
    expect(screen.getByText("Damage Repair")).toBeInTheDocument();
  });

  it("3. Bank Transfer match", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
      />
    );
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
  });

  it("4. Submit button match", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
      />
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("5. Back button match", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
      />
    );
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});