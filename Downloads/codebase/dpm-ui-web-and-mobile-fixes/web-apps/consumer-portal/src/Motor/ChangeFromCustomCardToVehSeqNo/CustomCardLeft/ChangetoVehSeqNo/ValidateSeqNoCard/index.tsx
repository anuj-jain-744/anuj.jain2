import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { Card } from "react-bootstrap";
import Nissan from "assets/Endorsement/png/Nissan.png";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import "./ValidateSeqNoCard.scss";
import { LanguageData } from "types/languageData";
import { getModelIcon } from "utils/getModelIcon";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { isInvalidKey } from "@dpm/shared-module";

interface IValidateSeqNoCard {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: string;
  languageData: LanguageData | undefined;
  vehicleMakeText?: string; 
  makeModelResponse?: MakeModelImageResponse[]; 
  errorMessage?: string;
  validateSeqValue?: string;
}

const ValidateSeqNoCard = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
  vehicleMakeText,
  makeModelResponse,
  errorMessage,
  validateSeqValue,
}: IValidateSeqNoCard) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInvalidKey(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="px-4">
      <Card className="validate-seq-no-card">
        <div className="car-logo">
          <img
            src={
              getModelIcon(
                vehicleMakeText, null,
                makeModelResponse || []
              ) ?? Nissan
            }
            alt="Car Logo"
            className="img-logo"
          />
        </div>
        <div className="custom-number">
          <div className="title walaa-regular-400">
            <TypographyAndIcon text={languageData?.custom_card_no ?? ""} />
          </div>
          <div className="value walaa-medium-500">{customCardData}</div>
        </div>
        <div>
          <ArrowForwardIcon className="arrow-icon"/>
        </div>
        <div className="vehicleSeqNo-textbox">
          <ThemeTextbox
            dataTestId="vehicleSeqNo-id"
            name="VehicleSeqNo"
            value={validateSeqValue}
            errorValue={errorMessage}
            placeholder={languageData?.enter_vehicle_sequence_no ?? ""}
            type="number"
            onKeyDown={handleKeyDown}
            onChangehandler={changeHandler}
          />
        </div>
        <div>
          <ThemeButton
            title={languageData?.validate_sequence_no ?? ""}
            isDisabled={isValidateSeqBtnDisable}
            variant={isValidateSeqBtnDisable ? "filterBtnsDisabled" : "filterBtnsActive"}
            data-testid="validateSeqNoCard-dataHandler"
            onClickhandler={() => fullDataHandler(customCardData)}
          />
        </div>
      </Card>
    </div>
  );
};

export default ValidateSeqNoCard;
