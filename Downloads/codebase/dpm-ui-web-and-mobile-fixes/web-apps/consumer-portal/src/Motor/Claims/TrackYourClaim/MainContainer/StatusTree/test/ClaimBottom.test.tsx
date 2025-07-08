import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import ClaimBottom from "../ClaimBottom";
import { navigateTo } from "../../../../../../../../app-shell/src/utils";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("Motor/ClaimHooks/useClaimContext", () => ({
  useClaimContext: jest.fn(),
}));

jest.mock("../../../../../../../../app-shell/src/utils", () => ({
  navigateTo: jest.fn(),
}));

describe("ClaimBottom Component", () => {
  let mockNavigate : any;
  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useClaimContext.mockReturnValue({
      trackClaimInfo: { track_another_claim: "Track Another Claim" },
    });
  });

  test("renders ThemeButton with correct props", () => {
    render(<ClaimBottom />);
    const button = screen.getByRole("button", { name: /track another claim/i });
    expect(button).toBeInTheDocument();
  });

  test("calls navigateTo function when button is clicked", () => {
    render(<ClaimBottom />);
    const button = screen.getByRole("button", { name: /track another claim/i });
    fireEvent.click(button);
    expect(navigateTo).toHaveBeenCalledWith("/track-claim", mockNavigate);
  });
});