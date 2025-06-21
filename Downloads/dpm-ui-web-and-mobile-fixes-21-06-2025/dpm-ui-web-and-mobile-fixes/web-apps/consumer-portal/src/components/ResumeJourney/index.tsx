import { Modal } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData, RedisData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";
import { DriverDetailsResponseData, VehicleDetailsResponseData } from "types/quoteAndBuy";
import { JAVA_API_ROUTES, PaymentUrl } from "../../constant";
import { useEffect, useState } from "react";
import { LoaderOverlay } from "components/OTPValidation";
import { DriverDetailsRequest } from "types/DriverDetailsApi";
import useHandleDriverData from "hook/motor/useHandleDriverData";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { useLocation } from "react-router-dom";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { formatDOB } from "Motor/QuoteAndBuy/hooks/useDriverDetails";
import { formatDate } from "utils/quoteAndBuy";
import { AlertBox } from "components/AlertBox";

interface InitialValueProps {
  [key: string]: string;
}

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

interface ResumeJourneyProps {
  readonly onContinue: () => void;
  readonly onNew: () => void;
  readonly show: boolean;
  readonly redisData: RedisData | null;
  readonly languageData: LanguageData;
  readonly setLeftStep: (step: number) => void;
  readonly navigateTo?: (url: string, data?: unknown) => void;
}

