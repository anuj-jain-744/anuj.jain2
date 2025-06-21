import React from "react";
import { render, screen } from "@testing-library/react";
import EndorsementContainer from "./endorsementcontainer";
import { useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

jest.mock("./endorsement", () => ({
  __esModule: true,
  default: ({ policyDetailObj, allPolicy }: any) => (
    <div data-testid="mock-endorsement">
      <div data-testid="policy-data">{JSON.stringify(policyDetailObj)}</div>
      <div data-testid="all-policy">{JSON.stringify(allPolicy)}</div>
    </div>
  ),
}));

describe("EndorsementContainer", () => {
  it("renders Endorsement with location.state.data and default allPolicy", () => {
    const mockPolicyData = { id: 123, name: "Test Policy" };
    (useLocation as jest.Mock).mockReturnValue({
      state: { data: mockPolicyData },
    });

    render(<EndorsementContainer />);

    expect(screen.getByTestId("mock-endorsement")).toBeInTheDocument();
    expect(screen.getByTestId("policy-data").textContent).toContain("Test Policy");
    expect(screen.getByTestId("all-policy").textContent).toBe("[]");
  });

  it("handles missing location.state.data gracefully", () => {
    (useLocation as jest.Mock).mockReturnValue({ state: undefined });

    render(<EndorsementContainer />);

    expect(screen.getByTestId("policy-data").textContent).toBe("{}");
  });

  it("forwards navigateTo prop to Endorsement", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { data: { id: 1 } },
    });
  
    const mockNavigate = jest.fn();
  
    render(<EndorsementContainer navigateTo={mockNavigate} />);
  
    const endorsement = screen.getByTestId("mock-endorsement");
    expect(endorsement).toBeInTheDocument();
  });  
});
