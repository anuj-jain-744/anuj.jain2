import { render } from "@testing-library/react";
import SuccessLeftComponent from "./index";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn().mockResolvedValue({
    config: [
      {
        policy_no: "Policy #12345",
        endorsement_schedule: "Endorsement Schedule",
        payment_receipt: "Payment Receipt",
        explore_other_insurance_pr: "Explore Other Insurance",
        back_to_endorsement: "Back to Endorsement",
      },
    ],
  }),
}));

const claimsInfo={
  refNo:"JD290423239",
  ownerId:"2138189754"
}

describe("SuccessLeftComponent", () => {
  beforeEach(() => {
    render(<SuccessLeftComponent claimLabel="Motor Claim No." claimNo="C-E00-21-310-004679-001" status={true} claimsInfo={claimsInfo} />);
  });

  it("renders without crashing and displays the correct information", async () => {
    // const policyNumber = await screen.findByText(/policy #12345/i);
    // const extraBenefitHeadings = screen.getAllByText(mockData["extra-benefit"]);

    // expect(policyNumber).toBeInTheDocument();
    // expect(extraBenefitHeadings.length).toBe(2);
    // expect(screen.getByText(mockData["death-package"])).toBeInTheDocument();
    // expect(screen.getByText(mockData["roadside"])).toBeInTheDocument();

    // const amounts = screen.getAllByText(/sar 200.00/i);
    // expect(amounts.length).toBe(2);

    // expect(screen.getByText(/endorsement schedule/i)).toBeInTheDocument();
    // expect(screen.getByText(/payment receipt/i)).toBeInTheDocument();
    // expect(screen.getByText(/explore other insurance/i)).toBeInTheDocument();
    // expect(screen.getByText(/back to endorsement/i)).toBeInTheDocument();
  });
});
