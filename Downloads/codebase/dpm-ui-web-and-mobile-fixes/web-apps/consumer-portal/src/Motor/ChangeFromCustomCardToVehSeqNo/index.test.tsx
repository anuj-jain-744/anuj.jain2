import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeFromCustomCardToVehSeqNo from "./index";
import * as sharedModule from "@dpm/shared-module";

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("@dpm/shared-module", () => ({
  ...jest.requireActual("@dpm/shared-module"),
  useApiCall: jest.fn(),
  capitalizeNameFirstLetter: jest.fn((str) => str),
  isValidInputRegex: jest.fn(() => true),
}));

jest.mock("./CustomCardLeft", () => (props: any) => (
    <div>
      CustomCardLeft
      <input
        data-testid="validate-seq-input"
        value={props.validateSeqValue}
        onChange={props.changeHandler}
      />
      <button
        data-testid="full-data-handler-btn"
        onClick={() => props.fullDataHandler(props.customCardData)}
        disabled={props.isValidateSeqBtnDisable}
      >
        Submit
      </button>
      {props.errorMessage && <div>{props.errorMessage}</div>}
    </div>
));
  
jest.mock("./CustomCardRight", () => () => <div>CustomCardRight</div>);
jest.mock("./SuccessVehSeqNo", () => () => <div>SuccessVehSeqNo</div>);
jest.mock("components/AlertBox", () => ({
  AlertBox: ({ title, description }: any) => (
    <div>{title} - {description}</div>
  ),
}));
jest.mock("components/BlueFormFooter", () => ({
  BlueFormFooter: ({ backBtnClickHandler }: any) => (
    <button onClick={backBtnClickHandler}>Back</button>
  ),
}));

describe("ChangeFromCustomCardToVehSeqNo", () => {
  const policyDetails = {
    nationalID: "123456789",
    policyNo: "POLICY123",
  };
  const vehicleDetails = [
    {
      vehicleCustomID: "CUST123",
      chassisNo: "CHASSIS456",
      repairCondition: "Normal",
      registrationPlateNo: "REG123",
      registrationPlateText1: "TX1",
      registrationPlateText2: "TX2",
      registrationPlateText3: "TX3",
      vehicleMakeTextEn: "Toyota",
      vehicleModelTextEn: "Camry",
    },
  ];
  const languageData = {
    vehicle_seqcunce_invalid: "Invalid sequence",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({
      state: { policyData: { policyDetails, vehicleDetails }, languageData },
    });
  });

  it("renders initial component with left and right cards", () => {
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
      errors: null,
    });

    render(<ChangeFromCustomCardToVehSeqNo />);
    expect(screen.getByText("CustomCardLeft")).toBeInTheDocument();
    expect(screen.getByText("CustomCardRight")).toBeInTheDocument();
  });

  it("renders SuccessVehSeqNo after successful API call", async () => {
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: { someData: true },
      errors: null,
    });

    render(<ChangeFromCustomCardToVehSeqNo />);

    await waitFor(() => {
      expect(screen.getByText("SuccessVehSeqNo")).toBeInTheDocument();
    });
  });

  it("shows alert modal on API error", async () => {
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
      errors: { name: "Error", messages: { message_en: "Error occurred" } },
    });

    render(<ChangeFromCustomCardToVehSeqNo />);

    await waitFor(() => {
      expect(screen.getByText("Error - Error occurred")).toBeInTheDocument();
    });
  });

  it("goBack navigates back on back button click", () => {
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
      errors: null,
    });

    render(<ChangeFromCustomCardToVehSeqNo />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("calls makeApiCall on fullDataHandler with valid customID", async () => {
    const makeApiCallMock = jest.fn(() => Promise.resolve());
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: makeApiCallMock,
      data: null,
      errors: null,
    });

    render(<ChangeFromCustomCardToVehSeqNo />);

    const input = screen.getByTestId("validate-seq-input");
    const submitBtn = screen.getByTestId("full-data-handler-btn");

    fireEvent.change(input, { target: { value: "12345678" } });

    makeApiCallMock.mockClear();

    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(makeApiCallMock).toHaveBeenCalledTimes(1);
      expect(makeApiCallMock).toHaveBeenCalledWith(
        expect.objectContaining({
          customId: "CUST123",
          sequenceNo: "12345678",
          ownerId: policyDetails.nationalID,
          policyNo: policyDetails.policyNo,
          chassisNumber: vehicleDetails[0].chassisNo,
        })
      );
    });
  });

  it("does not call makeApiCall on fullDataHandler with null or undefined customID", () => {
    const makeApiCallMock = jest.fn();
    (sharedModule.useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: makeApiCallMock,
      data: null,
      errors: null,
    });

    mockUseLocation.mockReturnValue({
      state: {
        policyData: {
          policyDetails,
          vehicleDetails: [{ ...vehicleDetails[0], vehicleCustomID: null }],
        },
        languageData,
      },
    });

    render(<ChangeFromCustomCardToVehSeqNo />);

    const submitBtn = screen.getByTestId("full-data-handler-btn");
    makeApiCallMock.mockClear();
    fireEvent.click(submitBtn);

    expect(makeApiCallMock).not.toHaveBeenCalled();
  });
});
