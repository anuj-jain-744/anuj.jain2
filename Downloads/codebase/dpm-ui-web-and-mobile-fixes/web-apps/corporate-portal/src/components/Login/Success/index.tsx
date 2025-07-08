import React, { useEffect, useState } from "react";
import { useLoginAndSignupContext } from "../useLoginAndSignupContext";
import TickThickIcon from "../../../assets/Login/TickThick.svg";
import { Box, LinearProgress } from "@mui/material";
import { getRandomString } from "@dpm/shared-module";
import "./index.scss";

interface SuccessProps {
    formElementsData?: { data?: { login_now?: string; redirect_to_login_screen?: string } };
    setCurrentStepValue: (step: number) => void;
    closeIcon: boolean;
}

export const Success: React.FC<SuccessProps> = ({
    formElementsData,
    setCurrentStepValue,
    closeIcon
}) => {
    const { successMessage } = useLoginAndSignupContext();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                const randomNum = getRandomString(1, true);
                const nextProgress = prev + randomNum * 0.9;
                if (nextProgress >= 100) {
                    setCurrentStepValue(0);
                    clearInterval(timer);
                    return 0;
                }
                return Math.min(nextProgress, 100);
            });
        }, 500);

        return () => clearInterval(timer);
    }, [setCurrentStepValue]);

    return (
        <div className="form-success-block">
            <div className="login-success-container">
                <img src={TickThickIcon} className="success-icon" alt="Success Icon" />
                <div className="success-message">{successMessage}</div>
                <div className="success-button">
                    <button onClick={() => setCurrentStepValue(0)}>
                        {formElementsData?.data?.login_now}
                    </button>
                </div>
                <div className="progress-bar-container">
                    <Box className="progress-bar-box">
                        <LinearProgress variant="determinate" value={progress} className="progress-bar-fill" />
                    </Box>
                    <div className="progress-bar-text">{formElementsData?.data?.redirect_to_login_screen}</div>
                </div>
            </div>
        </div>
    );
};
