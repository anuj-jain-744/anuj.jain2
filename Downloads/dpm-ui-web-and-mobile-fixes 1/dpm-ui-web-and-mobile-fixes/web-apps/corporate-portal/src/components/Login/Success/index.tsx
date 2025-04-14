import React, { useEffect, useState, useContext } from "react";
import "./index.scss"
import { useLoginAndSignupContext } from "../useLoginAndSignupContext";

interface SuccessProps {
    formElementsData: object | undefined;
    setCurrentStepValue: (step: number) => void;
    closeIcon:boolean;
}

export const Success:React.FC<SuccessProps> = ({
    formElementsData,
    setCurrentStepValue,
    closeIcon
}) => {
    const LoginContext = useLoginAndSignupContext();
    const {successMessage, navigateToErrorFrom} = useLoginAndSignupContext();
    const handleclick = ()=>{
        setCurrentStepValue(0);
    }
    
    return(
        <div className="form-success-block">
            <div className="login-success-container">
                <div className="success-icon">

                </div>
                <div className="success-message">
                    
                    { successMessage   }
                </div>
                <div className="success-button">
                    <button onClick={handleclick}>
                        
                        {formElementsData?.data?.login_now}
                    </button>
                </div>
            </div>
            
        </div>
    )

}
