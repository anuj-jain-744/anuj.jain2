import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { CombinedData } from "types/languageData";
import { Col, Row } from "react-bootstrap";
import clienIcon from "assets/QuoteAndBuy/client-icon.png";
import EditTraveller from "../EditTraveller";
import { formatToCalendarDate, formatTravelDate } from "utils/formatDate";
import { CONFIRM_MSG_DELETE, POPUP_FOR } from "constant";
import Delete from "../../../assets/Travel/Delete.svg";
import editSquore from "assets/QuoteAndBuy/edit_square.svg";
import ModalPopUp from "./PopUp/ModalPopUp";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { getRelation } from "utils/getRelation";

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

  const {
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
    if (deleteStatus !== null && deleteStatus?.messages?.message_en) {
      const msg = deleteStatus?.messages?.message_en;
      setReceivedPreimumErrorMsg(msg);
      setShowPopup(true);
    }
  }, [deleteStatus]);

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
      dateOfBirth: person.dateOfBirth,
      relation: person.relation,
      personAge:person.personAge,
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
      personAge:updatedValues.personAge,
      relation: updatedValues.relation,
      dateOfBirth: formatToCalendarDate(updatedValues.dateOfBirth ?? ''),
      policyCoverage: (updatedValues.policyCoverage || [])
        .map((item) => item.coverageCode)
        .sort(),
    };
    if (JSON.stringify(current) !== JSON.stringify(updated)) {
      const updatedPerson = {
        uiId: person.uiId,
        ...updated,
        policyCoverage: updatedValues.personAge > 50 ? [] : updatedValues.policyCoverage,
      };
      removeOrUpdatePerson(false, updatedPerson);
    }
  };



  return (
    <div className="trav-details-card-wrap">
      {Array.isArray(combinedTravelers) && combinedTravelers.map((item, index) => (
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
                    {item?.dateOfBirth?.replace(/-/g, "/") || "null"}
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
                    {item?.passportExpiryDate?.replace(/-/g, "/") || "null"}
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
