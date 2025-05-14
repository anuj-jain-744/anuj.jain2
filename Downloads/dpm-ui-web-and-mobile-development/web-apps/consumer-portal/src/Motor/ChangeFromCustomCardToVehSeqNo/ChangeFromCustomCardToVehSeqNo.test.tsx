import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChangeFromCustomCardToVehSeqNo from ".";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

describe("ChangeFromCustomCardToVehSeqNo", () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });
  it("1. load component", () => {
    render(<ChangeFromCustomCardToVehSeqNo />);

    expect(
      screen.getByTestId("changefromcustomcardtovehseq-test")
    ).toBeInTheDocument();
  });
  it("2. fetches and displays language data on load", async () => {
    // Mock the API response for language data
    const mockLanguageData = {
      config: [{ language: "en", someOtherData: "example" }],
    };
    (callAPI as jest.Mock).mockResolvedValueOnce(mockLanguageData);

    render(<ChangeFromCustomCardToVehSeqNo />);

    // Wait for API to be called and check if data is rendered
    await waitFor(() => expect(callAPI).toHaveBeenCalledTimes(1));
  });
  it("3. Enter the values for handle changes", async () => {
    window.scrollTo = jest.fn();
    const mockLanguageData = {
      config: [{ language: "en", someOtherData: "example" }],
    };
    (callAPI as jest.Mock).mockResolvedValueOnce(mockLanguageData);

    // Mock the API response for submission success
    const mockSuccessResponse = {
      message: "SUCCESS",
      data: [{ someData: "example" }],
    };
    (callAPI as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

    // Mock the second API for custom card to vehicle sequence
    const mockSubmitResponse = {
      message: "SUCCESS",
      data: { result: "MATCH" },
    };
    (callAPI as jest.Mock).mockResolvedValueOnce(mockSubmitResponse);

    await render(<ChangeFromCustomCardToVehSeqNo />);

    const inputElement = screen.getByTestId("vehicleSeqNo-id")
    expect(inputElement).toBeInTheDocument();



    await act(async () => {
      // Type a value in the input
      fireEvent.change(inputElement, {
        target: { value: "1234" }
      })
      expect(screen.getByTestId('validateSeqNoCard-dataHandler')).toBeInTheDocument();
      // Simulate the submit action
      fireEvent.click(screen.getByTestId('validateSeqNoCard-dataHandler'));
     

    });
  });
});
