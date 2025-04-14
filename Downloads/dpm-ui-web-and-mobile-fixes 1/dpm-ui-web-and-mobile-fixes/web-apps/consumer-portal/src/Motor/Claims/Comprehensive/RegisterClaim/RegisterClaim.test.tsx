import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RegisterClaim from ".";

jest.mock('assets/Claims/BankTransfer.png', () => 'mock-success-icon-path');
jest.mock('assets/Claims/DamageRepair.png', () => 'mock-success-icon-path');
jest.mock('assets/Claims/svg/icons/UploadBlue.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/Circle Tick.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/Chevron Up.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/Chevron Down.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/Upload.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/Cancel.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/DOC.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/DOCX.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/JPG.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/PDF.svg', () => 'mock-success-icon-path');
jest.mock('assets/IbanValidation/PNG.svg', () => 'mock-success-icon-path');
jest.mock('assets/QuoteAndBuy/Arrowrightalt.svg', () => 'mock-success-icon-path');
jest.mock('assets/Endorsement/png/Nissan.png', () => 'mock-success-icon-path');
jest.mock('assets/Claims/Idea.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Popups Status.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Line_new.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Download.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Whatsapp.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Mail.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/FeedBack.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Nissan.svg', () => 'mock-success-icon-path');
jest.mock('assets/SuccessPage/Branch.svg', () => 'mock-success-icon-path');

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

const mockFn = jest.fn();

describe("RegisterClaim", () => {
  it("1. load component", () => {
    render(
      <RegisterClaim
        type="OD"
        module="motor"
        claimCheckData={claimCheckData}
        claimsInfo={ClaimsInfo}
        backBtnClickHandler={mockFn}
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
        backBtnClickHandler={mockFn}
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
        backBtnClickHandler={mockFn}
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
        backBtnClickHandler={mockFn}
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
        backBtnClickHandler={mockFn}
      />
    );
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});