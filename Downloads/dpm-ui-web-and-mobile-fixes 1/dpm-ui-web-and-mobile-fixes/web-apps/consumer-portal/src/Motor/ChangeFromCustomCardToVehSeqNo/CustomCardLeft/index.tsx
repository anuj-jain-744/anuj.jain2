import ChangetoVehSeqNo from "./ChangetoVehSeqNo";

interface ICustomCardLeft {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullDataHandler: (customID: string) => void;
  isValidateSeqBtnDisable: boolean;
  customCardData: Object[];
}

const CustomCardLeft = ({
  changeHandler,
  isValidateSeqBtnDisable,
  customCardData,
  fullDataHandler
}: ICustomCardLeft) => {
  return (
    <div className="register-new-claim-left-card-main d-flex flex-column" data-testid="CustomCardLeft-test">
      <ChangetoVehSeqNo
        isValidateSeqBtnDisable={isValidateSeqBtnDisable}
        changeHandler={changeHandler}
        fullDataHandler={fullDataHandler}
        customCardData={customCardData}
      />
    </div>
  );
};

export default CustomCardLeft;
