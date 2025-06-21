import React from "react";
import style from "./Card.module.scss";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getPlateNumber } from "utils/getPlateNumber";
import { NOT_APPLICABLE } from "@dpm/shared-module";
import { getVehicleMakeModel } from "utils/quoteAndBuy";
import { getModelIcon } from "utils/getModelIcon";

interface CardProps {
  languageData: LanguageData | undefined | null;
}

const Card: React.FC<CardProps> = ({ languageData }) => {
  const { vehicleDetails, vehicleDetailsResponseData, makeModelResponse } =
    useQuoteAndBuyContext();
  return (
    <div className={style.container}>
      <div className={style.frame}>
        <div className={style.rowOne}>
          <div className={style.title}>
            <div className={style.product}>
                <img
                  width={"48px"}
                  height={"48px"}
                  className={style.productIcon}
                  src={
                    getModelIcon(
                      vehicleDetailsResponseData?.vehicleMakeTextEn,
                      vehicleDetailsResponseData?.vehicleMakeId,
                      makeModelResponse || []
                    )
                  }
                  alt="product icon"
                />
              <div className={style.formElement}>
                <div className={style.label}>
                  {getVehicleMakeModel(vehicleDetailsResponseData) ??
                    NOT_APPLICABLE}
                </div>
                 {/* Keeping in case we need it later */}
                {/* <div className={style.input}>
                  {vehicleDetailsResponseData
                    ? getPlateNumber(vehicleDetailsResponseData)
                    : ""}
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className={style.rowTwo}>
          <div className={style.ViewField}>
            <div className={style.label}>{languageData?.number_plate}</div>
            <div className={style.input}>
              {vehicleDetailsResponseData
                ? getPlateNumber(vehicleDetailsResponseData)
                : ""}
            </div>
          </div>
          <img src={verticleLine} alt="verticle line" />
          <div className={style.ViewField}>
            <div className={style.label}>
              {languageData?.registration_year_label}
            </div>
            <div className={style.input}>
              {vehicleDetailsResponseData?.manufactureYear ?? NOT_APPLICABLE}
            </div>
          </div>
          <img src={verticleLine} alt="verticle line" />
          <div className={style.ViewField}>
            <div className={style.label}>
              {vehicleDetails?.vehicleSequenceNo
                ? languageData?.vehicle_sequence
                : "CustomCard No"}
            </div>
            <div className={style.input}>
              {vehicleDetails?.vehicleSequenceNo
                ? vehicleDetails?.vehicleSequenceNo
                : vehicleDetails?.vehicleCustomID}
            </div>
          </div>
          <img src={verticleLine} alt="verticle line" />
          <div className={style.ViewField}>
            <div className={style.label}>{languageData?.chassis_no}</div>
            <div className={style.input}>
              {vehicleDetailsResponseData?.chassisNumber ?? " "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
