import { render, screen } from "@testing-library/react";
import SuccessLeftComponent from "./index";

const mockLanguageData = {
  policy_no: "Policy Number",
  extra_benefit: "Extra Benefit",
  effective_date: "Effective Date",
  amount: "Amount",
  endorsement_schedule: "Endorsement Schedule",
  payment_receipt: "Payment Receipt",
  cancellation_date: "Cancellation Date",
  policy_status: "Policy Status",
  refund_amount: "Refund Amount",
  download_document: "Download Document",
  note: "Note",
  refund_process: "Refund Process",
  feedback_heading: "Feedback",
  explore_other_insurance_pr: "Explore Other Insurance Products",
  view_my_dashboard: "View My Dashboard",
  go_to_dashboard: "Go to Dashboard",
};

const mockData = {
  policyNumber: "123456789",
  addBenefitDatas: [
    { benefitNameEn: "Benefit 1", benefitPrice: "100" },
    { benefitNameEn: "Benefit 2", benefitPrice: "200" },
  ],
};

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(() =>
    Promise.resolve({
      config: [mockLanguageData],
    })
  ),
}));

jest.mock("utils/formatDate", () => ({
  formatDate: jest.fn(() => "2025-06-12"),
}));

jest.mock("./../success.json", () => ({
  getInTouch: "Get in Touch",
  callSupport: "Call Support",
  supportNumber: "123-456-7890",
  whatsappSupport: "WhatsApp Support",
  mail: "Email Support",
  branchLocator: "Branch Locator",
}));

describe("SuccessLeftComponent", () => {
  it("renders SuccessEndorsementCard when status is true", async () => {
    render(<SuccessLeftComponent status={true} data={mockData} flag={false} />);

    expect(await screen.findByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    expect(screen.getByText("Endorsement Schedule")).toBeInTheDocument();
    expect(screen.getByText("Payment Receipt")).toBeInTheDocument();
  });

  it("renders SuccessPolicyCancellationCard when status is false and flag is false", async () => {
    render(<SuccessLeftComponent status={false} data={mockData} flag={false} />);

    expect(await screen.findByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("Cancellation Date")).toBeInTheDocument();
    expect(screen.getByText("Policy Status")).toBeInTheDocument();
    expect(screen.getByText("Refund Amount")).toBeInTheDocument();
    expect(screen.getByText("Download Document")).toBeInTheDocument();
  });

  it("renders empty content when status is false and flag is true", () => {
    render(<SuccessLeftComponent status={false} data={mockData} flag={true} />);
    expect(screen.queryByText("Policy Number")).not.toBeInTheDocument();
  });

  it("renders contact information card", async () => {
    render(<SuccessLeftComponent status={true} data={mockData} flag={false} />);

    expect(await screen.findByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByText("Call Support")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Support")).toBeInTheDocument();
    expect(screen.getByText("Email Support")).toBeInTheDocument();
    expect(screen.getByText("Branch Locator")).toBeInTheDocument();
  });

  it("renders ThemeButton with correct titles", async () => {
    render(<SuccessLeftComponent status={true} data={mockData} flag={false} />);

    expect(await screen.findByText("Explore Other Insurance Products")).toBeInTheDocument();
    expect(screen.getByText("View My Dashboard")).toBeInTheDocument();
  });
});