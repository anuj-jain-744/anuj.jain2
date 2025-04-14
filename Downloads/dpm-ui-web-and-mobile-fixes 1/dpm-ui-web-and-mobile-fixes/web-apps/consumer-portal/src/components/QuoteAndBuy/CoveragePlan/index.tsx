import React, { useState, useEffect } from "react";
import "./index.scss";
import horizontalLine from "assets/QuoteAndBuy/horizontalLine.svg";
import { TravelData, CoveragePlan, CoveragePlanResponse, CoverageTypes } from "types/languageData";
import CoveragePlanType from "components/CoveragePlanType";
import Coverageplandata from "../Mockdata/data.json";
import coveragtypeData from "../MockData/coveragtype.json";
import CoverageOptions from "../../CoverageOptions"
import ChoosePlan from "components/ChoosePlan";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { SelectPlanTypeKeys } from "types/coverageplan";
import { useApiCall } from "@dpm/shared-module";
import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { AlertBox } from "components/AlertBox";
import SquareLoader from "../../../assets/QuoteAndBuy/square_loader.gif";
import { INTERNAL_SERVER_ERROR, SOMETHING_WENT_WRONG,TRAVEL_PLAN_TYPE } from "constant";

interface TravelCoveragePlanProps {
  TravelData: TravelData;
  setStepValue: (val: number) => void;
}

const TravelCoveragePlan: React.FC<TravelCoveragePlanProps> = ({
  TravelData,
  setStepValue
}) => {

  const { travelcoverageTypeCode,travelcoveragePlan,setTravelCoveragePlan, travellerType, setTravelCoverage, travelcoverage, selectedPeriod, travelStartDate, ownerDetailsResponseData, setTravelCoverageType, dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide, dataCoverageplanfamilyworldwideusa, dataCoverageplanfamilyeurope,setTravelCoverageTypeCode
  } = useQuoteAndBuyContext();
  const [travelCoverages, setTravelCoverages] = useState<string[]>([]);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [coveragePlanSelected, setCoveragePlanSelected] =
    useState<null | string>(null);
  //change handler return for fileList




  let coverageplandata: CoveragePlan[] = [];
  const [dataCoveragePlan, setCoveragePlanData] = useState<CoveragePlanResponse | null>(null);
  const [codeid, setCodeid] = useState<string>("");


  // Get Coverages API call strats
  let travellerTypeCode = travellerType === "1" ? "1" : "2";
  const { makeApiCall: makeTravelCoverageMasterApiCall, isLoading, errors, data: masterCoverageData } = useApiCall(21, `/MasterData/V1/GetCoverage/${travellerTypeCode}`, "get");

  useEffect(() => {
    makeTravelCoverageMasterApiCall();
  }, []);

  useEffect(() => {
    if (masterCoverageData) {

      const travelCoverages = (masterCoverageData as any).model?.content?.map(
        (item: any) => item.codeId
      );
      setTravelCoverages(travelCoverages);

    }
  }, [masterCoverageData]);
  // Get Coverages API call ends
  coverageplandata = TravelData?.travel_coverage_plan?.filter((plan) =>
    travelCoverages.includes(plan.codeid)
  ) || [];
  //GETTING THE COVERAGE PLAN DATA

  const date = new Date(travelStartDate as string);
  const formattedDate = formatDate(date);

  const onchangeHandlerCoveragePlanType = async (event: React.ChangeEvent<HTMLInputElement>, codeid: string) => {
    setCodeid(codeid);
    const { value } = event?.target as HTMLInputElement;
    const res = value?.split(" ")?.join("")?.toLocaleLowerCase();
    setCoveragePlanSelected(res);
    setTravelCoverage(res);
    setTravelCoveragePlan(res as SelectPlanTypeKeys);
    setTravelCoverageType(null)
  };

  const setCoverageSelf = (typeOfCoverage) => {
    switch (typeOfCoverage) {

      case "1":
        setCoveragePlanData(dataCoverageplanselfworldwide);
        break;
      case "2":
        setCoveragePlanData(dataCoverageplanselfworldwideusa);
        break;
      case "3":
        setCoveragePlanData(dataCoverageplanselfeurope);
        break;
      default:
        break
    }
  };
  const setCoverageFAmily = (typeOfCoverage) => {
    switch (typeOfCoverage) {

      case "1":
        setCoveragePlanData(dataCoverageplanfamilyworldwide);
        break;
      case "2":
        setCoveragePlanData(dataCoverageplanfamilyworldwideusa);
        break;
      case "3":
        setCoveragePlanData(dataCoverageplanfamilyeurope);
        break;
      default:
        break
    }
  };
  useEffect(() => {

    if (travellerTypeCode === "1") {
      setCoverageFAmily(codeid);

    } else {
      setCoverageSelf(codeid);

    }
  }, [codeid]);


  const handleClose = () => {
    setShowAlertModal(false);
  };

  useEffect(() => {
    if (errors) {
      setApiErrorMessage({
        title: errors?.name || INTERNAL_SERVER_ERROR,
        description: errors.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [errors]);
  useEffect(() => {
   
      if (travelcoverage) {
     const editcodeid= travelcoverage===TRAVEL_PLAN_TYPE.world_wide?"1":travelcoverage===TRAVEL_PLAN_TYPE.europe?"3":"2";  
     setCoveragePlanSelected(travelcoverage);
     if (travellerTypeCode === "1") {
      setCoverageFAmily(editcodeid);
      } else {
      setCoverageSelf(editcodeid);
      }
      
    }
    
  }, [travelcoverage]);


  return (
    <div className="mainContainer">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      <div className="vehicleContainer">
        <div className="vehicleHeading">
          <div className="row w-100 d-flex align-items-center">
            <div className="col">
              <div className="vehicleTitle">{TravelData?.select_coverage_plan}</div>
            </div>
            <div className="col d-flex align-items-center justify-content-end pe-0">

            </div>
          </div>
        </div>
        <img src={horizontalLine} alt="horizontalLine" />

        <div className="vehicleBody">
          <CoveragePlanType
            TravelData={TravelData}
            coveragePlanData={coverageplandata}
            onChange={onchangeHandlerCoveragePlanType}
            coveragePlanSelected={coveragePlanSelected}
          />
          {(coveragePlanSelected) && (
            <CoverageOptions travelType={travellerType} coveragedata={dataCoveragePlan?.data} TravelData={TravelData} coveragePlanSelected={coveragePlanSelected} />
          )}
          {(coveragePlanSelected) && (
            <ChoosePlan choosePlanData={TravelData} />
          )}


        </div>
      </div>
    </div>
  );
};

export default TravelCoveragePlan;
