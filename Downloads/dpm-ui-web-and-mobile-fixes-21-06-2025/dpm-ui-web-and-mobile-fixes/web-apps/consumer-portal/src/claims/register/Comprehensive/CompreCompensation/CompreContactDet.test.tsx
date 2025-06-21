import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CompreContactDet from "./CompreContactDet";
import { DataContext } from "../../../../DataContext";

const mockData = {
  contact_details: "Contact Details",
  mobile_number: "Mobile Number",
  placeholder_enter_mobile: "Enter Mobile Number",
  email: "Email",
  placeholder_enter_email_id: "Enter Email ID",
  additional_remarks: "Additional Remarks",
};

const mockChangeHandler = jest.fn();

const mockContactDetData = {
  isMobilenum: "",
  isEmailId: "",
  isIAgree: false,
};

describe("CompreContactDet Component", () => {
  beforeEach(() => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreContactDet
          validationData={{}}
          contactDetData={mockContactDetData}
          changeHandler={mockChangeHandler}
          emailData=""
          mobilenumData=""
        />
      </DataContext.Provider>
    );
  });

  test("renders contact details title", () => {
    expect(screen.getByText(mockData.contact_details)).toBeInTheDocument();
  });

  test("renders mobile number input", () => {
    expect(screen.getByPlaceholderText(mockData.placeholder_enter_mobile)).toBeInTheDocument();
  });

  test("renders email input", () => {
    expect(screen.getByPlaceholderText(mockData.placeholder_enter_email_id)).toBeInTheDocument();
  });

  test("renders additional remarks textarea", () => {
    expect(screen.getByPlaceholderText(mockData.additional_remarks + "...")).toBeInTheDocument();
  });

  test("validates mobile number input", () => {
    const mobileInput = screen.getByPlaceholderText(mockData.placeholder_enter_mobile);
    fireEvent.change(mobileInput, { target: { value: "0555555555" } });
    expect(mockChangeHandler).toHaveBeenCalledWith("mobilenum", true, "0555555555");
  });

  test("validates email input", () => {
    const emailInput = screen.getByPlaceholderText(mockData.placeholder_enter_email_id);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(mockChangeHandler).toHaveBeenCalledWith("emailId", true, "test@example.com");
  });

  test("handles invalid mobile number", () => {
    const mobileInput = screen.getByPlaceholderText(mockData.placeholder_enter_mobile);
    fireEvent.change(mobileInput, { target: { value: "12345" } });
    expect(screen.getByText("Invlaid Mobile Number")).toBeInTheDocument();
  });

  test("handles invalid email", () => {
    const emailInput = screen.getByPlaceholderText(mockData.placeholder_enter_email_id);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText("Invalid Email ID")).toBeInTheDocument();
  });

  test("handles terms and conditions checkbox", () => {
    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);
    expect(mockChangeHandler).toHaveBeenCalledWith("IAgree", true);
  });
});