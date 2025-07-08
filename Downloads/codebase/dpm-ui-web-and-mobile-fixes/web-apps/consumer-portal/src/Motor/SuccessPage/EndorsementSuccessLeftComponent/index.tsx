import "./style.scss";
import Group from "assets/SuccessPage/Group.svg";
import Rectangle from "assets/SuccessPage/Rectangle.svg";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import { Card } from "react-bootstrap";
import ThemeButton from "./../../../Motor/Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import mockData from "./../success.json"

function EndorsementSuccessLeftComponent() {

  const [languageData, setLanguageData] = useState();

  const { VITE_CONTENT_BASE_URI } = import.meta.env;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };
  
  return (
    <Card className="endorsement-left-card-container">
      <div className="left-card-body">
        <div className="left-card-header">
          <div>
            <img src={Group} />
          </div>
          <div className="policy">
            <div className="content">
                <div className="policy-number-heading walaa-regular-400">
                  {languageData?.model_type}
                </div>
                <div className="policy-number walaa-medium-500">
                  {mockData["Model-Type"]}
                </div>
            </div>
            <div>
              <img src={Line} />
            </div>
            <div className="content">
                <div className="policy-number-heading walaa-regular-400">
                  {languageData?.vehicle_sequence}
                </div>
                <div className="policy-number walaa-medium-500">
                  {mockData["Vehicle-Sequence-No"]}
                </div>
            </div>
            <div>
              <img src={Line} />
            </div>
            <div className="content">
                <div className="policy-number-heading walaa-regular-400">
                  {languageData?.sponsor_name}
                </div>
                <div className="policy-number walaa-medium-500">
                  {mockData["Sponsor-Name"]}
                </div>
            </div>
          </div>
        </div>

        <img src={Rectangle} className="rectangle" />
        <div className="card-body-container">
          <div className="card-body-content">
            <div className="div-body">
              <div className="content">
                <div className="content-heading walaa-regular-400">
                  Driver Name
                </div>
                <div className="content-data walaa-medium-500">
                  {mockData["Driver-Name"]}
                </div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="content">
                <div className="content-heading walaa-regular-400">{languageData?.iqama_no}</div>
                <div className="content-data walaa-medium-500">{mockData["Iqama-No."]}</div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="content">
                <div className="content-heading walaa-regular-400">{languageData?.relationship}</div>
                <div className="content-data walaa-medium-500">{mockData["Relationship"]}</div>
              </div>
            </div>
          </div>

          <div className="card-body-content">
            <div className="div-body">
              <div className="content">
                <div className="content-heading walaa-regular-400">
                  Driver Name
                </div>
                <div className="content-data walaa-medium-500">
                  {mockData["Driver-Name1"]}
                </div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="content">
                <div className="content-heading walaa-regular-400">{languageData?.iqama_no}</div>
                <div className="content-data walaa-medium-500">{mockData["Iqama-No.1"]}</div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="content">
                <div className="content-heading walaa-regular-400">{languageData?.relationship}</div>
                <div className="content-data walaa-medium-500">{mockData["Relationship1"]}</div>
              </div>
            </div>
          </div>

          
          <div className="card-btns">
            <div className="btns">
              <div>
                <img src={Download} />
              </div>
              <div className="btn-content walaa-regular-400">
                {languageData?.endorsement_schedule}
              </div>
            </div>
            <div className="btns">
              <div>
                <img src={Download} />
              </div>
              <div className="btn-content walaa-regular-400">
                {languageData?.payment_receipt}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-links walaa-medium-500">
        <div>
          <ThemeButton
            title={languageData?.explore_other_insurance_pr}
            classes={"other-product"}
            variant="link"
          />
        </div>
        <div>
          <ThemeButton
            title={languageData?.back_to_endorsement}
            classes={"endorsement-link"}
          />
        </div>
      </div>
    </Card>
  );
}

export default EndorsementSuccessLeftComponent;
