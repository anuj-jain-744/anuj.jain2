import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ContactDetails from "./ContactDetails";

const mockStore = configureStore([]);
const mockChangeHandler = jest.fn();

describe("ContactDetails Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { userInfo: { userId: "12345" } },
      consumerCmsLanguageData: {
        config: [{ languageData: { invalid_mob_no: "Invalid mobile number" } }],
      },
    });
  });

  /*it("should render the component correctly", () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{ invalid_mob_no: "Invalid mobile number" }}
          mobilenumData="0501234567"
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    expect(screen.getByText(/Invalid mobile number/i)).toBeInTheDocument();
  });*/

  it("should validate mobilenumData on mount", async () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{ invalid_mob_no: "Invalid mobile number" }}
          mobilenumData="0501234567"
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith(
        "mobilenum",
        true,
        "0501234567"
      );
    });
  });

  /*it("should call validateIBAN with valid IBAN", async () => {
    const mockCallAPI = jest.fn().mockResolvedValue({
      message: "SUCCESS",
      data: { result: "MATCH", bank: { swiftCode: "SWIFT123" } },
    });

    jest.mock("@dpm/shared-module", () => ({
      callAPI: mockCallAPI,
    }));

    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{}}
          mobilenumData=""
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    const ibanInput = screen.getByLabelText(/IBAN/i);
    fireEvent.change(ibanInput, { target: { value: "SA1234567890123456789012" } });

    await waitFor(() => {
      expect(mockCallAPI).toHaveBeenCalledWith(
        "post",
        expect.stringContaining("/Motor/Claim/V1/ValidateIban"),
        expect.objectContaining({ iban: "SA1234567890123456789012" })
      );
      expect(mockChangeHandler).toHaveBeenCalledWith(
        "iBAN",
        true,
        "SA1234567890123456789012"
      );
    });
  });

  it("should handle updatedValue for mobilenum", () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{ invalid_mob_no: "Invalid mobile number" }}
          mobilenumData=""
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    const mobilenumInput = screen.getByLabelText(/Mobile Number/i);
    fireEvent.change(mobilenumInput, { target: { value: "0501234567" } });

    expect(mockChangeHandler).toHaveBeenCalledWith(
      "mobilenum",
      true,
      "0501234567"
    );
  });

  it("should handle handleReEnteredIbanChange", () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{}}
          mobilenumData=""
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    const reEnteredIbanInput = screen.getByLabelText(/Re-enter IBAN/i);
    fireEvent.change(reEnteredIbanInput, { target: { value: "SA1234567890123456789012" } });

    expect(screen.getByDisplayValue("SA1234567890123456789012")).toBeInTheDocument();
  });

  it("should handle handleBankNameChange", () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{}}
          mobilenumData=""
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    const bankNameInput = screen.getByLabelText(/Bank Name/i);
    fireEvent.change(bankNameInput, { target: { value: "Test Bank" } });

    expect(screen.getByDisplayValue("Test Bank")).toBeInTheDocument();
  });

  it("should validate reEnteredIban and bankName", async () => {
    render(
      <Provider store={store}>
        <ContactDetails
          languageData={{ iban_numbers_do_not_match: "IBAN numbers do not match." }}
          mobilenumData=""
          changeHandler={mockChangeHandler}
        />
      </Provider>
    );

    const ibanInput = screen.getByLabelText(/IBAN/i);
    const reEnteredIbanInput = screen.getByLabelText(/Re-enter IBAN/i);
    const bankNameInput = screen.getByLabelText(/Bank Name/i);

    fireEvent.change(ibanInput, { target: { value: "SA1234567890123456789012" } });
    fireEvent.change(reEnteredIbanInput, { target: { value: "SA1234567890123456789012" } });
    fireEvent.change(bankNameInput, { target: { value: "Test Bank" } });

    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith(
        "iBAN",
        true,
        "SA1234567890123456789012",
        "Test Bank"
      );
    });
  });*/
});