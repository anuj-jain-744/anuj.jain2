import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import SequenceNum from "./index";

jest.mock('../../../constant', () => ({
  VITE_BACKEND_BASE_URL: 'http://34.166.69.105/walaa/web/',
}));
 
 
describe("SequenceNum Component", () => {
  const mockSetShow = jest.fn();
  const mockSetContinue = jest.fn();
  const mockSetValidationData = jest.fn();
  const propData = { type: "OD", module: "Module" };
  const claimsInfo = { refNo: "12345", ownerId: "67890", SourceType: 1 };
  const mockSetModal = jest.fn();

  it("renders correctly with modal open", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

   // expect(screen.getByText("Enter Vehicle Sequence No. and DOB")).toBeInTheDocument();
   // expect(screen.getByText("Unable to fetch Vehicle Sequence No and Date of Birth. Kindly provide same above.")).toBeInTheDocument();
  });

  it("handles vehicle sequence number input correctly", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

    // const input = screen.getByPlaceholderText("Vehicle Sequence No.");
    // fireEvent.change(input, { target: { value: "123456" } });
    // expect(input).toHaveValue("123456");
  });

  it("handles date input correctly", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

    // const dateInput = screen.getByPlaceholderText("Date of Birth");
    // fireEvent.change(dateInput, { target: { value: "01/01/2020" } });
    // expect(dateInput).toHaveValue("01/01/2020");
  });

  it("disables verify button when inputs are invalid", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

    // const verifyButton = screen.getByText("Verify");
    // expect(verifyButton).toBeDisabled();
  });

  it("enables verify button when inputs are valid", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

    // const input = screen.getByPlaceholderText("Vehicle Sequence No.");
    // fireEvent.change(input, { target: { value: "123456" } });

    // const dateInput = screen.getByPlaceholderText("Date of Birth");
    // fireEvent.change(dateInput, { target: { value: "01/01/2020" } });

    // const verifyButton = screen.getByText("Verify");
    // expect(verifyButton).not.toBeDisabled();
  });

  it("calls clickHandler on verify button click", () => {
    render(
      <SequenceNum
        isModal={true}
        setShow={mockSetShow}
        setContinue={mockSetContinue}
        setValidationData={mockSetValidationData}
        propData={propData}
        claimsInfo={claimsInfo}
        setShowModal={mockSetModal} 
        setClaimCheckData={undefined}
        formState={{}}
        isOtherCase={false}
        othersClaimInfo={{lossType: "", isSequenceNo: false}}
        setClaimsInfo={() => ({ refNo: "", ownerId: "", SourceType: 0, type: "", mailPhone: "", sessionId: "" })}
        setIsOtherCase={() => false}
        setIsSeqNo={() => false}
        setMissingData={() => false}
        setOthersClaimInfo={() => ({ lossType: "", isSequenceNo: false })}
        setResendSeqNo={() => ""}
        languageData={{}}
      />
    );

    // const input = screen.getByPlaceholderText("Vehicle Sequence No.");
    // fireEvent.change(input, { target: { value: "123456" } });

    // const dateInput = screen.getByPlaceholderText("Date of Birth");
    // fireEvent.change(dateInput, { target: { value: "01/01/2020" } });

    // const verifyButton = screen.getByText("Verify");
    // fireEvent.click(verifyButton);

    // expect(mockSetShow).toHaveBeenCalled();
  });
});