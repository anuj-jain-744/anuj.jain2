import React, { useEffect, useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";
import { useApiCall } from "@dpm/shared-module";
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
    const {loginData,formData, stepValue} = useLoginAndSignupContext();
    const [formState, setFormState] = useState<formStateProps>({});
    const [apiError, setApiError] = useState<object>({});
    const LoginContext = useLoginAndSignupContext();
    const { makeApiCall, isLoading, errors, data : formField } = useApiCall(13, "/ChangeMobileNumber", "post");  
    
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
            const initialState: formStateProps = {};
            formfieldsData?.fields.forEach(({ field_name, field_type }: { field_name: string, field_type: string })=>{
                if (field_type !== "submit") {
                    initialState[field_name] = { value: "", isValid: false };
                }
            })
            setFormState(initialState);
    },[formfieldsData]);
   
    const handleSubmit = () => {
        setLoading(true);   
        setApiError({
            'mobileNumber':''
        })
        const payload ={
            "updatedMobileNo" : formState.new_mobile_no_.value.toString(), // Convert the value to a string
            "nationalId": (loginData as { userId: string }).userId
        }
        LoginContext.setContextMobNum(formState.new_mobile_no_.value.toString()); // Convert the value to a string
        makeApiCall(payload);
    };

    const handleBackBtn = () => {
        if(contextProvider){
            LoginContext.setStepValue(1);
        }
    }

    useEffect(() => {
        if(errors) {
            setApiError({
                'mobileNumber':errors?.messages?.message_en
            })
        } else if(formField) {
            handleSuccessValidation('changeMobileNum');
            LoginContext.setStepValue(1);
            LoginContext.setnavigateToErrorFrom(3);
            LoginContext.setSuccessMessage(formField.response);
        }
        setLoading(isLoading);
    
    }, [isLoading, errors, formField]);
    
    useEffect(()=>{
    if(stepValue){
        setCurrentStepValue(stepValue)
    }
    },[stepValue])

    return(
        <React.Fragment>
        {loading && <LoaderOverlay/>}
        <div className="change-mobile-container">
            <div className="navWrapper">
              <a  className="back-button" 
                onClick={()=>handleBackBtn()}>
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
                    <div className="user-id">
                        <FormsField
                            module="login"
                            classType={mobileNo?.field_class}
                            fieldType={mobileNo?.field_type}
                            fieldName={mobileNo?.field_title}
                            fieldOptions={mobileNo?.field_options}
                            field_name={mobileNo?.field_name}
                            tooltip={mobileNo?.tooltip}
                            onFieldChange={(fieldName, value, isValid) => handleChange(fieldName, value, isValid)}
                            inputPlaceholder={mobileNo?.field_placeholder}
                            languageData={languageData as { [key: string]: string }} // Add index signature for type 'string'
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
                        {verifyBtn?.field_title}
                    </button>
                </div>
            </div>  
        </div>    
    </React.Fragment>
    )

}
