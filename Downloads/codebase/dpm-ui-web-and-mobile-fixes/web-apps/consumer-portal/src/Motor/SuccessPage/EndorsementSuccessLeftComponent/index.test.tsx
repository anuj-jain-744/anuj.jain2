import { render, screen, waitFor } from "@testing-library/react";
import EndorsementSuccessLeftComponent from "./index";
import { callAPI } from "@dpm/shared-module";
import mockData from "../success.json";


jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

jest.mock("assets/SuccessPage/Group.svg", () => "mocked-group.svg");
jest.mock("assets/SuccessPage/Rectangle.svg", () => "mocked-rectangle.svg");
jest.mock("assets/SuccessPage/Line_new.svg", () => "mocked-line.svg");
jest.mock("assets/SuccessPage/Download.svg", () => "mocked-download.svg");

describe("EndorsementSuccessLeftComponent", () => {
  const mockApiResponse = {
    config: [
      {
        model_type: "Car Model",
        vehicle_sequence: "12345",
        sponsor_name: "John Doe",
        iqama_no: "987654321",
        relationship: "Owner",
        endorsement_schedule: "Download Schedule",
        payment_receipt: "Download Receipt",
        explore_other_insurance_pr: "Explore More",
        back_to_endorsement: "Back",
      },
    ],
  };

  beforeEach(() => {
    callAPI.mockResolvedValue(mockApiResponse);
  });

  test("renders component with mock data", async () => {
    render(<EndorsementSuccessLeftComponent />);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Car Model")).toBeInTheDocument();
    expect(screen.getByText(mockData["Model-Type"])).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText(mockData["Vehicle-Sequence-No"])).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(mockData["Sponsor-Name"])).toBeInTheDocument();

    // expect(screen.getByText("Driver Name")).toBeInTheDocument();
    expect(screen.getByText(mockData["Driver-Name"])).toBeInTheDocument();
    // expect(screen.getByText("987654321")).toBeInTheDocument();
    expect(screen.getByText(mockData["Iqama-No."])).toBeInTheDocument();
    // expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText(mockData["Relationship"])).toBeInTheDocument();

    expect(screen.getByText("Download Schedule")).toBeInTheDocument();
    expect(screen.getByText("Download Receipt")).toBeInTheDocument();
    expect(screen.getByText("Explore More")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});
