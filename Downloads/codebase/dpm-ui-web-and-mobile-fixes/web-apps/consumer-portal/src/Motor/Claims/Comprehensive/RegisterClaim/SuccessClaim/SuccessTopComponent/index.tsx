import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Green from "assets/SuccessPage/Popups Status.svg";
import { Card } from "react-bootstrap";
import { callAPI } from "@dpm/shared-module";
import { useEffect, useState } from "react";

function SuccessTopComponent(status) {

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
    setLanguageData(response?.config[0]);
  };
  
  return (
    <Card className="success-container">
      <div className="success-container-body">
        <div>
          {status.status && <img src={Green} alt={languageData?.success} />}
        </div>
        <div className="content"> 
          <div className="success-content walaa-regular-400">
            {languageData?.success_message_motorclaim}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SuccessTopComponent;
