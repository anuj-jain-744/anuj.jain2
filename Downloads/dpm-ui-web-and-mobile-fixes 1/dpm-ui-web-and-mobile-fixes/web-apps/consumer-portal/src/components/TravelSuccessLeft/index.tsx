import "./style.scss";
import Line from "assets/SuccessPage/Line_new.svg";
import travelIcon from 'assets/DashboardBanner/newTravelIcon.svg';
import Home from "assets/Dashboard/Home.svg";
import Download from "assets/SuccessPage/Download.svg";
import Whatsapp from "assets/SuccessPage/Whatsapp.svg";
import Mail from "assets/SuccessPage/Mail.svg";
import Branch from "assets/SuccessPage/Branch.svg";
import FeedBack from "assets/SuccessPage/FeedBack.svg";
import travelinfo from "../../assets/QuoteAndBuy/flight-icon.png";
import { Card } from "react-bootstrap";
import ThemeButton from "../../Motor/Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { callAPI, getFullUrl, useApiCall } from "@dpm/shared-module";
import mockData from "../../Motor/SuccessPage/success.json";
import { formatDate } from "utils/formatDate";
import UserCard from "../../Motor/QuoteAndBuy/UserCard/UserCard";
import { LanguageData, TravelData } from "types/languageData";
import { sanitizeHtml } from "@dpm/shared-module";
import { issueApi } from "hook/travel/issuePolicyApi";
import { openPdfInNewTab } from 'utils/policyDocuments';
import { createPdf } from "hook/travel/createPdf";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import Share from "assets/Share/Sharesuccess.svg";
import { INTERNAL_SERVER_ERROR, SOMETHING_WENT_WRONG, TRAVEL_POLICY_TYPE, HOME } from "constant";
import { AlertBox } from "components/AlertBox";
import { useRef } from "react";
import { TRAVEL_COVERAGE_TYPE } from "../../constant";
import { PDFDataStructure, useDownloadPDF } from ".../../hook/common/useDownloadPdf";
import useZipFiles from "Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";
import { useTravelPolicyContext } from "components/hooks/useTravelPolicyContext";
import ContentBenefitsModal from "components/ContentBenefits";
interface FooterProps {
  footerMenus: {
    [key: string]: { menuUrl: string; linkName: string }[];
  };
}

interface TravelSuccessLeftProps {
  status: boolean;
  data: any;
  flag?: boolean;
}

