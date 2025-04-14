import { render, screen } from "@testing-library/react";
import RightContainer from "./RightContainer";  // Path to your RightContainer component

// Mocking the child components to simplify the test
jest.mock("../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Claim Vehicle Info</div>),
}));

jest.mock("./DownloadDocLink/DownloadDocLink", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Download Doc Link</div>),
}));

jest.mock("./ContactCard/ContactCard", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Contact Card</div>),
}));

describe("RightContainer", () => {
  test("should render all child components correctly", () => {
    // Render RightContainer
    render(<RightContainer />);

    // Assert that the child components are rendered correctly
    expect(screen.getByText("Claim Vehicle Info")).toBeInTheDocument();
    expect(screen.getByText("Download Doc Link")).toBeInTheDocument();
    expect(screen.getByText("Contact Card")).toBeInTheDocument();
  });
});
