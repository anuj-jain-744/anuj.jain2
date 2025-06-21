import { LanguageData } from "types/languageData";
import ChangetoVehSeqNo from "./ChangetoVehSeqNo";

interface ICustomCardLeft {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: string;
  languageData: LanguageData | undefined;
  errorMessage?: string;
  validateSeqValue?: string;
}

const CustomCardLeft = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
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
        errorMessage={errorMessage}
        validateSeqValue={validateSeqValue}
      />
    </div>
  );
};

export default CustomCardLeft;
