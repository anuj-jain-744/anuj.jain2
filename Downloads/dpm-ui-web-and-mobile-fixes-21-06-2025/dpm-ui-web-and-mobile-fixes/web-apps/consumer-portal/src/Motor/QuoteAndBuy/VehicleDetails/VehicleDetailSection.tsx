import React, { useEffect } from "react";
import style from "./VehicleDetails.module.scss";
import VehicleDetailsCard from "./VehilceDetailsCard/VehicleDetailsCard";
import { LanguageData } from "types/languageData";
import BuyProductHeading from "components/BuyProductHeading";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

interface VehicleDetailSectionProps {
  languageData: LanguageData | undefined | null;
  leftStep?: number;
  navigateTo?: (url: string) => void;
  setLeftStep?: (val: number) => void;
}

const VehicleDetailSection: React.FC<VehicleDetailSectionProps> = ({languageData, leftStep, navigateTo, setLeftStep}) => {

  const { setCountryData } = useQuoteAndBuyContext();
  const {
    makeApiCall,
    data,
} = useApiCall(12, "/MasterData/V1/getCountryCodes", "get");

useEffect(() => {
  fetchData();
}, []);

useEffect(() => {
  if(data) {
      data && setCountryData(data?.model?.content);
  }
}, [data]);

const fetchData = async () => {
    await makeApiCall();
};
  return (
    <>
      <div className={style.mainContainer}>
        <div className={style.vehicleContainer}>
          {languageData?.vehicle_details && <BuyProductHeading heading={languageData?.vehicle_details}  />}
          <div className={style.vehicleBody}>
            <VehicleDetailsCard languageData={languageData} leftStep={leftStep} setLeftStep={setLeftStep} navigateTo={navigateTo}/>
          </div>
          {/*need in future stories*/}
          {/* <hr className={style.horizontalLine} />
          <div className={style.vehicleFooter}>
            <ThemeButton
              variant="outlineVehicleDetails"
              title={languageData?.add_another_vehicle}
              classes="walaa-medium-500"
            />
            <div className={style.vehicleFooterText}>
              {languageData?.the_policy_allows}.
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default VehicleDetailSection;
