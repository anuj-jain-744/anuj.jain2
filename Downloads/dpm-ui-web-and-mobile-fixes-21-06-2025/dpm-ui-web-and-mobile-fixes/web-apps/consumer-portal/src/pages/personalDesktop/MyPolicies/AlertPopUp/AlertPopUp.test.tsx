import React, { useEffect } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider , useDispatch, useSelector} from "react-redux";
import configureStore from "redux-mock-store";
import AlertPopUp from "./AlertPopUp";
import { showNotification } from "components/ThemeAlertNotification/ThemeAlertNotification";
import { useApiCall } from "@dpm/shared-module";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock('components/ThemeAlertNotification/ThemeAlertNotification', () => ({
  showNotification: jest.fn()
}));
jest.mock('components/AddEmailPopup/EmailPopup', () => ({
  __esModule: true,
  AddEmailPopup: jest.fn((props) => (
    <div >
      Email popup
      <button data-testid="Add-email-id" onClick={()=>props.handleAddEmail("abc@gmail.com")}>Add</button>
    </div>
  )),
}));
jest.mock('components/OTPValidation/OtpWrapper', () => ({
  __esModule: true,
  OTPWrapper: jest.fn((props) => (
    <div data-testid="otp-wrapper">
      OTPWrapper Mock
      <button onClick={props.handleSuccessValidation}>Mock OTP Success</button>
    </div>
  )),
}));
jest.mock('components/OTPValidation', () => ({
  LoaderOverlay: () => <div data-testid="loader-overlay" />
}));
jest.mock("components/ThemeAlertNotification/ThemeAlertNotification", () => ({
  showNotification: jest.fn(),
}));
const mockSetAuth = jest.fn();
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  slices: {
    auth: {
      setAuth: (...args) => mockSetAuth(...args),
    },
    
  },
}));

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(mockDispatch);
describe("AlertPopUp Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      dashbaordLanguageData: { languageData: { add_your_email_id_to_the_profile: "Add your email", please_add_your_email_id: "Please add your email" } },
      auth: { userInfo: { userId: "123", mobileNumber: "9876543210" } },
    });
    useSelector.mockImplementation((selector) => selector(store.getState()));
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with default props", () => {
    render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("handles close alert functionality", () => {
    render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );

    const closeButton = screen.getByAltText("Close");
    fireEvent.click(closeButton);

    expect(screen.getByRole("alert")).toHaveClass("d-none");
  });

  it("opens email popup when button is clicked", () => {
    render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );

    const addEmailButton = screen.getByText("Add Email");
    fireEvent.click(addEmailButton);

    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("handles OTP flow when email is added", async () => {
    render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );

    const addEmailButton = screen.getByText("Add Email");
    fireEvent.click(addEmailButton);

    const submitButton = screen.getByTestId("Add-email-id");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("OTPWrapper Mock")).toBeInTheDocument();
    });
  });

  it("shows success notification on successful email update", async () => {
    useApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(() => Promise.resolve({ response: "Email updated successfully" })),
      isLoading: false,
      errors: null,
      data: { response: "Email updated successfully" },
    });
    const {rerender}=render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );
    const addEmailButton = screen.getByText("Add Email");
      fireEvent.click(addEmailButton);
      rerender(<AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />)
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        title: "Success",
        description: "Email updated successfully",
        type: "success",
        icon: expect.any(String),
        duration: 3000,
        position: "top-center",
        transition: expect.any(Function),
       contentClassName: 'success-content',
       titleClassName: 'success-title',
       descriptionClassName: 'success-description'
      });
    });
  });

  it("shows error notification on email update failure", async () => {
    useApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(() => Promise.reject({ messages: { message_en: "Error updating email" } })),
      isLoading: false,
      errors: { messages: { message_en: "Error updating email" } },
      data: null,
    });

    render(
        <AlertPopUp varaint="success" title="Test Title" message="Test Message" buttonName="Add Email" />
    );

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        title: "Error",
        description: "Error updating email",
        type: "error",
        duration: 3000,
        position: "top-center",
        transition: expect.any(Function),
      });
    });
  });
});