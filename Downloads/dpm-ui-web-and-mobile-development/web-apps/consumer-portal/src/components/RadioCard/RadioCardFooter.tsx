import React, { useEffect } from "react";
import { IWorldwide, IworldwideExcept } from "../../types/coverageplan";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { compensationTypeCardFinalVAT, worldwidecoveragePlanPremium, worldwideexceptcoveragePlanPremium, europecoveragePlanPremium, worldwidecoverageFamilyPlanPremium } from "components/QuoteAndBuy/Commonfunction"

import { TravelData } from "types/languageData";
import { Travel } from "pages/travel";
import { getAmountWithIcon } from "@app-shell/utils/common";
interface TravellerTypeSelect {
  TravelData: TravelData | undefined | null;
}
interface IRadioCardFooter {
  label: string;
  TravelData: TravelData | undefined | null;
}

const WorldwideexceptFooter = ({ TravelData }: TravellerTypeSelect) => {
  const {
    dataCoverageplanselfworldwideusa,
    worldwideexceptCardPrice,
    setworldwideexceptCardPrice,
    setworldwideexceptCoveragePrice

  } = useQuoteAndBuyContext();


  useEffect(() => {
    if (
      dataCoverageplanselfworldwideusa
    ) {
      const priceData = worldwideexceptcoveragePlanPremium(dataCoverageplanselfworldwideusa?.data);
      setworldwideexceptCardPrice(priceData?.minFinalPrice);
      setworldwideexceptCoveragePrice(priceData);
    }
  }, [

    dataCoverageplanselfworldwideusa
  ]);

  return (
    <React.Fragment>
      <div className="walaa-medium-500">{TravelData?.starting_from}</div>
      <div className="d-flex align-items-center">
        <div>
          <span className="footer-denomination">{getAmountWithIcon(worldwideexceptCardPrice,'walaa-medium-500 footer-amount')}&nbsp;</span>
        </div>
        <div className="walaa-regular-400 footer-vat">+ {compensationTypeCardFinalVAT(
          dataCoverageplanselfworldwideusa?.data?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[0]
            ?.percentage as number
        )}% {TravelData?.vat}</div>
      </div>
    </React.Fragment>
  );
};

const WorldwideFooter = ({ TravelData }: TravellerTypeSelect) => {
  const {
    dataCoverageplanselfworldwide,
    dataCoverageplanfamilyworldwide,
    worldwideCardPrice,
    travellerType,
    setworldwideCardPrice,
    setworldwideCoveragePrice,
    setworldwideFamilyCoveragePrice

  } = useQuoteAndBuyContext();


  useEffect(() => {
    if (
      dataCoverageplanselfworldwide

    ) {

      const priceData = worldwidecoveragePlanPremium(dataCoverageplanselfworldwide?.data);
      setworldwideCardPrice(priceData?.minFinalPrice);
      setworldwideCoveragePrice(priceData);


    }
  }, [

    dataCoverageplanselfworldwide,

  ]);
  useEffect(() => {
    if (
      dataCoverageplanfamilyworldwide
    ) {
      const priceData = worldwidecoverageFamilyPlanPremium(dataCoverageplanfamilyworldwide?.data);
      setworldwideCardPrice(priceData?.minFinalPrice);
      setworldwideFamilyCoveragePrice(priceData);

    }
  }, [

    dataCoverageplanfamilyworldwide,

  ]);
  return (
    <React.Fragment>
      <div className="walaa-medium-500">{TravelData?.starting_from}</div>
      <div className="d-flex align-items-center">
        <div>
          <span className="footer-denomination">{getAmountWithIcon(worldwideCardPrice,'walaa-medium-500 footer-amount')}&nbsp;</span>
        </div>
        <div className="walaa-regular-400 footer-vat">+ {travellerType==="1" ? compensationTypeCardFinalVAT(
          dataCoverageplanfamilyworldwide?.data?.coverageTypes[0].pricingOptions[0]?.taxFeeBreakdowns[0]
            ?.percentage as number
        ): compensationTypeCardFinalVAT(
          dataCoverageplanselfworldwide?.data?.coverageTypes[0].pricingOptions[0]?.taxFeeBreakdowns[0]
            ?.percentage as number
        )}% {TravelData?.vat}</div>
      </div>
    </React.Fragment>
  );
};


const EuropeFooter = ({ TravelData }: TravellerTypeSelect) => {
  const {
    dataCoverageplanselfeurope,
    EuropeCardPrice,
    setEuropeCardPrice,
    seteuropeCoveragePrice

  } = useQuoteAndBuyContext();


  useEffect(() => {
    if (
      dataCoverageplanselfeurope
    ) {
      const priceData = europecoveragePlanPremium(dataCoverageplanselfeurope?.data);
      setEuropeCardPrice(priceData?.minFinalPrice);
      seteuropeCoveragePrice(priceData);
    }
  }, [

    dataCoverageplanselfeurope

  ]);
  return (
    <React.Fragment>
      <div className="walaa-medium-500">{TravelData?.starting_from}</div>
      <div className="d-flex align-items-center">
        <div>
          <span className="footer-denomination">{getAmountWithIcon(EuropeCardPrice,'walaa-medium-500 footer-amount')}&nbsp;</span>
        </div>
        <div className="walaa-regular-400 footer-vat"> + {compensationTypeCardFinalVAT(
          dataCoverageplanselfeurope?.data?.coverageTypes[0].pricingOptions[0]?.taxFeeBreakdowns[0]
            ?.percentage as number
        )}% {TravelData?.vat}</div>
      </div>
    </React.Fragment>

  );
};

const RadioCardFooter: React.FC<IRadioCardFooter> = ({ label, TravelData }) => {
  return (
    <React.Fragment>
      {label === IWorldwide ? (
        <WorldwideFooter TravelData={TravelData} />
      ) : label === IworldwideExcept ? (
        <WorldwideexceptFooter TravelData={TravelData} />
      ) : (
        <EuropeFooter TravelData={TravelData} />
      )
      }
    </React.Fragment>
  );
};

export default RadioCardFooter;
