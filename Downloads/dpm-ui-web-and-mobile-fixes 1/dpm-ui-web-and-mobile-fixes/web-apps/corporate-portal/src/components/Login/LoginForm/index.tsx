import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { encryptData, getRandomString, useApiCall } from "@dpm/shared-module";
import { FormsField } from "components/GetQuoteWidget/FormFields";
import { LoaderOverlay } from "components/Loader";
import {useLoginAndSignupContext} from "../useLoginAndSignupContext";
import { loginModuleErrorCode } from "../../../constant"; 


export interface formStateProps {
  [key: string]: {
      value: string | number ,
      isValid: boolean;
  }
}
export interface apiErrorProps {
  [key: string] : [value: string], 
}

interface LoginFormProps {
  formElementsData: object;
  closeIcon: boolean;
  languageData: object;
  setCurrentStepValue: (data: number) =>void;
  setMobileNumber: (data: number) =>void;
  contextProvider: boolean;
  refData: object;
  refNum: string
}
export const LoginForm: React.FC<LoginFormProps> = ({
  formElementsData,
  closeIcon,
  languageData,
  setCurrentStepValue,
  setMobileNumber,
  contextProvider,
  refData,
  refNum
}) => {
  const [formState, setFormState] = useState<formStateProps>({});
  const [apiError, setApiError] = useState<object>({})
  const [sessionId, setSessionId] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);
  const { makeApiCall, isLoading, errors, data : loginData } = useApiCall(13, "/UserLogin/GenerateOtp", "post");
  const {setSignUpForm,setLoginPayload,setFormData, setLoginData, setErrorMessage, setnavigateToErrorFrom, setReferenceNumber} = useLoginAndSignupContext();
  
  const handleChange = (fieldName: string, value: string | number, isValid: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: { value, isValid },
    }));
  };

  const allFieldsValid = () => Object.values(formState).every(
    (field) => field.value != "" && field.isValid
  );

  useEffect(() => {
    setFormData(formElementsData);
  }, []);

  const formElementdata = formElementsData?.data;
  const formData = formElementsData?.login_form[0];
  const formFields = formData?.fields;
  const userIdaData = formFields[0];
  const pwdData = formFields[1];

  useEffect(()=>{
    const initialState: formStateProps = {};
    formData?.fields.forEach(({ field_name, field_type })=>{
      if (field_type !== "webform_actions") {
        initialState[field_name] = { value: "", isValid: false };
      }
    })
    setFormState(initialState);
  },[formData]);

  const getSecretSessionId = () => {
    const sessionId = getRandomString(9, true);
    setSessionId(sessionId);
    return sessionId;
  }
  
  const handleSubmit = () => {
    setLoading(true);    
    setApiError({
      'userName': '',
      'password': ''
    })
    const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
    const encryptedPass = encryptData(formState.password.value);
    const payload ={
      "userId" : formState.national_id_iqama_no.value.toString(),
      "encryptedPass": encryptedPass,
      "sessionSecretId": sessionSecretId
    }
    setLoginPayload(payload);
    setnavigateToErrorFrom(0) 
    makeApiCall(payload);
  };

  const handleNavigation = (navigate) =>{
    setSignUpForm(navigate === 'signUp');
    setCurrentStepValue(5);
  }

  useEffect(() => {
    if(errors) {
      if(errors?.messages?.details?.field===loginModuleErrorCode.userId){
        setApiError({'userName' : errors?.messages?.message_en})
      }else if(errors?.messages?.details?.field===loginModuleErrorCode.password){
        setApiError({'password' : errors?.messages?.message_en})
      }else if(errors.code===loginModuleErrorCode.DTXSGOT4001){
        setErrorMessage(errors?.messages?.message_en);
        setnavigateToErrorFrom(0);
        setCurrentStepValue(2);
      }
    } else if(loginData || refData) {
      setCurrentStepValue(1);
      setMobileNumber(loginData?.mobileNumber ?? refData?.mobileNumber);
      setLoginData(loginData ?? refData);
    }
    if(refNum) {
      setnavigateToErrorFrom(6);
      setReferenceNumber(refNum);
    }
    setLoading(isLoading);
  }, [isLoading, errors, loginData, refData, refNum]);

  return (
    <React.Fragment>
    {loading && <LoaderOverlay/>}
    <div className="form-modal">
      <div className="form-head">
        <h2 data-testid="formTitle" className="form-title">
          {formElementdata?.title}
        </h2>
        <CloseIcon
          data-testid="close-icon"
          className="modal-close-icon"
          onClick={() => closeIcon(false)}
        />
      </div>
      <div className="modal-login-form">
        <Form.Group>
          <div className="user-id">
            <FormsField
              module="login"
              classType={userIdaData?.field_class}
              fieldType={userIdaData?.field_type}
              fieldName={userIdaData?.field_title}
              fieldOptions={userIdaData?.field_options}
              field_name={userIdaData?.field_name}
              tooltip={userIdaData?.tooltip}
              onFieldChange={handleChange}
              inputPlaceholder = {userIdaData?.field_placeholder}
              languageData={languageData}
              APIError={apiError.userName}
            /> 
          </div>
          <div className="user-pwd">
            <FormsField
                module = "login"
                classType={pwdData?.field_class}
                fieldType={pwdData?.field_type}
                fieldName={pwdData?.field_title}
                fieldOptions={pwdData?.field_options}
                field_name={pwdData?.field_name}
                tooltip={pwdData?.tooltip}
                onFieldChange={handleChange}
                inputPlaceholder = {pwdData?.field_placeholder}
                languageData={languageData}
                APIError={apiError.password}
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
            {formElementdata?.title}
          </button>
        </div>
      </div>
      <div className="forgot-signup">
        <div className="forgot-block">
        <a
            data-testid="forgot"
            className="forgot-title"
            onClick={() => handleNavigation('forgotPassword')}
          >
            {formElementdata?.forgot_password}?
          </a>
        </div>
        <div className="sign-up-block">
          {formElementdata?.newuser_link} 
          <a
            data-testid="signup"
            className="sign-up-title d-flex"
            onClick={() => handleNavigation('signUp')}
          >
            {formElementdata?.signup_now}
          </a>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
};
