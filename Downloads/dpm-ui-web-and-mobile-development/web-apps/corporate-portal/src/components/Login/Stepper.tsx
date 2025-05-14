import React, { useEffect, useCallback, useState } from "react";

interface StepperProps {
    steps: () => void;
}

export const Stepper : React.FC<StepperProps> = ({
    steps
})=>{
    return(
        <React.Fragment>
        {steps()}
        </React.Fragment>
    )
};