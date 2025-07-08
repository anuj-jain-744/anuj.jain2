import { LanguageData } from "types/languageData";
import ChangetoVehSeqNo from "./ChangetoVehSeqNo";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

interface ICustomCardLeft {
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

const CustomCardLeft = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
  vehicleMakeText,
  makeModelResponse,
  errorMessage,
  validateSeqValue,
}: ICustomCardLeft) => {
  return (
    <div className="register-new-claim-left-card-main d-flex flex-column" data-testid="CustomCardLeft-test">
      <ChangetoVehSeqNo
        languageData={languageData}
        isValidateSeqBtnDisable={isValidateSeqBtnDisable}
        changeHandler={changeHandler}
        fullDataHandler={fullDataHandler}
        customCardData={customCardData}
        vehicleMakeText={vehicleMakeText}
        makeModelResponse={makeModelResponse}
        errorMessage={errorMessage}
        validateSeqValue={validateSeqValue}
      />
    </div>
  );
};

export default CustomCardLeft;
