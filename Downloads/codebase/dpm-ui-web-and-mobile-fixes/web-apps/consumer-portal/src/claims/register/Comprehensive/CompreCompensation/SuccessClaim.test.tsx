import React from "react";
import { render, screen } from "@testing-library/react";
import SuccessClaim from "./SuccessClaim";

describe("SuccessClaim Component", () => {
  test("renders Motor Claim No. title", () => {
    render(<SuccessClaim />);
    expect(screen.getByText("Motor Claim No.")).toBeInTheDocument();
  });

  test("renders claim number", () => {
    render(<SuccessClaim />);
    expect(screen.getByText("C-E00-23-310-004679-001")).toBeInTheDocument();
  });
});