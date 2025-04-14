import React, { useEffect, useState } from "react";
import { getAge } from "utils/getAge";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import {
  worldwidecalculatePremium,
  worldwideexceptcalculatePremium,
  europecalculatePremium,
  worldwideFamilycalculatePremium,
} from "../QuoteAndBuy/Commonfunction";
import AddAdditionalTraveller from "./AddAdditionalTraveller";
import TravelerFamily from "./TravelerFamily";
import "./index.scss";
import { familtyFlowConstants } from "components/Travel/constantsTravel";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

interface TravelerAddDetailsData {
  data: { [key: string]: string };
}
interface TravelerInputs {
  travellerNameEnglish: string;
  dateOfBirth?: string;
  passportExpiryDate: string;
  passportNumber: string;
  relation?: string;
}
const TravelerAddDetails: React.FC<TravelerAddDetailsData> = ({ data }) => {
  const [primaryTravellerInputs, setPrimaryTravellerInputs] = useState<{
    [key: string]: string | number;
  }>({
    primaryTraveller: "",
    primaryTravellerPassportNo: "",
    primaryTravellerPassportExpiryDate: "",
    primaryTravellerDOB: "",
  });
  const {
    settravelCovidcoverage,
    settravelWintersportscoverage,
    dataWorldwidepearl,
    isAddTravelerValidation,
    setIsAddTravelerValidation,
    dataWorldwidetraveller,
    setworldwidepearlInitialPrice,
    setworldwidetravellerInitialPrice,
    setworldwideCardPrice,
    setdataworldwidepearlVAT,
    setdataworldwidepearladminfee,
    setdataworldwidepearlnetpremium,
    setdataworldwidetravellerVAT,
    setdataworldwidetravelleradminfee,
    setdataworldwidetravellernetpremium,
    travelCovidcoverage,
    travelWintersportscoverage,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    setworldwideexceptpearlInitialPrice,
    setworldwideexcepttravellerInitialPrice,
    setworldwideexceptCardPrice,
    setdataworldwideexceptpearlVAT,
    setdataworldwideexceptpearladminfee,
    setdataworldwideexceptpearlnetpremium,
    setdataworldwideexcepttravellerVAT,
    setdataworldwideexcepttravelleradminfee,
    setdataworldwideexcepttravellernetpremium,
    dataEuropeeurope,
    dataEuropeschengen,
    setEuropeeuropeInitialPrice,
    setEuropeschengenInitialPrice,
    setEuropeCardPrice,
    setEuropeeuropeVAT,
    setdataEuropeeuropeadminfee,
    setdataEuropeeuropenetpremium,
    setdataEuropeschengenVAT,
    setdataEuropeschengenadminfee,
    setdataEuropeschengennetpremium,
    ownerDetailsResponseData,
    setpTravelername,
    setpTravelerPassportno,
    setpTravelerPassportexpiry,
    pTravelerPassportexpiry,
    pTravelerPassportno,
    pTravelername,
    policyStartDate,
    adultCount,
    setAdultCount,
    childCount,
    setChildCount,
    srCitizenCount,
    setSrCitizenCount,
    primaryTravelers,
    setPrimaryTravelers,
    travelers,
    setTravelers,
    travelersChild,
    setTravelersChild,
    travelersSrcitizen,
    setTravelersSrcitizen,
    dataworldwideCoverageFamily,
    setworldwideFamilyCPPrice,
    travellerType,
    setTotalCount,
    setworldwideSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    seteuropeSelfCPPrice,
  } = useQuoteAndBuyContext();
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);

  useEffect(() => {
    if (dataWorldwidepearl && dataWorldwidetraveller) {
      const priceData = worldwidecalculatePremium(
        dataWorldwidepearl,
        dataWorldwidetraveller
      );
      setworldwidepearlInitialPrice(
        priceData?.dataworldwidepearlFinalPrice ?? null
      );
      setworldwidetravellerInitialPrice(
        priceData?.dataworldwidetravellerFinalPrice ?? null
      );
      setworldwideCardPrice(priceData?.minFinalPrice);
      setdataworldwidepearlVAT(priceData?.dataworldwidepearlVAT);
      setdataworldwidepearladminfee(priceData?.dataworldwidepearladminfee);
      setdataworldwidepearlnetpremium(priceData?.dataworldwidepearlnetpremium);
      setdataworldwidetravellerVAT(priceData?.dataworldwidetravellerVAT);
      setdataworldwidetravelleradminfee(
        priceData?.dataworldwidetravelleradminfee
      );
      setdataworldwidetravellernetpremium(
        priceData?.dataworldwidetravellernetpremium
      );
      setworldwideSelfCPPrice(priceData);
    }
  }, [
    dataWorldwidepearl,
    dataWorldwidetraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);
  useEffect(() => {
    if (dataWorldwideexceptpearl && dataWorldwideexcepttraveller) {
      const priceData = worldwideexceptcalculatePremium(
        dataWorldwideexceptpearl,
        dataWorldwideexcepttraveller
      );
      setworldwideexceptpearlInitialPrice(
        priceData?.dataworldwideexceptpearlFinalPrice ?? null
      );
      setworldwideexcepttravellerInitialPrice(
        priceData?.dataworldwideexcepttravellerFinalPrice ?? null
      );
      setworldwideexceptCardPrice(priceData?.minFinalPrice);
      setdataworldwideexceptpearlVAT(priceData?.dataworldwideexceptpearlVAT);
      setdataworldwideexceptpearladminfee(
        priceData?.dataworldwideexceptpearladminfee
      );
      setdataworldwideexceptpearlnetpremium(
        priceData?.dataworldwideexceptpearlnetpremium
      );
      setdataworldwideexcepttravellerVAT(
        priceData?.dataworldwideexcepttravellerVAT
      );
      setdataworldwideexcepttravelleradminfee(
        priceData?.dataworldwideexcepttravelleradminfee
      );
      setdataworldwideexcepttravellernetpremium(
        priceData?.dataworldwideexcepttravellernetpremium
      );
      setworldwideexceptSelfCPPrice(priceData);
    }
  }, [
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  useEffect(() => {
    if (dataEuropeeurope && dataEuropeschengen) {
      const priceData = europecalculatePremium(
        dataEuropeeurope,
        dataEuropeschengen
      );
      setEuropeeuropeInitialPrice(
        priceData?.dataEuropeeuropeFinalPrice ?? null
      );
      setEuropeschengenInitialPrice(
        priceData?.dataEuropeschengenFinalPrice ?? null
      );
      setEuropeCardPrice(priceData?.minFinalPrice);
      setEuropeeuropeVAT(priceData?.dataEuropeeuropeVAT);
      setdataEuropeeuropeadminfee(priceData?.dataEuropeeuropeadminfee);
      setdataEuropeeuropenetpremium(priceData?.dataEuropeeuropenetpremium);
      setdataEuropeschengenVAT(priceData?.dataEuropeschengenVAT);
      setdataEuropeschengenadminfee(priceData?.dataEuropeschengenadminfee);
      setdataEuropeschengennetpremium(priceData?.dataEuropeschengennetpremium);
      seteuropeSelfCPPrice(priceData);
    }
  }, [
    dataEuropeeurope,
    dataEuropeschengen,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  useEffect(() => {
    const dob = ownerDetailsResponseData?.ownerDobG?.split("-"); // TODO: get dob from api after otp verification
    if (dob) {
      setPrimaryTravellerInputs({
        ...primaryTravellerInputs,
        primaryTravellerDOB: getAge(`${dob[2]}-${dob[1]}-${dob[0]}`),
      });
    }
  }, []);

  useEffect(() => {
    if (dataworldwideCoverageFamily) {
      const priceDataWorldwidFamily =
        worldwideFamilycalculatePremium(dataworldwideCoverageFamily);
      setworldwideFamilyCPPrice(priceDataWorldwidFamily);
    }
  }, [dataworldwideCoverageFamily,travelCovidcoverage, travelWintersportscoverage]);

  const handleNewAddition = (
    adult: number,
    child: number,
    srCitizen: number
  ) => {
    setAdultCount(adult);
    setChildCount(child);
    setSrCitizenCount(srCitizen);
    setTotalCount(adult + child + srCitizen);
  };

  const handleDelete = (familtyType: string, person: travelersInfo) => {
    if (familtyType === familtyFlowConstants.TITLES.ADULT) {
      setAdultCount((adultCount as number) - 1);
      if (travelers && travelers.length > 0) {
        setTravelers((prevTravelers) =>
          prevTravelers.filter((item) => item.uiId !== person.uiId)
        );
      }
    } else if (familtyType === familtyFlowConstants.TITLES.CHILD) {
      setChildCount((childCount as number) - 1);
      setTravelersChild((prevTravelers) =>
        prevTravelers.filter((item) => item.uiId !== person.uiId)
      );
    } else if (familtyType === familtyFlowConstants.TITLES.SR_CITIZEN) {
      setSrCitizenCount((srCitizenCount as number) - 1);
      setTravelersSrcitizen((prevTravelers) =>
        prevTravelers.filter((item) => item.uiId !== person.uiId)
      );
    }
    setDeleteFlag(true);
  };

  const handleInputChangeBenfit = (
    person: travelersInfo,
    field: string,
    value: string,
    familyType: string
  ) => {
    const coverage = { coverageCode: value };
    const policyCoverage = [coverage];
    const getUpdatedData = (prevTravelers: Array<travelersInfo>) =>
      prevTravelers.map((item) => {
        if (item.uiId === person.uiId) {
          if (
            Array.isArray(item.policyCoverage) === false ||
            item.policyCoverage.length === 0
          )
            return { ...item, policyCoverage };
          else if (
            item.policyCoverage.every((val) => val.coverageCode !== value)
          ) {
            return {
              ...item,
              policyCoverage: item.policyCoverage.concat(policyCoverage),
            };
          } else return { ...item };
        }
        return item;
      });
    if (familyType === familtyFlowConstants.TITLES.SELF) {
      setPrimaryTravelers(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.ADULT) {
      setTravelers(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.CHILD) {
      setTravelersChild(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.SR_CITIZEN) {
      setTravelersSrcitizen(getUpdatedData);
    }
  };

  const handleRemoveCoverage = (
    person: travelersInfo,
    value: string,
    familyType: string
  ) => {
    const getUpdatedData = (prevTravelers: Array<travelersInfo>) =>
      prevTravelers.map((item) => {
        if (item.uiId === person.uiId) {
          if (Array.isArray(item.policyCoverage)) {
            return {
              ...item,
              policyCoverage: item.policyCoverage.filter(
                (val) => val.coverageCode !== value
              ),
            };
          } else return { ...item, policyCoverage: [] };
        }
        return item;
      });
    if (familyType === familtyFlowConstants.TITLES.SELF) {
      setPrimaryTravelers(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.ADULT) {
      setTravelers(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.CHILD) {
      setTravelersChild(getUpdatedData);
    } else if (familyType === familtyFlowConstants.TITLES.SR_CITIZEN) {
      setTravelersSrcitizen(getUpdatedData);
    }
  };

  useEffect(() => {
    setIsAddTravelerValidation(true);
    const allValidationsCompleted =
      (primaryTravelers?.length > 0
        ? primaryTravelers.every((traveler: TravelerInputs) => {
            return (
              traveler?.travellerNameEnglish &&
              traveler?.passportExpiryDate &&
              traveler?.passportNumber
            );
          })
        : true) &&
      (travelers?.length > 0
        ? travelers.every((traveler: TravelerInputs) => {
            return (
              traveler?.travellerNameEnglish &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              traveler?.passportNumber &&
              traveler?.relation
            );
          })
        : true) &&
      (travelersChild?.length > 0
        ? travelersChild.every((traveler: TravelerInputs) => {
            return (
              traveler?.travellerNameEnglish &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              traveler?.passportNumber &&
              traveler?.relation
            );
          })
        : true) &&
      (travelersSrcitizen?.length > 0
        ? travelersSrcitizen.every((traveler: TravelerInputs) => {
            return (
              traveler?.travellerNameEnglish &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              traveler?.passportNumber &&
              traveler?.relation
            );
          })
        : true);
      const SnrCount=srCitizenCount && srCitizenCount > 0 && adultCount === 0
        ? srCitizenCount - 1
        : srCitizenCount;
      const adltCount = adultCount && adultCount > 0 ? adultCount - 1 : adultCount

    const isChildCountMatching = travelersChild.length === childCount;
    const isAdultCountMatching = travelers.length === adltCount;
    const isSrCitizenCountMatching = travelersSrcitizen.length === SnrCount;
      const finalValidation = allValidationsCompleted && isChildCountMatching && isAdultCountMatching && isSrCitizenCountMatching;
    setIsAddTravelerValidation(!finalValidation);
    }, [primaryTravelers,travelers, travelersSrcitizen, travelersChild,childCount,adultCount,srCitizenCount]);

  return (
    // JSX code for your component's UI
    <div className="traveler-detail-wrapper">
      <div className="traveler-detail-content">
        <div className="traveler-section">
          <div className="traveler-heading" data-testid="travelerHead">
            {data?.add_traveller_page_title}
          </div>
          <div className="traveler-content">
            <div className="details-title">{data?.add_traveller_page_desc}</div>
            <div className="accordion-space">
              <div key={familtyFlowConstants.TITLES.SELF}>
                <TravelerFamily
                  setTravelers={setPrimaryTravelers}
                  travelers={primaryTravelers}
                  count={1}
                  data={data}
                  defaultActiveValue={"0"}
                  familyType={familtyFlowConstants.TITLES.SELF}
                  handleInputChangeBenfit={handleInputChangeBenfit}
                  handleRemoveCoverage={handleRemoveCoverage}
                />
              </div>
              <div key={familtyFlowConstants.TITLES.ADULT}>
                <TravelerFamily
                  setTravelers={setTravelers}
                  travelers={travelers}
                  count={
                    adultCount && adultCount > 0 ? adultCount - 1 : adultCount
                  }
                  data={data}
                  familyType={familtyFlowConstants.TITLES.ADULT}
                  handleDelete={handleDelete}
                  handleInputChangeBenfit={handleInputChangeBenfit}
                  handleRemoveCoverage={handleRemoveCoverage}
                />
              </div>
              <div key={familtyFlowConstants.TITLES.CHILD}>
                <TravelerFamily
                  setTravelers={setTravelersChild}
                  travelers={travelersChild}
                  count={childCount}
                  data={data}
                  familyType={familtyFlowConstants.TITLES.CHILD}
                  handleDelete={handleDelete}
                  handleInputChangeBenfit={handleInputChangeBenfit}
                  handleRemoveCoverage={handleRemoveCoverage}
                />
              </div>
              <div key={familtyFlowConstants.TITLES.SR_CITIZEN}>
                <TravelerFamily
                  handleDelete={handleDelete}
                  setTravelers={setTravelersSrcitizen}
                  travelers={travelersSrcitizen}
                  count={
                    srCitizenCount && srCitizenCount > 0 && adultCount === 0
                      ? srCitizenCount - 1
                      : srCitizenCount
                  }
                  data={data}
                  familyType={familtyFlowConstants.TITLES.SR_CITIZEN}
                  handleInputChangeBenfit={handleInputChangeBenfit}
                  handleRemoveCoverage={handleRemoveCoverage}
                />
              </div>
            </div>
          </div>
          {travellerType && travellerType == "1" ? (
            <div className="traveler-footer">
              <div className="footer-btn">
                <AddAdditionalTraveller
                  data={data}
                  handleNewAddition={handleNewAddition}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TravelerAddDetails;
