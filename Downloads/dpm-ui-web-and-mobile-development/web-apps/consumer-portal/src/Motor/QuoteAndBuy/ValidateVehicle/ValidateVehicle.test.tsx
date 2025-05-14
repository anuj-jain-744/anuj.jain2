import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // for useLocation
import ValidateVehicle from "./ValidateVehicle"; // Path to your component
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

// Mocking the context and API hooks
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  isValidInputRegex: (
    inputValue: string | number,
    minDigit: number,
    maxDigit?: number
  ): boolean => {
    const value = String(inputValue);

    // Create a regular expression to check if the value is a number with the specified length
    // If maxDigit is not provided, it defaults to minDigit, meaning the value should have exactly minDigit digits
    const regex = new RegExp(`^\\d{${minDigit},${maxDigit ?? minDigit}}$`);

    // Return true if the input matches the regex pattern, otherwise false
    return regex.test(value);
  },
  iqmaIdNationalIdValidationOnBlur: (input: string) => {
    let flag = false;
    // Validate input: up to 10 digits and starts with 1, 2, or 7
    if (
      !(input === "" || (input.length === 10 && /^[127]\d{0,9}$/.test(input)))
    ) {
      flag = true;
    }
    return flag;
  },
  sanitizeHtml: jest.fn(),
}));

