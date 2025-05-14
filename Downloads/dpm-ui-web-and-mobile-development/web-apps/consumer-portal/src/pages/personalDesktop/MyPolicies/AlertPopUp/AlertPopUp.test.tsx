import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import AlertPopUp from "./AlertPopUp";

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("utils/icons", () => ({
  IconsSet: {
    success: "success-icon.svg",
    error: "error-icon.svg",
  },
}));

describe("AlertPopUp Component", () => {
  let store : ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      dashbaordLanguageData: {
        languageData: {
          add_your_email_id_to_the_profile: "Add your email ID to the profile",
          please_add_your_email_id: "Please add your email ID",
        },
      },
    });
  });

  it("renders the component without crashing", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AlertPopUp
            varaint="success"
            title="Test Title"
            message="Test Message"
            buttonName="Test Button"
            navTo="/profile"
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Add your email ID to the profile")).toBeInTheDocument();
    expect(screen.getByText("Please add your email ID")).toBeInTheDocument();
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AlertPopUp
            varaint="error"
            title="Test Title"
            message="Test Message"
            buttonName="Test Button"
            navTo="/profile"
          />
        </BrowserRouter>
      </Provider>
    );

    const alertContainer = screen.getByRole("alert");
    expect(alertContainer).toHaveClass("alert-popup-container error");
  });

  it("hides the component when the close icon is clicked", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AlertPopUp
            varaint="success"
            title="Test Title"
            message="Test Message"
            buttonName="Test Button"
            navTo="/profile"
          />
        </BrowserRouter>
      </Provider>
    );

    const closeIcon = screen.getByAltText("Close");
    fireEvent.click(closeIcon);

    const alertContainer = screen.queryByRole("alert");
    expect(alertContainer).toBeInTheDocument();
  });

  it("navigates to the correct route when the button is clicked", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AlertPopUp
            varaint="success"
            title="Test Title"
            message="Test Message"
            buttonName="Test Button"
            navTo="/profile"
          />
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByText("Test Button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("renders default props when no values are passed", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AlertPopUp navTo="/profile" varaint={""} title={""} message={""} buttonName={""} />
        </BrowserRouter>
      </Provider>
    );

    const alertContainer = screen.getByRole("alert");
    expect(alertContainer).toHaveClass("alert-popup-container");
    expect(screen.getByText("Add your email ID to the profile")).toBeInTheDocument();
    expect(screen.getByText("Please add your email ID")).toBeInTheDocument();
  });
});