import "./style.scss";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { encryptData, useApiCall } from "@dpm/shared-module";
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
import { useNavigate, useParams } from "react-router-dom";
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
import { 
  PRODUCTSAPI, TRAVEL_TYPE, PRODUCTCODE_TRAVEL, PRODUCTCODE_MOTOR,
  NOT_AVAILABLE_TEXT,
  PRODUCTCODE_HOME,
  JAVA_API_ROUTES 
} from "constant";
import VehicleAndDriverDetails from "./VehicleAndDriverDetails";
import TravellerInfoSuccess from "./CommonComponent/TravelSection/TravellerInfoSuccess";
import HomeInfoSuccess from "./CommonComponent/HomeSection/HomeInfoSuccess";
import { getNoOfTravellers } from "utils/getCoverageDetails";

interface PolicyDetailsObj {
  policyNumber: string;
  vehicleDetails: {
    name: string;
    plateNumber: string;
    vehicleSequenceNo: string;
    chassisNo: string;
    manufactureYear: number;
  };
  refundValue: string;
}

function LeftSuccess({
  data,
  status,
  setLoading,
  loading,
  isCancelSuccess,
  claimData,
  langData,
}: Readonly<{
  data: PolicyDetailsObj;
  loading?: boolean;
  status: boolean;
  setLoading: (val: boolean) => void;
  isCancelSuccess: boolean;
  claimData?: { [key: string]: unknown };
  langData: LanguageData;
}>) {
  const { transactionid, productname } = useParams<{
    transactionid: string;
    productname: string;
  }>();
  const navigate = useNavigate();
  const processData = processTransactionId(transactionid ?? "");
  const [uniqueKey, setUniqueKey] = useState<string | undefined>(undefined);
  const [policyNum, setPolicyNum] = useState<string | undefined>("");
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [makeModelResponse, setMakeModelResponse] = useState<
    { model: string; image: string }[]
  >([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [feedbackpopup, setFeedbackpopup] = useState<boolean>(true);
  const handleClose = () => setFeedbackpopup(false);

  const { makeApiCall: resetRedisKey } = useApiCall(6, JAVA_API_ROUTES?.redisSetValue, "post");
  // language data api call
  const { makeApiCall, data: cmsData } = useApiCall<
    { config: LanguageData[]; motor_makes: { model: string; image: string }[] },
    unknown
  >(1, "consumerportal-config", "get");

  const fetchData = async () => {
    await makeApiCall();
  };

  // policyDocument api call
  const { createZip } = useZipFiles();
  const { processPDFs } = useDownloadPDF(createZip);

  const { makeApiCall: cmsPaymentApiCall, data: paymentLang } = useApiCall<
    {
      config: CmsPayment;
    },
    unknown
  >(1, "payment-config", "get");
  // issue policy api call
  const {
    makeApiCall: verifyAndIssueApiCall,
    data: issuePolicyData,
    isLoading,
    errors,
  } = useApiCall(5, "Payment/VerifyAndIssue", "post");

  const productsInfo = PRODUCTSAPI[processData.productCode] || {}; // get product APIs based on product code

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

  // get product labels like Motor, Home and Travel based on product code (01,02,03) 
  const productCodeLabel = paymentLang?.config?.productCodeMapping[processData?.productCode] || "Motor";

  // veiwpolicy api call
  const {
    makeApiCall: reviewPolicyApiCall,
    data: reviewPolicyData,
    isLoading: policyLoading,
  } = useApiCall(productsInfo?.viewPolicyNo, productsInfo?.viewPolicyAPI, "post");

  const reviewPolicyDetails = usePolicyData(reviewPolicyData, processData?.productCode);
  const policyData = reviewPolicyDetails?.successPageData ?? undefined;
  // used for displaying travel related data
  const { familyIndividual, typeOfCoverage } = reviewPolicyData !== null && reviewPolicyData?.policyLob !== undefined && reviewPolicyData?.policyLob[0];

  const travellerTypeReceived = familyIndividual !== undefined ? TRAVEL_TYPE[familyIndividual] : '';
  const numOfTravellers = getNoOfTravellers(reviewPolicyData?.policyLob);

  useEffect(() => {
    if (policyNum) {
      const fetchData = async () => {
        const viewPolicyData = {
          apiSource: "Portal",
          policyNo: policyNum,
          endorsementNo: "",
          isLatestSnapshot: "N"
        }
        await reviewPolicyApiCall(viewPolicyData);
      };
      fetchData();
    }
  }, [reviewPolicyApiCall, policyNum]);

  const handleDownloadPolicy = async () => {
    try {
      await policyApiCall();
    } catch (error) {
      console.error("Error policy", error);
    }
  };

  const fetch = async () => {
    try {
      const payload = {
        merchantID: paymentLang?.config?.MerchantID,
        messageID: paymentLang?.config?.MessageID?.enquiry_payment,
        version: paymentLang?.config?.Version[0], //"2.0",
        secureHash: "",
        originalTransactionID: transactionid,
        requestReferenceNumber:
          quoteData?.model?.policyBasic?.requestReferenceNo,
        platform: paymentLang?.config?.platform,
        amount: quoteData?.model?.policyBasic?.premiumInfo?.premiumDue + "",
        currencyISOCode: paymentLang?.config?.CurrencyISOCode?.sar,
        nationalID: quoteData?.model?.policyCustomer[0]?.nationalId,
      };
      const combineData = `${atob(
        paymentLang?.config?.directPayAuthenticationToken ?? ""
      )}${payload.merchantID}${payload.messageID}${payload.originalTransactionID
        }${payload.version}`;
      payload.secureHash = encryptData(combineData);

      await verifyAndIssueApiCall(payload);
    } catch (error) {
      console?.error("Error Issue policy", error);
    }
  };

  useEffect(() => {
    if (quoteData && paymentLang) {
      fetch();
    }
  }, [quoteData, paymentLang]);

  useEffect(() => {
    if (issuePolicyData) {
      setPolicyNum(issuePolicyData?.model?.policyNo);
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

  useEffect(() => {
    cmsPaymentApiCall();
    fetchData();
  }, []);

  useEffect(() => {
    if (cmsData && cmsData?.config?.length > 0) {
      setLanguageData(cmsData?.config[0]);
      setMakeModelResponse(cmsData?.motor_makes);
    }
  }, [cmsData]);

  useEffect(() => {
    setLoading(isLoading || quoteLoading || policyLoading);
  }, [isLoading, quoteLoading, policyLoading, setLoading]);

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
  const dateVal = new Date(policyData?.expiryDate ?? "");
  dateVal.setDate(dateVal.getDate() - 1);
  const policyPeriod =
    formatDate(policyData?.startDate) +
    " - " +
    formatDate(dateVal.toLocaleString());

  useEffect(() => {
    if (processData.quotationNo) {
      let quoteData = { quotationNo: processData.quotationNo };
      if (processData.productCode === PRODUCTCODE_HOME) {
        // for HOME use cases
        quoteData["apiSource"] = "Portal";
      }
      getQuoteData(quoteData);
    }
  }, [processData.quotationNo]);

  useEffect(() => {
    if (errors) {
      setShowAlertModal(true);
    }
  }, [errors]);

  useEffect(() => {
    if (policyData && productname && uniqueKey === undefined) {
      const uniqueKeys =
        policyData?.nationalityId.toString() +
        policyData?.mobileNo.toString() +
        productname;
      setUniqueKey(uniqueKeys);
      resetRedisKey({ key: uniqueKeys, value: null }, true);
    }
  }, [policyData, productname, uniqueKey]);

  const handleNavigate = () => {
    navigate("/track-claim");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
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
            <RegisterClaimCard claimData={claimData} langData={langData} />
          ) : data?.isAddon === true ? (
            <VehicleAndDriverDetails langData={langData} data={data} />
          ) : (
            policyNum &&
            !isCancelSuccess &&
            languageData && (
              <div className="policy-container-left">
                <PolicyDetails
                  languageData={languageData}
                  policyNum={policyNum}
                  policyData={policyData}
                  policyPeriod={policyPeriod}
                  planDetails={reviewPolicyDetails}
                />

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
                  onClickhandler={handleNavigate}
                  dataTestId='track-id'
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
                      ? languageData?.view_my_dashboard
                      : languageData?.go_to_dashboard) ?? ""
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
              {languageData?.how_feel ?? ""}
            </Modal.Header>
            <Modal.Body>
              {languageData !== null && <DataContext.Provider value={languageData}>
                <Feedback
                  url={`/${productCodeLabel || Motor}/Claim/V1/SubmitFeedback`}
                  feedbackData={{ ownerId: policyData?.nationalityId ?? claimData?.claimsInfo?.ownerId }}
                  feedbackType={true}
                  hideHeader={true}
                  handleClose={handleClose}
                />
              </DataContext.Provider>}
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
}

export default LeftSuccess;
