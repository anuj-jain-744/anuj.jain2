import React, { useState } from "react";
import "./MyRequest.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import MotorLogo from "assets/Dashboard/MOTOR_MyRequest.svg";
import TravelLogo from "assets/Dashboard/Travel_MyRequest.svg";
import Warning from "assets/Dashboard/Warning Fill.svg";
import Up from "assets/Dashboard/Chevron Up.svg";
import Down from "assets/Dashboard/Chevron Down.svg";
import Right from "assets/Dashboard/Arrow_Right.svg";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { LOADING, NO_REQUEST_FOUND, ERROR_LOADING_REQUESTS, NA, PaymentUrl } from 'constant';
import { useNavigate } from 'react-router-dom';
import { getProductCode } from "utils/fileUtil";


const productIcons: { [key: string]: string } = {
  "TRVL": TravelLogo,
  "RCOM": MotorLogo,
};

interface MyRequestProps {
  // Define the props for your component here
}

interface QuoteData {
  nationalID: string;
  productCode: string;
  quoteNo: string;
  quoteStatus: string;
  issueDate: string;
}

interface RequestCardProps {
  isOpen: boolean;
  toggleAccordion: () => void;
  dashbaordLanguageData: LanguageData;
  quoteData: QuoteData;
}

const REQUEST_TYPES = {
  ALL: "all",
  CLAIM: "claim",
  ENQUIRY: "enquiry",
  APPROVAL: "approval",
  CANCELLATION: "cancellation",
  QUOTATION: "quotation",
  ENDORSEMENT: "endorsement",
};

const getRequestType = (quoteData) => {
  return "Quotation";
};

const getStatusInfo = (quoteStatus: string) => {
  return {
    icon: Warning,
    text: quoteStatus || "Open",
  };
};

const RequestCard: React.FC<RequestCardProps> = ({
  isOpen,
  toggleAccordion,
  dashbaordLanguageData,
  quoteData,
}) => {
  const productIcon = productIcons[quoteData.productCode] || MotorLogo; // Default to MotorLogo if no match
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    const code = getProductCode(quoteData.productCode);
    navigate(PaymentUrl + quoteData.quoteNo + "_" + code);
  };

  return (
    <div className={`main-card ${isOpen ? "open-background" : ""}`}>
      <div className="inner-card">
        <div className="logo-inner-card">
          <img src={productIcon} alt="Product Icon" />
        </div>
        <div className="content-inner-card">
          <div className="label-value">
            <div className="label walaa-regular-400">{dashbaordLanguageData?.request_id}</div>
            <div className="value walaa-medium-500">{quoteData.quoteNo}</div>
          </div>
          <div className="label-value">
            <div className="label walaa-regular-400">{dashbaordLanguageData?.request_type}</div>
            <div className="value walaa-medium-500">{getRequestType(quoteData)}</div>
          </div>
          <div className="label-status">
            <div className="label walaa-regular-400">{dashbaordLanguageData?.status}</div>
            <div className="logo-value walaa-medium-500">
              <div>
                <img src={getStatusInfo(quoteData.quoteStatus).icon} />
              </div>
              <div>{getStatusInfo(quoteData.quoteStatus).text}</div>
            </div>
          </div>
          <div className="link-accordion">
            <div className="track-links walaa-medium-500">
              <div className="" onClick={handleNavigate}>{dashbaordLanguageData?.pay}</div>
              <div className="">
                <img src={Right} />
              </div>
            </div>
            <div className="accordion-inner-card">
              {!isOpen ? (
                <img
                  src={Down}
                  onClick={toggleAccordion}
                  alt="Toggle Down Accordion"
                />
              ) : (
                <img
                  src={Up}
                  onClick={toggleAccordion}
                  alt="Toggle Up Accordion"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="accordion-content">
          <div className="left-part">
            <div className="left-label walaa-regular-400">{dashbaordLanguageData?.description}</div>
            <div className="left-value walaa-medium-500">{quoteData.productCode || NA}</div>
          </div>
          <div className="right-part">
            <div className="right-label walaa-regular-400">{dashbaordLanguageData?.reference_id}</div>
            <div className="right-value walaa-medium-500">{quoteData.nationalID || "-"}</div>
          </div>
        </div>
      )}
      <hr
        className={` ${isOpen ? "card-horizontal-line-open" : "card-horizontal-line"} `}
      />
      {isOpen && (
        <div className="date-updated">
          <div className="last-updated">{dashbaordLanguageData?.last_updated_on}: </div>
          <div className="date-value"> 
            {quoteData.issueDate 
              ? new Date(quoteData.issueDate).toLocaleDateString('en-GB') 
              : "N/A"} 
          </div>
        </div>
      )}
    </div>
  );
};

