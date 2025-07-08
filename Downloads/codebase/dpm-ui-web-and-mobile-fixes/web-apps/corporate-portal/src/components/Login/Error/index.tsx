import React, { useContext } from "react";
import "./index.scss";
import { LoginAndSingupContext } from "../LoginandSignupContext";

interface ErrorProps {
  formElementsData: object | undefined;
  setCurrentStepValue: (step: number) => void;
  closeIcon: any;
  message: string;
  refNum: string;
}

export const LoginError: React.FC<ErrorProps> = ({
  formElementsData,
  setCurrentStepValue,
  closeIcon,
  message = "",
  refNum = "",
}) => {
  const { errorMessage, navigateToErrorFrom, setSignUpForm } =
    useContext(LoginAndSingupContext) || {};
  const handleclick = () => {
    if (navigateToErrorFrom === 0) {
      setCurrentStepValue(0);
    } else if (refNum) {
      setSignUpForm && setSignUpForm(true);
      setCurrentStepValue(5);
    }
  };

  return (
    <div className="form-error-block">
      <div className="container">
        <div className="error-icon"></div>
        <div className="error-message">{errorMessage ?? message}</div>
        <div className="error-button">
          <button onClick={handleclick}>
            {refNum
              ? (
                  formElementsData as {
                    data: { signup_now: string; title: string };
                  }
                )?.data?.signup_now
              : (
                  formElementsData as {
                    data: { signup_now: string; title: string };
                  }
                )?.data?.title}
          </button>
        </div>
      </div>
    </div>
  );
};
