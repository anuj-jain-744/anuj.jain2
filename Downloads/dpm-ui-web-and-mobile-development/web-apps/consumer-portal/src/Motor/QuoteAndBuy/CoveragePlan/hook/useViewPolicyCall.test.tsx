import { renderHook, act } from "@testing-library/react-hooks";
import useViewPolicyCall from "./useViewPolicyCall";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";

jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("@dpm/shared-module");
jest.mock("hook/motor/useCalculatePremiumApi");
jest.mock("Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload");

describe("useViewPolicyCall", () => {
  let mockContext: any;
  let mockApiCall: any;
  let mockCalculatePremiumApi: any;
  let mockCalculatePremiumPayload: any;

  const setupMocks = () => {
    mockContext = {
      isRenewPolicyData: { policyNumber: "POL123", loggedInRenew: true },
      vehicleDetails: {},
      setCountryData: jest.fn(),
      setViewPolicyData: jest.fn(),
      setVehicleDetailsResponseData: jest.fn(),
      setDriverDetailsResponseData: jest.fn(),
      setOwnerDetailsResponseData: jest.fn(),
      setVehicleDetails: jest.fn(),
      setRepairTypeSelected: jest.fn(),
      setCoverageType: jest.fn(),
      setApiErrorMessage: jest.fn(),
      setShowAlertModal: jest.fn(),
      driverDetailsResponseData: [{ driverId: "D123" }],
      vehicleDetailsResponseData: [{ vehicleId: "V123" }],
    };

    mockApiCall = {
      makeApiCall: jest.fn(),
      data: null,
      isLoading: false,
      errors: null,
    };

    mockCalculatePremiumApi = {
      handleCalculatePremium: jest.fn(),
      isCalculateData: false,
    };

    mockCalculatePremiumPayload = jest.fn(() => ({
      payload: "mockPayload",
    }));

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockContext);
    (useApiCall as jest.Mock).mockReturnValue(mockApiCall);
    (useCalculatePremiumApi as jest.Mock).mockReturnValue(mockCalculatePremiumApi);
    (useCalculatePremiumPayload as jest.Mock).mockReturnValue(mockCalculatePremiumPayload);
  };

  const renderUseViewPolicyCall = () =>
    renderHook(() =>
      useViewPolicyCall({
        setShowAlertModal: jest.fn(),
        setApiErrorMessage: jest.fn(),
      })
    );

  beforeEach(setupMocks);



it("should not call policyApiCall when selectedPolicyNumber is not provided", async () => {
  const { result } = renderUseViewPolicyCall();

  await act(async () => {
    result.current.viewPolicyCall({ policyLob: [] });
  });

  expect(mockApiCall.makeApiCall).not.toHaveBeenCalled();
});


it("should not call setCountryData when countryCodes is not updated", () => {
  const { result } = renderUseViewPolicyCall();

  act(() => {
    mockApiCall.data = null;
  });

  expect(mockContext.setCountryData).not.toHaveBeenCalled();
});

it("should not call setViewPolicyData when policyData is not updated", () => {
  const { result } = renderUseViewPolicyCall();

  act(() => {
    mockApiCall.data = null;
  });

  expect(mockContext.setViewPolicyData).not.toHaveBeenCalled();
});

it("should handle missing vehicleSequenceNo in response", () => {
  const { result } = renderUseViewPolicyCall();

  act(() => {
    mockApiCall.data = {};
  });

  expect(mockContext.setVehicleDetails).not.toHaveBeenCalled();
  expect(mockContext.setVehicleDetailsResponseData).not.toHaveBeenCalled();
});

it("should handle missing driver details in viewPolicyCall", async () => {
  const { result } = renderUseViewPolicyCall();

  await act(async () => {
    result.current.viewPolicyCall({
      policyLob: [
        {
          policyRisk: [{}],
        },
      ],
    });
  });

  expect(mockContext.setDriverDetailsResponseData).not.toHaveBeenCalled();
  expect(mockContext.setOwnerDetailsResponseData).not.toHaveBeenCalled();
});


it("should handle response and vehicleSequenceNo being truthy", async () => {
  const mockSetVehicleDetails = jest.fn();
  const mockSetVehicleDetailsResponseData = jest.fn();

  (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
    setVehicleDetails: mockSetVehicleDetails,
    setVehicleDetailsResponseData: mockSetVehicleDetailsResponseData,
    vehicleDetails: {},
    vehicleDetailsResponseData: {},
  });

  const { result } = renderHook(() =>
    useViewPolicyCall({
      setShowAlertModal: jest.fn(),
      setApiErrorMessage: jest.fn(),
    })
  );

  act(() => {
    result.current.viewPolicyCall({
      policyLob: [
        {
          policyRisk: [
            {
              vehicleSequenceNo: "123",
            },
          ],
        },
      ],
    });
  });

  expect(mockSetVehicleDetails).toHaveBeenCalled();
  expect(mockSetVehicleDetailsResponseData).toHaveBeenCalled();
});

});
