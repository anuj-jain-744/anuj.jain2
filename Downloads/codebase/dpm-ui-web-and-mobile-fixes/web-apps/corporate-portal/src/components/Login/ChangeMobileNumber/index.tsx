import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";
import { useApiCall, getRandomString } from "@dpm/shared-module";
import { FormsField } from "../../GetQuoteWidget/FormFields";
import { useLoginAndSignupContext } from "../useLoginAndSignupContext";
import { LoaderOverlay } from "../../Loader";

export interface formStateProps {
    [key: string]: {
        value: string | number ,
        isValid: boolean;
    }
}

interface ChangeMobileNumberProps {
    languageData: object;
    closeIcon: boolean;
    setCurrentStepValue: (step: number) => void;
    contextProvider : boolean;
    handleSuccessValidation: (val:string) => void;
}

export const ChangeMobileNumber:React.FC<ChangeMobileNumberProps> = ({
    setCurrentStepValue,
    languageData,
    closeIcon,
    contextProvider,
    handleSuccessValidation
}) => {
    const [loading,setLoading] = useState<boolean>(false);
    const {loginData, setLoginData,formData} = useLoginAndSignupContext();
    const [sessionId, setSessionId] = useState<string>("");
    const [formState, setFormState] = useState<formStateProps>({});
    const [apiError, setApiError] = useState<object>({});
    const LoginContext = useLoginAndSignupContext();
    const { makeApiCall, isLoading, errors, data : formField } = useApiCall(14, "/Verify/GenerateOtp", "post");  
    const { makeApiCall: changeMobileApiCall, isLoading: changeMobileLoading, changeMobileerrors, data : changeMobileData } = useApiCall(13, "/ChangeMobileNumber", "post");  
    
    const formElementdata = formData?.data;
    const formfieldsData = formData?.change_mobileno_form[0];
    const formFields = formfieldsData?.fields;  
    const mobileNo = formFields[0];
    const verifyBtn = formFields[1];

    const handleChange = (fieldName: string, value: string | number, isValid: boolean) => {
        setFormState((prevState) => ({
            ...prevState,
            [fieldName]: { value, isValid },
        }));
    };

    const allFieldsValid = () => Object.values(formState).every(
    (field) => field.value != "" && field.isValid
    );
    
    useEffect(()=>{
        LoginContext?.setStepValue(0); // Update the argument to be of type 'number'
        const initialState: formStateProps = {};
        formfieldsData?.fields.forEach(({ field_name, field_type }: { field_name: string, field_type: string })=>{
            if (field_type !== "submit") {
                initialState[field_name] = { value: "", isValid: false };
            }
        })
        setFormState(initialState);
    },[formfieldsData]);

    useEffect(()=>{
        if(LoginContext?.errorMessage){
            setApiError({
                'mobileNumber':LoginContext?.errorMessage
            })
        }
        if(LoginContext?.navigateToErrorFrom === 1){
            setLoading(true);
            const payload = {
                "updatedMobileNo" : LoginContext?.updatedMobNum,
                "userId": (loginData as { userId: string }).userId,
            }
            changeMobileApiCall(payload);
        }
    },[LoginContext?.errorMessage,LoginContext?.navigateToErrorFrom]);
    
    const getSecretSessionId = () => {
        const sessionId = getRandomString(9, true);
        setSessionId(sessionId);
        return sessionId;
    }

    const handleSubmit = () => {
        try{
            if(allFieldsValid()){
                setLoading(true);   
                setApiError({
                    'mobileNumber':''
                })
                const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
                const payload ={
                    "mobileNumber" : formState.new_mobile_no_.value.toString(), // Convert the value to a string
                    "userId": (loginData as { userId: string }).userId,
                    "sessionSecretId": sessionSecretId
                }
                LoginContext?.setUpdatedMobNum(formState.new_mobile_no_.value.toString()); // Convert the value to a string
                makeApiCall(payload);
            }
        }catch(err){
            setApiError({
                'mobileNumber':err,
            });
        }
    };

    const handleBackBtn = () => {
        if(contextProvider){
            setCurrentStepValue(1);
        }
    }

    useEffect(() => {
        if(errors || changeMobileerrors) {
            setApiError({
                'mobileNumber':errors?.messages?.message_en
            })
        } else if(formField) {
            setCurrentStepValue(1);
            setLoginData(formField);
            LoginContext.setnavigateToErrorFrom(3);
        }else if(changeMobileData) {
            LoginContext.setSuccessMessage(formElementdata?.mobile_number_verified);
            setCurrentStepValue(4);
        }
        setLoading(isLoading ?? changeMobileLoading);
    
    }, [isLoading, errors, formField, changeMobileData, changeMobileerrors, changeMobileLoading]);

    return(
        <React.Fragment>
        {loading && <LoaderOverlay data-testid="loader-overlay" />}
        <div className="change-mobile-container">
            <div className="navWrapper">
              <a  className="back-button" 
                onClick={()=>handleBackBtn()} role="button" tabIndex={0} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBackBtn();
                    }
                }}>
                {languageData?.back}
              </a>
              <CloseIcon
                data-testid="close-icon"
                className="modal-close-icon"
                onClick = {() => closeIcon(false)}
              />
            </div>
        </div>
    
        <div className="form-modal">
            <div className="form-head">
                <h2 data-testid="formTitle" className="form-title">
                    {languageData?.change_mobile_no as string}
                </h2>
            </div>
            <div className="formelements">
                <div className="iqamano">
                    <p className="title">{formElementdata?.iqama_no}</p>
                    <p className="value">{loginData?.userId}</p>
                </div>
                <div className="existingMobNo">
                    <span className="title">{formElementdata?.existing_mobile_no}</span>
                    <span className="value">{loginData?.mobileNumber}</span>
                </div>

            </div>
            <div className="modal-login-form">
                <Form.Group>
                    <div className="user-input">
                        <FormsField
                            module="login"
                            classType={mobileNo?.field_class}
                            fieldType={mobileNo?.field_type}
                            fieldName={mobileNo?.field_title}
                            fieldOptions={mobileNo?.field_options}
                            field_name={mobileNo?.field_name}
                            tooltip={mobileNo?.tooltip}
                            onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value, isValid)}
                            languageData={languageData as { [key: string]: string }} // Add index signature for type 'string'
                            APIError={(apiError as { mobileNumber: string }).mobileNumber}
                        />
                    </div>
                </Form.Group>
                <div className="info-content">
                    {formElementdata?.use_your_absher_registered}
                </div>

                <div
                    className={`form-submit-btn ${
                        allFieldsValid() && "form-submit-btn-active"
                    }`}
                    onClick={handleSubmit}
                    role="button" tabIndex={0} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                >
                    <button
                        data-testid="submitBtn"
                        disabled={!allFieldsValid()}                        
                        className={`form-btn ${allFieldsValid() && "form-btn-active"}`}
                    >
                        {verifyBtn?.field_title}
                    </button>
                </div>
            </div>  
        </div>    
    </React.Fragment>
    )

}
