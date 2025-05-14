import { Modal } from "react-bootstrap";
import "./style.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { sanitizeHtml, useApiCall } from "@dpm/shared-module";
import { useEffect, useState } from "react";
import { useCoveragePlanApi } from "hook/travel/useCoveragePlanApi";
import useUpdateCoveragePlanPayload from "hook/travel/useUpdateCoveragePlanRequestPayload";
import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import {
  cleanSpaces,
  getTravellerCountsWithoutPrimary,
  toTitleCase
} from "utils/quoteAndBuy";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

interface ResumeJourneyProps {
  readonly onContinue: () => void;
  readonly onNew: () => void;
  readonly show: boolean;
  readonly languageData: LanguageData;
  readonly setLeftStep: (step: number) => void;
  readonly redisData: string | object;
}

function ResumeJourney({
  onContinue,
  onNew,
  show,
  languageData,
  setLeftStep,
  redisData,
}: ResumeJourneyProps) {
  const [isContunueClicked, setIsContunueClicked] = useState<boolean>(false);
  const [isAlldependenciesLoaded, setIsAllDependenciesLoaded] = useState<boolean>(false);
  const { handlecoveragePlanSelf, handlecoveragePlanFamily } = useCoveragePlanApi(setLeftStep)
  const {
    ownerDetailsResponseData,
    setOwnerDetailsResponseData,
    primaryTravelers,
    setAdultCount,
    setChildCount,
    setSrCitizenCount,
    travelStartDate,
    setTravelStartDate,
    isToggleOn,
    setIsToggleOn,
    setTotalCount,
    setSelectedPeriod,
    setTravelCoverage,
    setTravelCoverageType,
    setTravelCoverageTypeCode,
    setTravelCoveragePlan,
    setTravellerType,
    setPrimaryTravelers,
    setTravelers,
    setTravelersChild,
    setTravelersSrcitizen,
    setworldwideFamilyCPPrice,
    setworldwideSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    seteuropeSelfCPPrice,
    setJourneyData,
    travelcoverageType,
    travelcoveragePlan,
    travellerType,
    travelcoverageTypeCode,
  } = useQuoteAndBuyContext();
  const coveragePlanPayload = useUpdateCoveragePlanPayload();

  const handleContinue = async () => {
    if (redisData) {
      let data = redisData;
      let jsonData = redisData;
      if (typeof jsonData === "string") data = JSON.parse(jsonData);
      else jsonData = JSON.stringify(redisData);
      const timestamp = Date.now();
      let idCount = 1;
      const childCount = data?.childCount ? parseInt(data.childCount) : 0;
      const adultCount = data?.adultCount ? parseInt(data.adultCount) : 0;
      const seniorCount = data?.srCitizenCount
        ? parseInt(data.srCitizenCount)
        : 0;
      const primary = Array.isArray(data?.primaryTravelers)
        ? data.primaryTravelers
        : primaryTravelers;

      if (primary[0]) {
        primary[0].travellerNameEnglish =
          toTitleCase(cleanSpaces(primary[0].travellerNameEnglish));
        if (!primary[0].uiId)
          primary[0] = {
            ...primary[0],
            uiId: `${timestamp}`,
            type: familtyFlowConstants.TITLES.SELF,
          };
        if (!primary[0].policyCoverage) primary[0].policyCoverage = [];
      }
      const counts = getTravellerCountsWithoutPrimary(primary[0], {
        child: childCount,
        adult: adultCount,
        senior: seniorCount,
      });
      const children = Array.isArray(data?.travelersChild)
        ? data.travelersChild
        : [];
      const adults = Array.isArray(data?.travelers) ? data.travelers : [];
      const seniors = Array.isArray(data?.travelersSrcitizen)
        ? data.travelersSrcitizen
        : [];
      const updateTravellers = (
        persons: Array<travelersInfo>,
        update: (data: Array<travelersInfo>) => void,
        count: number,
        type: string
      ) => {
        const items = [];
        for (let index = 0; index < count; index++) {
          if (persons[index]?.uiId) items.push(persons[index]);
          else {
            items.push({
              ...persons[index],
              uiId: `${timestamp}${idCount++}`,
              policyCoverage: persons[index]?.policyCoverage ?? [],
              type,
            });
          }
          items[index].nationalIqamaId = items[index].uiId;
          items[index].nationality = primary[0]?.nationality ?? "";
        }
        update(items);
      };
      setAdultCount(adultCount);
      setChildCount(childCount);
      setSrCitizenCount(seniorCount);
      if (primary.length > 0) setPrimaryTravelers(primary);
      updateTravellers(
        children,
        setTravelersChild,
        counts.child,
        familtyFlowConstants.TITLES.CHILD
      );
      updateTravellers(
        adults,
        setTravelers,
        counts.adult,
        familtyFlowConstants.TITLES.ADULT
      );
      updateTravellers(
        seniors,
        setTravelersSrcitizen,
        counts.senior,
        familtyFlowConstants.TITLES.SR_CITIZEN
      );

      setTravelStartDate(data?.travelStartDate);
      setTotalCount(data?.totalCount ? parseInt(data.totalCount) : 0);
      const travelPeriod = data?.selectedPeriod?.value ?? "";
      if (travelPeriod !== "") setSelectedPeriod(data?.selectedPeriod);
      setIsToggleOn(data?.isToggleOn);
      setTravelCoverage(data?.travelcoverage);
      setTravellerType(data?.travellerType);
      setTravelCoverageType(data?.travelcoverageType);
      setTravelCoverageTypeCode(data?.travelcoverageTypeCode);
      setTravelCoveragePlan(data?.travelcoveragePlan);
      setworldwideFamilyCPPrice(
        data?.worldwideFamilyCPPrice ? data?.worldwideFamilyCPPrice : {}
      );
      setworldwideSelfCPPrice(
        data?.worldwideSelfCPPrice ? data?.worldwideSelfCPPrice : {}
      );
      setworldwideexceptSelfCPPrice(
        data?.worldwideexceptSelfCPPrice ? data?.worldwideexceptSelfCPPrice : {}
      );
      seteuropeSelfCPPrice(
        data?.europeSelfCPPrice ? data?.europeSelfCPPrice : {}
      );
      setIsAllDependenciesLoaded(true);
      setIsContunueClicked(true);
      if (data?.currentStep === 2) {
        const formattedTravelStartDate = travelStartDate
          ?.toLocaleString()
          ?.split("/")
          .reverse()
          .join("-");
        const date = new Date(formattedTravelStartDate as string);
        const formattedDate = formatDate(date);
        ///1=Family, 2=Self
        if (coveragePlanPayload !== null) {
          coveragePlanPayload.policyEffectiveDate = formattedDate;
          coveragePlanPayload.travelDuration = travelPeriod;
          const travellerTypeCode = travellerType === "1" ? "1" : "2";
          if (travellerTypeCode === "1") {
            await handlecoveragePlanFamily(coveragePlanPayload);
          } else {
            await handlecoveragePlanSelf(coveragePlanPayload);
          }
        }
      }
      setJourneyData(jsonData);
      setLeftStep(data.currentStep ? parseInt(data.currentStep) : 0);
      setIsContunueClicked(false);
    }
    onContinue();
  };

  const replaceName = (text: string, actualName: string): string => {
    return text.replace("User", actualName);
  };
  const tName = ownerDetailsResponseData?.ownerFullNameEnglish ?
    ownerDetailsResponseData?.ownerFullNameEnglish : "";
  return (
    <Modal
      className="resume-jorney-parent-container-travel"
      show={show}
      centered
    >
      {/* {isLoading && <LoaderOverlay />} */}
      <div className="resume-journey-container">
        <div className="journey walaa-medium-500">
          {languageData?.resume_your_travel_insurance}
        </div>
        <div className="journey-content"
          dangerouslySetInnerHTML={
            {
              __html:
                sanitizeHtml(replaceName(languageData?.dear_user_would_you_like, tName))
            }
          }
        >
        </div>
        <hr className="horizontal-line" />
        <div className="bottom-btns">
          <ThemeButton
            isDisabled={false}
            title={languageData?.continue_from_where_left}
            classes={"continue-btn walaa-regular-400"}
            variant="outline"
            onClickhandler={handleContinue}
          />
          <ThemeButton
            isDisabled={false}
            title={languageData?.start_new_quotation}
            classes={"new-quotation-btn walaa-regular-400"}
            variant="policyPrimary"
            onClickhandler={onNew}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ResumeJourney;