describe("ValidateVehicle Component", () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetails: {},
      setVehicleDetails: jest.fn(),
      setVehicleDetailsResponseData: jest.fn(),
      setMakeModelResponse: jest.fn(),
      ownerDetailsResponseData: {},
      setOwnerDetailsResponseData: jest.fn(),
      setDriverDetailsResponseData: jest.fn(),
    });

    useApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: {},
      isLoading: false,
      errors: null,
    });
  });

  it("should render correctly", () => {
    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{ vehicle_details: "Vehicle Details" }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("infooutline-testid"));
    expect(screen.getByText("Vehicle Details")).toBeInTheDocument();
  });

  it("should toggle between new insurance and transfer ownership", async () => {
    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{
                  buy_new_insurance_button: "New Insurance",
                  transfer_ownership_button: "Transfer Ownership",
                }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const insuranceToggle = screen.getByTestId("insurance-toggle");
    const transferToggle = screen.getByTestId("ownership-toggle");
    expect(insuranceToggle).toBeInTheDocument();
    expect(transferToggle).toBeInTheDocument();

    fireEvent.click(insuranceToggle);
    waitFor(() => {
      expect(insuranceToggle).toHaveClass("selected");
      expect(transferToggle).not.toHaveClass("selected");
      expect(transferToggle).toHaveClass("selected");
      expect(insuranceToggle).not.toHaveClass("selected");
    });
  });

  it("should select a radio button for Vehicle Sequence", () => {
    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{
                  vehicle_sequence: "Vehicle Sequence",
                  custom_card_no: "Custom Card No",
                }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const sequenceRadio = screen.getByLabelText("Vehicle Sequence");
    const customCardRadio = screen.getByLabelText("Custom Card No");

    fireEvent.click(sequenceRadio);
    expect(sequenceRadio).toBeChecked();
    expect(customCardRadio).not.toBeChecked();
    const sequenceInput = screen.getByTestId("vehical-sequence");
    fireEvent.blur(sequenceInput);
    fireEvent.keyPress(sequenceInput, {
      key: "6",
      code: "Digit6",
      charCode: 54,
    });
    fireEvent.change(sequenceInput, { target: { value: "1234567890" } });
    expect(
      screen.queryByText("vehicle sequence invalid message")
    ).not.toBeInTheDocument();

    fireEvent.click(customCardRadio);
    expect(customCardRadio).toBeChecked();
    expect(sequenceRadio).not.toBeChecked();
  });
  it("should select a radio button for customeCard", () => {
    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{
                  vehicle_sequence: "Vehicle Sequence",
                  custom_card_no: "Custom Card No",
                  manufacturing_year: "2024",
                }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const sequenceRadio = screen.getByLabelText("Vehicle Sequence");
    const customCardRadio = screen.getByLabelText("Custom Card No");

    fireEvent.click(customCardRadio);
    expect(customCardRadio).toBeChecked();
    expect(sequenceRadio).not.toBeChecked();
    const customCardInput = screen.getByTestId("custom-card-input");
    fireEvent.change(customCardInput, { target: { value: "6543211234" } });
    fireEvent.blur(customCardInput);
    expect(
      screen.queryByText("custom card number invalid message")
    ).not.toBeInTheDocument();
    const modelYearInput = screen.getByTestId("manufature-year");
    fireEvent.change(modelYearInput, { target: { value: "2025" } });
    fireEvent.blur(modelYearInput);
    expect(
      screen.queryByText("model year invalid message")
    ).not.toBeInTheDocument();
    const insuranceToggle = screen.getByTestId("insurance-toggle");
    const transferToggle = screen.getByTestId("ownership-toggle");
    expect(insuranceToggle).toBeInTheDocument();
    expect(transferToggle).toBeInTheDocument();
    insuranceToggle.click()
    waitFor(()=>{
      const ownerInput = screen.getByTestId("owner-id");
      fireEvent.change(ownerInput, { target: { value: "2" } });
      expect(
        screen.queryByText("owner id invalid message")
      ).not.toBeInTheDocument();
    })
    
   
  });

  it("should disable the submit button if inputs are invalid", async () => {
    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{
                  retrieve_vehicle_details: "Retrieve Vehicle Details",
                  enter_vehicle_sequence_no: "Enter Vehicle Sequence",
                  custom_card_no: "Custom Card No",
                  enter_custom_card_no: "Enter Custom Card No",
                  manufacturing_year: "Manufacturing Year",
                  vehicle_seqcunce_invalid: "vehicle invalid",
                  custom_card_no_is_invalid: " custom card no is invalid",
                  manufacture_year_invalid: "manufacture year invalid",
                }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Retrieve Vehicle Details");

    // Initially disabled (due to invalid inputs)
    expect(submitButton).toBeDisabled();

    const sequenceInput = screen.getByPlaceholderText("Enter Vehicle Sequence");
    fireEvent.change(sequenceInput, { target: { value: "0" } });
    fireEvent.blur(sequenceInput);
    expect(screen.getByText("vehicle invalid")).toBeInTheDocument();

    expect(submitButton).toBeDisabled();

    const customCardRadio = screen.getByLabelText("Custom Card No");
    fireEvent.click(customCardRadio);
    expect(customCardRadio).toBeChecked();
    const customCardInput = screen.getByPlaceholderText("Enter Custom Card No");
    fireEvent.change(customCardInput, { target: { value: "0" } });
    fireEvent.blur(customCardInput);

    expect(screen.getByText("custom card no is invalid")).toBeInTheDocument();
    const modelYearInput = screen.getByPlaceholderText("Manufacturing Year");

    fireEvent.change(modelYearInput, { target: { value: "1800" } });
    fireEvent.blur(modelYearInput);
    expect(screen.getByText("manufacture year invalid")).toBeInTheDocument();

    // expect(submitButton).not.toBeDisabled();
  });

  it("should call the API on submit", async () => {
    const makeApiCallMock = jest.fn();

    useApiCall.mockReturnValue({
      makeApiCall: makeApiCallMock,
      data: {},
      isLoading: false,
      errors: null,
    });

    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{
                  retrieve_vehicle_details: "Retrieve Vehicle Details",
                  enter_vehicle_sequence_no: "Enter Vehicle Sequence",
                }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const sequenceInput = screen.getByPlaceholderText("Enter Vehicle Sequence");
    const submitButton = screen.getByText("Retrieve Vehicle Details");

    fireEvent.change(sequenceInput, { target: { value: "12345678910" } });
    fireEvent.blur(sequenceInput);

    fireEvent.click(submitButton);

    waitFor(() => {
      expect(makeApiCallMock).toHaveBeenCalled();
    });
  });

  it("should show an error message if the API call fails", async () => {
    useApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      data: null,
      isLoading: false,
      errors: {
        name: "Internal Server Error",
        messages: { message_en: "Something went wrong!" },
      },
    });

    render(
      <MemoryRouter initialEntries={["/validate-vehicle"]}>
        <Routes>
          <Route
            path="/validate-vehicle"
            element={
              <ValidateVehicle
                data={{ retrieve_vehicle_details: "Retrieve Vehicle Details" }}
                setLeftStep={jest.fn()}
              />
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Retrieve Vehicle Details");
    fireEvent.click(submitButton);

    waitFor(() => {
      expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
    });
  });
});
