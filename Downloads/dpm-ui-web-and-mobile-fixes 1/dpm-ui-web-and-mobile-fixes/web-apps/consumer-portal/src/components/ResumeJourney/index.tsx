import { Modal } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";
import { DriverDetailsResponseData, VehicleDetailsResponseData } from "types/quoteAndBuy";
import { JAVA_API_ROUTES } from "../../constant";
import { useEffect, useState } from "react";
import { LoaderOverlay } from "components/OTPValidation";
import { DriverDetailsRequest } from "types/DriverDetailsApi";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { useLocation } from "react-router-dom";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { formatDOB } from "Motor/QuoteAndBuy/hooks/useDriverDetails";

interface InitialValueProps {
  [key: string]: string;
}

interface ResumeJourneyProps {
  readonly onContinue: () => void;
  readonly onNew: () => void;
  readonly show: boolean;
  readonly languageData: LanguageData;
  readonly setLeftStep: (step: number) => void;
}

function ResumeJourney({
  onContinue,
  onNew,
  show,
  languageData,
  setLeftStep,
}: ResumeJourneyProps) {
  const [loader, setLoader] = useState(false);
  const { handleDriverAdded } = useHandleDriverData();
  const [isContunueClicked, setIsContunueClicked] = useState<boolean>(false);
  const requestPayload = useCalculatePremiumPayload();
  const { handleCalculatePremium, isLoadingCalculatePremium } =
    useCalculatePremiumApi();
  const [isAlldependenciesLoaded, setIsAllDependenciesLoaded] = useState<boolean>(false);
  const { 
    journeyData,
    setVehicleDetailsResponseData,
    vehicleDetailsResponseData,
    setVehicleDetails,
    setCoverageType,
    setRepairTypeSelected,
    setSchemeCode,
    setSliderValueDeductibles,
    setSliderValueSumInsured,
    setSelectedBenefits,
    setDriverDetailsResponseData,
    driverDetailsResponseData,
    setCountryData,
  } = useQuoteAndBuyContext();

  const {
    makeApiCall,
    isLoading: isVehicleDetailsLoading,
    data: response,
  } = useApiCall<VehicleDetailsResponseData, InitialValueProps>(0, JAVA_API_ROUTES.getVehicleDetails, "post");
  const location = useLocation();
  const propsData = location?.state?.data;

  const { 
    makeApiCall: quoteApiCall,
    isLoading: isDriverDetailLoading,
    data: driverDetailsResponse,
  } = useApiCall<DriverDetailsResponseData, DriverDetailsRequest>(
    2,
    "/Motor/QuoteAndBuy/V1/GetDriverDetails",
    "post"
  );
  const {
    makeApiCall: getCountryCodes,
    isLoading: isCountryCodesLoading,
    data: countryCodes,
  } = useApiCall(12, "/MasterData/V1/getCountryCodes", "get");

  
  const handleContinue = async () => {
    if (journeyData) {
      setLoader(true);
      const data = JSON.parse(journeyData);
      setIsContunueClicked(true);
      const driverDetailsPayload = {
        driverId: propsData?.ownerId,
        dob: formatDOB(propsData?.ownerDetail?.ownerDobH),
        mainDriverInd: 'Y',
        vehicleDefinitionType: data?.vehicleDetails?.sequenceNumber ? '1' : '2',
        vehicleId: data?.vehicleDetails?.sequenceNumber ? data?.vehicleDetails?.sequenceNumber : data?.vehicleDetails?.customCardNumber
      }
      quoteApiCall(driverDetailsPayload);
      getCountryCodes();
      if(data.vehicleDetails) {
        await makeApiCall(data.vehicleDetails);
        setLeftStep(data.currentStep ? parseInt(data.currentStep) : 0);
      }
      if(data.vehicleFormDetails) {
        setVehicleDetails({
          ...data.vehicleFormDetails,
          vehicleSequenceNo: data?.vehicleDetails?.sequenceNumber,
          vehicleCustomID: data?.vehicleDetails?.customCardNumber,
          vehicleDefinitionType: data?.vehicleDetails?.sequenceNumber ? "1" :"2",
        });
      } else {
        setVehicleDetails(val => {
          return {
            ...val,
            vehicleSequenceNo: data?.vehicleDetails?.sequenceNumber,
            vehicleCustomID: data?.vehicleDetails?.customCardNumber,
            vehicleDefinitionType: data?.vehicleDetails?.sequenceNumber ? "1" :"2",
          }
        });
      }
      if(data.driverDetails && Array.isArray(data.driverDetails)) {
        data.driverDetails.map(async (val: { ownerId: string; ownerDOB: string; }) => {
          await quoteApiCall({
            driverId: val.ownerId,
            dob: val.ownerDOB,
          });
        })
      }
      if(data?.coverageType) {
        setCoverageType(data?.coverageType);
      }
      if(data?.repairTypeSelected) {
        setRepairTypeSelected(data?.repairTypeSelected);
      }
      if(data?.schemeCode) {
        setSchemeCode(data?.schemeCode);
      }
      if(data?.sliderValueDeductibles) {
        setSliderValueDeductibles(data?.sliderValueDeductibles);
      }
      if(data?.sliderValueSumInsured) {
        setSliderValueSumInsured(data?.sliderValueSumInsured);
      }
      if(data?.selectedBenefits) {
        setSelectedBenefits(data?.selectedBenefits);
      }
      if(data?.currentStep === 1) {
        onContinue();
        setIsContunueClicked(false);
      }
      setLoader(false);
    }
  }

  useEffect(() => {
    if(countryCodes) {
        countryCodes && setCountryData(countryCodes?.model?.content);
    }
  }, [countryCodes]);

  useEffect(() => {
    if(driverDetailsResponse && journeyData) {
      const data = JSON.parse(journeyData);
      if(data.driverDetails && Array.isArray(data.driverDetails)) {
        const relationData = data.driverDetails.find((val: { ownerId: string; }) => {
          return val.ownerId === driverDetailsResponse.driverID;
        });
        if(relationData) {
          driverDetailsResponse.relationship = relationData.relation;
        }
      }
      setDriverDetailsResponseData((prevDrivers) => {
        // Check if the driver already exists to prevent duplicates
        const driverExists = prevDrivers.some(
          driver => driver.driverID === driverDetailsResponse.driverID
        );

        return driverExists 
          ? prevDrivers 
          : [...prevDrivers, driverDetailsResponse];
      });
      
      
      handleDriverAdded(driverDetailsResponse);
    }
  }, [driverDetailsResponse, journeyData]);

  const handleCalculatePremiumApi = async (payload: CalculatePremiumPayload) => {
    await handleCalculatePremium(payload);
    onContinue();
    setIsContunueClicked(false);
  }

  useEffect(() => {
    if(journeyData) {
      const data = JSON.parse(journeyData);
      if(isContunueClicked && data?.currentStep > 1 && Array.isArray(data?.driverDetails) && data?.driverDetails.length === driverDetailsResponseData.length -1) {
        setIsAllDependenciesLoaded(true);
      } 
    }
  },[journeyData, driverDetailsResponseData, isContunueClicked]);

  useEffect(() => { 
    if(isAlldependenciesLoaded && requestPayload) {
      handleCalculatePremiumApi(requestPayload)
    }
  }, [isAlldependenciesLoaded, requestPayload]);

  useEffect(() => {
    if (response) {
      const data = JSON.parse(journeyData);
      setVehicleDetailsResponseData({
        ...vehicleDetailsResponseData,
        ...response,
        vehicleDefinitionType: data?.vehicleDetails?.sequenceNumber ? '1' : '2',
        vehicleCustomID: data?.vehicleDetails?.customCardNumber,
      });
    }
  }, [response]);  

  return (
    <Modal className="resume-jorney-parent-container" show={show} centered>
      {(loader ||
        isLoadingCalculatePremium ||
        isVehicleDetailsLoading ||
        isDriverDetailLoading ||
        isCountryCodesLoading) && <LoaderOverlay />}
      <div className="resume-journey-container">
        <div className="journey walaa-medium-500">
          {languageData?.resume_your_motor_insuranc}
        </div>
        <div className="journey-content">
          {languageData?.dear_user_would_you_like}
        </div>
        <hr className="horizontal-line" />
        <div className="bottom-btns">
          <ThemeButton
            isDisabled={false}
            title={languageData?.continue_from_where_left}
            classes={"continue-btn walaa-medium-500"}
            variant="outline"
            onClickhandler={handleContinue}
          />
          <ThemeButton
            isDisabled={false}
            title={languageData?.start_a_new_quotation}
            classes={"new-quotation-btn walaa-medium-500"}
            variant="policyPrimary"
            onClickhandler={onNew}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ResumeJourney;
