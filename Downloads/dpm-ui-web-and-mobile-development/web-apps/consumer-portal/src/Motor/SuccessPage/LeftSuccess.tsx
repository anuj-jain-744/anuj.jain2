import "./style.scss";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { encryptData, useApiCall ,useCommonContext, RootState} from "@dpm/shared-module";
import { PDFDataStructure, useDownloadPDF } from "hook/common/useDownloadPdf";
import useZipFiles from "Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import {
  getRegistrationNumber,
  getRepairType,
  formatDate,
} from "utils/quoteAndBuy";
import PolicyDetails from "./CommonComponent/PolicyDetails";
import UserCard from "./CommonComponent/UserCard";
import VehicleInfo from "./CommonComponent/VehicleInfo";
import ActionLinks from "./CommonComponent/ActionLinks";
import ContactCard from "./CommonComponent/ContactCard";
import { useParams } from "react-router-dom";
import { processTransactionId } from "utils/paymentUtils";
import { LanguageData } from "types/languageData";
import { CmsPayment } from "components/PaymentOptions/types/cmsPayment";
import { ViewQuotePayload, ViewQuoteResponse } from "types/viewQuote";
import { AlertBox } from "components/AlertBox";
import Feedback from "components/Feedback";
import { Modal } from "react-bootstrap";
import { DataContext } from "DataContext";
import CancelSuccessLeft from "./CancelSuccessLeft";
import RegisterClaimCard from "./registerClaimCard";
import feedbackicon from "../../assets/Feedback/feedbackicon.svg";
import {
  PRODUCTSAPI,
  TRAVEL_TYPE,
  PRODUCTCODE_TRAVEL,
  PRODUCTCODE_MOTOR,
  NOT_AVAILABLE_TEXT,
  PRODUCTCODE_HOME,
  JAVA_API_ROUTES,
  PORTAL,
  PRODUCTS_INDENTIFIERS,
  Motor,
} from "constant";
import VehicleAndDriverDetails from "./VehicleAndDriverDetails";
import TravellerInfoSuccess from "./CommonComponent/TravelSection/TravellerInfoSuccess";
import HomeInfoSuccess from "./CommonComponent/HomeSection/HomeInfoSuccess";
import Endorsement from "./CommonComponent/Endorsement";
import { getNoOfTravellers } from "utils/getCoverageDetails";
import { AddBenefitprops } from "types/AddBenefit";
import { RedisDataResponse } from "components/PaymentOptions/types/providerPayment";
import { Login } from "@corporate-portal/components/Login/index";
import {useSelector} from 'react-redux'
import { PolicyDetailsObj } from "types/policyDetails";
import StopRefreshBackButton from "components/StopRefreshBackButton";


