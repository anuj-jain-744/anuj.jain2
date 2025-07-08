import React from "react";
import { render } from "@testing-library/react";
import SubmitTicket from "./SubmitTicket";

describe("SubmitTicket Component", () => {
  it("should render the SubmitTicket component without crashing", () => {
    const { container } = render(<SubmitTicket />);
    expect(container).toBeInTheDocument();
  });

  it("should have a div with the correct class name", () => {
    const { container } = render(<SubmitTicket />);
    const divElement = container.querySelector(".contactWrapperBoxOuter");
    expect(divElement).toBeInTheDocument();
  });
});