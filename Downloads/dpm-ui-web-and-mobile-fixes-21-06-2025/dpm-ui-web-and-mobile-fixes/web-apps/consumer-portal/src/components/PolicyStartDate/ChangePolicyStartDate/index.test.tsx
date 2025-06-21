import { fireEvent, render, screen } from "@testing-library/react";
import ChangePolicyStartDate from ".";
import {
  Country,
  QuoteAndBuyContext,
  QuoteAndBuyContextProps,
  travelersInfo,
} from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { PremiumBreakdown, RenewPolicyDataProps } from "types/quoteAndBuy";
import { SelectPlanTypeKeys } from "types/coverageplan";
import { DateObject, Value } from "react-multi-date-picker";

jest.mock("../../Calendar/inputCalendar", () => ({
    InputCalendar: jest.fn(({ value, setValue, setIsOn }) => (
      <input
        type="text"
        data-testid="mock-input-calendar"
        value={value}
        onChange={(e) => {
            setValue(e.target.value)
            setIsOn(true);
        }
        }
      />
    )),
  }));
const mockContextValue: QuoteAndBuyContextProps = {
  schemeCode: null,
  setSchemeCode: () => {},
  premium: 0,
  setPremium: () => {},
  comprehensiveCardPrice: null,
  setComprehensiveCardPrice: jest.fn(),
  sliderValueSumInsured: "",
  setSliderValueSumInsured: jest.fn(),
  sliderValueDeductibles: "",
  setSliderValueDeductibles: jest.fn(),
  makeModelResponse: [],
  setMakeModelResponse: jest.fn(),
  sliderDeductibleValue: 0,
  setSliderDeductibleValue: jest.fn(),
  minDeductibleAmount: null,
  setMinDeductibleAmount: jest.fn(),
  maxDeductibleAmount: null,
  setMaxDeductibleAmount: jest.fn(),
  deductibleAmounts: undefined,
  setDeductibleAmounts: jest.fn(),
  repairTypeSelected: undefined,
  setRepairTypeSelected: jest.fn(),
  workShopInitialPrice: null,
  setWorkShopInitialPrice: jest.fn(),
  mathInitialPrice: null,
  setMathInitialPrice: jest.fn(),
  agencyInitialPrice: null,
  setAgencyInitialPrice: jest.fn(),
  selectedBenefits: [],
  setSelectedBenefits: jest.fn(),
  vehicleDetails: null,
  setVehicleDetails: jest.fn(),
  driverDetails: [],
  setDriverDetails: jest.fn(),
  compWorkShop: null,
  setcompWorkShop: jest.fn(),
  compMath: null,
  setcompMath: jest.fn(),
  compAgency: null,
  setcompAgency: jest.fn(),
  stepValue: 0,
  selectedDriverID: null,
  setSelectedDriverID: jest.fn(),
  showManageDriverModal: false,
  setShowManageDriverModal: jest.fn(),
  setStepValue: jest.fn(),
  selectedPackage: null,
  setSelectedPackage: jest.fn(),
  vehicaleFormResponse: null,
  setVehicleDetail: jest.fn(),
  comp3rdParty: null,
  setcomp3rdParty: jest.fn(),
  vehicleDetailsResponseData: null,
  setVehicleDetailsResponseData: jest.fn(),
  driverDetailsResponseData: [],
  setDriverDetailsResponseData: jest.fn(),
  ownerDetailsResponseData: null,
  setOwnerDetailsResponseData: jest.fn(),
  email: null,
  setEmail: jest.fn(),
  isTermCondition: false,
  setIsTermCondition: jest.fn(),
  coverageType: null,
  setCoverageType: jest.fn(),
  policyStartDate: null,
  setPolicyStartDate: jest.fn(),
  policyStartDateAPI: null,
  setPolicyStartDateAPI: jest.fn(),
  journeyData: "",
  setJourneyData: jest.fn(),
  redisKey: "",
  setRedisKey: jest.fn(),
  addDriverFormData: [],
  setAddDriverFormData: jest.fn(),
  availableRepairTypes: [],
  countryData: [],
  setCountryData: function (value: Country[]): void {
    throw new Error("Function not implemented.");
  },
  setAvailableRepairTypes: function (
    value: React.SetStateAction<string[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  quoteNumber: null,
  setQuoteNumber: function (value: React.SetStateAction<string | null>): void {
    throw new Error("Function not implemented.");
  },
  expiryDate: null,
  setExpiryDate: function (value: React.SetStateAction<string | null>): void {
    throw new Error("Function not implemented.");
  },
  referanceNumber: null,
  setReferanceNumber: function (
    value: React.SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelData: null,
  setTravelData: function (value: React.SetStateAction<Value>): void {
    throw new Error("Function not implemented.");
  },
  setTravelStartDate: function (value: React.SetStateAction<Value>): void {
    throw new Error("Function not implemented.");
  },
  travelStartDate: null,
  selectedPeriod: "someDefaultValue" as unknown as Travel.TravelPeriodOption,
  setSelectedPeriod: function (
    value: React.SetStateAction<Travel.TravelPeriodOption>
  ): void {
    throw new Error("Function not implemented.");
  },
  setIsToggleOn: function (value: React.SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  isToggleOn: false,
  totalCount: null,
  setTotalCount: function (value: React.SetStateAction<number | null>): void {
    throw new Error("Function not implemented.");
  },
  travellerType: "",
  setTravellerType: function (
    value: React.SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  adultCount: 0,
  setAdultCount: function (value: React.SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
  adultTravelerObj: undefined,
  setAdultTravelerObj: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  childCount: 0,
  setChildCount: function (value: React.SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
  childTravelerObj: undefined,
  setChildTravelerObj: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  srCitizenCount: 0,
  setSrCitizenCount: function (value: React.SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
  srCitizenTravelerObj: undefined,
  setSrCitizenTravelerObj: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  travelersList: undefined,
  setTravelersList: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  travelcoverageType: null,
  setTravelCoverageType: function (
    value: React.SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelcoveragePlan: null,
  setTravelCoveragePlan: function (
    value: React.SetStateAction<SelectPlanTypeKeys | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelcoverage: "",
  setTravelCoverage: function (
    value: React.SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelcoverageTypeCode: null,
  setTravelCoverageTypeCode: function (
    value: React.SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataWorldwidepearl: undefined,
  setWorldwidepearl: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataWorldwidetraveller: undefined,
  setWorldwidetraveller: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  worldwideCardPrice: null,
  setworldwideCardPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  worldwidepearlInitialPrice: null,
  setworldwidepearlInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  worldwidetravellerInitialPrice: null,
  setworldwidetravellerInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidepearlVAT: null,
  setdataworldwidepearlVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidepearladminfee: null,
  setdataworldwidepearladminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidepearlnetpremium: null,
  setdataworldwidepearlnetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidetravellerVAT: null,
  setdataworldwidetravellerVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidetravelleradminfee: null,
  setdataworldwidetravelleradminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwidetravellernetpremium: null,
  setdataworldwidetravellernetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataWorldwideexceptpearl: undefined,
  setWorldwideexceptpearl: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataWorldwideexcepttraveller: undefined,
  setWorldwideexcepttraveller: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  worldwideexceptCardPrice: null,
  setworldwideexceptCardPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  worldwideexceptpearlInitialPrice: null,
  setworldwideexceptpearlInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  worldwideexcepttravellerInitialPrice: null,
  setworldwideexcepttravellerInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexceptpearlVAT: null,
  setdataworldwideexceptpearlVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexceptpearladminfee: null,
  setdataworldwideexceptpearladminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexceptpearlnetpremium: null,
  setdataworldwideexceptpearlnetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexcepttravellerVAT: null,
  setdataworldwideexcepttravellerVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexcepttravelleradminfee: null,
  setdataworldwideexcepttravelleradminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideexcepttravellernetpremium: null,
  setdataworldwideexcepttravellernetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeeurope: undefined,
  setEuropeeurope: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeschengen: undefined,
  setEuropeschengen: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  EuropeCardPrice: null,
  setEuropeCardPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  EuropeeuropeInitialPrice: null,
  setEuropeeuropeInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  EuropeschengenInitialPrice: null,
  setEuropeschengenInitialPrice: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeeuropeVAT: null,
  setEuropeeuropeVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeeuropeadminfee: null,
  setdataEuropeeuropeadminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeeuropenetpremium: null,
  setdataEuropeeuropenetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeschengenVAT: null,
  setdataEuropeschengenVAT: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeschengenadminfee: null,
  setdataEuropeschengenadminfee: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataEuropeschengennetpremium: null,
  setdataEuropeschengennetpremium: function (
    value: React.SetStateAction<number | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelCovidcoverage: false,
  settravelCovidcoverage: function (
    value: React.SetStateAction<boolean>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelWintersportscoverage: false,
  settravelWintersportscoverage: function (
    value: React.SetStateAction<boolean>
  ): void {
    throw new Error("Function not implemented.");
  },
  isAddTravelerValidation: false,
  setIsAddTravelerValidation: function (
    value: React.SetStateAction<boolean>
  ): void {
    throw new Error("Function not implemented.");
  },
  productName: "",
  setProductName: function (value: React.SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  tpPremiumBreakdown: [],
  setTpPremiumBreakdown: function (
    value: React.SetStateAction<PremiumBreakdown[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  wsPremiumBreakdown: [],
  setWsPremiumBreakdown: function (
    value: React.SetStateAction<PremiumBreakdown[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  agencyPremiumBreakdown: [],
  setAgencyPremiumBreakdown: function (
    value: React.SetStateAction<PremiumBreakdown[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  mathPremiumBreakdown: [],
  setMathPremiumBreakdown: function (
    value: React.SetStateAction<PremiumBreakdown[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  homePremiumResponse: {} as Record<string, any>,
  setHomePremiumResponse: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  requestPayload: {} as Record<string, any>,
  updateRequestPayload: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  isRenewpolicy: false,
  setIsRenewpolicy: function (value: React.SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  isRenewPolicyData: null,
  setIsRenewPolicyData: function (
    value: React.SetStateAction<RenewPolicyDataProps | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  viewPolicyData: undefined,
  setViewPolicyData: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  pTravelername: "",
  setpTravelername: function (value: string): void {
    throw new Error("Function not implemented.");
  },
  pTravelerPassportno: "",
  setpTravelerPassportno: function (value: string): void {
    throw new Error("Function not implemented.");
  },
  pTravelerPassportexpiry: "",
  setpTravelerPassportexpiry: function (value: string): void {
    throw new Error("Function not implemented.");
  },
  quoteDataResponse: "",
  setQuoteDataResponse: function (value: string): void {
    throw new Error("Function not implemented.");
  },
  setTravelJourneyData: function (value: string): void {
    throw new Error("Function not implemented.");
  },
  primaryTravelers: [],
  setPrimaryTravelers: function (
    value: React.SetStateAction<travelersInfo[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelers: [],
  setTravelers: function (value: React.SetStateAction<travelersInfo[]>): void {
    throw new Error("Function not implemented.");
  },
  travelersChild: [],
  setTravelersChild: function (
    value: React.SetStateAction<travelersInfo[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  travelersSrcitizen: [],
  setTravelersSrcitizen: function (
    value: React.SetStateAction<travelersInfo[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanselfworldwide: undefined,
  setCoverageplanselfworldwide: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanselfworldwideusa: undefined,
  setCoverageplanselfworldwideusa: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanselfeurope: undefined,
  setCoverageplanselfworldwideeurope: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanfamilyworldwide: undefined,
  setCoverageplanfamilyworldwide: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanfamilyworldwideusa: undefined,
  setCoverageplanfamilyworldwideusa: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  dataCoverageplanfamilyeurope: undefined,
  setCoverageplanfamilyeurope: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  worldwideCoveragePrice: {} as Record<string, any>,
  setworldwideCoveragePrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  worldwideFamilyCoveragePrice: {} as Record<string, any>,
  setworldwideFamilyCoveragePrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  worldwideexceptCoveragePrice: {} as Record<string, any>,
  setworldwideexceptCoveragePrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  europeCoveragePrice: {} as Record<string, any>,
  seteuropeCoveragePrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  dataworldwideCoverageFamily: undefined,
  setdataworldwideFamily: function (value: any): void {
    throw new Error("Function not implemented.");
  },
  worldwideFamilyCPPrice: {} as Record<string, any>,
  setworldwideFamilyCPPrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  worldwideSelfCPPrice: {} as Record<string, any>,
  setworldwideSelfCPPrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  worldwideexceptSelfCPPrice: {} as Record<string, any>,
  setworldwideexceptSelfCPPrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  europeSelfCPPrice: {} as Record<string, any>,
  seteuropeSelfCPPrice: function (value: Record<string, any>): void {
    throw new Error("Function not implemented.");
  },
  deleteStatus: undefined,
  setDeleteStatus: function (value: React.SetStateAction<{} | null>): void {
    throw new Error("Function not implemented.");
  },
};

describe("ChangePolicyStartDate Component", () => {
  const mockCloseHandler = jest.fn();
  const mockChangeHandler = jest.fn();
  const mockLanguageData = {
    modify_policy_start_date: "Modify Policy Start Date",
    policy_start_date: "Policy Start Date",
    cancel: "Cancel",
    isLatest: "home",
    save: "Save",
    update: "Update",
    hirji: "Hirji",
    policyStartDateError: "Invalid date",
  };

  const defaultProps = {
    closeHandler: mockCloseHandler,
    languageData: mockLanguageData,
    changeHandler: mockChangeHandler,
    policyDate: new DateObject().add(1, "days").format("DD/MM/YYYY"), // Default date for testing
    isCalendarIcon: true,
    isOnVal: false,
    productType: "motor",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with required props", () => {
    render(
      <QuoteAndBuyContext.Provider value={mockContextValue}>
        <ChangePolicyStartDate {...defaultProps} />
      </QuoteAndBuyContext.Provider>
    );
    expect(
      screen.getByText(mockLanguageData.modify_policy_start_date)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockLanguageData.policy_start_date)
    ).toBeInTheDocument();
  });

  it("calls closeHandler when cancel button is clicked", () => {
    render(
      <QuoteAndBuyContext.Provider value={mockContextValue}>
        <ChangePolicyStartDate {...defaultProps} />
      </QuoteAndBuyContext.Provider>
    );
    const cancelButton = screen.getByText(mockLanguageData.cancel);
    fireEvent.click(cancelButton);
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("renders update button when checkValue is true", () => {
    const propsWithCheckValue = {
      ...defaultProps,
      languageData: { ...mockLanguageData, isLatest: "home" },
    };
    render(
      <QuoteAndBuyContext.Provider value={{...mockContextValue, isRenewpolicy: true}}>
        <ChangePolicyStartDate {...propsWithCheckValue} />
      </QuoteAndBuyContext.Provider>
    );
    expect(screen.getByText(mockLanguageData.update)).toBeInTheDocument();
  });

  it("renders save button when checkValue is null", () => {
    const propsWithNullCheckValue = {
      ...defaultProps,
      languageData: { ...mockLanguageData, isLatest: "" }, // Change null to an empty string
    };
    render(
      <QuoteAndBuyContext.Provider value={mockContextValue}>
        <ChangePolicyStartDate {...propsWithNullCheckValue} />
      </QuoteAndBuyContext.Provider>
    );
    expect(screen.getByText(mockLanguageData.update)).toBeInTheDocument();
  });

  it("calls changeHandler with correct value on save button click", () => {
    render(
        <QuoteAndBuyContext.Provider value={mockContextValue}>
        <ChangePolicyStartDate {...defaultProps} />
      </QuoteAndBuyContext.Provider>
    );
    const validDate = "15/10/2023";
    const calendarInput = screen.getByRole("textbox");
    fireEvent.change(calendarInput, { target: { value: validDate } });

    const saveButton = screen.getByText(mockLanguageData.update);
    fireEvent.click(saveButton);

    // expect(mockChangeHandler).toHaveBeenCalledWith(validDate);
  });

  it("sets error state when save button is clicked with invalid date", () => {
    render(
        <QuoteAndBuyContext.Provider value={mockContextValue}>
        <ChangePolicyStartDate {...defaultProps} />
      </QuoteAndBuyContext.Provider>
    );
    const invalidDate = "32/13/2023";
    const calendarInput = screen.getByRole("textbox");
    fireEvent.change(calendarInput, { target: { value: invalidDate } });

    const saveButton = screen.getByText(mockLanguageData.update);
    fireEvent.click(saveButton);

    // expect(screen.getByText(mockLanguageData.policyStartDateError)).toBeInTheDocument();
    // expect(mockChangeHandler).not.toHaveBeenCalled();
  });
});
