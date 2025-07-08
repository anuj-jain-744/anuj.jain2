import React from "react";
import "./index.scss";

interface IStepProgress {
  progressData: string[];
  onClickhandler?: () => void;
  currentStep: number;
}

function StepsProgress({
  onClickhandler,
  currentStep = 2, // Provide a default value to avoid undefined
  progressData,
}: IStepProgress) {
  return (
    <div className="col theme-steps-progress align-items-center">
      {progressData?.map((item, key) => {
        let stepClass = "disabled progress-num walaa-medium-500";
        let stepTitleClass = "disabled progress-title walaa-medium-500";
        if (currentStep === key) {
          stepClass = "active progress-num walaa-medium-500";
          stepTitleClass = "progress-title walaa-medium-500";
        } else if (currentStep > key) {
          stepClass = "done progress-num walaa-medium-500";
          stepTitleClass = "progress-title walaa-medium-500";
        }

        return (
        <React.Fragment key={key}>
          <div className="d-flex flex-direction-row align-item-center step-column">
            <p
              className={stepClass}
              // onClick={onClickhandler}
            >
              {key+1}
            </p>
            <p className={stepTitleClass}>
              {item}
            </p>
          </div>
          {(progressData?.length !== key + 1) && (
            <span className="step-progress-bar"></span>
          )}
        </React.Fragment>)
      })}
    </div>
  );
}

export default StepsProgress;