import React, { useEffect, useState } from "react";
import CustomCardLeft from "./CustomCardLeft";
import CustomCardRight from "./CustomCardRight";
import "./ChangeFromCustomCardToVehSeqNo.scss";
import SuccessVehSeqNo from "./SuccessVehSeqNo";
import { useApiCall, capitalizeNameFirstLetter, isValidInputRegex } from "@dpm/shared-module";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertBox } from "components/AlertBox";
import { BlueFormFooter } from "components/BlueFormFooter";
import { getPlateNumber } from "utils/getPlateNumber";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { MAX_VEH_SEQUENCE_NUMBER, MIN_VEH_SEQUENCE_NUMBER } from "constant";

const ChangeFromCustomCardToVehSeqNo = () => {
  //validate sequence button enable/disable state
  const [isValidateSeqBtnDisable, setValidateSeqBtnDisable] =
    useState<boolean>(true);
  //validateseq number value
  const [validateSeqValue, setValidateSeqValue] = useState<null | string>(null);
  //validate sequence response success enable success page
  const [validateSeqSuccess, setValidateSeqSuccess] = useState(false);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [makeModelResponse, setMakeModelResponse] = useState();
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const policyDetailsData = location?.state;
  const { policyData, languageData } = policyDetailsData || {};
  const { policyDetails, vehicleDetails } = policyData;
  const { nationalID, policyNo } = policyDetails;

  const {vehicleCustomID, chassisNo, repairCondition, registrationPlateNo, registrationPlateText1, registrationPlateText2, registrationPlateText3, vehicleMakeTextEn, vehicleModelTextEn } = vehicleDetails[0];

  const displayPlateNumber = getPlateNumber({
    plateNo: registrationPlateNo,
    plateNoText1: registrationPlateText1,
    plateNoText2: registrationPlateText2,
    plateNoText3: registrationPlateText3,
  });

  const vehicleMakeModel = capitalizeNameFirstLetter(`${vehicleMakeTextEn} ${vehicleModelTextEn}`)

  //change handler return accept fn
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target ?? { value: "" };

    const trimmedValue = value.slice(0, 11);

    setValidateSeqValue(trimmedValue);

    if (
      !isValidInputRegex(
        trimmedValue,
        MIN_VEH_SEQUENCE_NUMBER,
        MAX_VEH_SEQUENCE_NUMBER
      )
    ) {
      setError(languageData?.vehicle_seqcunce_invalid);
    } else {
      setError("");
    }

    setValidateSeqBtnDisable(value?.length < 8 ? true : false);
  };

  //final data receive handler accept fn
  const fullDataHandler = (customID: string) => {
    if (customID !== null || customID !== undefined) submitCustomCardtoVehSeq();
  };

  const goBack = () => {
    navigate(-1);
  };

  const {
    makeApiCall,
    data: sequenceData,
    errors: errors,
  } = useApiCall(4, "/Change/CustomCardNo/To/SequenceNo", "post");

  const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
  useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
    1,
    "consumerportal-config",
    "post",
    "en"
  );

  const submitCustomCardtoVehSeq = async () => {
    try {
      await makeApiCall({
          ownerId: nationalID,
          apiSource: "Portal",
          customId: vehicleCustomID,
          sequenceNo: validateSeqValue,
          policyNo: policyNo,
          chassisNumber: chassisNo,
        });
      }catch (error) {
      console.error(
        "Change from Custom Card to Vehicle Sequence Submit failed with error",
        error
      );
    } finally {
      /* empty */
    }
  };
  
  useEffect(() => {
    makeModelImageApiCall();
  }, []);

  useEffect(() => {
    if (modelImageResponse) {
      setMakeModelResponse(modelImageResponse?.motor_makes);
    }
  }, [modelImageResponse]);

  useEffect(() => {
    if (sequenceData) {
      setValidateSeqSuccess(true);
    }
  }, [sequenceData]);

  useEffect(() => {
    if (errors) {
      setApiErrorMessage({
        title: errors?.name,
        description: errors.messages?.message_en,
      });
      setShowAlertModal(true);
    }
  }, [errors]);

  return (
    <div
      className="changecustvehcontainer"
      data-testid="changefromcustomcardtovehseq-test"
    >
      <div className="register-new-claim-comprehensive">
        <div className="container-fluid">
          {validateSeqSuccess ? (
            <SuccessVehSeqNo
              languageData={languageData}
              policyNumber={policyDetails?.policyNo}
              customCardValue={vehicleCustomID}
              validateSeqValue={validateSeqValue}
              vehicleMakeText={vehicleMakeTextEn}
              makeModelResponse={makeModelResponse}
            />
          ) : (
            <React.Fragment>
              <AlertBox
                title={apiErrorMessage.title}
                description={apiErrorMessage.description}
                showAlertModal={showAlertModal}
                setShowAlertModal={setShowAlertModal}
              />
              <div className="register-new-claim-container-main p-0">
                {/* left content */}
                <CustomCardLeft
                  languageData={languageData}
                  isValidateSeqBtnDisable={isValidateSeqBtnDisable}
                  changeHandler={onChangeHandler}
                  fullDataHandler={fullDataHandler}
                  customCardData={vehicleCustomID}
                  vehicleMakeText={vehicleMakeTextEn}
                  makeModelResponse={makeModelResponse}
                  errorMessage={error}
                  validateSeqValue={validateSeqValue ?? ""}
                />
                {/* right content */}
                <CustomCardRight
                  policyDetails={policyDetails}
                  languageData={languageData}
                  plateNumber={displayPlateNumber}
                  repairType= {repairCondition}
                  vehicleMakeModel={vehicleMakeModel}
                />
              </div>
              <div className="register-new-claim-container-footer-main">
                <div className="footer">
                  <div className="footer-btns walaa-medium-500">
                    <BlueFormFooter
                      backBtnClickHandler={goBack}
                      isVisibleSubmitButton={false}
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeFromCustomCardToVehSeqNo;
