import React from "react";
import { render, screen } from "@testing-library/react";
import CancelPolicyContainer from "./CancelPolicyContainer";

jest.mock("./CancelPolicies", () => ({
  __esModule: true,
  default: ({ policyDataObj, navigateTo }: any) => (
    <div data-testid="CancelPolicy">
      Policy Data: {policyDataObj?.policyId}, Navigate: {navigateTo}
    </div>
  ),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    state: {
      data: { policyId: "POL123" },
    },
  }),
}));

describe("CancelPolicyContainer", () => {
  it("renders CancelPolicy with correct props from location.state", () => {
    render(<CancelPolicyContainer navigateTo="/some-route" />);
    const child = screen.getByTestId("CancelPolicy");

    expect(child).toHaveTextContent("POL123");
    expect(child).toHaveTextContent("/some-route");
  });
});
