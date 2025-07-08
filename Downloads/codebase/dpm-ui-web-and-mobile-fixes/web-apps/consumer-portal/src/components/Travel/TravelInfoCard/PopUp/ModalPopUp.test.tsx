import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalPopUp from "./ModalPopUp";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

jest.mock("components/ThemeButton/ThemeButton", () => (props: any) => (
  <button
    disabled={props.isDisabled}
    className={props.classes}
    onClick={props.onClickhandler}
  >
    {props.title}
  </button>
));

describe("ModalPopUp", () => {
  const handleClose = jest.fn();
  const handleSubmitPopup = jest.fn();

  const defaultProps = {
    show: true,
    errorMsg: "Test error message",
    popupUsedFor: familtyFlowConstants.POPUP_USED.POPUP_FOR,
    handleClose,
    handleSubmitPopup,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when show is true", () => {
    render(<ModalPopUp {...defaultProps} />);
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("does not render modal content when show is false", () => {
    render(<ModalPopUp {...defaultProps} show={false} />);
    expect(screen.queryByText("Test error message")).not.toBeInTheDocument();
  });

  it("renders journey header based on popupUsedFor", () => {
    render(<ModalPopUp {...defaultProps} />);
    expect(screen.getByText(familtyFlowConstants.POPUP_USED.DELETE_TRAVELLER)).toBeInTheDocument();

    const cmsConfigData = { senior_citizen_age_validation_header: "Senior Header" };
    render(
      <ModalPopUp
        {...defaultProps}
        popupUsedFor={familtyFlowConstants.POPUP_USED.SENIOR_CITIZEN_AGE_VALIDATION}
        cmsConfigData={cmsConfigData}
      />
    );
    expect(screen.getByText("Senior Header")).toBeInTheDocument();

    render(
      <ModalPopUp
        {...defaultProps}
        popupUsedFor={""}
      />
    );
    expect(screen.getByText(familtyFlowConstants.POPUP_USED.ERROR)).toBeInTheDocument();
  });

  it("calls handleClose when NO button clicked", () => {
    render(<ModalPopUp {...defaultProps} />);
    const noButton = screen.getByText(familtyFlowConstants.POPUP_USED.BUTTONS.NO);
    fireEvent.click(noButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("handles optional handleSubmitPopup prop gracefully", () => {
    render(<ModalPopUp {...defaultProps} handleSubmitPopup={undefined} />);
    const primaryButton = screen.getByText(familtyFlowConstants.POPUP_USED.BUTTONS.YES);
    fireEvent.click(primaryButton);
  });

  it("calls handleSubmitPopup when primary button clicked", () => {
    render(<ModalPopUp {...defaultProps} />);
    const primaryButton = screen.getByText(familtyFlowConstants.POPUP_USED.BUTTONS.YES);
    fireEvent.click(primaryButton);
    expect(handleSubmitPopup).toHaveBeenCalledTimes(1);
  });

  it("renders primary button title correctly based on popupUsedFor", () => {
    render(
      <ModalPopUp
        {...defaultProps}
        popupUsedFor={familtyFlowConstants.POPUP_USED.LAST_FAMILY_MEMBER_NOT_SELF_DELETE}
      />
    );
    expect(screen.getByText(familtyFlowConstants.POPUP_USED.BUTTONS.CONFIRM)).toBeInTheDocument();

    render(<ModalPopUp {...defaultProps} popupUsedFor="UNKNOWN" />);
    expect(screen.getByText(familtyFlowConstants.POPUP_USED.BUTTONS.OK)).toBeInTheDocument();
  });
});
