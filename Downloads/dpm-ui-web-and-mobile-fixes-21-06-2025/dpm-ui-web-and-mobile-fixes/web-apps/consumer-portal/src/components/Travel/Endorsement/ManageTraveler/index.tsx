import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { slices } from "@dpm/shared-module";
import "./index.scss";
import { toCamelCase } from "utils/quoteAndBuyTravel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { validateIBAN, validateIbanNonSA } from "@dpm/shared-module";
import { Col, Row } from "react-bootstrap";
import { CombinedData } from "types/languageData";
import Info from "assets/CancelPolicy/Info.svg";
import Iban from "components/Iban/iban";
import { classifyTravelersByAge } from "utils/classifyTravelersByAge";
import DeleteAlert from "../ManageTraveler/TravelerDelete/DeleteAlert";
import TravelInfoCard from "./TravelInfoCard";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import AddAdditionalTraveller from "./TravelerAddAditional";
import TravelAddForm from "./TravelerAddAditional/TravelAddForm";
import TermsAndCon from "../../../../claims/register/compensation/TermsAndCon";

// Define Traveler type
interface Traveler {
  id: number;
  name: string;
  dob: string;
  passportNo: string;
  passportExpiry: string;
  relation: "Self" | "Spouse" | "Son" | "Daughter";
}
interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}
interface ManageTravelerProps {
  languageData: CombinedData | undefined | null;
  onUpdate: (updatedTraveler: Traveler) => void;
  onDelete: (travelerId: string) => void;
}
const generateId = () => `${Date.now()}`;
const ManageTraveler: React.FC<ManageTravelerProps> = React.memo(
  ({ languageData }) => {
    const [alertFlag, setAlertFlag] = useState(false);
    const [travelers, setTravelers] = useState<Traveler[]>([]);
    const [isTermCondition, setIsTermCondition] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [smShow, setSmShow] = useState(false);
    const [iban, setIban] = useState("");
    const [reEnterIban, setReEnterIban] = useState("");
    const [bankName, setBankName] = useState("");
    const [isReEnterIbanValid, setIsReEnterIbanValid] = useState(false);
    const [isBankNameValid, setIsBankNameValid] = useState(false);
    const [ibanMismatch, setIbanMismatch] = useState(false);
    const [isValidIban, setIsValidIban] = useState(true);
    const [deletedTravelerName, setDeletedTravelerName] = useState("");
    const [childCount, setChildCount] = useState<number>(0);
    const [adultCount, setAdultCount] = useState<number>(0);
    const [srCitizenCount, setSrCitizenCount] = useState<number>(0);
    const [additionalCounts, setAdditionalCounts] = useState({
      child: 0,
      adult: 0,
      srCitizen: 0,
    });
    const dispatch = useDispatch();
    const manageTravelerData = useSelector(
      (state: RootState) =>
        state?.endorsementManageTravelers?.endorsementTravelers
    );
    const {
      updateEndorsementTraveler,
      deleteEndorsementTraveler,
      getEndorsementTravelers,
    } = slices.endorsementTravelers;

    const renderTooltip = () => setSmShow(true);

    const handleAlertMessage = (name: string) => {
      const nameincamelcase = toCamelCase(name);
      setDeletedTravelerName(nameincamelcase);
      setAlertFlag(true);
    };
    const handleAlertClose = () => {
      setAlertFlag(false);
    };
    const showAddFormModal = () => {
      setShowAddForm(true);
    };
    const hideAddFormModal = () => {
      setShowAddForm(false);
    };
    useEffect(() => {
      dispatch(getEndorsementTravelers());
    }, [dispatch, getEndorsementTravelers]);

    useEffect(() => {
      if (!manageTravelerData) return;
      const updatewithIds = manageTravelerData.map((traveler) => ({
        ...traveler,
        id: traveler.id ?? generateId(),
        converageCode: traveler.converageCode ?? [],
      }));
      //update to Redux if any traveler was missing ID
      updatewithIds.forEach((traveler) => {
        if (!traveler.id || traveler.id.toString().length < 5) {
          dispatch(updateEndorsementTraveler(traveler));
        }
      });
      //setTravelers(manageTravelerData);
      setTravelers(updatewithIds);
      const { child, adult, senior } =
        classifyTravelersByAge(manageTravelerData);
      setChildCount(child);
      setAdultCount(adult);
      setSrCitizenCount(senior);
    }, [manageTravelerData]);
    const replaceName = (text: string, actualName: string): string => {
      const formattedName = actualName
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return text.replace("<<NAME>>", formattedName);
    };

    const handleBankName = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replaceAll(/ {2,}/g, " ").trimStart();

      // Regex to allow only letters and a single space between words
      const regex = /^[a-zA-Z ]*$/;

      if (regex.test(value) && value.length <= 30) {
        setBankName(value);
        setIsBankNameValid(true);
      } else {
        setIsBankNameValid(false);
      }
    };

    const validateInput = (value: string, maxLength: number): boolean => {
      const regex = /^[a-zA-Z0-9]*$/; // Only alphanumeric characters
      return (
        value.length <= maxLength && // Check max length
        value.trim() === value && // No leading or trailing spaces
        regex.test(value) // No special characters
      );
    };
    let isValid = true;
    const handleIban = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (validateInput(value, 24)) {
          setIban(value);
          // Reset related fields if IBAN is cleared
          if (value === "") {
            setReEnterIban("");
            setBankName("");
            setIbanMismatch(false);
            setIsReEnterIbanValid(false);
            setIsValidIban(false);
          } else {
            setIbanMismatch(value !== reEnterIban && reEnterIban !== "");
            if (value.startsWith(SA)) {
              // eslint-disable-next-line react-hooks/exhaustive-deps
              isValid = validateIBAN(value);
            } else {
              setIsValidIban(validateIbanNonSA(value));
            }
          }
        }
      },
      [setIban, validateIBAN, validateIbanNonSA, reEnterIban]
    );
    const handleUpdate = (updatedTraveler: Traveler) => {
      dispatch(updateEndorsementTraveler(updatedTraveler));
    };
    const handleDelete = (deleteTraveler: string) => {
      dispatch(deleteEndorsementTraveler(deleteTraveler));
    };
    return (
      <>
        <div className="manage-traveler">
          <div className="benefit-container">
            <div className="header walaa-medium-500">
              <div className="eader-list">
                {languageData?.endorsement_manage_traveler && (
                  <div className="header-body">
                    {languageData?.endorsement_manage_traveler}
                  </div>
                )}
                <div className="header-right">
                  <AddAdditionalTraveller
                    data={languageData}
                    adultCount={adultCount}
                    childCount={childCount}
                    srCitizenCount={srCitizenCount}
                    setAdultCount={setAdultCount}
                    setChildCount={setChildCount}
                    setSrCitizenCount={setSrCitizenCount}
                    showTravelerAddForm={showAddFormModal}
                    setAdditionalCounts={setAdditionalCounts}
                  />
                </div>
              </div>
            </div>
            <div className="header-border"></div>

            <div className="body-addons">
              <Row>
                <Col>
                  {alertFlag && (
                    <DeleteAlert
                      handleAlertClose={handleAlertClose}
                      title={
                        languageData?.endorsement_after_delete_msg &&
                        replaceName(
                          languageData?.endorsement_after_delete_msg,
                          deletedTravelerName ?? ""
                        )
                      }
                    />
                  )}{" "}
                </Col>
              </Row>

              <Row className="row-width">
                <Col>
                  {languageData?.endorsement_manage_traveler_sub_title && (
                    <div className="travel-tooltip-cantainer">
                      <InfoOutlinedIcon className="travel-tooltip-icon" />
                      <span>
                        {languageData?.endorsement_manage_traveler_sub_title}
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              {travelers.map((endorData, i) => (
                <div key={i} className="row-width">
                  <TravelInfoCard
                    travelersData={endorData}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    languageData={languageData}
                    handleAlertMessage={handleAlertMessage}
                  />
                </div>
              ))}
            </div>
            {alertFlag && (
              <div className="body-content">
                <div className="body-header walaa-medium-500">
                  {languageData?.your_refund_details}
                </div>

                <div className="refund-tooltip">
                  <div className="refund-section">
                    <div className="refund-approx-amt-label">
                      {languageData?.refundable_approx_amount}
                    </div>
                    <div className="refund-approx-amt walaa-medium-500">
                      {/* {formattedRefundValue} */}
                      RefundableApprox Amount SAR 400.00
                    </div>
                  </div>
                  <img src={Info} alt="Tooltip_Logo" onClick={renderTooltip} />
                </div>
                <hr className="horizontal-line" />

                <div className="body-header walaa-medium-500">
                  {languageData?.bank_details}
                </div>

                <div className="iban-details">
                  <div className="important-text-field">
                    <div className="iban-heading">
                      {languageData?.iban_no}
                      <span className="important-field">*</span>
                    </div>
                    <div>
                      <ThemeTextbox
                        value={iban}
                        name="iban"
                        type="text"
                        onChangehandler={handleIban}
                      />

                      {!isValidIban && iban.startsWith(SA) && (
                        <CancelRoundedIcon className="invalid-iban" />
                      )}
                      {isValidIban && iban && (
                        <CheckCircleRoundedIcon className="valid-iban" />
                      )}
                    </div>
                  </div>

                  {iban && !iban.startsWith(SA) && (
                    <>
                      <div className="important-text-field">
                        <div className="iban-heading">
                          {languageData?.re_enter_iban}
                          <span className="important-field">*</span>
                        </div>
                        <div>
                          <ThemeTextbox
                            value={reEnterIban}
                            name={""}
                            onChangehandler={handleReEnterIban}
                          />
                        </div>
                      </div>

                      <div className="important-text-field">
                        <div className="iban-heading">
                          {languageData?.bank}
                          <span className="important-field">*</span>
                        </div>
                        <div>
                          <ThemeTextbox value="" name={""} onChangehandler="" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="iban-detail walaa-regular-400">
                  {" "}
                  {languageData?.iban_no_fetched_from_your}
                </div>
              </div>
            )}
            {iban && !iban.startsWith(SA) && languageData && (
              <Iban
                fileData=""
                setFileData=""
                languageData={languageData}
                onChequeLeafUpload=""
                onChequeLeafRemove=""
              />
            )}
          </div>
          <TravelAddForm
            data={languageData}
            show={showAddForm}
            onClose={hideAddFormModal}
            childCount={additionalCounts.child}
            adultCount={additionalCounts.adult}
            srCitizenCount={additionalCounts.srCitizen}
          />

          <br />
          <TermsAndCon
            languageData={languageData}
            isChecked={isTermCondition}
            setIsChecked={setIsTermCondition}
          />
        </div>
      </>
    );
  }
);

export default ManageTraveler;
