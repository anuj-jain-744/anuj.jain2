import React, { useEffect } from "react";
import successIcon from "assets/Claims/GreenSuccess.svg";
import { Badge, Card } from "react-bootstrap";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Nissan from "assets/Endorsement/png/Nissan.png";
import Mercedes from "assets/Endorsement/png/Mercedes.png";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { useNavigate } from "react-router-dom";

interface ISuccessVehSeqNo {
  customCardValue: null | string;
  validateSeqValue: null | string;
  policyNumber: null | string;
  languageData?: LanguageData;
}

export default function SuccessVehSeqNo({
  customCardValue,
  validateSeqValue,
  policyNumber,
  languageData,
}: ISuccessVehSeqNo) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fn that returns vehicle icn as per their manufacturer
  function icnfactory(name: string) {
    switch (name) {
      case "nissan":
        return Nissan;
      case "mercedes":
        return Mercedes;
    }
  }

  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handlePolicyDetails = () => {
    navigate(-1);
  }

  return (
    <>
      <React.Fragment>
        <div
          className="claimsDetailsContainer"
          data-testid="SuccessVehSeqNo-test"
        >
          <div className="innerContainerMain width-56">
            <div className="popupStatusSection">
              <img
                className="GreenIcon"
                src={successIcon}
                alt="Green Success Icon"
              />
              <div className="messageGreenSection">
                <label className="messageGreenSectionLbl">
                  {languageData?.success}
                </label>
              </div>
              <p className="messageSection">
                {languageData?.successMsgChangeToSequenceNumber
                  .replace(/<< customCardNo >>/i, customCardValue || "")
                  .replace(/<< vehicleSequenceNo >>/i, validateSeqValue || "")
                  .replace("<br>", " ")
                  .replace(/<< policyNo >>/i, policyNumber || "")}
              </p>
            </div>
            {/* card */}
            <Card className="right-card h-auto mb-2">
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex gap-4">
                  <div>
                    <img src={icnfactory("nissan")} alt="nissan" />
                  </div>
                  <div>
                    <div>{languageData?.custom_card_no}</div>
                    <div>{customCardValue ?? ""}</div>
                  </div>
                  <div>
                    <ArrowForwardIcon />
                  </div>
                  <div>
                    <div>{languageData?.vehicle_sequence}</div>
                    <div>{validateSeqValue ?? ""}</div>
                  </div>
                </div>
                <div>
                  <Badge className="py-2" bg="success">
                    {languageData?.success}
                  </Badge>
                </div>
              </div>
            </Card>
            <div className="bottom-links walaa-medium-500">
              <div>
                <ThemeButton
                  title={languageData?.go_to_dashboard}
                  classes={"other-product"}
                  variant="linked"
                  onClickhandler={handleDashboard}
                />
              </div>
              <div>
                <ThemeButton
                  title={languageData?.back_to_policyDetails}
                  classes={"endorsement-link"}
                  variant="trackClaim"
                  onClickhandler={handlePolicyDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
}
