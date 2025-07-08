import { useCallback, useEffect, useState } from "react";
import { useApiCall, useCommonContext } from "@dpm/shared-module";
import {
  DriverDetailsResponseData,
  VehicleDetailsResponseData,
} from "types/quoteAndBuy";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { DriverDetailsRequest } from "types/DriverDetailsApi";
import { JAVA_API_ROUTES } from "constant";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { getDateForDriverDetailApi } from "utils/formatDate";
import { ViewPolicy } from "types/endorsement";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { formatDateDmy } from "../CommonFunction/CommonFunction";

interface InitialValueProps {
  [key: string]: string;
}

const useViewPolicyCall = ({
  setShowAlertModal,
  setApiErrorMessage
}: {
  setShowAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApiErrorMessage: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    classes?: string;
  }>>;
}) => {
  const {
    isRenewPolicyData,
    vehicleDetails,
    setCountryData,
    setViewPolicyData,
    setVehicleDetailsResponseData,
    setDriverDetailsResponseData,
    setOwnerDetailsResponseData,
    setVehicleDetails,
    vehicleDetailsResponseData,
    setRepairTypeSelected,
    setCoverageType,
    setMakeModelResponse,
    setPolicyExpiryDate,
  } = useQuoteAndBuyContext();
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [vehicleSequenceNo, setVehicleSequenceNo] = useState<string | null>(null);

  const { currentLanguage } = useCommonContext();

  const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
  useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
    1,
    "consumerportal-config",
    "post",
    currentLanguage
  );

  useEffect(() => {
    makeModelImageApiCall();
  }, []);

  useEffect(() => {
    if (modelImageResponse) {
      setMakeModelResponse(modelImageResponse?.motor_makes);
    }
  }, [modelImageResponse]);

  const { makeApiCall: getCountryCodes, data: countryCodes } = useApiCall(
    12,
    "/MasterData/V1/getCountryCodes",
    "get"
  );

  // Renew Policy
  const requestPayloadPolicy = useCalculatePremiumPayload();
  const { handleCalculatePremium, isCalculateData ,errorResponse,isAllError,isLoadingCalculatePremium} = useCalculatePremiumApi();
  const {
    makeApiCall: getVehicleDetails,
    data: response,
    errors: vehicleDetailsError,
    isLoading: isVehicleDetailsLoading,
  } = useApiCall<VehicleDetailsResponseData, InitialValueProps>(
    0,
    JAVA_API_ROUTES.getVehicleDetails,
    "post"
  );

  const {
    makeApiCall: getDriverDetails,
    data: driverDetailsResponse,
    errors: driverDetailsError,
    isLoading: isDriverDetailsLoading,
  } = useApiCall<DriverDetailsResponseData, DriverDetailsRequest>(
    2,
    "/Motor/QuoteAndBuy/V1/GetDriverDetails",
    "post"
  );


  const handleCalculatePremiumApi = async (
    payload: CalculatePremiumPayload
  ) => {
    if (payload) await handleCalculatePremium(payload);
  };

  // ViewPolicy API Call
  const selectedPolicyNumber = isRenewPolicyData?.policyNumber;

  const {
    makeApiCall: policyApiCall,
    errors: policyError,
    data: policyData,
    isLoading: isPolicyLoading,
  } = useApiCall(11, "/Dashboard/V1/ViewPolicy", "post");
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        await policyApiCall({
          apiSource: "Portal",
          policyNo: selectedPolicyNumber,
          endorsementNo: "",
          isLatestSnapshot: "Y",
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedPolicyNumber) {
      fetchPolicyData();
    }
  }, [selectedPolicyNumber]);

  useEffect(() => {
    if (countryCodes) {
      countryCodes && setCountryData(countryCodes?.model?.content);
    }
  }, [countryCodes]);
  useEffect(() => {
    if (isAllError && errorResponse) {
      setApiErrorMessage({
        title: errorResponse?.name,
        description: errorResponse.message ?? "",
        classes: "type-warning",
      });
      setShowAlertModal(true);
    }
  },[isAllError])

  useEffect(() => {
    if (policyError) {
      setApiErrorMessage({
        title: policyError?.name,
        description: policyError.messages?.message_en ?? "",
        classes: "type-warning",
      });
      setShowAlertModal(true);
    }
  }, [policyError]);

  useEffect(() => {
    if (driverDetailsError) {
      setApiErrorMessage({
        title: driverDetailsError?.name,
        description: driverDetailsError.messages?.message_en ?? "",
        classes: "type-warning",
      });
      setShowAlertModal(true);
    }
  }, [driverDetailsError]);

  useEffect(() => {
    if (vehicleDetailsError) {
      setApiErrorMessage({
        title: vehicleDetailsError?.name,
        description: vehicleDetailsError.messages?.message_en ?? "",
        classes: "type-warning",
      });
      setShowAlertModal(true);
    }
  }, [vehicleDetailsError]);

  useEffect(() => {
    if (policyData) {
      setViewPolicyData(policyData);
      const dateString = policyData?.policyBasic?.expiryDate;
      const formattedExpiryDate = dateString ? formatDateDmy(dateString) : null;
      setPolicyExpiryDate(formattedExpiryDate); // Policy expiry date in DD/MM/YYYY format
    }
  }, [policyData]);

  useEffect(() => {
    if (requestPayloadPolicy && !isAllLoaded && driverDetailsResponse && vehicleDetailsResponseData) {
      setIsAllLoaded(true)
      handleCalculatePremiumApi(requestPayloadPolicy);
    }
  }, [requestPayloadPolicy, vehicleDetailsResponseData, driverDetailsResponse , isAllLoaded]);

  useEffect(() => {
    const policyLob = policyData?.policyLob?.[0];
    const policyRisk = policyLob?.policyRisk?.[0];

    if (response) {
      setVehicleDetails({
        ...vehicleDetails,
        ...response,
        vehicleSequenceNo: vehicleSequenceNo,
        vehicleDefinitionType: vehicleSequenceNo ? "1" : "2",
        vehicleCustomID: policyRisk?.vehicleCustomID || "",
      }

      )
      setVehicleDetailsResponseData({
        ...vehicleDetailsResponseData,
        ...response,
        vehicleSequenceNo: vehicleSequenceNo,
        vehicleDefinitionType: vehicleSequenceNo ? "1" : "2",
        vehicleCustomID: policyRisk?.vehicleCustomID || "",

      });
    }
  }, [response, vehicleSequenceNo, policyData]);

  useEffect(() => {
    if(isCalculateData && policyData) {
      const policyLob = policyData?.policyLob?.[0];
      const policyRisk = policyLob?.policyRisk?.[0];

      setRepairTypeSelected(policyRisk?.repairCondition);
    }
  }, [isCalculateData, policyData]);

  useEffect(() => {
    if (driverDetailsResponse) {
      setDriverDetailsResponseData(prev => {
        return [
          ...(Array.isArray(prev) ? prev : []), // Ensure the rest of the previous data is included
          driverDetailsResponse, // Set the element as driverDetailsResponse
        ];

    });
    }
  }, [driverDetailsResponse]);

  const viewPolicyCall = useCallback(
    async (policyData: ViewPolicy) => {
      if (!isRenewPolicyData) return;

      const policyLob = policyData?.policyLob?.[0];
      const policyRisk = policyLob?.policyRisk?.[0];
      const policyCustomer = policyData?.policyCustomer?.[0];
      setVehicleSequenceNo(policyRisk?.vehicleSequenceNo);
      let vehiclePayload;
      if(policyRisk?.vehicleSequenceNo)
        vehiclePayload = {
          ownerId: policyCustomer?.nationalId,
          sequenceNumber: policyRisk?.vehicleSequenceNo,
        };
      else if(policyRisk?.vehicleCustomID) {
        vehiclePayload = {
          modelYear: policyRisk?.manufactureYear,
          customCardNumber: policyRisk?.vehicleCustomID,
        };
      }

      let driverDetailsPayload;
      const driverData = policyRisk?.drivers;

      if (policyCustomer) {
        driverDetailsPayload = {
          driverId: policyCustomer?.nationalId,
          dob: policyCustomer?.nationalId?.startsWith("1") && policyCustomer?.dateOfBirthH ? getDateForDriverDetailApi(policyCustomer?.dateOfBirthH, true):getDateForDriverDetailApi(policyCustomer?.dateOfBirth, false) ,
          mainDriverInd: "Y", // main driver
          vehicleDefinitionType: policyRisk?.vehicleSequenceNo ? "1" : "2",
          vehicleId: policyRisk?.vehicleSequenceNo ?? policyRisk?.vehicleCustomID,
        };
      }


      try {

        if (Array.isArray(driverData) && driverData.length > 0) {
          const additionalDrivers = driverData?.filter((driver: DriverDetailsResponseData) => driver?.mainDriverInd === "N");
          if(additionalDrivers.length > 0) {
            setDriverDetailsResponseData(additionalDrivers?.map(
              (driver: DriverDetailsResponseData) => ({
                ...driver,
                driverIDType: driver?.driverIDType?.toString() ?? "0",
                nationality: driver?.nationality ?? "0",
                dateOfBirthH: driver?.dateofBirthH ?? "",
              }))
            );
          }
        }

        await getDriverDetails(driverDetailsPayload);
        getCountryCodes();
        if(vehiclePayload)
          await getVehicleDetails(vehiclePayload);

        if (policyRisk?.policyCoverage?.[0]?.coverageName) {
          setCoverageType(policyRisk?.policyCoverage[0]?.coverageName);
        }

        setOwnerDetailsResponseData({
          ...isRenewPolicyData?.ownerDetail,
          ownerId: policyCustomer?.nationalId ?? "",
          ownerFullNameEnglish: policyCustomer?.customerNameEnglish ?? "",
          ownerFullNameArabic: isRenewPolicyData?.ownerFullNameArabic ?? "",
          gender: isRenewPolicyData?.gender ?? "",
          nationality: isRenewPolicyData?.nationality ?? "",
          mobileNumber: isRenewPolicyData.mobileNumber ?? "",
          ownerDobH: policyCustomer?.dateOfBirthH ?? "",
          ownerDobG: policyCustomer?.dateOfBirth?.split("-")?.reverse()?.join("-") ?? "",
        });
      } catch (error) {
        console.error("API Call Error:", error);
      }
    },
   
    [
      isRenewPolicyData,
      getCountryCodes,
      getVehicleDetails,
      setVehicleDetailsResponseData,
      setVehicleDetails,
      setCoverageType,
      setRepairTypeSelected,
      setDriverDetailsResponseData,
      setOwnerDetailsResponseData,
      
      
    ]
  );
  const viewPolicyLoading= isVehicleDetailsLoading || isDriverDetailsLoading || isPolicyLoading;
  return { viewPolicyCall,isLoadingCalculatePremium,
    errorResponse,
    isAllError,
  viewPolicyLoading };
};

export default useViewPolicyCall;
