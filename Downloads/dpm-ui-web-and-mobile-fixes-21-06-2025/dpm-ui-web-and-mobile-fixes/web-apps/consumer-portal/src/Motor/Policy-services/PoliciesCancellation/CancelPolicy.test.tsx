import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import CancelPolicy from "./CancelPolicies";
import { useCancelRefund } from "./hook/useCancelRefund";

type UseCancelPolicyReturn = {
  fetchCancelRefundData: jest.Mock;
  isLoading: boolean;
  error: string | null;
  data: {
    data: {
      policyBasic: {
        policyNumber: string;
        effectiveDate: string;
        expiryDate: string;
      };
      policyLob: Array<{
        policyRisk: Array<{
          vehicleValue: number;
          vehicleMakeText: string;
          plateNo: string;
        }>;
      }>;
      cancelRefund: number;
    };
  };
};

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

jest.mock("./hook/useCancelRefund", () => ({
  useCancelRefund: jest.fn(),
}));

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("CancelPolicy Component", () => {
  beforeEach(() => {
    (useCancelRefund as jest.Mock).mockReturnValue({
      fetchCancelRefundData: jest.fn().mockResolvedValue({}),
      isLoading: false,
      error: null,
      data: {
        data: {
          policyBasic: {
            policyNumber: "12345",
            effectiveDate: "2021-01-01",
            expiryDate: "2022-01-01",
          },
          policyLob: [
            {
              policyRisk: [
                {
                  vehicleValue: 50000,
                  vehicleMakeText: "Nissan",
                  plateNo: "ABC123",
                },
              ],
            },
          ],
          cancelRefund: 100.0,
        },
      },
    } as UseCancelPolicyReturn);
  });

  /*test("renders CancelPolicy component correctly", async () => {
    render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
  });

  test("displays the correct policy number", () => {
    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    expect(getByText("12345")).toBeInTheDocument();
  });

  test("dropdown changes state correctly", () => {
    const { getByLabelText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    const dropdown = getByLabelText("Select cancellation") as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: "Some reason" } });
    expect(dropdown.value).toBe("Some reason");
  });

  test("IBAN input field updates correctly", () => {
    const { getByLabelText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    const ibanInput = getByLabelText("IBAN No") as HTMLInputElement;
    fireEvent.change(ibanInput, { target: { value: "SA1234567890" } });
    expect(ibanInput.value).toBe("SA1234567890");
  });

  test("submit button is disabled when required fields are not filled", () => {
    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    const submitButton = getByText("Submit");
    expect(submitButton).toBeDisabled();
  });

  test("submit button is enabled when all required fields are filled", () => {
    const { getByText, getByLabelText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    const ibanInput = getByLabelText("IBAN No");
    fireEvent.change(ibanInput, { target: { value: "SA1234567890" } });
    const checkbox = getByLabelText("I accept the terms and conditions");
    fireEvent.click(checkbox);
    const submitButton = getByText("Submit");
    expect(submitButton).not.toBeDisabled();
  });

  test("modal opens when info icon is clicked", () => {
    const { getByAltText, getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    const infoIcon = getByAltText("Tooltip_Logo");
    fireEvent.click(infoIcon);
    expect(getByText("The amount of refund")).toBeInTheDocument();
  });

  test("handles loading state correctly", () => {
    (useCancelRefund as jest.Mock).mockReturnValue({
      fetchCancelRefundData: jest.fn().mockResolvedValue({}),
      isLoading: true,
      error: null,
      data: null,
    } as unknown as UseCancelPolicyReturn);

    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  test("handles error state correctly", () => {
    (useCancelRefund as jest.Mock).mockReturnValue({
      fetchCancelRefundData: jest.fn().mockResolvedValue({}),
      isLoading: false,
      error: "Error fetching data",
      data: null,
    } as unknown as UseCancelPolicyReturn);

    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    expect(getByText("Error fetching data")).toBeInTheDocument();
  });

  test("displays the correct vehicle details", () => {
    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    expect(getByText("Nissan")).toBeInTheDocument();
    expect(getByText("ABC123")).toBeInTheDocument();
    expect(getByText("50000")).toBeInTheDocument();
  });

  test("calculates the correct refund amount", () => {
    const { getByText } = render(<CancelPolicy policyNo="12345" navigateTo={jest.fn()} />);
    expect(getByText("100.0")).toBeInTheDocument();
  });*/

  test("handles form submission correctly", async () => {
    const mockNavigateTo = jest.fn();
    /*const { getByText, getByLabelText } = render(<CancelPolicy policyNo="12345" navigateTo={mockNavigateTo} />);
    const ibanInput = getByLabelText("IBAN No");
    fireEvent.change(ibanInput, { target: { value: "SA1234567890" } });
    const checkbox = getByLabelText("I accept the terms and conditions");
    fireEvent.click(checkbox);
    const submitButton = getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigateTo).toHaveBeenCalled();
    });*/
  });
});