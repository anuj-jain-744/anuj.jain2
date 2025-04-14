import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ValidateTravel from "./index";
import { useQuoteAndBuyContext } from "../../hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

// Mock hooks
jest.mock("../../hooks/useQuoteAndBuyContext");
jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn((html) => html),
  useApiCall: jest.fn(),
}));

describe("ValidateTravel Component", () => {
  const mockSetLeftStep = jest.fn();
  const mockSetSelectedPeriod = jest.fn();
  const mockSetTravelStartDate = jest.fn();
  const mockSetIsToggleOn = jest.fn();
  const mockSetTotalCount = jest.fn();
  const mockSetTravellerType = jest.fn();
  const mockSetAdultCount = jest.fn();
  const mockSetChildCount = jest.fn();
  const mockSetSrCitizenCount = jest.fn();

  const mockContext = {
    selectedPeriod: "",
    setSelectedPeriod: mockSetSelectedPeriod,
    travelStartDate: null,
    setTravelStartDate: mockSetTravelStartDate,
    isToggleOn: false,
    setIsToggleOn: mockSetIsToggleOn,
    totalCount: 0,
    setTotalCount: mockSetTotalCount,
    setTravellerType: mockSetTravellerType,
    adultCount: 0,
    setAdultCount: mockSetAdultCount,
    childCount: 0,
    setChildCount: mockSetChildCount,
    srCitizenCount: 0,
    setSrCitizenCount: mockSetSrCitizenCount,
  };

  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue(mockContext);
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: { model: { content: [{ codeDesc: "7 Days" }, { codeDesc: "14 Days" }] } },
    });
  });

  it("renders the component correctly", () => {
    render(<ValidateTravel travelData={{}} setLeftStep={mockSetLeftStep} />);
    expect(screen.getByTestId("vehicalHead")).toBeInTheDocument();
  });

  it("displays the correct welcome text", () => {
    const travelData = {
      welcome_text: "Welcome, <<NAME>>!",
    };
    render(<ValidateTravel travelData={travelData} setLeftStep={mockSetLeftStep} />);
    expect(screen.getByText("Welcome, Javid!")).toBeInTheDocument();
  });

  it("toggles between self and family", () => {
    const travelData = {
      self: "Self",
      family: "Family",
    };
    render(<ValidateTravel travelData={travelData} setLeftStep={mockSetLeftStep} />);

    const selfToggle = screen.getByTestId("self-toggle");
    const familyToggle = screen.getByTestId("family-toggle");

    fireEvent.click(familyToggle);
    expect(mockSetIsToggleOn).toHaveBeenCalledWith(expect.any(Function));
    act(() => {
      mockSetIsToggleOn.mock.calls[0][0](false);
    });

    fireEvent.click(selfToggle);
    expect(mockSetIsToggleOn).toHaveBeenCalledWith(expect.any(Function));
    act(() => {
      mockSetIsToggleOn.mock.calls[1][0](true);
    });
  });

  it("calls setSelectedPeriod on period selection", () => {
    const travelData = {
      travel_period: "Travel Period",
    };
    render(<ValidateTravel travelData={travelData} setLeftStep={mockSetLeftStep} />);
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "Select Days" } });
    expect(mockSetSelectedPeriod).toHaveBeenCalledWith("Select Days");
  });

  it("displays error message when API call fails", async () => {
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { name: "Error", messages: { message_en: "Something went wrong!" } },
      data: null,
    });

    render(<ValidateTravel travelData={{}} setLeftStep={mockSetLeftStep} />);

    await waitFor(() => expect(screen.getByText("Error")).toBeInTheDocument());
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("updates total count when counter values change", () => {
    const travelData = {
      children: "Children",
      adult: "Adult",
      senior_citizen: "Senior Citizen",
    };
    render(<ValidateTravel travelData={travelData} setLeftStep={mockSetLeftStep} />);

    const childCounter = screen.getByTestId("child-counter");
    fireEvent.click(childCounter);
    expect(mockSetChildCount).toHaveBeenCalledWith(1);
    expect(mockSetTotalCount).toHaveBeenCalledWith(1);

    const adultCounter = screen.getByTestId("adult-counter");
    fireEvent.click(adultCounter);
    expect(mockSetAdultCount).toHaveBeenCalledWith(1);
    expect(mockSetTotalCount).toHaveBeenCalledWith(2);
  });

  it("displays the modal on info icon click", () => {
    const travelData = {
      traveller_popup_title: "Popup Title",
      traveller_popup_content: "Popup Content",
    };
    render(<ValidateTravel travelData={travelData} setLeftStep={mockSetLeftStep} />);

    const infoIcon = screen.getByRole("button", { name: /info/i });
    fireEvent.click(infoIcon);

    expect(screen.getByText("Popup Title")).toBeInTheDocument();
    expect(screen.getByText("Popup Content")).toBeInTheDocument();
  });
});
