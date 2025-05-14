import React, { useEffect, useState, useRef } from "react";
import { getAge } from "utils/getAge";
import { isValidName, isValidPassportNum } from "utils/quoteAndBuy";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import AddAdditionalTraveller from "./AddAdditionalTraveller";
import TravelerFamily from "./TravelerFamily";
import "./index.scss";
import { familtyFlowConstants, coverageCodes } from "components/Travel/constantsTravel";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { Button, Col, Modal, Row } from "react-bootstrap";
import WarningIcon from '@mui/icons-material/Warning';
import {INVALID_SENIOR_CITIZEN_DELETED_MSG, TRAVEL_TOTAL_COUNT } from "constant";
import SeniorCitizenAlert from "components/QuoteAndBuy/ValidateTravel/SeniorCitizenAlert";
import { toCamelCase } from "utils/quoteAndBuyTravel";
interface TravelerAddDetailsData {
  data: { [key: string]: string };
  setLeftStep?: (step: number) => void;
}
interface TravelerInputs {
  travellerNameEnglish: string;
  dateOfBirth?: string;
  passportExpiryDate: string;
  passportNumber: string;
  relation?: string;
}
const TravelerAddDetails: React.FC<TravelerAddDetailsData> = ({ data , setLeftStep}) => {
  const [primaryTravellerInputs, setPrimaryTravellerInputs] = useState<{
    [key: string]: string | number;
  }>({
    primaryTraveller: "",
    primaryTravellerPassportNo: "",
    primaryTravellerPassportExpiryDate: "",
    primaryTravellerDOB: "",
  });
  const {
    setIsAddTravelerValidation,
    ownerDetailsResponseData,
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
    travellerType,
    setTotalCount,
  } = useQuoteAndBuyContext();
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [showBenfitModal, setShowBenfitModal] = useState<boolean>(false);
  const [coverageCode, setCoverageCode] = useState<string>("");
  const [shouldShowInvalidSrCitizenDeletedAlert, setShouldShowInvalidSrCitizenDeletedAlert] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const dataRef = useRef<{applyBenefit: string}>({
    applyBenefit: "",
  });

  useEffect(() => {
    const dob = ownerDetailsResponseData?.ownerDobG?.split("-"); // TODO: get dob from api after otp verification
    if (dob) {
      setPrimaryTravellerInputs({
        ...primaryTravellerInputs,
        primaryTravellerDOB: getAge(`${dob[2]}-${dob[1]}-${dob[0]}`),
      });
    }
  }, []);

  const handleNewAddition = (
    child: number,
    adult: number,
    srCitizen: number
  ) => {
    setChildCount(child);
    setAdultCount(adult);
    setSrCitizenCount(srCitizen);
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
    if (person.type === familtyFlowConstants.TITLES.SELF && travellerType === "1") {
      dataRef.current.applyBenefit = value;
      setCoverageCode(value);
      setShowBenfitModal(true);
    }
  };

  const getUpdatedBenefitData = (prevTravelers: Array<travelersInfo>) =>{
    const value = dataRef.current.applyBenefit;
    const coverage = { coverageCode: value };    
    const policyCoverage = [coverage];
    const resp = prevTravelers.map((item) => {
      if (item.personAge <= 50 || item.personAge === undefined) {
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
    return resp;
    
  }


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
              isValidName(traveler?.travellerNameEnglish) &&
              traveler?.passportExpiryDate &&
              isValidPassportNum(traveler?.passportNumber)
            );
          })
        : true) &&
      (travelers?.length > 0
        ? travelers.every((traveler: TravelerInputs) => {
            return (
              isValidName(traveler?.travellerNameEnglish) &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              isValidPassportNum(traveler?.passportNumber) &&
              traveler?.relation
            );
          })
        : true) &&
      (travelersChild?.length > 0
        ? travelersChild.every((traveler: TravelerInputs) => {
            return (
              isValidName(traveler?.travellerNameEnglish) &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              isValidPassportNum(traveler?.passportNumber) &&
              traveler?.relation
            );
          })
        : true) &&
      (travelersSrcitizen?.length > 0
        ? travelersSrcitizen.every((traveler: TravelerInputs) => {
            return (
              isValidName(traveler?.travellerNameEnglish) &&
              traveler?.dateOfBirth &&
              traveler?.passportExpiryDate &&
              isValidPassportNum(traveler?.passportNumber) &&
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
const addBenfitToAllYes = () => {
  setTravelers(getUpdatedBenefitData);
  setTravelersChild(getUpdatedBenefitData);
  setShowBenfitModal(false);
}
  const handleAllBenfitCloseModal = () => {
    setShowBenfitModal(false);
  };
  const handleShowAddModal = () => setShowAddModal(true);
  const handleHideAddModal = () => setShowAddModal(false);
  const totalCount = adultCount + childCount + srCitizenCount;

  const replaceName = (text: string, actualName: string): string => {
    if (!text) return "";
    return text.replace("<<NAME>>", actualName); //TODO: replace with actual name once API is integrated
  };
  const nameincamelcase = toCamelCase(ownerDetailsResponseData?.ownerFullNameEnglish ?? "");
  return (
    // JSX code for your component's UI
    <>
    <div className="traveler-winter-container">
      <Modal
        show={showBenfitModal}
        centered
        className="modal-lg winter-travel-benefit-all custom-modal-width"
      >
        <Modal.Body className="add-modal-body">
          <div className="add-modal-info">
            <div>
              <WarningIcon className="warning-icon" />
            </div>
            <div className="content-align">
              <h1>{coverageCode ? coverageCodes[coverageCode] : ""}</h1>
              <p>{data?.cover_all_travelers}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary add-cancel-btn btn-width"
            onClick={handleAllBenfitCloseModal}
          >
            {data?.no}
          </Button>
          <Button variant="primary" className="delete-btn btn-width" onClick={addBenfitToAllYes}>
            {`${data?.yes}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    <div className="traveler-detail-wrapper">
      <div className="traveler-detail-content">
        <div className="traveler-section">
          <div className="traveler-heading" data-testid="travelerHead">
            {data?.add_traveller_page_title}
          </div>
          <div className="traveler-content">
            <div className="details-title">
            {data?.welcome_text &&
              replaceName(data?.welcome_text, nameincamelcase ?? "")}
            </div>
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
                  setLeftStep={setLeftStep}
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
                  setLeftStep={setLeftStep}
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
                  setLeftStep={setLeftStep}
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
                  setLeftStep={setLeftStep}
                  setShouldShowInvalidSrCitizenDeletedAlert={setShouldShowInvalidSrCitizenDeletedAlert}
                />
              </div>
            </div>
            {shouldShowInvalidSrCitizenDeletedAlert && (
                <Row>
                  <Col>
                    <SeniorCitizenAlert
                      message={INVALID_SENIOR_CITIZEN_DELETED_MSG(totalCount!)}
                      isDismissable={true}
                      handleAlertDismissal ={() => setShouldShowInvalidSrCitizenDeletedAlert(false)}
                    />
                  </Col>
                </Row>
              )}
          </div>
          {(travellerType === "1" && totalCount < TRAVEL_TOTAL_COUNT)  ? (
            <div className="traveler-footer">
              <button
                className="footer-btn traveler-add-btn"
                onClick={handleShowAddModal}
              >
                {`+ ${data?.add_traveller_button}`}
              </button>
              {showAddModal === true && (
                <AddAdditionalTraveller
                  data={data}
                  handleNewAddition={handleNewAddition}
                  handleClose={handleHideAddModal}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
    </>
  );
};

export default TravelerAddDetails;
