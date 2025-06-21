import React, { useContext, useEffect } from "react";
import successIcon from "../../../assets/Claims/GreenSuccess.svg";
import iconCar from "../../../assets/Claims/Car.svg";
import Feedback from "../../../components/Feedback";
import { DataContext } from "../../../DataContext";
import { Card } from "react-bootstrap";
import ThemeButton from "../../components/ThemeButton";

// import {
//   setDefaultLanguage,
//   getCurrentLanguage,
//   getTranslationForKey,
//   setUserLanguage,
// } from "../../components/languages";

interface IClaimDetails {
  validationData: any;
  claimResponse: any;
  claimsInfo?: any;
  //onClickhandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ClaimsDetails({
  validationData,
  claimResponse,
  claimsInfo
}: IClaimDetails) {
  const languageData = useContext(DataContext);
  const feedbackRequest = {
    SourceType: validationData?.SourceType,
    ClaimRequestType: validationData?.ClaimRequestType,
    caseReportId: claimsInfo?.refNo || validationData?.CaseReportId,
    ownerId: claimsInfo?.ownerId || validationData?.OwnerId,
    sequenceNo: validationData?.sequenceNo,
    vehicleOwnerDob: validationData?.dob,
    claimNo: claimResponse?.claimNo,
    subclaimNo: claimResponse?.subclaimNo,
    rating: 0,
    message: "Awosome",
  };

  enum CaseRefNoLabel {
    POLICE = languageData?.police_case_reference,
    NAJM = languageData?.najm_case_reference,
    OTHERS = languageData?.other_case_reference,
  }

  const getCaseRefNoLabel = (refNo: string): CaseRefNoLabel => { 
    if (/^\d{2}/.test(refNo)) {
      if (/^[4567]/.test(refNo)) {
        return CaseRefNoLabel.POLICE;
      } else {
        return CaseRefNoLabel.OTHERS;
      }
    }
    return CaseRefNoLabel.NAJM;
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);

  return (
    <>
      {languageData ? (
        <React.Fragment>
          <div className="claimsDetailsContainer">
            <div className="innerContainerMain">
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
                  {languageData?.success_message_motorclaim}
                </p>
              </div>
              {/* card */}
              <Card className="register-card">
                {/* row 1 */}
                <Card.Header className="register-card-header">
                  <div className="title-colored">
                    <div className="walaa-medium-500 title">
                      {languageData?.claim_submitted}
                    </div>
                    <div className="register-row-spacing-bottom"></div>
                  </div>
                </Card.Header>
                <Card.Body className="register-card-body register-compre-card-body p-0">
                  <div className="cardSectionContainer">
                    <div className="cardSection col-lg-4 col-md-6 col-sm-12 col-xs-12">
                      <div className="cardText">
                        <label className="cardTextLbl">
                          {getCaseRefNoLabel(claimsInfo.refNo)}
                        </label>
                        <label className="cardTextValue">
                          {claimsInfo?.refNo}
                        </label>
                      </div>
                    </div>
                    <div className="cardSection col-lg-4 col-md-6 col-sm-12 col-xs-12">
                      <div className="cardText">
                        <label className="cardTextLbl">
                          {languageData?.owner_id}
                        </label>
                        <label className="cardTextValue">
                          {claimsInfo?.ownerId}
                        </label>
                      </div>
                    </div>
                    <div className="cardSection col-lg-4 col-md-6 col-sm-12 col-xs-12">
                      <div className="cardText">
                        <label className="cardTextLbl">
                          {languageData?.vehicle_sequence}
                        </label>
                        <label className="cardTextValue">
                          {validationData?.sequenceNo}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="cardSectionContainer2">
                    <div className="cardSection">
                      <div className="cardIconContainer">
                        <div className="cardIconContainerIn">
                          <img src={iconCar} alt="type icon" />
                        </div>
                      </div>
                      <div className="cardText">
                        <label className="cardTextLbl">
                          {languageData?.motor_claim_no}
                        </label>
                        <label className="cardTextValue">
                          {claimResponse?.claimNo}
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* row 1 end */}
                  <div className="btnSection d-flex align-items-center justify-content-between register-row-spacing-top btnContainer">
                    <div className="btnContainerIn"></div>
                    <div>
                      <ThemeButton
                        classes="register-call2action2 walaa-medium-500"
                        isDisabled={false}
                        title={languageData?.submit_another_claim}
                        variant="link"
                        onClickhandler={() => window.location.reload()}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
              <div className="line"></div>
            </div>
            <Feedback
              url="/Motor/Claim/V1/SubmitFeedback"
              feedbackData={feedbackRequest}
            />
          </div>
        </React.Fragment>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
