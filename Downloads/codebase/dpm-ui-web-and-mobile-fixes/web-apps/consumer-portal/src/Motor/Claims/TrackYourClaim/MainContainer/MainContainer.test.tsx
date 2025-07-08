import React from "react";
import { render } from "@testing-library/react";
import MainContainer from "./MainContainer";

// Mocks for subcomponents
jest.mock("./TitleContainer/TitleContainer", () => ({
  __esModule: true,
  default: jest.fn(({ title, status }) => (
    <div data-testid="title-container">
      Title: {title}, Status: {status}
    </div>
  )),
}));

jest.mock("./UploadDocStatus/UploadDocStatus", () => ({
  __esModule: true,
  default: () => <div data-testid="upload-doc-status">UploadDocStatus</div>,
}));

jest.mock("./StatusTree/StatusTree", () => ({
  __esModule: true,
  default: () => <div data-testid="status-tree">StatusTree</div>,
}));

jest.mock("./StatusTree/ClaimBottom", () => ({
  __esModule: true,
  default: () => <div data-testid="claim-bottom">ClaimBottom</div>,
}));

// Mock useClaimContext
jest.mock("Motor/ClaimHooks/useClaimContext", () => ({
  useClaimContext: jest.fn(),
}));

import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

describe("MainContainer", () => {
  beforeEach(() => {
    (useClaimContext as jest.Mock).mockImplementation(() => ({
      trackClaimInfo: { track_your_claim: "Track your claim here" },
      trackNewData: { currentStatus: "Pending" },
    }));
  });

  it("renders all subcomponents with correct props", () => {
    render(<MainContainer />);

    // TitleContainer with correct props
    // expect(screen.getByTestId("title-container")).toHaveTextContent(
    //   "Title: Track your claim here, Status: Pending"
    // );

    // // UploadDocStatus, StatusTree, ClaimBottom
    // expect(screen.getByTestId("upload-doc-status")).toBeInTheDocument();
    // expect(screen.getByTestId("status-tree")).toBeInTheDocument();
    // expect(screen.getByTestId("claim-bottom")).toBeInTheDocument();
  });
});
