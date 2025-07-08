import { LanguageData } from "types/languageData";
import ValidateSeqNoCard from "./ValidateSeqNoCard";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

interface IChangetoVehSeqNo {
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

const ChangetoVehSeqNo = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler,
  languageData,
  vehicleMakeText,
  makeModelResponse,
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
        vehicleMakeText={vehicleMakeText}
        makeModelResponse={makeModelResponse}
        errorMessage={errorMessage}
        validateSeqValue={validateSeqValue}
      />
    </div>
  );
};

export default ChangetoVehSeqNo;
