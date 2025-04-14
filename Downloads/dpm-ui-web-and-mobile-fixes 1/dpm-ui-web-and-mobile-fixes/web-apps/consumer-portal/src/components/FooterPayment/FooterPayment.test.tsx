import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FooterPayment from "./FooterPayment";
import ThemeButton from "../../Motor/Endorsement/sharedComponent/ThemeButton";

describe("FooterPayment Component", () => {
  const handlePayment = jest.fn();
  const setSelectedPolicyNumber = jest.fn();
  const navigateTo = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <FooterPayment
        handlePayment={handlePayment}
        isAnyBenefitSelected={true}
        isEnable={true}
        selectedPolicyNumber="12345"
        setSelectedPolicyNumber={setSelectedPolicyNumber}
        navigateTo={navigateTo}
        {...props}
      />
    );
  };

  test("should call setSelectedPolicyNumber with undefined when Back button is clicked and selectedPolicyNumber is defined", () => {
    renderComponent();
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(setSelectedPolicyNumber).toHaveBeenCalledWith(undefined);
  });

  test("should call navigateTo with '/Motor/Claim/PolicyDashboard' when Back button is clicked and selectedPolicyNumber is undefined", () => {
    renderComponent({ selectedPolicyNumber: undefined });
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(navigateTo).toHaveBeenCalledWith("/Motor/Claim/PolicyDashboard");
  });

  test("should render Proceed for Payment button when isAnyBenefitSelected is true", () => {
    renderComponent();
    const paymentButton = screen.getByText("Proceed for Payment");
    expect(paymentButton).toBeInTheDocument();
  });

  test("should call handlePayment when Proceed for Payment button is clicked and isEnable is true", () => {
    renderComponent();
    const paymentButton = screen.getByText("Proceed for Payment");
    fireEvent.click(paymentButton);
    expect(handlePayment).toHaveBeenCalled();
  });

  test("should disable Proceed for Payment button when isEnable is false", () => {
    renderComponent({ isEnable: false });
    const paymentButton = screen.getByText("Proceed for Payment");
    expect(paymentButton).toBeDisabled();
  });
});