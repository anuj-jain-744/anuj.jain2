import { renderHook } from '@testing-library/react-hooks';
import { useQuoteAndBuyContext } from './useQuoteAndBuyContext';
import React from 'react';
import { QuoteAndBuyContext, QuoteAndBuyContextProps } from 'Motor/QuoteAndBuy/QuoteAndBuyContext';

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