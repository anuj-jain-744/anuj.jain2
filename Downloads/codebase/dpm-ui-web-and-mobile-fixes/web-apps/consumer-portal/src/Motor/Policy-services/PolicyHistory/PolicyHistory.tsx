import React, { useEffect, useState } from "react";
import "./PolicyHistory.scss";
import EndorsementIcon from "assets/Dashboard/Endorsement_Icon.svg";
import Endorsement_Cancel_Icon from "assets/Dashboard/Endorsement_Cancel_Icon.svg";
import Motor_Logo from "assets/Dashboard/Frame_History_Purchase.svg";
import Travel_Logo from "assets/Dashboard/Travel_MyRequest.svg";
import Home_Logo from "assets/Dashboard/Home_policyHistory.svg";
import line from "assets/Dashboard/Frame_History_Line.svg";
import line_large from "assets/Dashboard/Line_large.svg";
import line_straight from "assets/Dashboard/Frame_History_Lines.svg";
import Motor from "assets/Dashboard/Motor_Logo.svg";
import Travel from "assets/Dashboard/Travel.svg";
import Home from "assets/Dashboard/Home.svg";
import PolicyCard from "../PoliciesCancellation/sharedComponent/PolicyCard";
import { useSelector } from "react-redux";
import { RootState, useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { formatDate } from "utils/formatDate";
import { NA, TRAVEL, HOME } from "constant";
import { BackFooter } from "components/index";
import { useReviewPolicy } from "../PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "../PolicyDashboard/hooks/usePolicyData";
import { getPriceFormat } from "utils/getPriceFormat";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getPlanName } from "utils/policyDetails";
import { PDFDataStructure, useDownloadPDF } from "hook/common/useDownloadPdf";
import { getPlateNumber } from "utils/getPlateNumber";
import { truncateName } from "utils/quoteAndBuy";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface PolicyData {
  endorsementType: string;
  nationalID: string;
  policyNo: string;
  premium: number;
  productCode: string;
  endoSubType: string;
  endorsementNo: string;
}

interface PlanDescription {
  plateNo?: string;
  plateNoText1?: string;
  plateNoText2?: string;
  plateNoText3?: string;
  repairCondition?: string;
  vehicleModelTextEn?: string;
  vehicleMakeTextEn?: string;
}

interface PolicyHistoryProps {
  policyData: PolicyData;
  navigateTo: (path: string) => void;
}

