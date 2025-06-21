import { useContext } from "react";
import CompensationTypeCardRadio from "Motor/Claims/Comprehensive/RegisterClaim/RegisterClaimLeft/Components/CompensationTypeCardRadio";
import { DataContext } from "../../../../../DataContext";

interface ICompensationType {
  isBankTransferSelected: boolean;
  isDamageRepairSelected: boolean;
  changeHandler:(event: React.ChangeEvent<HTMLInputElement>)=>void;
}
const CompensationType = ({
  isBankTransferSelected,
  isDamageRepairSelected,
  changeHandler,
}: ICompensationType) => {
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="compensation-type">
      <div className="radio-btns walaa-medium-500">
        <CompensationTypeCardRadio
          cardimgname="BankTransfer"
          radiobuttonname={Data?.bank_transfer}
          radioname="Bank Transfer"
          isradioSelected={isBankTransferSelected}
          changeHandler={changeHandler}
          
        />

        <CompensationTypeCardRadio
          cardimgname="DamageRepair"
          radiobuttonname={Data?.damage_repair}
          radioname="Damage Repair"
          isradioSelected={isDamageRepairSelected}
          changeHandler={changeHandler}
        />
      </div>
    </div>
  );
};

export default CompensationType;
