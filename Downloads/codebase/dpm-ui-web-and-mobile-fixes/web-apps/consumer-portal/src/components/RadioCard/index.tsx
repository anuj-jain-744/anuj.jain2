import ThemeRadioCheckbox from "components/ThemeComponents/ThemeRadioCheckbox";
import React from "react";
import { Card } from "react-bootstrap";
import { CompensationType } from "../../types/common"
import { SelectPlanTypeKeys, IDetails } from "types/coverageplan";
import ListItemIcon from "../ListItemIcon"
import "./style.scss";
import RadioCardFooter from "./RadioCardFooter";
import ViewDetails from "./ViewDetails";
import { TravelData } from "types/languageData";

interface IRadioCard {
  radiokey: SelectPlanTypeKeys;
  cardlistitems: IDetails[];
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  coveragePlanSelected: SelectPlanTypeKeys | null | string;
  popup?:boolean;
  TravelData: TravelData | undefined | null;
}

const RadioCard: React.FC<IRadioCard> = ({
  radiokey,
  cardlistitems,
  label,
  checked,
  onChange,
  coveragePlanSelected,
  popup,
  TravelData
}) => {
  return (
    <Card
      className={
        checked
          ? "card-checked w-100 radio-card"
          : `card-unchecked w-100 radio-card ${
              coveragePlanSelected === null && "nothing-selected"
            }`
      }
    >
      <Card.Img
        variant="top"
        src={CompensationType(radiokey)}
        className="img-card"
      />
      <Card.Body className="body-card">
        <ThemeRadioCheckbox
          label={label}
          type="radio"
          defaultChecked={checked}
          classes="body-card-btn-title walaa-medium-500"
          onChangehandler={onChange}
          name="compensationtyperadio"
        />
        {cardlistitems?.map((item, key) => {
          return (
            <div
              className="d-flex walaa-regular-400 list-item-container"
              key={key}
            >
              {item?.id <= 3 && <ListItemIcon title={item?.itemname} />}
            </div>
          );
        })}
{popup && 
        <ViewDetails DetailsData={cardlistitems} label={label} />
}
      </Card.Body>
      <Card.Footer
        className={
          checked
            ? "footer footer-card-checked"
            : `footer footer-card-unchecked ${
                coveragePlanSelected === null && ""
              }`
        }
      >
        <div className="py-2">
          <RadioCardFooter label={radiokey} TravelData={TravelData} />
        </div>
      </Card.Footer>
    </Card>
  );
};

export default RadioCard;