function ResumeJourney({
  onContinue,
  onNew,
  show,
  redisData,
  languageData,
  setLeftStep,
  navigateTo,
}: ResumeJourneyProps) {
  const [loader, setLoader] = useState(false);
  const { handleDriverAdded } = useHandleDriverData();
  const [isContunueClicked, setIsContunueClicked] = useState<boolean>(false);
  const requestPayload = useCalculatePremiumPayload();
  const { handleCalculatePremium, isAllError, isLoadingCalculatePremium, isCalculateData, errorResponse } =
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
    setAddDriverFormData,
  } = useQuoteAndBuyContext();

  const [apiErrorMessage, setApiErrorMessage] = useState<ApiError>({
    title: "",
    description: ""
  });

  const {
    makeApiCall,
    isLoading: isVehicleDetailsLoading,
    data: response,
    errors: vehicleDetailsError,
  } = useApiCall<VehicleDetailsResponseData, InitialValueProps>(0, JAVA_API_ROUTES.getVehicleDetails, "post");
  const location = useLocation();
  const propsData = location?.state?.data;

  const { 
    makeApiCall: quoteApiCall,
    isLoading: isDriverDetailLoading,
    data: driverDetailsResponse,
    errors: driverDetailsError,
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
      setDriverDetailsResponseData([]);
      setIsAllDependenciesLoaded(false);
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
      }
      if(data?.driverDetails?.length && Array.isArray(data.driverDetails)) {
        data.driverDetails.map(async (val: { ownerId: string; ownerDOB: string; }) => {
          await quoteApiCall({
            driverId: val.ownerId,
            dob: formatDOB(val.ownerDOB),
          });
        })
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
      if(data?.currentStep === 1) {
        updateQuoteContext(data);
        onContinue();
        setIsContunueClicked(false);
        setLoader(false);
      }
      setLoader(false);

    }
  }

  const updateQuoteContext = (data) => {
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
    setLeftStep(data.currentStep ? parseInt(data.currentStep) : 0);
  }

  useEffect(() => {
    if(countryCodes) {
        countryCodes && setCountryData(countryCodes?.model?.content);
    }
  }, [countryCodes]);

  useEffect(() => {
    if(driverDetailsResponse && !driverDetailsError && journeyData) {
      const data = JSON.parse(journeyData);
      if(data?.driverDetails?.length && Array.isArray(data.driverDetails)) {
        const relationData = data.driverDetails.find((val: { ownerId: string; }) => {
          return val.ownerId === driverDetailsResponse.driverID;
        });
        if(relationData) {
          driverDetailsResponse.relationship = relationData.relation;
        }
        setAddDriverFormData(data.driverDetails);
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
  }, [driverDetailsResponse, driverDetailsError, journeyData]);

  useEffect(() => {
    if (driverDetailsError) {
      setLoader(false);
      setApiErrorMessage({
        title: driverDetailsError?.name || languageData?.internal_server_error,
        description: driverDetailsError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [driverDetailsError]);

  const handleCalculatePremiumApi = async (payload: CalculatePremiumPayload) => {
    if(redisData?.quoteNumber) {
      const encryptedQuoteNumber = btoa(`${redisData?.quoteNumber}_01`);
      navigateTo && navigateTo(PaymentUrl + encryptedQuoteNumber);
    } else {
      await setIsAllDependenciesLoaded(false);
      await handleCalculatePremium(payload);
    }
  }

  useEffect(() => {
    if (isCalculateData && !isLoadingCalculatePremium) {
      const data = JSON.parse(journeyData);
      setLoader(false);
      updateQuoteContext(data);
      onContinue();
      setIsContunueClicked(false);
    }
  }, [isCalculateData, isLoadingCalculatePremium])

  useEffect(() => {
    if (isAllError) {
      setLoader(false);
      setApiErrorMessage({
        title: errorResponse?.name || languageData?.internal_server_error,
        description: errorResponse.message ?? languageData?.something_went_wrong,
      });
    }
  }, [isAllError]);

  useEffect(() => {
    if(journeyData) {
      const data = JSON.parse(journeyData);
      if(isContunueClicked && data?.currentStep > 1 && vehicleDetailsResponseData && Array.isArray(data?.driverDetails) && data?.driverDetails.length === driverDetailsResponseData.length -1) {
        setIsAllDependenciesLoaded(true);
      } 
    }
  },[journeyData, driverDetailsResponseData, vehicleDetailsResponseData, isContunueClicked]);

  useEffect(() => { 
    if(isAlldependenciesLoaded && requestPayload) {
      handleCalculatePremiumApi(requestPayload)
    }
  }, [isAlldependenciesLoaded, requestPayload]);

  useEffect(() => {
    if (response && !vehicleDetailsError) {
      const data = JSON.parse(journeyData);
      setVehicleDetailsResponseData({
        ...vehicleDetailsResponseData,
        ...response,
        vehicleDefinitionType: data?.vehicleDetails?.sequenceNumber ? '1' : '2',
        vehicleCustomID: data?.vehicleDetails?.customCardNumber,
      });
    }
  }, [response, vehicleDetailsError]);  

  useEffect(() => {
    if (vehicleDetailsError) {
      setLoader(false);
      setApiErrorMessage({
        title: vehicleDetailsError?.name || languageData?.internal_server_error,
        description: vehicleDetailsError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [vehicleDetailsError]);

  const handleModalClose = () => {
    setApiErrorMessage({
      title: "",
      description: ""
    });
  };

  return (
    <Modal className="resume-jorney-parent-container" show={show} centered>
      {apiErrorMessage.title && apiErrorMessage.description && <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={Boolean(apiErrorMessage.title && apiErrorMessage.description)}
        setShowAlertModal={handleModalClose}
      />}
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
          <br />
          {redisData?.quoteNumber && (
            <>
              {languageData?.quote_number} - {redisData.quoteNumber} <br />
              {languageData?.expiry_date} - {formatDate(redisData.expiryDate ?? "")} <br />
              {languageData?.vehicle_sequence_number} - {redisData.vehicleDetails?.sequenceNumber} <br />
              {languageData?.type_of_coverage} - {redisData.coverageType} <br />
            </>
          )}
        </div>
        <hr className="horizontal-line" />
        <div className="bottom-btns">
          <ThemeButton
            isDisabled={false}
            title={languageData?.continue_to_where_you_left_off}
            classes={"continue-btn walaa-medium-500"}
            variant="outline"
            onClickhandler={handleContinue}
          />
          <ThemeButton
            isDisabled={false}
            title={languageData?.generate_new_quote}
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