const MyRequest: React.FC<MyRequestProps> = () => {
  const { quotes, isLoading, error } = useSelector((state: RootState) => state.queryQuote);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(REQUEST_TYPES.ALL);
  
  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter quotes based on the selected tab
  const filteredQuotes = React.useMemo(() => {
    if (!quotes || quotes.length === 0) {
      return [];
    }

    if (activeTab === REQUEST_TYPES.ALL) {
      return quotes;
    }

    if (activeTab === REQUEST_TYPES.QUOTATION) {
      return quotes;
    }
    return [];
  }, [quotes, activeTab]);

  const handleTabClick = (tabType: string) => {
    setActiveTab(tabType);
    setOpenIndex(null); // Close any open accordions when changing tabs
  };

  const isTabDisabled = (tabType) => {
    if (activeTab === REQUEST_TYPES.ALL) {
      return false;
    }
    // if (activeTab === REQUEST_TYPES.QUOTATION && tabType !== REQUEST_TYPES.QUOTATION && tabType !== REQUEST_TYPES.ALL) {
    //   return true;
    // }
    return false;
  };

  return (
    <div className="my-request-container">
      <div className="my-request-header">
        <div className="my-request-heading walaa-medium-500">
          {languageData?.my_request} ({filteredQuotes.length})
        </div>
        <hr className="horizon" />
        <div className="my-request-tabs">
          <div className="single-tab">
            <ThemeButton 
              title={languageData?.all} 
              variant={activeTab === REQUEST_TYPES.ALL ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.ALL)}
              isDisabled ={isTabDisabled(REQUEST_TYPES.ALL)}
            />
            <ThemeButton 
              title={languageData?.claim} 
              variant={activeTab === REQUEST_TYPES.CLAIM ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.CLAIM)}
              isDisabled={isTabDisabled(REQUEST_TYPES.CLAIM)}
            />
            <ThemeButton 
              title={languageData?.enquiry} 
              variant={activeTab === REQUEST_TYPES.ENQUIRY ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.ENQUIRY)}
              isDisabled={isTabDisabled(REQUEST_TYPES.ENQUIRY)}
            />
            <ThemeButton 
              title={languageData?.approval} 
              variant={activeTab === REQUEST_TYPES.APPROVAL ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.APPROVAL)}
              isDisabled={isTabDisabled(REQUEST_TYPES.APPROVAL)}
            />
            <ThemeButton 
              title={languageData?.cancellation} 
              variant={activeTab === REQUEST_TYPES.CANCELLATION ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.CANCELLATION)}
              isDisabled={isTabDisabled(REQUEST_TYPES.CANCELLATION)}
            />
            <ThemeButton 
              title={languageData?.quotation} 
              variant={activeTab === REQUEST_TYPES.QUOTATION ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.QUOTATION)}
              isDisabled={isTabDisabled(REQUEST_TYPES.QUOTATION)}
            />
            <ThemeButton 
              title={languageData?.endorsement} 
              variant={activeTab === REQUEST_TYPES.ENDORSEMENT ? "policyLink" : "outline"}
              onClickhandler = {() => handleTabClick(REQUEST_TYPES.ENDORSEMENT)}
              isDisabled={isTabDisabled(REQUEST_TYPES.ENDORSEMENT)}
            />
            <div className="tab-btns"></div>
          </div>
        </div>
      </div>
      <div className="my-request-body">
        <div className="dropdown-cards">
          {isLoading ? (
            <div>{LOADING}</div>
          ) : error ? (
            <div>{ERROR_LOADING_REQUESTS}</div>
          ) : (
            <div className="my-request-body-card">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote: QuoteData, index: number) => (
                  <RequestCard
                    key={index}
                    isOpen={openIndex === index}
                    toggleAccordion={() => toggleAccordion(index)}
                    dashbaordLanguageData={languageData}
                    quoteData={quote}
                  />
                ))
              ) : (
                <div>{NO_REQUEST_FOUND}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequest;