import React, { useContext, useEffect } from "react";
import successIcon from "assets/Claims/GreenSuccess.svg";
import { Badge, Card } from "react-bootstrap";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Nissan from "assets/Endorsement/png/Nissan.png";
import Mercedes from "assets/Endorsement/png/Mercedes.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DataContext } from "../../../DataContext";
import { formatDate } from "utils/formatDate";

interface ISuccessVehSeqNo {
  customCardValue: null | string;
  validateSeqValue: null | string;
  policyNumber: null | string;
  effectiveDate: null | string;
}

export default function SuccessVehSeqNo({
  customCardValue,
  validateSeqValue,
  policyNumber,
  effectiveDate,
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
  //cms content
  const Data = useContext(DataContext);

  //date formater util fn call
  const formatedStartDate = formatDate(effectiveDate);
  return (
    <>
      <React.Fragment>
        <div className="claimsDetailsContainer" data-testid="SuccessVehSeqNo-test">
          <div className="innerContainerMain">
            <div className="popupStatusSection">
              <img
                className="GreenIcon"
                src={successIcon}
                alt="Green Success Icon"
              />
              <div className="messageGreenSection">
                <label className="messageGreenSectionLbl">
                  {Data?.success}
                </label>
              </div>
              <p className="messageSection">
                You have successful changed {Data?.custom_card_no}{" "}
                {customCardValue} to
                {Data?.vehicle_sequence} {validateSeqValue}.Same will reflect to
                the {Data?.policy_no} {policyNumber}.
              </p>
            </div>
            {/* card */}
            <Card className="right-card h-auto mb-2">
              <div className="row w-100">
                <div className="col-xs-12 col-sm-12 col-md-5">
                  <div className="row">
                    <div className="col-2 d-flex align-items-center justify-content-around">
                      <img src={icnfactory("nissan")} alt="nissan" />
                    </div>
                    <div className="col-4 d-flex flex-column px-0">
                      <div>{Data?.custom_card_no}</div>
                      <div>{customCardValue ?? "null"}</div>
                    </div>
                    <div className="col-1 d-flex align-items-center px-0">
                      <ArrowForwardIcon />
                    </div>
                    <div className="col-5 d-flex flex-column px-0">
                      <div>{Data?.vehicle_sequence}</div>
                      <div>{validateSeqValue ?? "null"}</div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-7 d-flex justify-content-end pe-0 py-3 pt-2">
                  <Badge className="py-2" bg="success">
                    {Data?.success}
                  </Badge>
                </div>
              </div>
              <hr className="horizontal-line" />
              <div className="row">
                <div className="col-sm-12 d-flex">
                  <div>
                    <CheckCircleIcon color="success" />
                  </div>
                  <div>
                    <p className="walaa-regular-400">
                      {formatedStartDate} : {Data?.custom_card_no}
                      {customCardValue}
                      changed to {Data?.vehicle_sequence} {validateSeqValue}.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </React.Fragment>
    </>
  );
}
