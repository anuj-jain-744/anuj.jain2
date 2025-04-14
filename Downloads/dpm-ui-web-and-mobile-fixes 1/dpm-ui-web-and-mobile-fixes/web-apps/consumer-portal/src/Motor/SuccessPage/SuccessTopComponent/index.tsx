import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useApiCall } from "@dpm/shared-module";
import Green from "assets/SuccessPage/Popups Status.svg";
import "./style.scss";
import { LanguageData } from "types/languageData";
import mockData from "./../success.json";

interface SuccessComponentProps {
  status: boolean;
  data: LanguageData;
  flag: boolean;
  typeCode?: boolean;
  loading?: boolean;
  claimData?: { [key: string]: any };
}

function SuccessTopComponent({
  status,
  data,
  flag,
  typeCode = false,
  loading = false,
  claimData,
}: Readonly<SuccessComponentProps>) {
  const [languageData, setLanguageData] = useState<LanguageData | undefined>();

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
    return(<div>
        <span>{mockData["cancellation-msg"]}</span>
        <span><a href="/contact-walaa" target="_self">{mockData["Contact-walaa"]}</a></span>
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
            {!flag && (
              <div className="success-msg walaa-medium-500">
                {status
                  ? languageData?.success
                  : languageData?.success_msg_cancel}
              </div>
            )}
            {flag && (
              <div className="success-msg walaa-medium-500">
                {languageData?.success_msg_review_quotes}
              </div>
            )}
            {claimData ? (
              <div className="success-content walaa-regular-400">
                {data && status
                  ? mockData["endorsement-msg"] + data.policyNumber
                  : getHypertext() }
              </div>
            ) : (
              !flag && (
                <div className="success-content walaa-regular-400">
                  {data && status ? (
                    `${languageData?.successfully_added} ${data.policyNumber}`
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
                {status ? "" : data?.success_msg_cancel}
              </div>
            )}
            {flag && (
              <div className="success-msg walaa-medium-500">
                {data?.success_msg_review_quotes}
              </div>
            )}
            {!flag && (
              <div className="success-content walaa-regular-400">
                {status ? "" : data?.cancellation}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default SuccessTopComponent;
