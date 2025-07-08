import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";


// Material-UI Icons
import {
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  CallOutlined as CallOutlinedIcon,
  LibraryBooksOutlined as LibraryBooksOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

// Assets
import { CardID, PasswordIcon } from "../../assets/GetQuoteWidget";
import PasswordEyeCLosed from "../../assets/Login/Visibility_Off.svg";
import PasswordEyeOpen from "../../assets/Login/visibility_eye.svg";
import CheckCircle from "../../assets/Login/CheckCircle.svg";

// Constants and Utilities
import { formFieldModule, viewPassword, FIELD_NAMES } from "../../constant";
import { SharedCalendar } from "../Calendar";
import {
  RootState,
  checkPhoneNumberStarts,
  iqmaIdNationalIdValidation,
  iqmaIdNationalIdValidationOnBlur,
  isValidInputRegex,
  isValidPassword,
} from "@dpm/shared-module";

// Types
import { DateObject, type Value } from "react-multi-date-picker";
import { calendarValidation } from "utils/calendarValidation";


interface FormsFieldProps {
  module?: string;
  classType: string;
  fieldName: string;
  fieldType: string;
  tooltip?: string;
  refNoTooltip?: string;
  fieldOptions?: { [key: string]: string };
  field_name?: string;
  format?: string;
  onFieldChange?: (fieldName: string, value: string | number | Value, isValid: boolean) => void;
  onFieldBlur?: (fieldName: string, value: string | number | Value, isValid: boolean) => void;
  languageData?: { [key: string]: string };
  productName?: string;
  setIsHizriCalendar?: (val: boolean) => void;
  inputPlaceholder?: string;
  APIError?: string;
  maxLength?: number;
  fieldValidationMessage?: string;
  isArabic?: boolean; // Optional if field is Arabic
  arabicPlaceholder?: string; // Optional if field is Arabic
}

const InputIcon = {
  Identity: CardID,
  DOB: <CalendarMonthOutlinedIcon />,
  MobileNumber: <CallOutlinedIcon />,
  Library: <LibraryBooksOutlinedIcon />,
};

const inputType: {
  [key: string]: { inputType: string; valueType: string | number | Value };
} = {
  text: { inputType: "text", valueType: "" },
  phone: { inputType: "text", valueType: "" },
  calendar: { inputType: "text", valueType: null as Value | null },
  select: { inputType: "text", valueType: "" },
  textfield: { inputType: "text", valueType: "" },
  password: { inputType: "password", valueType: "" },
  checkbox: { inputType: "checkbox", valueType: "" },
};

export const FormsField: React.FC<FormsFieldProps> = memo(
  ({
    classType,
    module = "",
    inputPlaceholder = "",
    APIError = "",
    fieldType,
    fieldName,
    fieldOptions,
    field_name = "",
    setIsHizriCalendar,
    format,
    onFieldChange,
    onFieldBlur,
    tooltip,
    refNoTooltip,
    languageData = {},
    maxLength,
    productName = "",
    fieldValidationMessage = "",
    isArabic,
    arabicPlaceholder,
  }) => {
    const [value, setValue] = useState<string | number | Value>(
      inputType[fieldType]?.valueType
    );
    const dateFormat = format ?? "MM/YYYY";
    const [errorMessage, setErrorMessage] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    //Modal dialog handler state
    const [isModal, setShow] = useState<boolean>(false);
    const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
    const [isOn, setIsOn] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
    const [calendarError, setCalendarError] = useState<string>("");


    const handleChange = useCallback(
      (name: string, value: string, required: boolean = false) => {
        if (maxLength && value?.length > maxLength) {
          return;
        }
        const newValue = value;
        const inputName = name;
        if (fieldType === "calendar") {
          const stringVal = newValue as string;
          setValue(stringVal);
          const isValid = calendarValidation(stringVal, isOn);
          if (stringVal?.length === 7) {
            setCalendarError(isValid ? "" : fieldValidationMessage);
            if (onFieldChange) {
              onFieldChange(field_name, stringVal, isValid);
            }
          } else if (stringVal?.length > 0){
            setCalendarError(isValid ? "" : fieldValidationMessage);
            if (onFieldChange) {
              onFieldChange(field_name, stringVal, isValid);
            }
          }
          return;

        }

        // other inputs
        setValue(newValue);
        validateInput(newValue, inputName, required);
      },
      [fieldName, errorMessage, isOn]
    );


    const handleBlur = useCallback(
      (name: string, value: string) => {
        const newValue = value;
        const inputName = name;
        //  Handle calendar blur separately
        if (fieldType === "calendar") {
          const stringVal = newValue as string;
          const isValid = calendarValidation(stringVal, isOn);
          setCalendarError(isValid ? "" : fieldValidationMessage);
          if (onFieldChange) {
            onFieldChange(field_name, stringVal, isValid);
          }
          return;
        }

        setValue(newValue);
        validateInputOnBlur(newValue, inputName);
      },
      [fieldName, errorMessage, isOn]
    );

    const validateInput = (input: string, inputName: string, required: boolean) => {
      let isValid = true;
      setErrorMessage('');
      if (onFieldChange) {
        onFieldChange(inputName, input, true);
        switch (inputName) {
          case 'i_agree':
            onFieldChange(inputName, input, required);
            break;
          case 'case_reference_no':
            if (input === '') {
              // if blank then no error
            } else if (input.length > 0) {

              if (!/^[a-zA-Z0-9][a-zA-Z0-9]*$/.test(input)
                || /^[A-Za-z]/.test(input)) { //## Najm case ##
                //## Najm case ## reference number starts with 2 alphabets followed by 7 to 10 digits
                if (/^[A-Za-z]{0,2}[0-9]{0,10}$/.test(input)) {
                  //correct format
                } else {
                  setErrorMessage(languageData?.field_invalid_case_reference_no); //'Invalid NAJM Case
                  onFieldChange(inputName, input, false);
                }

              } else if (/^[4567]/.test(input)) { //## Police case ##
                //## Police case ## reference number starts with 4,5,6 or 7 and with 10 numeric characters.
                if (!/\d$/.test(input) || input.length > 10) { // all should be digit otherwise error
                  setErrorMessage(languageData?.invalid_police_case_refere); //'Invalid Police Case
                  onFieldChange(inputName, input, false);
                } else if (input.length === 10 && !/^[4567][0-9]{0,10}$/.test(input)) { //invalid format
                  setErrorMessage(languageData?.invalid_police_case_refere); //'Invalid Police Case
                  onFieldChange(inputName, input, false);
                }

              } else if (/^[123890]/.test(input)) { //## Other case ##
                //## Other case ## reference number starts with 1,2,3,8,9,0
                //as of now it is not defined so no validation
                if (!/\d$/.test(input) || input.length > 30) {
                  setErrorMessage(languageData?.invalid_other_case_referen); //'Invalid Other case
                  onFieldChange(inputName, input, false);
                }
              }
            }
            break;
          case 'national_id_iqama_no_':
          case 'national_id_iqama_no':
          case 'ownerId':
            // Validate input: up to 10 digits and starts with 1, 2, or 7
             if (iqmaIdNationalIdValidation(input)) {
              const message = formFieldModule.login ?  languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.user_id_label) : fieldValidationMessage;
              setErrorMessage(message);
              onFieldChange(inputName, input, false);
            }
            break;
          case 'new_mobile_no_':
          case 'mobileNumber':
            if (!checkPhoneNumberStarts(input)) {
              const message = module === formFieldModule.login ? languageData?.ensure_mobile_number : fieldValidationMessage;
              setErrorMessage(message);
              onFieldChange(inputName, input, false);

             }
            break;
          case "mobile_no":
            // signup mobile number must have 10 to 12 digits
            if (isValidInputRegex(input, 10, 12) === false) {
              isValid = false;
              setErrorMessage(languageData?.phone_no_must_be_starts_wi);
            }
            onFieldChange(inputName, input, isValid);
            break;
          case 'new_pasd':
            if (input !== "" && isValidPassword(input)) {
              setErrorMessage("");
              setPasswordsMatch(true);
            } else {
              setPasswordsMatch(false);
              setErrorMessage(languageData?.password_should_contain_min);
            }
            onFieldChange(inputName, input, false);
            break;
          case 'confirm_pasd':
            if (input !== "" && isValidPassword(input)) {
              setErrorMessage("");
              setPasswordsMatch(true);
            } else {
              setPasswordsMatch(false);
            }
            onFieldChange(inputName, input, false);
            break;
          default:
            break;
        }
      }
    };

    const validateInputOnBlur = (input: string, inputName: string, required:boolean = false) => {
      let regex;
      let isValid = true;
      setErrorMessage('');
      if (onFieldChange) {
        onFieldChange(inputName, input, true);
        switch (inputName) {

          case 'case_reference_no':
            if (input === '') {
              // if blank then no error
            } else if (input.length > 0) {

              if (!/^[a-zA-Z0-9][a-zA-Z0-9]*$/.test(input)
                || /^[A-Za-z]/.test(input)) { //## Najm case ##
                //## Najm case ## reference number starts with 2 alphabets followed by 7 to 10 digits
                if (input.length > 8 && /^[A-Za-z]{0,2}[0-9]{0,10}$/.test(input)) {
                  //correct format
                } else {
                  setErrorMessage(languageData?.field_invalid_case_reference_no); //'Invalid NAJM Case
                  onFieldChange(inputName, input, false);
                }

              } else if (/^[4567]/.test(input)) { //## Police case ##
                //## Police case ## reference number starts with 4,5,6 or 7 and with 10 numeric characters.
                if (/\d$/.test(input) && input.length === 10) { // all should be digit otherwise error
                  //correct format
                } else { //invalid format
                  setErrorMessage(languageData?.field_invalid_case_reference_no); //'Invalid Police Case
                  onFieldChange(inputName, input, false);
                }

              } else if (/^[123890]/.test(input)) { //## Other case ##
                //## Other case ## reference number starts with 1,2,3,8,9,0
                //as of now it is not defined so no validation
                if (input.length < 3 || input.length > 30 || !/\d$/.test(input)) {
                  setErrorMessage(languageData?.invalid_other_case_referen); //'Invalid Other case
                  onFieldChange(inputName, input, false);
                }
              }
            }
            break;
          case 'national_id_iqama_no_':
          case 'national_id_iqama_no':
          case 'ownerId':
           if (iqmaIdNationalIdValidationOnBlur(input)) {
              const message = formFieldModule.login ?  languageData?.invalid_dynamic_input.replace("<DYNAMIC>", languageData?.user_id_label) : fieldValidationMessage;
              setErrorMessage(message);
              onFieldChange(inputName, input, false);

            }
            break;
          case 'new_mobile_no_':
          case 'mobileNumber':
            // Validate input: up to 10 digits and starts with 1, 2, or 7
            if (!checkPhoneNumberStarts(input)) {
              const message = module === formFieldModule.login ? languageData?.ensure_mobile_number : fieldValidationMessage;
              setErrorMessage(message);
              onFieldChange(inputName, input, false);

            }
            break;
          case "mobile_no":
            // signup mobile number must have 10 to 12 digits
            if (isValidInputRegex(input, 10, 12) === false) {
              isValid = false;
              setErrorMessage(languageData?.phone_no_must_be_starts_wi);
            }
            onFieldChange(inputName, input, isValid);
            break;
          case 'new_pasd':
          case 'confirm_pasd':
            if (input !== "" && isValidPassword(input)) {
              setErrorMessage("");
            } else {
              isValid = false;
              setErrorMessage(languageData?.password_should_contain_min);
            }
            if (onFieldBlur) {
              onFieldBlur(inputName, input, isValid);
            }
             break;
          default:
            break;
        }
      }
    };

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [value]);

    useEffect(() => {
      setValue(inputType[fieldType]?.valueType);
    }, [productName]);

    useEffect(() => {
      setIsHizriCalendar && setIsHizriCalendar(isOn);
    }, [isOn]);

    useEffect(() => {
      setErrorMessage(APIError);
    }, [APIError])

    useEffect(() => {
      if (fieldType === "calendar" && onFieldChange) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          // DOB is empty — mark invalid
          onFieldChange(field_name, "", false);
        }
      }
    }, [value]);

    const PlaceHolderElement: React.FC = () => {
      return (
        <div className="input-placeholder">
          <span className={`${value && "data-filled"}`}>
            {classType === "Identity" ? (
              <img src={CardID} alt="Identity" />
            ) : classType === "Password" ? (
              <img src={PasswordIcon} alt="Identity" />
            ) : (
              classType && InputIcon[classType as keyof typeof InputIcon]
            )}
          </span>
          <span className={`${value && "d-none"} form-field`}>
            {fieldName}
          </span>
        </div>
      );
    };

    //modal dialog handler functions
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleRefNoClose = () => setRefNoShow(false);
    const handleRefNoShow = () => setRefNoShow(true);
    const togglePasswordVisibility = () => setShowPassword(value => !value);

    // get authenticated flag from redux store
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth?.isAuthenticated
    );
    // get user id from redux store
    const userID = useSelector(
      (state: RootState) => state.auth?.userInfo?.userId
    );

    const mobileNumber = useSelector(
      (state: RootState) => state.auth?.userInfo?.mobileNumber
    );

    const dateOfBirth = useSelector(
      (state: RootState) => userID?.toString()?.startsWith("1") ? state.auth?.userInfo?.ownerDobH : state.auth?.userInfo?.ownerDobG
    );
    const extractDOB = dateOfBirth?dateOfBirth?.split("-")[1]+'/'+dateOfBirth?.split("-")[2]:"";

    // when user is authenticated and userID is available, set the default value for the field
    useEffect(() => {
      if (isAuthenticated && userID) {
        switch (fieldName) {
          case FIELD_NAMES.CLAIM_TYPE:
            handleChange("claim_type", languageData?.comprehensive, true);
            break;
          case FIELD_NAMES.NATIONAL_ID_IQAMA_NO:
            handleChange("national_id_iqama_no", userID, true);
            break;
          default:
            break;
        }
      }
    }, [isAuthenticated, userID, fieldName]);

    const inputFieldType: string =
      inputType[fieldType]?.inputType === inputType.password.inputType && showPassword === true
      ? inputType.text.inputType
      : inputType[fieldType]?.inputType;

    return (
      <React.Fragment>
        {fieldType !== "checkbox" && fieldType !== "calendar" && <PlaceHolderElement /> }
        {fieldType === "calendar" && (
          <>
            <SharedCalendar
              value={value as Value}
              setValue={setValue}
              format={dateFormat}
              isOn={isOn}
              switchLabel={languageData?.hirji}
              setIsOn={setIsOn}
              name={field_name}
              onFieldChange={handleChange}
              errorClass={`${value && "data-filled"} ${calendarError ? "error-class" : ""}`}
              maxDate={new DateObject().subtract(18, "years").format("DD/MM/YYYY")}
              minDate={new DateObject().subtract(100, "years").format("DD/MM/YYYY")}
              errorMessage={calendarError ? fieldValidationMessage : ""}
              arabicPlaceholder={arabicPlaceholder}
              isArabic={isArabic}
            />
          </>
        )}
        {fieldType === "select" && (
          <DropdownButton
            title={
              <React.Fragment>
                <div className="get-quote-dropdown">
                  <span
                    className={`${value ? "item-selected" : "empty"}`}
                    data-testid="field-select"
                  >
                    {value ? value.toString() : fieldName}
                  </span>
                </div>
                <ExpandMoreIcon />
              </React.Fragment>
            }
            onSelect={(selectedValue) => {
              if (typeof selectedValue === 'string') {
                handleChange(field_name, selectedValue);
                onFieldChange(field_name, selectedValue, true);
              }
            }}
          >

            {fieldOptions &&
              Object.keys(fieldOptions).map((key, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleChange(field_name, fieldOptions[key])}
                >
                  {fieldOptions[key]}
                </Dropdown.Item>
              )
              )}
          </DropdownButton>
        )}
        {fieldType !== "select" && fieldType !== "calendar" &&  fieldType !== "checkbox" && (
          <div className="input-wrapper d-flex w-100 align-items-center">
            <input
              className={`${value && "data-filled"}${errorMessage != "" ? " error-class" : ""}`}
              type={inputFieldType}
              onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              name={field_name}
              value={value as string | number}
              required
              placeholder={inputPlaceholder}
              maxLength={`${module === formFieldModule.login ? 50 : ""}`}
              autoComplete="off"
            />
            {(fieldType === inputType.password.inputType) && (
              passwordsMatch ? (
                <img
                  className="checkCircleIcon eyeIcon"
                  src={CheckCircle}
                  alt="Passwords Match"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  className="eyeIcon"
                  onClick={togglePasswordVisibility}
                  src={showPassword === true ? PasswordEyeOpen : PasswordEyeCLosed}
                  alt={showPassword === true ? viewPassword.hide : viewPassword.show}
                />
              )
            )}
            {(classType === "Library" || (classType === "Identity" && module !== formFieldModule.login)) && (
              <button
                className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0 button-tooltip"
                title="Read More"
                type="button"
                onClick={classType === "Library" ? handleShow : handleRefNoShow}
              >
                <InfoOutlinedIcon className="tooltip-icon" />
              </button>
            )}
            {errorMessage != "" && (
              <div className="validation-error">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {fieldType === "checkbox" && (
          <>
          <input
            className={`${value && "data-filled"}${errorMessage != "" ? " error-class" : ""}`}
            type={inputFieldType}
            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.checked)}
            onBlur={(e) => handleBlur(e.target.name, e.target.value, e.target.checked)}
            name={field_name}
            value={field_name}
            required
          />
          </>
        )}

        {isModal && (
          <Modal
            size="lg"
            show={isModal}
            centered
            onHide={handleClose}
            className="register-new-claim-GetQuoteWidget-ModalDialogBox"
          >
            <Modal.Header closeButton></Modal.Header>
            {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip }}></div>}
          </Modal>
        )}
        {isRefNoModal && (
          <Modal
            size="lg"
            show={isRefNoModal}
            centered
            onHide={handleRefNoClose}
            className="register-new-claim-GetQuoteWidget-ModalDialogBox"
          >
            <Modal.Header closeButton></Modal.Header>
            {refNoTooltip && <div dangerouslySetInnerHTML={{ __html: refNoTooltip }}></div>}
          </Modal>
        )}
      </React.Fragment>
    );
  }
);