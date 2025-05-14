import React from "react";
import { render, screen } from "@testing-library/react";
import CancelPolicyContainer from "./CancelPolicyContainer";
import CancelPolicy from "./CancelPolicy";

jest.mock("./CancelPolicy", () => jest.fn(() => <div data-testid="cancel-policy" />));

describe("CancelPolicyContainer Component", () => {
  test("renders CancelPolicyContainer without crashing", () => {
    render(<CancelPolicyContainer navigateTo={jest.fn()} />);
    expect(screen.getByTestId("cancel-policy")).toBeInTheDocument();
  });

  test("passes correct policyNo to CancelPolicy", () => {
    render(<CancelPolicyContainer navigateTo={jest.fn()} />);
    expect(CancelPolicy).toHaveBeenCalledWith(
      expect.objectContaining({
        policyNo: "P-OS01-25-605-000026",
      }),
      {}
    );
  });

  test("passes navigateTo function to CancelPolicy", () => {
    const mockNavigateTo = jest.fn();
    render(<CancelPolicyContainer navigateTo={mockNavigateTo} />);
    expect(CancelPolicy).toHaveBeenCalledWith(
      expect.objectContaining({
        navigateTo: mockNavigateTo,
      }),
      {}
    );
  });
});
