import { LanguageData } from "types/languageData";
import ValidateSeqNoCard from "./ValidateSeqNoCard";

interface IChangetoVehSeqNo {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: string;
  languageData: LanguageData | undefined;
  errorMessage?: string;
  validateSeqValue?: string;
}

const ChangetoVehSeqNo = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
  errorMessage,
  validateSeqValue,
}: IChangetoVehSeqNo) => {

  return (
    <div className="register-new-claim-left-card walaa-regular-400">
      <div className="register-new-claim-header walaa-medium-500">
        <div className="header-body">{languageData?.change_to_vehicle_sequence}</div>
      </div>
      <div className="header-border"></div>
      {/* custom card to validate seq No. Card */}
      <ValidateSeqNoCard
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

export default ChangetoVehSeqNo;
