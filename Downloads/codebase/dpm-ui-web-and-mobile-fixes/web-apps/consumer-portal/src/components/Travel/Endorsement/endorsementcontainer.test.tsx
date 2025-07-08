import React from "react";
import { render, screen } from "@testing-library/react";
import EndorsementContainer from "./endorsementcontainer";
import { useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

jest.mock("./endorsement", () => (props: any) => {
  return (
    <div data-testid="endorsement">
      policyNo: {props.policyNo}, travelData: {props.travelData}, allPolicy:{" "}
      {JSON.stringify(props.allPolicy)}
    </div>
  );
});

describe("EndorsementContainer", () => {
  it("renders Endorsement with props from location state and passed props", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        policyNo: "POL123",
        allPolicy: ["policy1", "policy2"],
      },
    });

    const navigateToMock = jest.fn();
    const travelData = "travel-info";

    render(
      <EndorsementContainer
        navigateTo={navigateToMock}
        travelData={travelData}
      />
    );

    const endorsement = screen.getByTestId("endorsement");
    expect(endorsement).toHaveTextContent("policyNo: POL123");
    expect(endorsement).toHaveTextContent(travelData);
    expect(endorsement).toHaveTextContent(JSON.stringify(["policy1", "policy2"]));
  });
});
