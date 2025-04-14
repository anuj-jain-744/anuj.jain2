import React, {useState, useEffect} from "react";
import { Form } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { getRandomString, useApiCall } from "@dpm/shared-module";
import { LoaderOverlay } from "../../Loader";
import { FormsField }  from "../../GetQuoteWidget/FormFields";

import { useLoginAndSignupContext } from "../useLoginAndSignupContext";

export interface formStateProps {
    [key: string]: {
        value: string | number ,
        isValid: boolean;
    }
  }

interface ForgotPasswordAndSignUpProps {
    setCurrentStepValue: (step: number) => void;
    closeIcon:boolean;
    formElementsData:object;
    languageData: object;
}

export const ForgotPasswordAndSignUp:React.FC<ForgotPasswordAndSignUpProps>  = ({
    setCurrentStepValue,
    closeIcon,
    formElementsData,
    languageData
}) =>{
    const [loading,setLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState<formStateProps>({});
    const [apiError, setApiError] = useState<object>({});
    const [sessionId, setSessionId] = useState<string>("");
    const LoginContext = useLoginAndSignupContext();
    const url = LoginContext?.signUpForm ? "/UserSignup/GenerateOtp" : "/GenerateOtp";
    const { makeApiCall, isLoading, errors, data } = useApiCall(14, url, "post");
    

    const formData = formElementsData?.forgot_password_form[0];
    const screenTitle = LoginContext?.signUpForm ? formElementsData?.data?.signup_title : formElementsData?.forgot_password_form[0]?.product_name
    const formFields = formData?.fields;  
    const nationalId = formFields[0];
    const mobileNum = formFields[1];
    const continueBtn = formFields[2];

    const handleChange = (fieldName: string, value: string | number, isValid: boolean) => {
        setFormState((prevState) => ({
          ...prevState,
          [fieldName]: { value, isValid },
        }));
    };

    const allFieldsValid = () => Object.values(formState).every(
        (field) => field.value != "" && field.isValid
    );

    const getSecretSessionId = () => {
      const sessionId = getRandomString(9, true);
      setSessionId(sessionId);
      return sessionId;
    }

    const handleSubmit = () => {
        setLoading(true);
        setApiError({
          'mobileNumber': '',
          'nationalID': ''
        })
        const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
        let payload = {};
        payload = {
          "userId": formState.national_id_iqama_no_.value.toString(),
          "mobileNumber": formState.mobile_no.value.toString(), // Convert the value to a string
          "sessionSecretId": sessionSecretId
        }

        LoginContext.setContextMobNum(formState.mobile_no.value.toString()); // Convert the value to a string
        LoginContext.setForgotPassPayload(payload);
        LoginContext.setnavigateToErrorFrom(5);
        makeApiCall(payload)
    }

    const handleBackBtn = () => {
        setCurrentStepValue(0)
    }

    useEffect(()=>{
        const initialState: formStateProps = {};
        formData?.fields.forEach(({ field_name, field_type }: { field_name: string, field_type: string })=>{
          if (field_type !== "submit") {
            initialState[field_name] = { value: "", isValid: false };
          }
        })
        setFormState(initialState);
    },[formData]);

    useEffect(() => {
        if(errors) {
          setApiError({'mobileNumber' : errors?.messages?.message_en})
        } else if(data) {
          setCurrentStepValue(1);
          LoginContext.setLoginData(data);
        }
        setLoading(isLoading);
      }, [isLoading, errors, data]);

    return (
    <React.Fragment>
        {loading && <LoaderOverlay/>}
        <div className="forgot-password-container">
            <div className="navWrapper">
              <a  className="back-button" 
                onClick={()=>handleBackBtn()}>
                {languageData?.back}
              </a>
              <CloseIcon
                data-testid="close-icon"
                className="modal-close-icon"
                onClick = {() => closeIcon && closeIcon(false)}
              />
            </div>
        </div>
        <div className="form-modal">
        <div className="form-head">
            <h2 data-testid="formTitle" className="form-title">
                {screenTitle}
            </h2>
        </div>
        <div className="modal-login-form">
            <Form.Group>
            <div className="user-id">
              <FormsField
                module="login"
                classType={nationalId?.field_class}
                fieldType={nationalId?.field_type}
                fieldName={nationalId?.field_title}
                fieldOptions={nationalId?.field_options}
                field_name={nationalId?.field_name}
                tooltip={nationalId?.tooltip}
                onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                inputPlaceholder={nationalId?.field_placeholder}
                languageData={languageData as { [key: string]: string }}
                APIError={(apiError as { nationalID: string }).nationalID}
              />  
            </div>
            <div className="user-id">
            <FormsField
                    module="login"
                    classType={mobileNum?.field_class}
                    fieldType={mobileNum?.field_type}
                    fieldName={mobileNum?.field_title}
                    fieldOptions={mobileNum?.field_options}
                    field_name={mobileNum?.field_name}
                    tooltip={mobileNum?.tooltip}
                    onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                    inputPlaceholder = {mobileNum?.field_placeholder}
                    languageData={languageData as { [key: string]: string }}
                    APIError={(apiError as { mobileNumber: string }).mobileNumber}
                    />  
            </div>
            </Form.Group>
            <div
            className={`form-submit-btn ${
                allFieldsValid() && "form-submit-btn-active"
            }`}
            >
            <button
                data-testid="submitBtn"
                disabled={!allFieldsValid()}
                onClick={handleSubmit}
                className={`form-btn ${allFieldsValid() && "form-btn-active"}`}
            >
                { continueBtn.field_title }
            </button>
            </div>
        </div>
        </div>
    </React.Fragment>
    );


}