import { Card } from "react-bootstrap";
import BankTransfer from "assets/Claims/BankTransfer.png";
import DamageRepair from "assets/Claims/DamageRepair.png";
import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";

interface ICompensationTypeCardRadio {
  cardimgname: string;
  radiobuttonname: string;
  radioname: string;
  isradioSelected: boolean;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const CompensationTypeCardRadio = ({
  cardimgname,
  radiobuttonname,
  radioname,
  isradioSelected,
  changeHandler,
}: ICompensationTypeCardRadio) => {
  //card image renderer
  function CompensationTypeCardImg(name: string) {
    switch (name) {
      case "BankTransfer":
        return BankTransfer;
      case "DamageRepair":
        return DamageRepair;
    }
  }
  return (
    <Card className={isradioSelected ? "card-active" : "card-inactive"}>
      <Card.Img variant="top" src={CompensationTypeCardImg(cardimgname)} />
      <Card.Body>
        <Card.Title>
          <ThemeRadioCheckbox
            classes={
              isradioSelected
                ? "compensationtyperadio compensationtyperadioselected"
                : "compensationtyperadio"
            }
            defaultChecked={isradioSelected}
            label={radioname}
            type="radio"
            name="compensationType"
            onChangehandler={changeHandler}
          />
        </Card.Title>
      </Card.Body>
    </Card>
  );
};
export default CompensationTypeCardRadio;
