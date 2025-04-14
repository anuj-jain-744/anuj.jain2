import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AlertPopUp from "./AlertPopUp";

describe("AlertPopUp Component", () => {
  const defaultProps = {
    varaint: "success",
    title: "Success!",
    message: "Your operation was successful.",
    buttonName: "Go to Profile",
    navTo: "/profile",
  };

  it("renders the component with provided props", () => {
    const { getByText, getByAltText, getByRole } = render(
      <BrowserRouter>
        <AlertPopUp {...defaultProps} />
      </BrowserRouter>
    );

    expect(getByText("Success!")).toBeInTheDocument();
    expect(getByText("Your operation was successful.")).toBeInTheDocument();

    expect(getByRole("button", { name: "Go to Profile" })).toBeInTheDocument();

    expect(getByAltText("success")).toBeInTheDocument();
    expect(getByAltText("Close")).toBeInTheDocument();
  });

  it("hides the component when close icon is clicked", () => {
    const { getByAltText, container } = render(
      <BrowserRouter>
        <AlertPopUp {...defaultProps} />
      </BrowserRouter>
    );

    const closeIcon = getByAltText("Close");
    fireEvent.click(closeIcon);

    expect(container.querySelector(".d-none")).not.toBeNull();
  });

it("navigates to the correct page when button is clicked", () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));
  
    const { getByText } = render(
      <BrowserRouter>
        <AlertPopUp {...defaultProps} />
      </BrowserRouter>
    );
  
    const button = getByText("Go to Profile");
    fireEvent.click(button);
  
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });
});
