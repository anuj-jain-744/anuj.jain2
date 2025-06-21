import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileEditBankDialog from "./ProfileEditBankDialog";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mock IBAN input component

jest.mock('components/IbanInputField', () => ({
    __esModule: true,
    default: jest.fn(({ getBankDetails, checkDisabled,userId }) => {
          const React = require("react");
  React.useEffect(() => {
    getBankDetails({ bankName: "Mock Bank" }, "SA0380000000608010167519");
    checkDisabled(false);
  }, []);
        return (<div><div data-testid="iban-input" userId={userId} getBankDetails={getBankDetails} checkDisabled={checkDisabled} >IbanField</div></div>)
    }),
  }));

// Mock validateIBAN
jest.mock("@dpm/shared-module", () => ({
  ...jest.requireActual("@dpm/shared-module"),
  validateIBAN: (iban: string) => iban.startsWith("SA"),
}));

const mockStore = configureStore([]);
const mockSetShowDialog = jest.fn();
const mockUpdateBankDetails = jest.fn();

const initialState = {
  dashbaordLanguageData: {
    languageData: {
      update_bank_details: "Update Bank Details",
      existing_iban_no: "Existing IBAN No",
      existing_bank_name: "Existing Bank Name",
      cancel: "Cancel",
      update: "Update",
      dashboard: {
        bank_name: "Bank Name"
      }
    },
  },
  auth: {
    userInfo: {
      userId: "user123",
      ibanNo: "SA031000000123456789",
      bankName: "Old Bank"
    },
  },
};

describe("ProfileEditBankDialog", () => {
  it("renders the modal with existing bank details", () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <ProfileEditBankDialog
          showDialog={true}
          setShowDialog={mockSetShowDialog}
          updateBankDetails={mockUpdateBankDetails}
        />
      </Provider>
    );

    expect(screen.getByText("Update Bank Details")).toBeInTheDocument();
    expect(screen.getByText("Existing IBAN No")).toBeInTheDocument();
    expect(screen.getByText("SA031000000123456789")).toBeInTheDocument();
    expect(screen.getByText("Old Bank")).toBeInTheDocument();
    expect(screen.getByTestId("iban-input")).toBeInTheDocument();
  });

  it("enables update button and calls updateBankDetails on click", () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <ProfileEditBankDialog
          showDialog={true}
          setShowDialog={mockSetShowDialog}
          updateBankDetails={mockUpdateBankDetails}
        />
      </Provider>
    );

    const updateButton = screen.getByText("Update");
    expect(updateButton).toBeEnabled();

    fireEvent.click(updateButton);

    expect(mockUpdateBankDetails).toHaveBeenCalledWith({
      nationalID: "user123",
      primaryAccount: {
        bankName: "Mock Bank",
        ibanNo: "SA0380000000608010167519"
      }
    });

    expect(mockSetShowDialog).toHaveBeenCalledWith(false);
  });

  it("calls setShowDialog(false) when cancel is clicked", () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <ProfileEditBankDialog
          showDialog={true}
          setShowDialog={mockSetShowDialog}
          updateBankDetails={mockUpdateBankDetails}
        />
      </Provider>
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockSetShowDialog).toHaveBeenCalledWith(false);
  });
});
