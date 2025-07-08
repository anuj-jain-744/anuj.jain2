import React from "react";
import style from "./Specifications.module.scss";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface SpecificationsProps {
  languageData: LanguageData | undefined | null;
}

const EngineValueBox: React.FC<{ title: string | undefined; value: string | undefined }> = ({ title, value }) => (
  <div className={style.engineValueBox}>
    <div className={style.engineValueTitle}>{title}</div>
    <div className={style.engineValueInput}>{value}</div>
  </div>
);

const Specifications: React.FC<SpecificationsProps> = ({languageData}) => {
  const { vehicleDetailsResponseData} = useQuoteAndBuyContext();
  return (
    <div className={style.container}>
      <div className={style.engineContainer}>
        <div className={style.engineTitle}>{languageData?.engine}</div>
        <div className={style.engineValue}>
          <EngineValueBox title={languageData?.engine_size} value={vehicleDetailsResponseData?.engineCapacity ?? " "} />
          <img src={verticleLine} alt="verticle line" />
          <EngineValueBox title={languageData?.transmission} value={vehicleDetailsResponseData?.transmissionType ?? " "} />
        </div>
      </div>
    </div>
  );
};

export default Specifications;