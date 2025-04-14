import React from "react";
import { render, screen } from "@testing-library/react";
import StepsProgress from "./index";

describe("StepsProgress", () => {
    const progressData = ["Step 1", "Step 2", "Step 3"];
    const currentStep = 1;

    it("renders the correct number of steps", () => {
        render(
            <StepsProgress
                progressData={progressData}
                currentStep={currentStep}
            />
        );

        const steps = screen.getAllByTestId("step");
        expect(steps).toHaveLength(progressData.length);
    });

    it("renders the active step with the correct class", () => {
        render(
            <StepsProgress
                progressData={progressData}
                currentStep={currentStep}
            />
        );

        const activeStep = screen.getByTestId("step-active");
        expect(activeStep).toHaveClass("active");
    });

    it("renders the done steps with the correct class", () => {
        render(
            <StepsProgress
                progressData={progressData}
                currentStep={currentStep}
            />
        );

        const doneSteps = screen.getAllByTestId("step-done");
        expect(doneSteps).toHaveLength(currentStep);
    });
});
