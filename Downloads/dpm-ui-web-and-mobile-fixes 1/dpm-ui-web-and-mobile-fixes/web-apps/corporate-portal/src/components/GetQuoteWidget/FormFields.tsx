import React, {
  Fragment,
  useState,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { DateObject, type Value } from "react-multi-date-picker";
import { formFieldModule, viewPassword} from "constant";
import { CardID, CardIDFilled } from "../../assets/GetQuoteWidget";
import PasswordEyeCLosed from "../../assets/Login/pwd.svg";
import PasswordEyeOpen from "../../assets/product/eye.svg";
import { SharedCalendar } from "../Calendar";
import { Modal } from "react-bootstrap";
import { checkPhoneNumberStarts, iqmaIdNationalIdValidation, iqmaIdNationalIdValidationOnBlur } from "@dpm/shared-module";
import { useSelector } from 'react-redux';
import { RootState, isValidInputRegex } from "@dpm/shared-module";

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
  languageData?: { [key: string]: string };
  productName?: string;
  setIsHizriCalendar?: (val: boolean) => void;
  inputPlaceholder?: string;
  APIError?: string;
  isqmaId?: boolean;
  maxLength?: number;
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
    tooltip,
    refNoTooltip,
    languageData = {},
    isqmaId = false,
    maxLength,
    productName="",
  }) => {
    const [value, setValue] = useState<string | number | Value>(
      inputType[fieldType].valueType
    );
    const [errorMessage, setErrorMessage] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    //Modal dialog handler state
    const [isModal, setShow] = useState<boolean>(false);
    const [isRefNoModal, setRefNoShow] = useState<boolean>(false);
    const [isOn, setIsOn] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChange = useCallback(
      (name: string, value: string, required: boolean = false) => {
        if (maxLength && value.length > maxLength) {
          return;
        }
        const newValue = value;
        const inputName = name;
        setValue(newValue);
        validateInput(newValue, inputName, required);
      },
      [fieldName, errorMessage]
    );

    const handleBlur = useCallback(
      (name: string, value: string) => {
        const newValue = value;
        const inputName = name;
        setValue(newValue);
        validateInputOnBlur(newValue, inputName);
      },
      [fieldName, errorMessage]
    );

    const validateInput = (input: string, inputName: string, required: boolean) => {
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
              let messageLabel = module === formFieldModule.home ? languageData?.customer_id_label : languageData?.owner_id_label;
              setErrorMessage(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", messageLabel));
              onFieldChange(inputName, input, false);
            }
            break;
          case 'new_mobile_no_':
          case 'mobileNumber':
            if (!checkPhoneNumberStarts(input)) {
              setErrorMessage(languageData?.phone_no_must_be_starts_wi);//'Invalid input for Owner ID'
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
          default:
            break;
        }
      }
    };

    const validateInputOnBlur = (input: string, inputName: string) => {
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
              let messageLabel = module === formFieldModule.home ? languageData?.customer_id_label : languageData?.owner_id_label;
              setErrorMessage(languageData?.invalid_dynamic_input.replace("<DYNAMIC>", messageLabel));
              onFieldChange(inputName, input, false);
            }
            break;
          case 'new_mobile_no_':
          case 'mobileNumber':
            // Validate input: up to 10 digits and starts with 1, 2, or 7
            if (input !== "" && !checkPhoneNumberStarts(input)) {
              setErrorMessage(languageData?.phone_no_must_be_starts_wi);//'Invalid input for Owner ID'
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
          case 'new_password':
          case 'confirm_password':
            if (!/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(input)) {//Minimum 8 characters, at least one number, at least one special character
              setErrorMessage(languageData?.password_should_contain_min);
              onFieldChange(inputName, input, false);
            }
            break;
          default:
            break;
        }
      }
    };

    useEffect(() => {
      setIsOn(isqmaId);
    }, [isqmaId]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [value]);
    useEffect(() => {
      setValue(inputType[fieldType].valueType);
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
        } else {
          // DOB selected — mark valid
          const monthIndex = new DateObject(value).monthIndex + 1;
          const year = new DateObject(value).year;
          const formatted = `${monthIndex < 10 ? "0" + monthIndex : monthIndex}/${year}`;
          onFieldChange(field_name, formatted, true);
        }
      }
    }, [value]);
    
    const PlaceHolderElement: React.FC = () => {
      return (
        <div className="input-placeholder">
          <span className={`${value && "data-filled"}`}>
            {classType === "Identity" && module !== formFieldModule.login ? (
              <img src={value ? CardIDFilled : CardID} alt="Identity" />
            ) : (
              classType && module !== formFieldModule.login && InputIcon[classType as keyof typeof InputIcon]
            )}
          </span>
          <span className={module !== formFieldModule.login ?
            `${value && "d-none"} 'form-field'` : 'form-field'
          }>
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

    // when user is authenticated and userID is available, set the default value for the field
    useEffect(() => {
      if (isAuthenticated && userID) {
      switch (fieldName) {
        case "Claim Type":
        handleChange("claim_type", languageData?.comprehensive, true);
        break;
        case "National Id / IQAMA No.":
        handleChange("national_id_iqama_no", userID, true);
        break;
        default:
        break;
      }
      }
    }, [isAuthenticated, userID, fieldName]);
    
    const inputFieldType: string =
      inputType[fieldType].inputType === inputType.password.inputType && showPassword === true 
      ? inputType.text.inputType 
      : inputType[fieldType].inputType;

    return (
      <React.Fragment>
        <PlaceHolderElement />
        {fieldType === "calendar" && (
          <SharedCalendar
            value={value as Value}
            setValue={setValue}
            format={format}
            isOn={isOn}
            switchLabel={languageData?.hirji}
            setIsOn={setIsOn}
            errorClass={`${value && "data-filled"}${errorMessage != "" ? " error-class" : ""}`}
          />
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
        {fieldType !== "select" && fieldType !== "calendar" && (
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
            />
            {fieldType === inputType.password.inputType && (
              <img
                onClick={togglePasswordVisibility}
                src={showPassword === true ? PasswordEyeOpen : PasswordEyeCLosed}
                alt={showPassword === true ? viewPassword.hide : viewPassword.show}
              />
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