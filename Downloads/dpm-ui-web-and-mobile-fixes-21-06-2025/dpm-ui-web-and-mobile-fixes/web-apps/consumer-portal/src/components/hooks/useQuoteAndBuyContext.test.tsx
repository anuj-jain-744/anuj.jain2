import { renderHook } from '@testing-library/react-hooks';
import { useQuoteAndBuyContext } from './useQuoteAndBuyContext';
import React from 'react';
import { Country, QuoteAndBuyContext, QuoteAndBuyContextProps, travelersInfo } from 'Motor/QuoteAndBuy/QuoteAndBuyContext';
import { Value } from 'react-multi-date-picker';
import { SelectPlanTypeKeys } from 'types/coverageplan';
import { PremiumBreakdown, RenewPolicyDataProps } from 'types/quoteAndBuy';

describe('useQuoteAndBuyContext', () => {
  it('should throw an error if used outside of QuoteAndBuyProvider', () => {
    const { result } = renderHook(() => useQuoteAndBuyContext());
    expect(result.error).toEqual(
      new Error('useQuoteAndBuyContext must be used within a QuoteAndBuyProvider')
    );
  });

  it('should return context value if used within QuoteAndBuyProvider', () => {
    const mockContextValue: QuoteAndBuyContextProps = {
      schemeCode: null,
      setSchemeCode: () => { },
      premium: 0,
      setPremium: () => { },
      comprehensiveCardPrice: null,
      setComprehensiveCardPrice: jest.fn(),
      sliderValueSumInsured: '',
      setSliderValueSumInsured: jest.fn(),
      sliderValueDeductibles: '',
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
      journeyData: '',
      setJourneyData: jest.fn(),
      redisKey: '',
      setRedisKey: jest.fn(),
      addDriverFormData: [],
      setAddDriverFormData: jest.fn(),
      availableRepairTypes: [],
      countryData: [],
      setCountryData: function (value: Country[]): void {
        throw new Error('Function not implemented.');
      },
      setAvailableRepairTypes: function (value: React.SetStateAction<string[]>): void {
        throw new Error('Function not implemented.');
      },
      quoteNumber: null,
      setQuoteNumber: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      expiryDate: null,
      setExpiryDate: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      referanceNumber: null,
      setReferanceNumber: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      travelData: null,
      setTravelData: function (value: React.SetStateAction<Value>): void {
        throw new Error('Function not implemented.');
      },
      setTravelStartDate: function (value: React.SetStateAction<Value>): void {
        throw new Error('Function not implemented.');
      },
      travelStartDate: null,
      selectedPeriod: undefined,
      setSelectedPeriod: function (value: React.SetStateAction<Travel.TravelPeriodOption>): void {
        throw new Error('Function not implemented.');
      },
      setIsToggleOn: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      },
      isToggleOn: false,
      totalCount: null,
      setTotalCount: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      travellerType: '',
      setTravellerType: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      adultCount: 0,
      setAdultCount: function (value: React.SetStateAction<number>): void {
        throw new Error('Function not implemented.');
      },
      adultTravelerObj: undefined,
      setAdultTravelerObj: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      childCount: 0,
      setChildCount: function (value: React.SetStateAction<number>): void {
        throw new Error('Function not implemented.');
      },
      childTravelerObj: undefined,
      setChildTravelerObj: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      srCitizenCount: 0,
      setSrCitizenCount: function (value: React.SetStateAction<number>): void {
        throw new Error('Function not implemented.');
      },
      srCitizenTravelerObj: undefined,
      setSrCitizenTravelerObj: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      travelersList: undefined,
      setTravelersList: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      travelcoverageType: null,
      setTravelCoverageType: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      travelcoveragePlan: null,
      setTravelCoveragePlan: function (value: React.SetStateAction<SelectPlanTypeKeys | null>): void {
        throw new Error('Function not implemented.');
      },
      travelcoverage: '',
      setTravelCoverage: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      travelcoverageTypeCode: null,
      setTravelCoverageTypeCode: function (value: React.SetStateAction<string | null>): void {
        throw new Error('Function not implemented.');
      },
      dataWorldwidepearl: undefined,
      setWorldwidepearl: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataWorldwidetraveller: undefined,
      setWorldwidetraveller: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      worldwideCardPrice: null,
      setworldwideCardPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      worldwidepearlInitialPrice: null,
      setworldwidepearlInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      worldwidetravellerInitialPrice: null,
      setworldwidetravellerInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidepearlVAT: null,
      setdataworldwidepearlVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidepearladminfee: null,
      setdataworldwidepearladminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidepearlnetpremium: null,
      setdataworldwidepearlnetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidetravellerVAT: null,
      setdataworldwidetravellerVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidetravelleradminfee: null,
      setdataworldwidetravelleradminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwidetravellernetpremium: null,
      setdataworldwidetravellernetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataWorldwideexceptpearl: undefined,
      setWorldwideexceptpearl: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataWorldwideexcepttraveller: undefined,
      setWorldwideexcepttraveller: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      worldwideexceptCardPrice: null,
      setworldwideexceptCardPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      worldwideexceptpearlInitialPrice: null,
      setworldwideexceptpearlInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      worldwideexcepttravellerInitialPrice: null,
      setworldwideexcepttravellerInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexceptpearlVAT: null,
      setdataworldwideexceptpearlVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexceptpearladminfee: null,
      setdataworldwideexceptpearladminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexceptpearlnetpremium: null,
      setdataworldwideexceptpearlnetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexcepttravellerVAT: null,
      setdataworldwideexcepttravellerVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexcepttravelleradminfee: null,
      setdataworldwideexcepttravelleradminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideexcepttravellernetpremium: null,
      setdataworldwideexcepttravellernetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeeurope: undefined,
      setEuropeeurope: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeschengen: undefined,
      setEuropeschengen: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      EuropeCardPrice: null,
      setEuropeCardPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      EuropeeuropeInitialPrice: null,
      setEuropeeuropeInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      EuropeschengenInitialPrice: null,
      setEuropeschengenInitialPrice: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeeuropeVAT: null,
      setEuropeeuropeVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeeuropeadminfee: null,
      setdataEuropeeuropeadminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeeuropenetpremium: null,
      setdataEuropeeuropenetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeschengenVAT: null,
      setdataEuropeschengenVAT: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeschengenadminfee: null,
      setdataEuropeschengenadminfee: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      dataEuropeschengennetpremium: null,
      setdataEuropeschengennetpremium: function (value: React.SetStateAction<number | null>): void {
        throw new Error('Function not implemented.');
      },
      travelCovidcoverage: false,
      settravelCovidcoverage: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      },
      travelWintersportscoverage: false,
      settravelWintersportscoverage: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      },
      isAddTravelerValidation: false,
      setIsAddTravelerValidation: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      },
      productName: '',
      setProductName: function (value: React.SetStateAction<string>): void {
        throw new Error('Function not implemented.');
      },
      tpPremiumBreakdown: [],
      setTpPremiumBreakdown: function (value: React.SetStateAction<PremiumBreakdown[]>): void {
        throw new Error('Function not implemented.');
      },
      wsPremiumBreakdown: [],
      setWsPremiumBreakdown: function (value: React.SetStateAction<PremiumBreakdown[]>): void {
        throw new Error('Function not implemented.');
      },
      agencyPremiumBreakdown: [],
      setAgencyPremiumBreakdown: function (value: React.SetStateAction<PremiumBreakdown[]>): void {
        throw new Error('Function not implemented.');
      },
      mathPremiumBreakdown: [],
      setMathPremiumBreakdown: function (value: React.SetStateAction<PremiumBreakdown[]>): void {
        throw new Error('Function not implemented.');
      },
      homePremiumResponse: undefined,
      setHomePremiumResponse: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      requestPayload: undefined,
      updateRequestPayload: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      isRenewpolicy: false,
      setIsRenewpolicy: function (value: React.SetStateAction<boolean>): void {
        throw new Error('Function not implemented.');
      },
      isRenewPolicyData: null,
      setIsRenewPolicyData: function (value: React.SetStateAction<RenewPolicyDataProps | null>): void {
        throw new Error('Function not implemented.');
      },
      viewPolicyData: undefined,
      setViewPolicyData: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      pTravelername: '',
      setpTravelername: function (value: string): void {
        throw new Error('Function not implemented.');
      },
      pTravelerPassportno: '',
      setpTravelerPassportno: function (value: string): void {
        throw new Error('Function not implemented.');
      },
      pTravelerPassportexpiry: '',
      setpTravelerPassportexpiry: function (value: string): void {
        throw new Error('Function not implemented.');
      },
      quoteDataResponse: '',
      setQuoteDataResponse: function (value: string): void {
        throw new Error('Function not implemented.');
      },
      setTravelJourneyData: function (value: string): void {
        throw new Error('Function not implemented.');
      },
      primaryTravelers: [],
      setPrimaryTravelers: function (value: React.SetStateAction<travelersInfo[]>): void {
        throw new Error('Function not implemented.');
      },
      travelers: [],
      setTravelers: function (value: React.SetStateAction<travelersInfo[]>): void {
        throw new Error('Function not implemented.');
      },
      travelersChild: [],
      setTravelersChild: function (value: React.SetStateAction<travelersInfo[]>): void {
        throw new Error('Function not implemented.');
      },
      travelersSrcitizen: [],
      setTravelersSrcitizen: function (value: React.SetStateAction<travelersInfo[]>): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanselfworldwide: undefined,
      setCoverageplanselfworldwide: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanselfworldwideusa: undefined,
      setCoverageplanselfworldwideusa: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanselfeurope: undefined,
      setCoverageplanselfworldwideeurope: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanfamilyworldwide: undefined,
      setCoverageplanfamilyworldwide: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanfamilyworldwideusa: undefined,
      setCoverageplanfamilyworldwideusa: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      dataCoverageplanfamilyeurope: undefined,
      setCoverageplanfamilyeurope: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      worldwideCoveragePrice: undefined,
      setworldwideCoveragePrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      worldwideFamilyCoveragePrice: undefined,
      setworldwideFamilyCoveragePrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      worldwideexceptCoveragePrice: undefined,
      setworldwideexceptCoveragePrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      europeCoveragePrice: undefined,
      seteuropeCoveragePrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      dataworldwideCoverageFamily: undefined,
      setdataworldwideFamily: function (value: any): void {
        throw new Error('Function not implemented.');
      },
      worldwideFamilyCPPrice: undefined,
      setworldwideFamilyCPPrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      worldwideSelfCPPrice: undefined,
      setworldwideSelfCPPrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      worldwideexceptSelfCPPrice: undefined,
      setworldwideexceptSelfCPPrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      europeSelfCPPrice: undefined,
      seteuropeSelfCPPrice: function (value: Record<string, any>): void {
        throw new Error('Function not implemented.');
      },
      deleteStatus: undefined,
      setDeleteStatus: function (value: React.SetStateAction<{} | null>): void {
        throw new Error('Function not implemented.');
      }
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuoteAndBuyContext.Provider value={mockContextValue}>
        {children}
      </QuoteAndBuyContext.Provider>
    );

    const { result } = renderHook(() => useQuoteAndBuyContext(), { wrapper });
    expect(result.current).toEqual(mockContextValue);
  });
});