function LeftSuccess({
  data,
  status,
  setLoading,
  loading,
  isCancelSuccess,
  claimData,
  langData,
  paymentLang,
  setEndoPolicyNo,
  setDriverBenefit,
  handleNavigate
}: Readonly<{
  data: PolicyDetailsObj | null;
  loading?: boolean;
  status: boolean;
  setLoading: (val: boolean) => void;
  isCancelSuccess: boolean;
  claimData?: {
    claimNo?: string;
    claimsInfo?: {
      refNo?: string;
      ownerId?: string;
    };
  };
  langData: LanguageData;
  setEndoPolicyNo?: (val: string) => void;
  setDriverBenefit?: (val: string) => void;
  paymentLang: {
    config: CmsPayment;
  };
  handleNavigate?: (url: string )=> void;
}>) {
  const { transactionid } = useParams<{
    transactionid: string;
  }>();
  const [isVerifyApicalled, setIsVerifyApiCalled] = useState<boolean>(false)

  const { triggerLogin, setTriggerLogin }= useCommonContext();
  const processData = processTransactionId(transactionid ?? "");
  const [uniqueKey, setUniqueKey] = useState<string | undefined>(undefined);
  const [policyNum, setPolicyNum] = useState<string | undefined>("");
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [makeModelResponse, setMakeModelResponse] = useState<
    { model: string; image: string }[]
  >([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [feedbackpopup, setFeedbackpopup] = useState<boolean>(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const handleClose = () => setFeedbackpopup(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  
  let isEndosementPolicy = false;
  let paymentVerifyAPI = "Payment/VerifyAndIssue";
  if (processData?.endrosmentNo) {
    isEndosementPolicy = true;
    paymentVerifyAPI = "Payment/VerifyAndDirectIssue";
  }
  const {
    makeApiCall: getEndorsementFromRedisKey,
    data: endorsementRedisData,
  } = useApiCall<{ key: string }, RedisDataResponse>(
    6,
    `${JAVA_API_ROUTES?.redisGetValue}/${processData?.endrosmentNo}`,
    "get"
  );

  const { makeApiCall: resetRedisKey } = useApiCall(
    6,
    JAVA_API_ROUTES?.redisSetValue,
    "post"
  );

  // language data api call
  const { makeApiCall, data: cmsData } = useApiCall<
    { config: LanguageData[]; motor_makes: { model: string; image: string }[] },
    unknown
  >(1, "consumerportal-config", "get");

  // call the function to get language data for consumer portal
  const fetchData = async () => {
    await makeApiCall();
  };

  // policyDocument api call
  const { createZip } = useZipFiles();
  const { processPDFs } = useDownloadPDF(createZip);

  // issue policy api call
  const {
    makeApiCall: verifyAndIssueApiCall,
    data: issuePolicyData,
    isLoading,
    errors,
  } = useApiCall(5, paymentVerifyAPI, "post");

  const productsInfo = PRODUCTSAPI[processData.productCode] || {}; // get product APIs based on product code
  
  
  
  // Call the API by quotation number for product and get the quotation based information
  const {
    makeApiCall: getQuoteData,
    data: quoteData,
    isLoading: quoteLoading,
  } = useApiCall<ViewQuoteResponse, ViewQuotePayload>(
    productsInfo?.viewQuoteNo,
    productsInfo?.viewQuoteAPI,
    "post"
  );

  const allDocUrl = `/Dashboard/V1/Download/Policy/AllDoc?policyNo=${policyNum}`;
  const { makeApiCall: policyApiCall, data: responseData } = useApiCall<
    PDFDataStructure[],
    undefined
  >(11, allDocUrl, "post");

  // get product name like RMTPL, HOME AND TRVL based on prduct code (01,02,03)
  const productName = PRODUCTS_INDENTIFIERS[processData?.productCode as keyof typeof PRODUCTS_INDENTIFIERS];

  // get product's policy information using quotation data
  const reviewPolicyDetails = usePolicyData(
    quoteData?.model,
    processData?.productCode
  );
  const policyData = reviewPolicyDetails?.successPageData ?? undefined;
  // used for displaying travel related data
  const { familyIndividual } =
    quoteData !== null &&
    quoteData?.model?.policyLob !== undefined &&
    quoteData?.model?.policyLob[0];

  const travellerTypeReceived =
    familyIndividual !== undefined ? TRAVEL_TYPE[familyIndividual] : "";
  const numOfTravellers = getNoOfTravellers(quoteData?.model?.policyLob);
  setDriverBenefit && setDriverBenefit(endorsementRedisData?.driversPremiumData);
  const handleDownloadPolicy = async () => {
    try {
      await policyApiCall();
    } catch (error) {
      console.error("Error policy", error);
    }
  };

  // make the payload request for payment verify issue API
  const fetch = async () => {
    setIsVerifyApiCalled(true);
    try {
      let payload = {
        merchantID: paymentLang?.config?.MerchantID,
        messageID: paymentLang?.config?.MessageID?.enquiry_payment,
        version: paymentLang?.config?.Version[0], //"2.0",
        secureHash: "",
        platform: paymentLang?.config?.platform,
        currencyISOCode: paymentLang?.config?.CurrencyISOCode?.sar,
        originalTransactionID: transactionid,
      };

      let paymentVerifyRequest = {};
      if (!isEndosementPolicy) {
        // for non endorsement API request
        paymentVerifyRequest = {
          requestReferenceNumber:
            quoteData?.model?.policyBasic?.requestReferenceNo,
          amount: quoteData?.model?.policyBasic?.premiumInfo?.premiumDue + "",
          nationalID: quoteData?.model?.policyCustomer[0]?.nationalId,
        };
      } else {
        paymentVerifyRequest = {
          requestReferenceNumber: processData?.endrosmentNo,
          amount: endorsementRedisData?.totalAmount,
          policyNo: endorsementRedisData?.policyNo,
          endoEffectiveDate: endorsementRedisData?.endoEffectiveDate,
          nationalID: endorsementRedisData?.nationalId,
        };
      }

      let motorData = {};
      if (
        processData.productCode === PRODUCTCODE_MOTOR &&
        endorsementRedisData &&
        isEndosementPolicy
      ) {
        motorData = {
          amount: parseFloat(
            endorsementRedisData?.totalAmount?.totalAmount ?? 0 + ""
          )?.toFixed(2),
        };
      }
      if (
        processData.productCode === PRODUCTCODE_MOTOR &&
        endorsementRedisData?.benefitsPremiumData
      ) {
        motorData = {
          ...motorData,
          vehicles: [
            {
              sequenceNo: endorsementRedisData?.vehicleSequenceNo,
              benefits: endorsementRedisData?.benefitsPremiumData?.map(
                (val: AddBenefitprops) => {
                  return {
                    benefitId: val?.benefitId,
                  };
                }
              ),
            },
          ],
        };
      }
      if(processData.productCode === "03" && endorsementRedisData?.benefitsPremiumData) {
        motorData = {
          ...motorData,
          vehicles: [ // As per api team shared we used name as vehicles and for travel, most of the endorsement api is not integrated so used static data 
            {
              sequenceNo: 101928603,
              benefits: [
                {
                  benefitId: 114946564
                }
              ]
            }
          ]
        }
      }
      payload = { ...payload, ...paymentVerifyRequest, ...motorData };
      const combineData = `${atob(
        paymentLang?.config?.directPayAuthenticationToken ?? ""
      )}${payload.merchantID}${payload.messageID}${
        payload.originalTransactionID
      }${payload.version}`;
      payload.secureHash = encryptData(combineData);

      await verifyAndIssueApiCall(payload);
    } catch (error) {
      console?.error("Error Issue policy", error);
    }
  };

  // calling the function to proceed the payment for non endorsement
  useEffect(() => {
    if (quoteData && paymentLang && !isEndosementPolicy) {
      fetch();
    }
  }, [quoteData, paymentLang]);

  // calling the function to proceed the payment for endorsement
  useEffect(() => {
    if (endorsementRedisData && !isVerifyApicalled) {
      fetch();
    }
  }, [endorsementRedisData, isVerifyApicalled]);

  // set the policy number after getting payment success from payment and verfiy API
  useEffect(() => {
    if (issuePolicyData) {
      setPolicyNum(issuePolicyData?.model?.policyNo);
      setEndoPolicyNo && setEndoPolicyNo(endorsementRedisData?.policyNo);
    }
  }, [issuePolicyData]);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        if (responseData) {
          // Then process and download them
          await processPDFs(responseData, {
            format: "zip",
            zipFileName: "policyDocuments.zip",
            autoDownload: true,
          });
        }
      } catch (error) {
        console.error("An error occurred while fetching the data", error);
      }
    };

    fetchPdf();
  }, [responseData]);

  // call the effect at once to get the langauge date for consumer portal
  useEffect(() => {
    fetchData();
  }, []);

  // set the CMS data from consumer portal config API
  useEffect(() => {
    if (cmsData && cmsData?.config?.length > 0) {
      setLanguageData(cmsData?.config[0]);
      setMakeModelResponse(cmsData?.motor_makes);
    }
  }, [cmsData]);

  useEffect(() => {
    setLoading(isLoading || quoteLoading);
  }, [isLoading, quoteLoading, setLoading]);

  const repairCondition =
    policyData?.repairCondition &&
    getRepairType(parseInt(policyData?.repairCondition));

  const plateNumber =
    policyData?.registrationPlateNo &&
    policyData?.registrationPlateNo !== NOT_AVAILABLE_TEXT
      ? getRegistrationNumber(
          policyData?.registrationPlateNo,
          policyData?.registrationPlateText1 ?? "",
          policyData?.registrationPlateText2 ?? "",
          policyData?.registrationPlateText3 ?? ""
        )
      : NOT_AVAILABLE_TEXT;
      
  const extractDate = (date: string | undefined) => {
    const dateArr = date?.split("T")[0]?.split("-");
    return (
      dateArr &&
      dateArr[2] + " " + langData?.month[Number(dateArr[1]) - 1] + " " + dateArr[0]
    );
  };

  const policyPeriod = policyData?.startDate && policyData?.expiryDate && langData
    ? processData.productCode === PRODUCTCODE_TRAVEL
      ? formatDate(policyData?.startDate, langData) +
        " - " +
        formatDate(policyData?.expiryDate, langData)
      : extractDate(policyData?.startDate) +
        " - " +
        extractDate(policyData?.expiryDate)
    : "";

  // set the product information get from view quote API related to products
  useEffect(() => {
    if (processData?.quotationNo && !isEndosementPolicy) {
      const quoteData: { quotationNo: string; apiSource?: string } = {
        quotationNo: processData?.quotationNo,
      };
      if (processData.productCode === PRODUCTCODE_HOME) {
        // for HOME use cases
        quoteData.apiSource = PORTAL;
      }
      getQuoteData(quoteData);
    }
  }, [processData?.quotationNo, isEndosementPolicy]);

  // get the policy endorsement date from redis cache API
  useEffect(() => {
    if (processData?.endrosmentNo) {
      getEndorsementFromRedisKey();
    }
  }, [processData?.endrosmentNo]);

  useEffect(() => {
    if (errors) {
      setShowAlertModal(true);
    }
  }, [errors]);

  // call the redis cache API to reset the whole data as empty after policy creation
  useEffect(() => {
    if (
      policyData &&
      issuePolicyData &&
      productName &&
      uniqueKey === undefined
    ) {
      const uniqueKeys =
        policyData?.nationalityId.toString() +
        policyData?.mobileNo.toString() +
        productName;
      setUniqueKey(uniqueKeys);
      // resetRedisKey({ key: uniqueKeys, value: "" });
    }
  }, [policyData, issuePolicyData, productName, uniqueKey]);

  // call the redis cache API to reset the whole data as empty when endorsement policy created
  useEffect(() => {
    if (isEndosementPolicy && issuePolicyData && uniqueKey === undefined && processData?.endrosmentNo) {
      setUniqueKey(processData?.endrosmentNo);
      resetRedisKey({ key: processData?.endrosmentNo, value: "" });
    }
  }, [isEndosementPolicy, issuePolicyData, uniqueKey]);


  const handleClaimNavigate = () => {
    handleNavigate && handleNavigate("/track-claim");
  };

  const handleDashboard = async () => {
    
    if (isAuthenticated) {
      handleNavigate && handleNavigate("/Dashboard");
    } else {
      await setTriggerLogin(true);
      handleNavigate && await handleNavigate("/login");
    }
  };

  const handleRefresh = () => {
    sessionStorage.setItem("isRefresh", "1");
  }
  return (
    <>
    <StopRefreshBackButton handleRefresh={handleRefresh} />
      {!loading && (
        <div className="left-card-container">
          {isCancelSuccess && (
            <CancelSuccessLeft
              isCancelSuccess={isCancelSuccess}
              policyData={data}
            />
          )}
          <AlertBox
            title={"Payment"}
            description={errors?.messages?.message_en}
            showAlertModal={showAlertModal}
            setShowAlertModal={() => setShowAlertModal(false)}
          />
          {claimData ? (
            <RegisterClaimCard claimData={claimData} langData={languageData} />
          ) : data?.isAddon === true ? (
            <VehicleAndDriverDetails langData={langData} data={data} />
          ) : (
            !policyNum &&
            !isCancelSuccess &&
            languageData && (
              <div className="policy-container-left">
                <PolicyDetails
                  languageData={languageData}
                  policyNum={policyNum}
                  policyData={policyData}
                  policyPeriod={policyPeriod}
                  planDetails={reviewPolicyDetails}
                  isEndosementPolicy={isEndosementPolicy}
                />
                {isEndosementPolicy ? (
                  <div className="vehicle-info-container">
                    <Endorsement
                      endorsementData={endorsementRedisData}
                      languageData={languageData}
                    />
                  </div>
                ) : (
                  <>
                    <div className="policy-card-container-parent">
                      <div className="policy-card-details">
                        <div className="policy-cards">
                          {policyData && (
                            <UserCard
                              policyData={policyData}
                              languageData={languageData}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="vehicle-info-container">
                      {processData.productCode === PRODUCTCODE_MOTOR && (
                        <VehicleInfo
                          policyData={policyData}
                          languageData={languageData}
                          plateNumber={plateNumber}
                          repairCondition={repairCondition}
                          makeModelResponse={makeModelResponse}
                        />
                      )}
                      {processData.productCode === PRODUCTCODE_TRAVEL && (
                        <TravellerInfoSuccess
                          travellerType={travellerTypeReceived}
                          noOfTravellers={numOfTravellers}
                          languageData={languageData}
                        />
                      )}
                      {processData.productCode === PRODUCTCODE_HOME && (
                        <HomeInfoSuccess
                          policyData={reviewPolicyDetails}
                          languageData={languageData}
                        />
                      )}
                      <ActionLinks
                        languageData={languageData}
                        handleDownloadPolicy={handleDownloadPolicy}
                      />
                    </div>
                  </>
                )}
              </div>
            )
          )}

          <ContactCard />

          {claimData ? (
            <div className="bottom-links walaa-medium-500">
              <div>
                <ThemeButton
                  title={languageData?.track_your_claim ?? ""}
                  classes="other-product"
                  variant="link"
                  onClickhandler={handleClaimNavigate}
                  dataTestId="track-id"
                />
              </div>
            </div>
          ) : (
            <div className="bottom-links walaa-medium-500">
              <div>
                <ThemeButton
                  title={languageData?.explore_other_insurance_pr ?? ""}
                  classes="other-product"
                  variant="link"
                />
              </div>
              <div>
                <ThemeButton
                  title={
                    (status
                      ? languageData?.go_to_dashboard
                      : languageData?.view_my_dashboard) ?? ""
                  }
                  classes="endorsement-link"
                  onClickhandler={handleDashboard}
                />
              </div>
            </div>
          )}

          <Modal
            show={feedbackpopup}
            onHide={handleClose}
            className="modal-feedback"
          >
            <Modal.Header className="motor-modal-header" closeButton>
              {isSliderOpen ? (
                <div className="feedback-heading">
                  <img src={feedbackicon} alt="feedbackicon" />{" "}
                  {languageData?.feedback_heading ?? ""}
                </div>
              ) : (
                <div className="how-head">{languageData?.how_feel ?? ""}</div>
              )}
            </Modal.Header>
            <Modal.Body>
              {languageData !== null && (
                <DataContext.Provider value={languageData}>
                  <Feedback
                    url="/Motor/Claim/V1/SubmitFeedback"
                    feedbackData={{
                      ownerId:
                        policyData?.nationalityId ??
                        claimData?.claimsInfo?.ownerId ?? "",
                    }}
                    feedbackType={true}
                    hideHeader={true}
                    handleClose={handleClose}
                    onSliderOpen={setIsSliderOpen}
                  />
                </DataContext.Provider>
              )}
            </Modal.Body>
          </Modal>
          {triggerLogin && (
                    <Login
                      showModalStatus={triggerLogin}
                      ShowLoginModalStatus={setTriggerLogin}
                      navigateTo={handleNavigate}
                    />
                  )}
        </div>
      )}
    </>
  );
}

export default LeftSuccess;
