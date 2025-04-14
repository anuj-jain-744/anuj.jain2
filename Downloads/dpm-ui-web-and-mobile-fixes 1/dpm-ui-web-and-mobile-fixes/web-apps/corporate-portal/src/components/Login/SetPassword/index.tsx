import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { encryptData, useApiCall } from "@dpm/shared-module";
import CloseIcon from "@mui/icons-material/Close";
import { LoaderOverlay } from "../../Loader";
import { FormsField } from "../../GetQuoteWidget/FormFields";

import { useLoginAndSignupContext } from "../useLoginAndSignupContext";

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
  const [apiError, setApiError] = useState<ConfirmPasswordProps>({});
  const [handleSubmitFailed, setHandleSubmitFailed] = useState<boolean>(false);
  const { makeApiCall, isLoading, errors, data } = useApiCall(13, '/ResetPassword', "post");
  const { makeApiCall: signupApiCall, isLoading:signupLoading, errors:signupError, data:signupData } = useApiCall(13, '/UserSignup/UserRegister', "post");
  const LoginContext = useLoginAndSignupContext()

  const formData = (formElementsData as { set_new_password_form: any[] })?.set_new_password_form[0];
  const formFields = formData?.fields;
  const newPassword = formFields[0];
  const confirmPassword = formFields[1];
  const submitBtn = formFields[2].field_title;

  const handleChange = (fieldName: string, value: string | number, isValid: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: { value, isValid },
    }));
  };

  const allFieldsValid = () => Object.values(formState).every(
    (field) => field.value != "" && field.isValid
  );

  const handleSubmit = () => {
    if (formState.new_password.value !== formState.confirm_password.value) {
      setApiError({ confirmPassword: '' });
      setHandleSubmitFailed(true);
    } else {
      setApiError({});
      setLoading(true);
      setHandleSubmitFailed(false);
      const encryptedPass = encryptData(formState.confirm_password.value);
      
      const payload = LoginContext?.signUpForm ? {
        "userId": (LoginContext?.loginData as { userId: string })?.userId.toString(),
        "newPassword": encryptedPass,
        "mobileNumber": (LoginContext?.loginData as { mobileNumber: string })?.mobileNumber,
      }
      :
      {
        "userId": (LoginContext?.loginData as { userId: string })?.userId.toString(),
        "newPassword": encryptedPass,
        "type":"RESETPASSWORD"
      }
      LoginContext?.signUpForm ? signupApiCall(payload) : makeApiCall(payload);
    }
  }

  const handleBackBtn = () => {
    setCurrentStepValue(5)
  }

  // check the confirm password does not macth the new password and shows an message to user
  useEffect(() => {
    if (!apiError?.confirmPassword && formState?.new_password?.value !== formState?.confirm_password?.value && handleSubmitFailed) {
      setApiError({ confirmPassword: (formElementsData as { data: { passwords_do_not_match: string } })?.data?.passwords_do_not_match });
    }
  }, [apiError?.confirmPassword, handleSubmitFailed]);

  useEffect(() => {
    const initialState: formStateProps = {};
    formData?.fields.forEach(({ field_name, field_type }: { field_name: string, field_type: string }) => {
      if (field_type !== "submit") {
        initialState[field_name] = { value: "", isValid: false };
      }
    })
    setFormState(initialState);
  }, [formData]);

  useEffect(() => {
    if (errors || signupError) {
      setApiError({
        'confirmPassword': errors?.messages?.message_en
      })
    } else if (data || signupData) {
      let successMessage = LoginContext.signUpForm ? (formElementsData as { data: { signup_success_msg: string } })?.data?.signup_success_msg : (formElementsData as { data: { forgotpassword_success_msg: string } })?.data?.forgotpassword_success_msg;
      LoginContext.setSuccessMessage(successMessage)
      setCurrentStepValue(4);
    }
    setLoading(isLoading || signupLoading);
  }, [isLoading, errors, data, signupLoading, signupError, signupData]);


  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
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
        <div className="modal-login-form">
          <Form.Group>
            <div className="user-pwd">
              <FormsField
                module="login"
                classType={newPassword?.field_class}
                fieldType={newPassword?.field_type}
                fieldName={newPassword?.field_title}
                fieldOptions={newPassword?.field_options}
                field_name={newPassword?.field_name}
                tooltip={newPassword?.tooltip}
                onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                inputPlaceholder={newPassword?.field_placeholder}
                languageData={languageData as { [key: string]: string }}
                APIError={apiError.newPassword || ''}
              />
            </div>
            <div className="user-pwd">
              <FormsField
                module="login"
                classType={confirmPassword?.field_class}
                fieldType={confirmPassword?.field_type}
                fieldName={confirmPassword?.field_title}
                fieldOptions={confirmPassword?.field_options}
                field_name={confirmPassword?.field_name}
                tooltip={confirmPassword?.tooltip}
                onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value as string | number, isValid)}
                inputPlaceholder={confirmPassword?.field_placeholder}
                languageData={languageData as { [key: string]: string }}
                APIError={apiError.confirmPassword || ''}
              />
            </div>
          </Form.Group>
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