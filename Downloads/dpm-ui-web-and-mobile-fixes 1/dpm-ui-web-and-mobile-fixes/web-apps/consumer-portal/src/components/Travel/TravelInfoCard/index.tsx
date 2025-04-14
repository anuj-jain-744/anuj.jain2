import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { TravelItem } from "../TravelDetailCard/TravelContent";
import { CombinedData } from "types/languageData";
import { Col, Row } from "react-bootstrap";
import clienIcon from "assets/QuoteAndBuy/client-icon.png";
import EditTraveller from "../EditTraveller";
import {
  worldwidecalculatePremium,
  worldwideexceptcalculatePremium,
  europecalculatePremium,
  worldwideFamilycalculatePremium,
} from "components/QuoteAndBuy/Commonfunction";
import { formatTravelDate } from "utils/formatDate";
import { CONFIRM_MSG_DELETE, POPUP_FOR } from "constant";
import Delete from "../../../assets/Travel/Delete.svg";
import editSquore from "assets/QuoteAndBuy/edit_square.svg";
import ModalPopUp from "./PopUp/modalPopUp";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

export interface TraItem {
  label: string;
  value: string;
}

export interface TravelLink {
  label: string;
  link: boolean | string;
}

interface TravelDetailCardProps {
  languageData: CombinedData | undefined | null;
}

