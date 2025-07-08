import React from "react";
import { render } from "@testing-library/react";
import CustomAlertBox from "./index";

describe("CustomAlertBox", () => {
  it("renders the CustomAlertBox with the correct variant and children", () => {
    const { getByText } = render(
      <CustomAlertBox variant="warning">
        <span>Test Alert</span>
      </CustomAlertBox>
    );

    expect(getByText("Test Alert")).toBeInTheDocument();
    expect(
      document.querySelector(".custom-alert-wrapper.d-flex.warning")
    ).toBeInTheDocument();
  });
});
