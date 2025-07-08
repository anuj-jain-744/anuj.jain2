import React, { useState, useEffect } from "react";
import "./index.scss";
import horizontalLine from "assets/QuoteAndBuy/horizontalLine.svg";
import { TravelData, CoveragePlan, CoveragePlanResponse } from "types/languageData";
import CoveragePlanType from "components/CoveragePlanType";
import CoverageOptions from "../../CoverageOptions"
import ChoosePlan from "components/ChoosePlan";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { SelectPlanTypeKeys } from "types/coverageplan";
import { useApiCall } from "@dpm/shared-module";
import { AlertBox } from "components/AlertBox";
import {INTERNAL_SERVER_ERROR, SOMETHING_WENT_WRONG, coverageTypeIdMap, travelerTypeIdMap } from "constant";

interface TravelCoveragePlanProps {
  TravelData: TravelData;
  setStepValue: (val: number) => void;
  proposerAge?: number;
}

const TravelCoveragePlan: React.FC<TravelCoveragePlanProps> = ({
  TravelData,
  proposerAge
}) => {

  const { setTravelCoveragePlan, travellerType, setTravelCoverage, travelcoverage, ownerDetailsResponseData, setTravelCoverageType, dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide, dataCoverageplanfamilyworldwideusa, dataCoverageplanfamilyeurope, setTravelCoverageTypeCode
  } = useQuoteAndBuyContext();
  const [travelCoverages, setTravelCoverages] = useState<string[]>([]);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [coveragePlanSelected, setCoveragePlanSelected] =
    useState<string>('');
  //change handler return for fileList




  let coverageplandata: CoveragePlan[] = [];
  const [dataCoveragePlan, setCoveragePlanData] = useState<CoveragePlanResponse | null>(null);
  const [codeid, setCodeid] = useState<string>("");
  // Get Coverages API call strats
  const { makeApiCall: makeTravelCoverageMasterApiCall, isLoading, errors, data: masterCoverageData } = useApiCall(21, `/MasterData/V1/GetCoverage/${travellerType}`, "get");

  useEffect(() => {
    makeTravelCoverageMasterApiCall();
  }, []);

  useEffect(() => {
    if (masterCoverageData) {
      let travelCoverages = masterCoverageData.model?.content?.map(
        (item) => item.codeId
      ) ?? [];
      if (travellerType === travelerTypeIdMap.self && proposerAge && proposerAge > 80) {
        travelCoverages = travelCoverages.filter(
          item => item.codeId === coverageTypeIdMap.europe
        );
      }
      setTravelCoverages(travelCoverages);
    }
  }, [masterCoverageData, proposerAge]);
  // Get Coverages API call ends

  if (travellerType === travelerTypeIdMap.self && proposerAge && proposerAge > 80) {
    coverageplandata = TravelData?.travel_coverage_plan?.filter((plan) =>
      plan.codeid === coverageTypeIdMap.europe
    ) || [];
  } else {
    coverageplandata = TravelData?.travel_coverage_plan?.filter((plan) =>
      travelCoverages.includes(plan.codeid)
    ) || [];
  }
  //GETTING THE COVERAGE PLAN DATA

  const onchangeHandlerCoveragePlanType = async (event: React.ChangeEvent<HTMLInputElement>, codeid: string) => {
    setCodeid(codeid);
    const { value } = event?.target as HTMLInputElement;
    const res = value?.split(" ")?.join("")?.toLocaleLowerCase();
    setCoveragePlanSelected(codeid);
    setTravelCoverage(codeid);
    setTravelCoveragePlan(res as SelectPlanTypeKeys);
    setTravelCoverageType(null)
  };

  const setCoverageSelf = (typeOfCoverage: string) => {
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
  const setCoverageFAmily = (typeOfCoverage: string) => {
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
    if (travellerType === travelerTypeIdMap.family) {
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
      setCoveragePlanSelected(travelcoverage)
      if (travellerType === travelerTypeIdMap.family) {
        setCoverageFAmily(travelcoverage);
      } else {
        setCoverageSelf(travelcoverage);
      }
    }
  }, []);


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
