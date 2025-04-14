import React, { useEffect, useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import { useApiCall,iqmaIdNationalIdValidationOnBlur, iqmaIdNationalIdValidation } from "@dpm/shared-module";
import { DateObject, type Value } from "react-multi-date-picker"; // Import DateObject from the appropriate library
import "./AddDriver.scss";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import { SharedCalendar } from "components/Calendar";
import ThemeMasterSelect from "components/ThemeComponents/ThemeMasterSelect";
import { useMasterData } from "./hook/useMasterData";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DriverProps } from "types/driver";
import { DriverDetailsFormsData, DriverDetailsRequest } from "types/DriverDetailsApi";
import { DriverDetailsResponseData } from "types/quoteAndBuy";
import { ErrorResponse } from "types/ErrorResponse";
import { MAX_OWNER_ID } from "constant";

interface DriverDetailApiProps {
  "apiSource": string;
  "policyNo": string | undefined;
  "driverID": string;
  "dateOfBirth": Value | undefined;
  "mainDriverInd": string;
  "usagePercentage": string;
}

interface AddDriverProps {
  showAddDriver: boolean;
  setShowAddDriver: (show: boolean) => void;
  languageData: {[key:string] : string};
  setNewDriver?: (driverData: DriverProps) => void;
  setNewDriverRelation?: (newDriverRelation :number) => void;
  policyNumber?: string;
  driverCount?: number;
  isQuote?: boolean;
  onDriverAdded?: (driverData: DriverDetailsResponseData, formData: DriverDetailsFormsData) => void;
  onDriverAddedError?: (driverData: ErrorResponse) => void;
}

type FormInputType = {
  name: string;
  value: string;
};