const TravelInfoCard: React.FC<TravelDetailCardProps> = ({ languageData }) => {
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<string>("");
  const dataRef = useRef<{ removePerson: Partial<travelersInfo> }>({
    removePerson: {},
  });
  const [travelData, setTravelData] = useState<TravelItem[]>([]);
  const [travelNameData, setTravelNameData] = useState<TravelItem[]>([]);

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
    setTravelersList,
    travelersList,
    setworldwideSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    seteuropeSelfCPPrice,
    deleteStatus,
  } = useQuoteAndBuyContext();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [receivedPreimumErrorMsg, setReceivedPreimumErrorMsg] =
    useState<string>("");

    const combinedTravelers = useMemo(
      () => [
        ...primaryTravelers,
        ...travelers,
        ...travelersChild,
        ...travelersSrcitizen,
      ],
      [primaryTravelers, travelers, travelersChild, travelersSrcitizen]
    );

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {    
    if (deleteStatus !== null &&  deleteStatus?.messages?.message_en) {
      const msg = deleteStatus?.messages?.message_en;
      setReceivedPreimumErrorMsg(msg);
      setShowPopup(true);
    }
  }, [deleteStatus]);

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
    if (dataworldwideCoverageFamily) {
      const priceDataWorldwidFamily = worldwideFamilycalculatePremium(
        dataworldwideCoverageFamily
      );
      setworldwideFamilyCPPrice(priceDataWorldwidFamily);
    }
  }, [
    dataworldwideCoverageFamily,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  function isValidDate(stringDate: any) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(stringDate);
  }

  const formatDate = (date: string) => {
    const result = isValidDate(date);
    if (result) {
      return date;
    }
    const [day, month, year] = date?.includes("/")
      ? date.split("/")
      : date.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTravelersList(
      combinedTravelers.map((item: travelersInfo, index: number) => {
        const result = { ...item };
        result.dateOfBirth = formatDate(item.dateOfBirth);
        result.passportExpiryDate = formatDate(item.passportExpiryDate);
        result.riskId = `R0000${index + 1}`;
        result.travellerNameArabic = " ";
        return result;
      })
    );
  }, [combinedTravelers]);

  useEffect(() => {
    if (languageData && combinedTravelers.length > 0) {
      const nameData = combinedTravelers.map((traveler) => ({
        label: "name in english",
        value: traveler.travellerNameEnglish || "null",
      }));

      const travelData = combinedTravelers
        .map((traveler) => [
          {
            label: languageData?.traveller_dob || "null",
            value: traveler.dateOfBirth.replace(/\//g, "-") || "null",
          },
          {
            label: languageData?.traveller_passport_no || "null",
            value: traveler.passportNumber || "null",
          },
          {
            label: languageData?.traveller_passport_exp_date || "null",
            value: traveler.passportExpiryDate.replace(/\//g, "-") || "null",
          },
          {
            label: languageData?.relationship || "null",
            value: traveler.relation || "null",
          },
        ])
        .flat();

      setTravelNameData(nameData);
      setTravelData(travelData);
    }
  }, [languageData, combinedTravelers]);

  const handleOpenRemoveModal = (item: travelersInfo): void => {
    dataRef.current.removePerson = item;
    setShowRemoveModal(true);
  };

  const handleRemovePopupSubmit = () => {
    removeOrUpdatePerson(true);
    setShowRemoveModal(false);
  };

  const removeOrUpdatePerson = (
    remove: boolean,
    person?: Partial<travelersInfo>
  ) => {
    const uiId =
      remove === true ? dataRef.current.removePerson.uiId : person?.uiId;
    const getUpdatedPersons =
      remove === true
        ? (items: Array<travelersInfo>) =>
            items.filter((item) => item.uiId !== uiId)
        : (items: Array<travelersInfo>) =>
            items.map((item) =>
              item.uiId === uiId ? { ...item, ...person } : item
            );
    if (travelers.find((item) => item.uiId === uiId)) {
      setTravelers(getUpdatedPersons(travelers));
      if (remove === true && (adultCount as number) > 0)
        setAdultCount((adultCount as number) - 1);
    } else if (travelersChild.find((item) => item.uiId === uiId)) {
      setTravelersChild(getUpdatedPersons(travelersChild));
      if (remove === true && (childCount as number) > 0)
        setChildCount((childCount as number) - 1);
    } else if (travelersSrcitizen.find((item) => item.uiId === uiId)) {
      setTravelersSrcitizen(getUpdatedPersons(travelersSrcitizen));
      if (remove === true && (srCitizenCount as number) > 0)
        setSrCitizenCount((srCitizenCount as number) - 1);
    } else if (
      remove === false &&
      primaryTravelers.find((item) => item.uiId === uiId)
    ) {
      setPrimaryTravelers(getUpdatedPersons(primaryTravelers));
    }
  };

  const handleUpdate = (
    updatedValues: travelersInfo,
    person: travelersInfo
  ) => {
    const current = {
      travellerNameEnglish: person.travellerNameEnglish,
      passportNumber: person.passportNumber,
      passportExpiryDate: person.passportExpiryDate,
      policyCoverage: person.policyCoverage
        .map((item) => item.coverageCode)
        .sort(),
    };
    const updated = {
      travellerNameEnglish: updatedValues.travellerNameEnglish,
      passportNumber: updatedValues.passportNumber,
      passportExpiryDate: formatTravelDate(
        updatedValues.passportExpiryDate ?? ""
      ),
      policyCoverage: (updatedValues.policyCoverage || [])
        .map((item) => item.coverageCode)
        .sort(),
    };
    if (JSON.stringify(current) !== JSON.stringify(updated)) {
      const updatedPerson = {
        uiId: person.uiId,
        ...updated,
        policyCoverage: updatedValues.policyCoverage,
      };
      removeOrUpdatePerson(false, updatedPerson);
    }
  };

  const getRelation = (relation: string): string => {
    switch (relation) {
      case "1":
        return "Self";
      case "2":
        return "Spouse";
      case "4":
        return "Daughter";
      case "3":
        return "Son";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="trav-details-card-wrap">
    {combinedTravelers.map((item, index) => (
      <div className="Outer-travel-box" key={item.uiId}>
        <div className="trav-details-card">
            {languageData && (
              <Row className="trav-top">
                <Col className="user-logo text-start">
                  <img
                    src={clienIcon ? clienIcon : "default-icon.png"}
                    alt="user icon"
                  />
                </Col>

                <Col className="label-container text-start">
                  <span className="trav-value">
                    {item.travellerNameEnglish || "null"}
                  </span>
                </Col>

                <Col className="label-container text-start">
                  <span className="trav-label">
                    {languageData?.traveller_dob || "null"}
                  </span>
                  <span className="trav-value">
                    {item?.dateOfBirth?.replace(/\//g, "-") || "null"}
                  </span>
                </Col>
                <Col className="label-container text-start">
                  <span className="trav-label">
                    {languageData?.traveller_passport_no || "null"}
                  </span>
                  <span className="trav-value">
                    {item.passportNumber || "null"}
                  </span>
                </Col>
                <Col className="label-container text-start">
                  <span className="trav-label">
                    {languageData?.traveller_passport_exp_date || "null"}
                  </span>
                  <span className="trav-value">
                    {item?.passportExpiryDate?.replace(/\//g, "-") || "null"}
                  </span>
                </Col>
                <Col className="label-container text-start">
                  <span className="trav-label">
                    {languageData?.relationship || "null"}
                  </span>
                  <span className="trav-value">
                    {getRelation(item.relation)}
                  </span>
                </Col>

                <Col className="text-start col-1 d-flex">
                  <button
                    className="traveler-add-btn"
                    onClick={() => setShowEditModal(item.uiId)}
                    aria-label="edit traveller"
                  >
                    <div className="trav-label">
                      {" "}
                      <img src={editSquore} alt="user icon" />{" "}
                    </div>
                  </button>
                  {showEditModal === item.uiId && (
                    <EditTraveller
                      person={item}
                      langData={languageData}
                      onClose={() => setShowEditModal("")}
                      onSave={(updatedValues) =>
                        handleUpdate(updatedValues, item)
                      }
                    />
                  )}
                  {index !== 0 && (
                    <div className="warning-info">
                      <div className="acc-delete">
                        <img
                          src={Delete}
                          alt="delete"
                          className="delete-icon"
                          onClick={() => handleOpenRemoveModal(item)}
                        />
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            )}
          </div>
          {item.policyCoverage !== undefined && (
            <Row className="traveladdon-details">
              <Col className="poli-detail-container col-4 text-start">
                <span className="poli-label">
                  {languageData?.additonal_benefits
                    ? languageData.additonal_benefits
                    : "Default Value"}
                </span>
              </Col>
              <Col className="poli-detail-container-left text-end">
                {item.policyCoverage?.map((detail) => (
                  <button
                    key={detail.coverageCode}
                    className="tra-info-btn col-3"
                  >
                    {detail.coverageCode === "CV"
                      ? languageData?.benfit_covid
                      : languageData?.benfit_sports}
                  </button>
                ))}
              </Col>
            </Row>
          )}
        </div>
      ))}
      {showPopup && (
        <ModalPopUp
          show={showPopup}
          handleClose={handlePopup}          
          errorMsg={receivedPreimumErrorMsg}
          popupUsedFor=""
          handleSubmitPopup={handlePopup}
        />
      )}
      <ModalPopUp
        show={showRemoveModal}
        handleClose={() => setShowRemoveModal(false)}
        errorMsg={CONFIRM_MSG_DELETE}
        popupUsedFor={POPUP_FOR}
        handleSubmitPopup={handleRemovePopupSubmit}
      />
    </div>
  );
};

export default TravelInfoCard;