const PolicyHistory: React.FC<PolicyHistoryProps> = ({policyData, navigateTo}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const {policyHistory} = useSelector((state: RootState) => state.policyHistory);
  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  const policyNumber = policyData?.policyNo;
  
  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: policyNumber,
    Product: policyData?.productCode,
  });
  
  const handleToggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const sortedQuestions = [...(policyHistory || [])].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );

  const productCode = sortedQuestions.find(
    (question) => question.productCode
  )?.productCode;

  const policyDataDetail = usePolicyData(data, productCode);
  
  const coverageName = getPlanName(policyDataDetail);

  const {policyDetails, planDetails} = policyDataDetail

  const planDescription : PlanDescription = planDetails?.policyRisk[0] || {};

  const {plateNo, plateNoText1, plateNoText2, plateNoText3, repairCondition, vehicleModelTextEn, vehicleMakeTextEn} = planDescription || {};

  const displayPlateNumber = getPlateNumber({plateNo, plateNoText1, plateNoText2, plateNoText3});

  const endorsementDocUrl = `/Dashboard/V1/Download/Policy/AllDoc?policyNo=${policyNumber}`;
  const { makeApiCall: policyApiCall, data: responseData } = useApiCall<
    PDFDataStructure[],
    undefined
  >(11, endorsementDocUrl, "post");

  const { processPDFs } = useDownloadPDF();

  const handleDownloadDocument = async () => {
    try {
      // await policyApiCall();   // as suggested by Dikesh don't api call here wait other api to implement to show only donwload single doc for each endorsemeent
    } catch (error) {
      console.error("Error policy", error);
    }
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        if (responseData) {
          await processPDFs(responseData, {
            format: "zip",
            zipFileName: "Endorsement.zip",
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
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }, [policyNumber]);

    const handleBackClick = () => {
      navigateTo("/dashboard");
    };

  const productLogo = (productCode: string, mainCard: boolean) => {
    switch (productCode) {
      case TRAVEL:
        return mainCard ? Travel_Logo : Travel;
      case HOME:
        return mainCard ? Home_Logo : Home;
      default:
        return mainCard ? Motor_Logo : Motor;
    }
  }

  const getPolicyNumber = (productCode: string) => {
    switch (productCode) {
      case TRAVEL:
        return languageData?.travel_policy_no;
      case HOME:
        return languageData?.home_policy_no;
      default:
        return languageData?.motor_policy_no;
    }
  }

  return (
    <div className="policy-history-card-wrapper">
      <div className="policy-history-container">
        <div className="policy-history">
          <div className="policy-history-left">
            <div className="policy-history-main-card">
              <div className="policy-history-main-card-title">
                <div className="title-content">
                  <div className="title walaa-medium-500">
                    {languageData?.policy_history}
                  </div>
                </div>
                <hr className="horizontal-line" />
              </div>
              <div className="policy-history-main-card-body">
                <div className="main-card-header walaa-regular-400">
                  {languageData?.your_policy_timeline}
                </div>
                <div className="main-card-body">
                  <div className="left-logo-section">
                    {sortedQuestions.map((index, idx) => (
                      <React.Fragment key={`${index.policyNo}${idx}`}>
                        <div className="logo">
                          <img
                          src={
                            idx === 0
                            ? Endorsement_Cancel_Icon
                            : idx === sortedQuestions.length - 1
                            ? productLogo(productCode, true)
                            : EndorsementIcon
                          }
                          alt={`Icon ${idx}`}
                          />
                        </div>
                        {idx < sortedQuestions.length - 1 && (
                          <div>
                            <img
                              src={expandedIndex === idx ? line_large : line}
                              alt={`Line ${idx}`}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="right-content-section-container">
                    {sortedQuestions.map((question, index) => (
                      <React.Fragment key={`${question.policyNo}${index}`}>
                        {expandedIndex !== index && (
                          <div
                            className={`right-content-section ${
                              index === 0 ? "first-question" : "other-questions"
                            } ${
                              index === sortedQuestions.length - 1
                                ? "last-question"
                                : ""
                            }`}
                          >
                            <div className="left-section">
                              <div className="left-top-section walaa-medium-500">
                                {question.endorsementType}
                              </div>
                              <div className="left-bottom-section">
                                <span className="cmp walaa-medium-500">
                                  {question.productName || NA}
                                </span>{" "}
                                |{" "}
                                <span className="date walaa-regular-400">
                                  {formatDate(question.issueDate)}
                                </span>
                              </div>
                            </div>
                            <div
                              className="right-section"
                              onClick={() => handleToggleAccordion(index)}
                              role="button" tabIndex={0} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleToggleAccordion(index);
                                }
                              }}
                            >
                              {expandedIndex === index ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </div>
                          </div>
                        )}
                        {expandedIndex === index && (
                          <div
                            className={`expanded-content ${
                              index === 0 ? "first-question" : "other-questions"
                            } ${
                              index === sortedQuestions.length - 1
                                ? "last-question"
                                : ""
                            }`}
                          >
                            <div className="left-expanded-content">
                              <div className="left-top-expanded walaa-medium-500">
                                {question.endorsementType}
                              </div>
                              {question.endorsementType.includes(
                                "Endorsement"
                              ) ? (
                                <>
                                  <div className="left-bottom-expanded-container flex-column align-items-start">
                                    <div className="left-bottom-expanded">
                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.type_of_endorsement}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {question.endoSubType || NA}
                                        </div>
                                      </div>
                                      <img src={line_straight} />

                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.premium_change}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {getAmountWithIcon(question.premium)}
                                        </div>
                                      </div>
                                      <img src={line_straight} />

                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.name_label}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {question.name || NA}
                                        </div>
                                      </div>
                                      <img src={line_straight} />

                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.date}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {formatDate(question.issueDate) || NA}
                                        </div>
                                      </div>
                                    </div>
                                    {/* Commented the code due to unavailability of the API to download the document */}
                                      {/* <div className="download-document" onClick={handleDownloadDocument}
                                        role="button" tabIndex={0} onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleDownloadDocument();
                                          }
                                        }}>
                                      <div className="download-logo">
                                        <img src={Download} />
                                      </div>
                                      <div className="download-document-text walaa-regular-400">
                                        {languageData?.download_document}
                                      </div>
                                    </div> */}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="left-bottom-expanded-container">
                                    <div className="first-bottom-left">
                                      <img
                                        src={productLogo(productCode, false)}
                                      />
                                    </div>
                                    <div className="left-bottom-expanded">
                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                            {getPolicyNumber(productCode)}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {question.policyNo || NA}
                                        </div>
                                      </div>
                                      <img src={line_straight} />

                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.coverage}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {question.productName || NA}
                                        </div>
                                      </div>
                                      <img src={line_straight} />

                                      {/* As of now we are not getting the repair type from getPolicyList API so commenting this code as of now */}

                                      {/* <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.repair_type}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {question.repairType || NA}
                                        </div>
                                      </div>
                                      <img src={line_straight} /> */}

                                      <div className="label-content-container">
                                        <div className="label walaa-regular-400">
                                          {languageData?.date}
                                        </div>
                                        <div className="label-content walaa-medium-500">
                                          {formatDate(question.issueDate) || NA}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div
                              className="right-expanded-content"
                              onClick={() => handleToggleAccordion(index)}
                              role="button" tabIndex={0} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleToggleAccordion(index);
                                }
                              }}
                            >
                              <FaChevronUp />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="policy-history-right">
            <PolicyCard
              policyNumber={policyNumber}
              startDate={policyDetails?.startDate}
              expiryDate={policyDetails?.expiryDate}
              idvValue={
                policyDetails?.idv
                  ? `${languageData?.sar ?? "SAR"} ${getPriceFormat(
                    parseInt(policyDetails?.idv)
                  )}`
                  : `${languageData?.not_available ?? "Not Available"}`
              }
              coverageName={coverageName}
              startDateTitle={languageData?.start_date ?? "Start Date"}
              expiryDateTitle={languageData?.expiry_date ?? "Expiry Date"}
              policyNo={languageData?.policy_no ?? "Policy No"}
              idvTitle={languageData?.sum_insured ?? "Sum Insured"}
              prodCode={policyData?.productCode}
              plateNumber={displayPlateNumber}
              vehicleMakeModel={truncateName(capitalizeNameFirstLetter(`${vehicleMakeTextEn} ${vehicleModelTextEn}`),12)}
              repairType={repairCondition}
            />
          </div>
        </div>
      </div>
      <BackFooter
        selectedPolicyNumber={policyData.policyNo}
        setSelectedPolicyNumber={policyNumber}
        handleBackClick={handleBackClick}
      />
    </div>
  );
};

export default PolicyHistory;