export const AddDriver: React.FC<AddDriverProps> = ({
  showAddDriver,
  setShowAddDriver,
  languageData,
  setNewDriver,
  setNewDriverRelation,
  policyNumber,
  driverCount, isQuote, onDriverAdded, onDriverAddedError }) => {
  const [ownerId, setOwnerId] = useState<FormInputType>({ name: "Owner_Id", value: "" });
  const [ownerDOB, setOwnerDOB] = useState<string | number | Value>();
  const [relation, setRelation] = useState<number | null>(null);

  const [isOn, setIsOn] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<string | number | Value>();
  const format="MM/YYYY";

  // Error text tracking for textbox data
  const [ownerIdError, setOwnerIdError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  // enable/disable action btn state
  const [actionEnabler, setActionEnabler] = useState<boolean>(false);

  const { makeMasterApiCall, masterData } = useMasterData("getRelations");
  const {
    makeApiCall: quoteApiCall,
    isLoading: isQuoteLoading,
    errors: quoteApiErrors,
    data: driverDetailsData
  } = useApiCall<DriverDetailsResponseData, DriverDetailsRequest>(
    2,
    "/Motor/QuoteAndBuy/V1/GetDriverDetails",
    "post"
  );

  const { makeApiCall, errors, data: driverDetails } = useApiCall<DriverProps, DriverDetailApiProps>(4, "/GetDriverAndPremiumDetails", "post");

  const updatedValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setActionEnabler(false);
    if (name === "Owner_Id") {
      setOwnerId({
        name: "Owner_Id",
        value: value,
      });
      setOwnerIdError('');
      if(iqmaIdNationalIdValidation(value)){
        setOwnerIdError(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.owner_id_label));
      }
      setIsOn(value.startsWith("1"));
    }
  };

  

  const updatedValueOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "Owner_Id") {
      setOwnerId({
        name: "Owner_Id",
        value: value,
      });
      setOwnerIdError('');
      if(iqmaIdNationalIdValidation(value)){
        setOwnerIdError(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.owner_id_label));
      }
    }
  };


  //click handler return accept fn
  const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionEnabler(true);
    setAlertMessage("");
    if (isQuote){
      if(ownerDOB && ownerId?.value){
        const ownerIdValue = ownerId?.value;
        const ownerDOBValue = ownerDOB;
        try {
          await quoteApiCall({
            driverId: ownerIdValue,
            dob: ownerDOBValue.toString()
          });
        } catch (error) {
          console.error("API Call Error:", error);
        }
      }
    } else {
      const { value } = event?.target as HTMLInputElement;
      if (value === "update") {
        fetchDriver();
      }
    }
  };

  const fetchDriver = async () => {
    const ownerIdValue = ownerId?.value;
    const ownerDOBValue = ownerDOB;
    let percentage = "50";
    //next driver share %
    if (driverCount && (driverCount+1) > 2) percentage = "25";
    await makeApiCall({
      "apiSource": "Portal",
      "policyNo": policyNumber,
      "driverID": ownerIdValue,
      "dateOfBirth": ownerDOBValue && ownerDOBValue.toString(),
      "mainDriverInd": "N",
      "usagePercentage": percentage
    });
  }


  useEffect(() => {

    if (isQuote && quoteApiErrors) {
      onDriverAddedError?.(quoteApiErrors);
      handleClose();
    }

    if (isQuote && driverDetailsData) {
      const relationship = relation;
      if(ownerDOB && relationship) {
        onDriverAdded?.({  ...driverDetailsData, relationship: relationship + "" }, { ownerId: ownerId?.value, ownerDOB: ownerDOB.toString(), relation: relationship });
        handleClose();
      }
    }
  }, [driverDetailsData, quoteApiCall, onDriverAdded, onDriverAddedError, quoteApiErrors]);

  useEffect(() => {
    if (driverDetails?.driver?.driverName && setNewDriverRelation && setNewDriver) {
      setNewDriver(driverDetails);
      setNewDriverRelation(relation ?? 0);
      setShowAddDriver(false);
    }
  }, [driverDetails]);

  useEffect(() => {
    //In case of error adding driver API capture here and display the error
    if (errors?.messages?.message_en){
      setAlertMessage(errors?.messages?.message_en);
    } else if (errors) {
      setAlertMessage(languageData?.something_went_wrong);
    }
  }, [errors]);


  useEffect(() => {
    const fetchData = async () => {
      await makeMasterApiCall();
    };
    fetchData();
  }, [makeMasterApiCall]);

  useEffect(() => {
    //ownerID, date and relation input - on validate enable/disable update button
    (ownerDOB != "" && ownerId?.value?.length && relation != 0 &&
      ownerDOB != null && ownerId?.value != null && relation != null &&
      ownerIdError === "")
      ? setActionEnabler(false)
      : setActionEnabler(true);
      if (!isQuote && relation!=null && relation!=0 && setNewDriverRelation)
        setNewDriverRelation(relation);
  }, [ownerId, ownerDOB, relation]);

  useEffect(() => {
    if (showAddDriver){
      setOwnerId({
        name: "Owner_Id",
        value: "",
      });
      setOwnerDOB(null);
      setDateValue(null);
      setRelation(null);
      setAlertMessage("");
    }
  }, [showAddDriver]);

  useEffect(() => {
    if (dateValue) {
      const monthIndex = new DateObject(dateValue).monthIndex + 1;
      const year = new DateObject(dateValue).year;
      const dob = `${monthIndex < 10 ? "0" + monthIndex : monthIndex}-${year}`;
      setOwnerDOB(dob);
    }
  }, [dateValue, isOn]);

  //modal dialog handler functions
  const handleClose = () => setShowAddDriver(false);
  //ThemeSelect handler
  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setRelation(parseInt(value));
  };
  const handleKeyPress = (
      e: React.KeyboardEvent<HTMLInputElement>,
      maxLength: number
    ) => {
      const inputValue = e.currentTarget.value;
      if (
        inputValue.length >= maxLength &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault();
      }
    };

  return (
    <React.Fragment>
      {/* dialog code */}
      <Modal
        show={showAddDriver}
        centered
        onHide={handleClose}
        className="add-driver-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {languageData?.additional_driver}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            variant="danger"
            className="register-new-claim-comprehensive-warning"
            show={(alertMessage?.length > 0)}
          >
            <div className="row d-flex align-items-center">
              <div className="col-1">
                <WarningAmberIcon fontSize="large" />
              </div>
              <div className="col walaa-regular-400 ps-10">
                {alertMessage}
              </div>
            </div>
          </Alert>
          <div className="add-driver-container" data-testid="driver-detail-testid">
            <p className="info-message">{languageData?.please_fill_in_the_follow}</p>
            {/* section for national id label and textbox */}
            <div className="p-1">
              <div className="walaa-regular-400 title">
                <TypographyAndIcon
                  text={languageData?.owner_id}
                  tooltip={true}
                  required={true}
                />
              </div>
              <div>
                <ThemeTextbox
                  type="text"
                  title={languageData?.owner_id}
                  name="Owner_Id"
                  value={ownerId?.value}
                  placeholder={languageData?.enter + " " + languageData?.owner_id}
                  onChangehandler={updatedValue}
                  onBlurhandler={updatedValueOnBlur}
                  errorValue={ownerIdError}
                  onKeyDown={(e)=>handleKeyPress(e, MAX_OWNER_ID)}
                  maxLengthIs={MAX_OWNER_ID}
                />
              </div>
            </div>
            {/* ends - section for national id label and textbox */}

            {/* section for DOB label and date picker */}
            <div className="p-1">
              <div className="walaa-regular-400 title">
                <TypographyAndIcon
                  text={languageData?.dob}
                  required={true}
                />
              </div>
              <div className="calendarContainer">
                <SharedCalendar
                  value={dateValue as Value}
                  setValue={setDateValue}
                  format={format}
                  isOn={isOn}
                  switchLabel={languageData?.hirji}
                  setIsOn={setIsOn}
                  placeHolder={languageData?.driver_dob}
                />
              </div>
            </div>
            {/* ends - section for DOB label and date picker */}

            {/* section for relationship capturing */}
            <div className="p-1">
              <div className="walaa-regular-400 title">
                <TypographyAndIcon
                  text={languageData?.driver_relation}
                  required={true}
                />
              </div>
              <div>
                <ThemeMasterSelect
                  options={masterData?.model?.content}
                  placeholder={languageData?.driver_relation_placeholder}
                  value={(relation != null)?relation.toString():""}
                  onChangehandler={handleFieldChange}
                  isRequired={true}
                  fieldName="driver_relation"
                  classes="master-select"
                  label={languageData?.driver_relation}
                />
              </div>
            </div>
            {/* ends - section for relationship capturing */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-end gap-1">
            <div>
              <ThemeButton
                isDisabled={false}
                title={languageData?.cancel}
                value="cancel"
                classes="walaa-medium-500 register-call2action2 btn btn-link btn-lg"
                onClickhandler={handleClose}
              />
            </div>
            <div>
              <ThemeButton
                isDisabled={(isQuote && isQuoteLoading) ? true : actionEnabler}
                title={languageData?.submit}
                value="update"
                classes="walaa-medium-500"
                // onClickhandler={hanldeUpdate}
                onClickhandler={(event) => clickHandler(event)}
              />
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      {/* dialog code ends */}
    </React.Fragment >
  );
};

//export default AddDriver;