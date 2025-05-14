import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { encryptData, useApiCall, getRandomString } from "@dpm/shared-module";
import CloseIcon from "@mui/icons-material/Close";
import { LoaderOverlay } from "../../Loader";
import { FormsField } from "../../GetQuoteWidget/FormFields";
import { passwordInput } from "constant";

import { useLoginAndSignupContext } from "../useLoginAndSignupContext";
import InfoIcon from "../../../assets/Login/InfoIcon.svg";

export interface formStateProps {
  [key: string]: {
    value: string | number,
    isValid: boolean;
  }
}

interface SetPasswordProps {
  setCurrentStepValue: (step: number) => void;
  closeIcon: boolean;
  formElementsData: object;
  languageData: object;
}

interface ConfirmPasswordProps {
  confirmPassword?: string | null;
  newPassword?: string | null;
}

export const SetPassword: React.FC<SetPasswordProps> = ({
  setCurrentStepValue,
  closeIcon,
  formElementsData,
  languageData
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<formStateProps>({});
  const [sessionId, setSessionId] = useState<string>("");
  const [apiError, setApiError] = useState<ConfirmPasswordProps>({});
  const [handleSubmitFailed, setHandleSubmitFailed] = useState<boolean>(false);
  const { makeApiCall, isLoading, errors, data } = useApiCall(13, "/ResetPassword/GenerateOtp", "post");
  const { makeApiCall: signupApiCall, isLoading:signupLoading, errors:signupError, data:signupData } = useApiCall(14, '/UserSignup/UserRegister', "post");
  const LoginContext = useLoginAndSignupContext();
  const fieldstoexclude = ["i_agree",]; // fields to exclude for forgot password form

  const formData = (formElementsData as { set_new_password_form: any[] })?.set_new_password_form[0];
  const formFields = formData?.fields;
  const newPassword = formFields[0];
  const confirmPassword = formFields[1];
  const termsAndCondition = formFields[2];
  const submitBtn = formFields[3].field_title;

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
    if (formState.new_pasd.value !== formState.confirm_pasd.value) {
      setApiError({ confirmPassword: '' });
      setHandleSubmitFailed(true);
    } else {
      setApiError({});
      setLoading(true);
      setHandleSubmitFailed(false);
      const encryptedPass = encryptData(formState.confirm_pasd.value);
      const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
      const payload = LoginContext?.signUpForm ? {
        "userId": (LoginContext?.loginData as { userId: string })?.userId.toString(),
        "newPassword": encryptedPass,
        "mobileNumber": (LoginContext?.loginData as { mobileNumber: string })?.mobileNumber,
      }
      :
      {
        "userId": (LoginContext?.loginData as { userId: string })?.userId.toString(),
        "sessionSecretId": sessionSecretId,
      }
      LoginContext?.setencryptedPassword(encryptedPass);
      LoginContext?.signUpForm ? signupApiCall(payload) : makeApiCall(payload);
    }
  }

  const handleBackBtn = () => {
    LoginContext?.navigateToErrorFrom === 0 ? setCurrentStepValue(0) : setCurrentStepValue(5);
  }

  // check the confirm password does not macth the new password and shows an message to user
  useEffect(() => {
    if (!apiError?.confirmPassword && formState?.new_pasd?.value !== formState?.confirm_pasd?.value && handleSubmitFailed) {
      setApiError({ confirmPassword: (formElementsData as { data: { passwords_do_not_match: string } })?.data?.passwords_do_not_match });
    }
  }, [apiError?.confirmPassword, handleSubmitFailed]);

  useEffect(() => {
    const initialState: formStateProps = {};
    let filteredArray = LoginContext?.signUpForm ? formData?.fields : formData?.fields?.filter((item: { field_name: string }) => !fieldstoexclude.includes(item.field_name));
    filteredArray?.forEach(({ field_name, field_type }: { field_name: string, field_type: string }) => {
      if (field_type !== "submit") {
        initialState[field_name] = { value: "", isValid: false };
      }
    })
    setFormState(initialState);
  }, [formData]);

  useEffect(() => {
    if (errors || signupError) {
      let err = errors ?? signupError;
      setApiError({
        'confirmPassword': err?.messages?.message_en
      })
    } else if (data || signupData) {
      let successMessage = LoginContext.signUpForm ? (formElementsData as { data: { signup_success_msg: string } })?.data?.signup_success_msg : (formElementsData as { data: { forgotpassword_success_msg: string } })?.data?.forgotpassword_success_msg;
      LoginContext.setSuccessMessage(successMessage);
      LoginContext?.navigateToErrorFrom === 0 ? LoginContext?.setnavigateToErrorFrom(6.1) : LoginContext?.setnavigateToErrorFrom(6);
      LoginContext.signUpForm ? setCurrentStepValue(4) : setCurrentStepValue(1);
      LoginContext.setLoginData(data ?? signupData);
    }
    setLoading(isLoading || signupLoading);
  }, [isLoading, errors, data, signupLoading, signupError, signupData]);
  
  return (
    <React.Fragment>
      {loading && <LoaderOverlay data-testid="loader-overlay" />}
      <div className="set-password-container">
        <div className="navWrapper">
          <a className="back-button"
            onClick={() => handleBackBtn()}>
            {languageData?.back as string}
          </a>
          <CloseIcon
            data-testid="close-icon"
            className="modal-close-icon"
            onClick={() => closeIcon && closeIcon(false)}
          />
        </div>
      </div>
      <div className="form-modal">
        <div className="form-head">
          <h2 data-testid="formTitle" className="form-title">
            {formData?.product_name}
          </h2>
        </div>
        {LoginContext?.navigateToErrorFrom === 0 && (
          <div className="warning-message">
            {LoginContext?.warningMessage && <span className="warning-text">{LoginContext?.warningMessage}</span>}
          </div>
        )}
        <div className="modal-login-form">
          <Form.Group>
            <div className="user-input">
              <FormsField
                module="login"
                classType={newPassword?.field_class}
                fieldType={newPassword?.field_type}
                fieldName={newPassword?.field_title}
                fieldOptions={newPassword?.field_options}
                field_name={newPassword?.field_name}
                tooltip={newPassword?.tooltip}
                onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                onBlur={() => {/* Add your onBlur logic here if needed */}}
                languageData={languageData as { [key: string]: string }}
                APIError={apiError.newPassword || ''}
              />
            </div>
            <div className="user-input">
              <FormsField
                module="login"
                classType={confirmPassword?.field_class}
                fieldType={confirmPassword?.field_type}
                fieldName={confirmPassword?.field_title}
                fieldOptions={confirmPassword?.field_options}
                field_name={confirmPassword?.field_name}
                tooltip={confirmPassword?.tooltip}
                onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                onBlur={() => {/* Add your onBlur logic here if needed */}}
                languageData={languageData as { [key: string]: string }}
                APIError={apiError.confirmPassword || ''}
              />
            </div>
          </Form.Group>
          <div className="password-info-container">
            <img
              src={InfoIcon}
              className="password-info-icon"
              data-testid="password-info-icon"
              alt={languageData?.password_should_contain_min}
            />
            <p>
              {languageData?.password_should_contain_min}
            </p>
          </div>
          {LoginContext?.signUpForm && (
            <div className="user-checkbox">
              <FormsField
                  module="login"
                  classType={termsAndCondition?.field_class}
                  fieldType={termsAndCondition?.field_type}
                  fieldName={termsAndCondition?.field_title}
                  fieldOptions={termsAndCondition?.field_options}
                  field_name={termsAndCondition?.field_name}
                  tooltip={termsAndCondition?.tooltip}
                  onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                  onBlur={() => {/* Add your onBlur logic here if needed */}}
                  languageData={languageData as { [key: string]: string }}
                />
                <div className="checkbox-text" dangerouslySetInnerHTML={{ __html: termsAndCondition?.field_title }} /> 
            </div>
          )}
          <div
            className={`form-submit-btn ${allFieldsValid() && "form-submit-btn-active"
              }`}
          >
            <button
              data-testid="submitBtn"
              disabled={!allFieldsValid()}
              onClick={handleSubmit}
              className={`form-btn ${allFieldsValid() && "form-btn-active"}`}
            >
              {submitBtn}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );


}