function TravelSuccessLeft({ status, data, flag = false }: TravelSuccessLeftProps) {

  const today = new Date().toISOString();
  const todayDate = formatDate(today);
  const [headerData, setHeaderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { VITE_CONTENT_BASE_URI } = import.meta.env;
  const [policyNumber, setPolicyno] = useState<string>("");
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const { travellerType, travelStartDate, selectedPeriod, quoteDataResponse, travelcoverage, travelcoverageTypeCode } = useQuoteAndBuyContext();
  const { refundPolicy, reviewPolicy } = useTravelPolicyContext();
  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        endpoint === "header-menu"
          ? responseData?.menus
          : endpoint === "corporate-homepage"
            ? responseData?.data
            : responseData ?? {};
      setter(result);

    } catch (ex) {
      console.log(ex);
    }
  }; 

  const handlePDFDownload = () => {
    // Integrate url here and get the response
    // const response = await callAPI("post", urlRef.current, payloadRef.current) as any;
    downloadPDF(mockDataForPolicy);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  const [contactUsArray, setContactUsArray] = useState<any[]>([]);

  useEffect(() => {
    const contactUsArray = headerData?.filter((item) => item.linkName === "Contact Us")[0]?.childrens || [];
    setContactUsArray(contactUsArray);
  }, [headerData]);

  const callSupport = contactUsArray.length > 0 ? contactUsArray[0].link_content : "";
  const sanitizedContent = sanitizeHtml(callSupport);
  const WhatsappSupport = contactUsArray.length > 0 ? contactUsArray[1].linkName : "";
  const MailSupport = contactUsArray.length > 0 ? contactUsArray[2].linkName : "";
  const branchLocator = contactUsArray.length > 0 ? contactUsArray[3].linkName : "";
  const feedback = contactUsArray.length > 0 ? contactUsArray[4].linkName : "";

  const fetchref = useRef(true);
  const { getIssuePolicyDetails, isError, isLoading:issueLoading, issuePolicydata } = issueApi();
  useEffect(() => {
    try {
      if (fetchref.current) {
        getIssuePolicyDetails();
        fetchref.current = false;
      }
    } catch (error) {
      console.error("Issue API calls failed:", error);
    }
  }, []);

  useEffect(() => {
    setPolicyno(issuePolicydata?.policyNo);

    if (isError) {
      setApiErrorMessage({
        title: isError?.name || INTERNAL_SERVER_ERROR,
        description: isError.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [issuePolicydata, isError]);


  // policyDocument api call
  const { createZip } = useZipFiles();
  const { processPDFs, isProcessing } = useDownloadPDF(createZip);
  const allDocUrl = `/Dashboard/V1/Download/Policy/AllDoc?policyNo=${policyNumber}`
  const {
    makeApiCall: policyApiCall,
    isLoading,
    data: responseData,
  } = useApiCall<PDFDataStructure[], undefined>(11, allDocUrl, "post");

  const SuccessPolicyDownload = async () => {
    try {
      await policyApiCall();
    } catch (error) {
      console.error("Error policy", error);
    }
  };
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

    
  const TravelPeriod = selectedPeriod ? selectedPeriod.split(" ")[0] : ""

  const calculateEndDate = (startDate: Date, days: number): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const day = endDate.getDate().toString().padStart(2, '0');
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateForm = typeof travelStartDate === 'string' ? travelStartDate.split("/").reverse().join("-") : travelStartDate;
  const travelEndDate = travelStartDate ? calculateEndDate(new Date(dateForm as string | number | Date), parseInt(TravelPeriod)) : "";

  
  const formatTravelStartDate = (date: string | number | Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(date.split("/").reverse().join("-"))
      .toLocaleDateString('en-GB', options)
      .replace(/(\d{1,2}) (\w+) (\d{4})/, '$1 $2,$3');
    return formattedDate;
  };

  const formattedTravelStartDate = travelStartDate ? formatTravelStartDate(travelStartDate) : "";
  const formattedTravelEndDate = travelEndDate ? formatTravelStartDate(travelEndDate) : "";
  
  const handleClose = () => {
    setShowAlertModal(false);
  };

  const renderPriceTravel = () => {
    switch (travelcoverage) {

      case "worldwide":
        if (travelcoverageTypeCode === "1") {
          return {
            type: TRAVEL_COVERAGE_TYPE.type_one,

          };
        } else if (travelcoverageTypeCode === "2"){
          return {

            type: TRAVEL_COVERAGE_TYPE.type_two,

          
        } }else if (travelcoverageTypeCode === "3") {
          return {
          type: TRAVEL_COVERAGE_TYPE.type_seven,
        };
      }
      case "worldwideexceptusa&canada":
        if (travelcoverageTypeCode === "1") {
          return {

            type: TRAVEL_COVERAGE_TYPE.type_three,

          };
        } else if (travelcoverageTypeCode === "2") {
          return {

            type: TRAVEL_COVERAGE_TYPE.type_four,

          };
        }
      case "europe":
        if (travelcoverageTypeCode === "4") {
          return {

            type: TRAVEL_COVERAGE_TYPE.type_five,

          };
        } else if (travelcoverageTypeCode === "5") {
          return {

            type: TRAVEL_COVERAGE_TYPE.type_six,

          };
        }
      default:
        break
    }
  };

 const checkTraveller = reviewPolicy?.policyLob[0]?.typeOfCoverage && TRAVEL_POLICY_TYPE[reviewPolicy?.policyLob[0]?.typeOfCoverage]
  
  const SuccessPolicyCancellationCard = (<Card className="policy-cancel-card">
    <div className="header">
      <div className="logo">
        <div>
          {
            refundPolicy?.productCode === HOME ? 
            <img src={Home} className="product-logo" alt="Product-logo"/> : 
            <img src={travelIcon} className="product-logo" alt="Product-logo"/>
          }
        </div>
        <div>
          <div className="policy-cancel-number-heading walaa-regular-400">
            {data?.policy_number}
          </div>
          <div className="policy-cancel-number walaa-medium-500">{refundPolicy?.policyNumber.toLocaleUpperCase()}</div>
        </div>
      </div>
      <div className="policy-cancel-number-container">
      <div className="curved-blue-box">
            <div className="curved-blue-boxText walaa-regular-400">
              {refundPolicy?.productCode === HOME
              ? refundPolicy?.coverageType
              : `${checkTraveller} traveller`
              }
            </div>
          </div>
      </div>
    </div>
    <div className="body-content">
      <div className="top-table">
        <div className="box">
          <div className="box-content">
            <div className="package-content">
              <div className="package-heading walaa-regular-400">
                {data?.cancellation_date}
              </div>
              <div className="package-value walaa-medium-500">
                {todayDate}
              </div>
            </div>
            <div>
              <img src={Line} />
            </div>
            <div className="package-content">
              <div className="package-heading walaa-regular-400">
                {data?.policy_status}
              </div>
              <div className="package-value walaa-medium-500">{data?.cancelled}</div>
            </div>
            <div>
              <img src={Line} />
            </div>
            <div className="package-content">
              <div className="package-heading walaa-regular-400">
                {data?.refund_amount}
              </div>
              <div className="package-value walaa-medium-500">
                {data?.sar}{refundPolicy?.cancelRefund ? Math.abs(refundPolicy?.cancelRefund) : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-links">
        <div className="link-container">
          <div>
            <img src={Download} />
          </div>
          <div className="links-content walaa-regular-400">
            {data?.download_document}
          </div>
        </div>
      </div>
    </div>
    <div className="footer-note-container">
      <div className="footer-note">
        <div className="note walaa-medium-500">{data?.note}</div>
        <div className="note-content walaa-regular-400">
          {data?.success_note_cancel}
        </div>
      </div>
    </div>
  </Card>);
  const PolicySucessCard = (
    <Card className="policy-receipt-policy-cancellation">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      <div className="header">


        <div>
          <div className="policy-number-heading walaa-regular-400" data-testid="tr-popicy-no">
            {data?.policy_number}
          </div>
          <div className="policy-number walaa-medium-500">{policyNumber}</div>
          <div className="policy-number-heading walaa-regular-400">
            {data?.policy_period}
          </div>
          <div className="coverage-plan walaa-medium-500">{formattedTravelStartDate} - {formattedTravelEndDate}</div>
        </div>

        <div className="policy-number-container">
          <div className="policy-number-heading walaa-regular-400">
            {data?.premium_amount}
          </div>
          <div className="policy-number-price walaa-medium-500">
            {data?.sar} {quoteDataResponse?.premiumDue}
          </div>
          <div className="policy-number-heading walaa-regular-400">
            {data?.coverage_plan}
          </div>
          <div className="coverage-plan walaa-medium-500">{renderPriceTravel()?.type}</div>
        </div>

      </div>
      {status  &&
      <div className="space-usercard"><UserCard languageData={data as LanguageData | null} /></div>
      }
      <div className="body-content">
        <div className="top-table">
          <div className="box">
            <div className="box-content">
              <div>
                <img src={travelinfo} />
              </div>
              <div className="package-content">

                <div className="package-heading walaa-regular-400">
                  {data?.travellerType}
                </div>
                <div className="package-value walaa-medium-500">{travellerType.charAt(0).toUpperCase() + travellerType.slice(1)}</div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  {data?.no_of_travellers}
                </div>
                <div className="package-value walaa-medium-500">1 Traveller</div>
              </div>

            </div>
          </div>

          <div className="activeTagContainer">
            <div className="activeTagText walaa-regular-400">{data?.confirmed}</div>
          </div>

        </div>
        <div className="bottom-links">
          <div className="link-container">
            <div>
              <img src={Download} onClick={SuccessPolicyDownload} />
            </div>
            <div className="links-content walaa-regular-400">
              {data?.download_policy}
            </div>

            <div>
              <img src={Download} />
            </div>
            <div onClick={() => handlePDFDownload()} className="links-content walaa-regular-400">
              {data?.download_payment_receipt}
            </div>

            <div>
              <img src={Share} />
            </div>
            <div className="links-content walaa-regular-400">
              {data?.share}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-note-container">
        <div className="footer-note">
          <div className="note walaa-medium-500">{data?.note}</div>
          <div className="note-content walaa-regular-400">
            {data?.note_text}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="left-card-container-travel">
       {data && status ? PolicySucessCard : SuccessPolicyCancellationCard}
      <Card className="select-policy-left-card">
        <div className="select-policy">
          <div className="select-policy-header walaa-medium-500">
            {data?.get_in_touch}
          </div>
          <hr className="horizontal-line" />
          <div className="policy-list">
            <div className="policy-support">
              <div className="top">
                <div
                  className="contact-support"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedContent,
                  }}
                />
              </div>
              <div className="bottom">
                <div className="whatsapp-logo">
                  <img src={Whatsapp} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {WhatsappSupport}
                </div>
              </div>
            </div>
            <div className="contact">
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={Mail} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {MailSupport}
                </div>
              </div>
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={Branch} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {branchLocator}
                </div>
              </div>
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={FeedBack} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {feedback}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bottom-links walaa-medium-500">
        <div>
          <ThemeButton
            title={data?.explore_other_insurance_pr || ""}
            classes={"other-product"}
            variant="link"
          />
        </div>
        <div>
          <ThemeButton
            title={status ?  "Go to Dashboard" :"View My Dashboard"}
            classes={"endorsement-link"}
          />
        </div>
      </div>
    </div>
  );
}

export default TravelSuccessLeft;
