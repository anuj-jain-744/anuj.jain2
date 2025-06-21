import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useApiCall } from "@dpm/shared-module";
import { processTransactionId } from "utils/paymentUtils";
import { useParams } from "react-router-dom";
import Green from "assets/SuccessPage/Popups Status.svg";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { PolicyDetailsObj } from "types/policyDetails";
import { PRODUCTCODE_HOME, TRAVEL } from "constant";
import mockData from "./../success.json";
interface SuccessComponentProps {
  status: boolean;
  data: PolicyDetailsObj | null;
  flag: boolean;
  typeCode?: boolean;
  loading?: boolean;
  claimData?: { [key: string]: any };
  endPolicyNo?: string;
  driver?:string;
  isCancelSuccess?: boolean;
}

function SuccessTopComponent({
  status,
  data,
  flag,
  typeCode = false,
  loading = false,
  claimData,
  endPolicyNo,
  driver,
  isCancelSuccess
}: Readonly<SuccessComponentProps>) {
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  const [languageData, setLanguageData] = useState<LanguageData | undefined>();
  const { transactionid } = useParams<{
    transactionid: string;
    productname: string;
  }>();
  const processData = processTransactionId(transactionid ?? "");
  const { makeApiCall, data: cmsData } = useApiCall<
    { config: LanguageData[] },
    unknown
  >(1, "consumerportal-config", "get");

  const fetchData = async () => {
    makeApiCall();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (cmsData) {
      setLanguageData(cmsData.config[0]);
    }
  }, [cmsData]);

  // Adding contact walaa hyperlink
  const getHypertext = () => {
    return (<div>
      <span>{languageData?.further_questions}</span>
      <span><a href="/contact-walaa" target="_self">{languageData?.contact_walaa}</a></span>
    </div>)
  }

  return (
    <Card
      className={`success-container ${flag ? "background-color-none" : ""}`}
    >
      <div className="success-container-body">
        <div className="success-image-celebration">
          {!loading && status && <img src={Green} alt="Success Icon" />}
          {loading && (
            <div className="success-celebration">
              <img src={Green} alt="Success Icon" />
            </div>
          )}
        </div>
        {typeCode ? (
          <div className="content">
            {!isCancelSuccess && <div className="success-text walaa-medium-500">{languageData?.success}</div>}
            {!flag && (
              <div className={`${status ? 'success-msg' : 'cancel-success-msg walaa-medium-500'} `}>
                {status
                  ? languageData?.success
                  : languageData?.success_msg_cancel}
              </div>
            )}
            {flag && processData?.endrosmentNo && (
              Array.isArray(driver) && driver.length > 0 ? (
                <div className="success-msg">
                  {languageData?.successfully_added_driver} {data?.policyNumber ?? endPolicyNo}
                </div>
              ) : (
                <div className="success-msg">
                  {languageData?.successfully_added} {data?.policyNumber ?? endPolicyNo}
                </div>
              )
            )}
            {flag && processData?.quotationNo && (
              <div className="success-msg">
                {languageData?.success_msg_review_quotes}
              </div>
            )}
            {claimData ? (
              <div className="success-content walaa-regular-400">
                {claimData?.productCode === PRODUCTCODE_HOME && status ? (
                    languageData?.success_msg_home_reg_claim                
                ) : claimData?.productCode === TRAVEL ? (
                  languageData?.travel_claim_success
                ) : (
                    data && status ? mockData["endorsement-msg"] + data.policyNumber
                      : getHypertext()
                )}
              </div>
            ) : (
              !flag && (
                <div className="success-content walaa-regular-400">
                  {data && status ? (
                    `${languageData?.successfully_added} ${data?.policyNumber}`
                  ) : (
                    <>
                      {languageData?.further_questions}{" "}
                      <Link to="/contact-walaa" className="walaa-medium-500">
                        {languageData?.contact_walaa}
                      </Link>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="content">
            {!flag && (
              <div className="success-msg walaa-medium-500">
                {status ? "" : languageData?.success_msg_cancel}
              </div>
            )}
            {flag && (
              <div className="success-msg walaa-medium-500">
                {languageData?.success_msg_review_quotes}
              </div>
            )}
            {!flag && (
              <div className="success-content walaa-regular-400">
                {status ? "" : data?.cancellation} {/* TODO: Remove it from data type if its not required */}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default SuccessTopComponent;
