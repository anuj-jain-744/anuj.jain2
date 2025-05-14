import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ModalDialogBox from ".";

function handleClose(): void {
  throw new Error("Function not implemented.");
}

describe("ModalDialogBox", () => {
  it("1. load ModalDialogBox Load component", () => {
    render(
      <ModalDialogBox
        isModal={true}
        handleClose={handleClose}
      />
    );

    expect(screen.getByTestId("register-new-claim-modal")).toBeInTheDocument();
  });

});
