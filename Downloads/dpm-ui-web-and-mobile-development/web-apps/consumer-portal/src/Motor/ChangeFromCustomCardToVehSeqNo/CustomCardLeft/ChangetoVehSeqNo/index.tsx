import { useContext } from "react";
import ValidateSeqNoCard from "./ValidateSeqNoCard";
import { DataContext } from "../../../../DataContext";

interface IChangetoVehSeqNo {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: Object[];
}

const ChangetoVehSeqNo = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler
}: IChangetoVehSeqNo) => {
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="register-new-claim-left-card walaa-regular-400">
      <div className="register-new-claim-header walaa-medium-500">
        <div className="header-body">{Data?.change_to_vehicle_sequence}</div>
      </div>
      <div className="header-border"></div>
      {/* custom card to validate seq No. Card */}
      <ValidateSeqNoCard
        isValidateSeqBtnDisable={isValidateSeqBtnDisable}
        changeHandler={changeHandler}
        fullDataHandler={fullDataHandler}
        customCardData={customCardData}
      />
    </div>
  );
};

export default ChangetoVehSeqNo;
