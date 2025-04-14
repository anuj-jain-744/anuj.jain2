import React, { useEffect } from "react";
import { Card, Placeholder } from "react-bootstrap";
import { CompensationTypeKeys, IDetails } from "types/coverageplan";
import ListItemIcon from "../ListItemIcon";
import "./style.scss";
import RadioCardFooter from "./RadioCardFooter";
import ViewDetails from "./ViewDetails";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface IRadioCard {
  radiokey: CompensationTypeKeys;
  languageData: LanguageData | undefined | null;
  cardlistitems: IDetails[];
  label: string;
  checked: boolean;
  onChange: (title: string) => void;
  isRepairTypeSelected?: boolean;
  coveragePlanSelected?: CompensationTypeKeys | null;
  imageLink: string;
  disabled?: boolean;
}

const RadioCard: React.FC<IRadioCard> = ({
  radiokey,
  languageData,
  cardlistitems,
  label,
  checked,
  onChange,
  imageLink,
  disabled,
}) => {
  
  const { setSelectedBenefits, repairTypeSelected, setRepairTypeSelected, coverageType, availableRepairTypes } = useQuoteAndBuyContext();

  const handleOnChange = (title: string) => {
    if (!disabled) {
      onChange(title);
      setSelectedBenefits([]);
    }
  };

  useEffect(() => {
    setRepairTypeSelected(repairTypeSelected)
  }, [repairTypeSelected]);

  return (
    <Card
      className={
        `${checked ? "card-checked" : "card-unchecked"} w-50 radio-card ${disabled ? "card-disabled" : ""}`
      }
      title={label}
      onClick={() => handleOnChange(label)}
      data-testid="radiocard-test"
    >
      {imageLink ? (
        <Card.Img
          variant="top"
          src={imageLink}
          className="img-card"
          loading="lazy"
        />
      ) : (
        <Placeholder
          className="img-card"
          style={{ height: "129px" }}
          animation="glow"
        />
      )}
      <Card.Body className="body-card">
        <div className="d-flex align-items-center">
          <div
            className={
              checked
                ? "radio-dummy-container radio-dummy-container-checked"
                : `radio-dummy-container radio-dummy-container-unchecked`
            }
          >
            <div
              className={
                checked
                  ? "radio-dummy-inner-circle radio-dummy-inner-circle-checked"
                  : `radio-dummy-inner-circle radio-dummy-inner-circle-unchecked`
              }
            ></div>
          </div>
          <div className="ps-2 card-box-title"><h5>{label}</h5></div>
        </div>
        
        {cardlistitems?.map((item, key) => {
          return (
            <div
              className={
                item?.itemname?.length > 41
                  ? "d-flex walaa-regular-400 list-item-container"
                  : "d-flex align-items-center walaa-regular-400 list-item-container"
              }
              key={key}
            >
              {item?.id <= 2 && <ListItemIcon title={item?.itemname} />}
            </div>
          );
        })}

        <ViewDetails DetailsData={cardlistitems} label={label} />
      </Card.Body>
      <Card.Footer
        className={
          checked
            ? "footer footer-card-checked"
            : `footer footer-card-unchecked ${
              coverageType === null && ""
              }`
        }
      >
        <div className="py-2">
          <RadioCardFooter label={radiokey} languageData={languageData} />
        </div>
      </Card.Footer>
    </Card>
  );
};

export default RadioCard;