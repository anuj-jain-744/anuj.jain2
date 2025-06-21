import ThemeButton from "components/ThemeComponents/ThemeButton";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { Card } from "react-bootstrap";
import Nissan from "assets/Endorsement/png/Nissan.png";
import Mercedes from "assets/Endorsement/png/Mercedes.png";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import "./ValidateSeqNoCard.scss";
import { LanguageData } from "types/languageData";

interface IValidateSeqNoCard {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: string;
  languageData: LanguageData | undefined;
  errorMessage?: string;
  validateSeqValue?: string;
}

const ValidateSeqNoCard = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
  errorMessage,
  validateSeqValue,
}: IValidateSeqNoCard) => {
  // fn that returns vehicle icn as per their manufacturer
  function icnfactory(name: string) {
    switch (name) {
      case "nissan":
        return Nissan;
      case "mercedes":
        return Mercedes;
    }
  }

  return (
    <div className="px-4">
      <Card className="validate-seq-no-card">
        <div>
          <img src={icnfactory("nissan")} alt="nissan" />
        </div>
        <div className="custom-number">
          <div className="title walaa-regular-400">
            <TypographyAndIcon text={languageData?.custom_card_no ?? ""} />
          </div>
          <div className="value walaa-medium-500">{customCardData}</div>
        </div>
        <div>
          <ArrowForwardIcon />
        </div>
        <div className="vehicleSeqNo-textbox">
          <ThemeTextbox
            dataTestId="vehicleSeqNo-id"
            name="VehicleSeqNo"
            value={validateSeqValue}
            errorValue={errorMessage}
            placeholder={languageData?.enter_vehicle_sequence_no ?? ""}
            type="number"
            onChangehandler={changeHandler}
          />
        </div>
        <div>
          <span
            data-testid="validateSeqNoCard-dataHandler"
            role="button"
            tabIndex={0}
            onClick={() => fullDataHandler(customCardData)}
          >
            <ThemeButton
              title={languageData?.validate_sequence_no ?? ""}
              isDisabled={isValidateSeqBtnDisable}
              classes=""
              // onClickhandler={clickHandler}
            />
          </span>
        </div>
      </Card>
    </div>
  );
};

export default ValidateSeqNoCard;
