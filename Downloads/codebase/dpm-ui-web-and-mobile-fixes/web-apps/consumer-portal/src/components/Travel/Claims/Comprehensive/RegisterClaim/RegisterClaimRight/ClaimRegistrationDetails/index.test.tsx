import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ClaimRegistrationDetails from "./index";

jest.mock("../../../Components/RegisterClaimModalDialog", () => ({
  __esModule: true,
  default: ({ showRegModal, setShowRegModal }: any) =>
    showRegModal ? (
      <div data-testid="register-claim-modal">
        <button onClick={() => setShowRegModal(false)}>Close Modal</button>
        Modal Content
      </div>
    ) : null,
}));

const mockLangData = {
  consumer: {} as any,
  product: {
    claim_registration_details: "Claim Registration Details",
    claim_register_popup_content: ["Here is some information."],
    read_more: "Read More",
  },
};

describe("ClaimRegistrationDetails", () => {
  test("renders claim registration text and icon", () => {
    render(<ClaimRegistrationDetails langData={mockLangData} />);

    expect(screen.getByText("Claim Registration Details")).toBeInTheDocument();
    expect(screen.getByAltText("claim_reg_det")).toBeInTheDocument();
    expect(screen.getByText("Here is some information.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Read More/i })).toBeInTheDocument();
  });

  test("does not show modal initially", () => {
    render(<ClaimRegistrationDetails langData={mockLangData} />);
    expect(screen.queryByTestId("register-claim-modal")).not.toBeInTheDocument();
  });

  test("shows modal when 'Read More' is clicked", () => {
    render(<ClaimRegistrationDetails langData={mockLangData} />);
    const readMoreButton = screen.getByRole("button", { name: /Read More/i });
    fireEvent.click(readMoreButton);

    expect(screen.getByTestId("register-claim-modal")).toBeInTheDocument();
  });

  test("closes modal when close button is clicked", () => {
    render(<ClaimRegistrationDetails langData={mockLangData} />);
    fireEvent.click(screen.getByRole("button", { name: /Read More/i }));

    const closeBtn = screen.getByText("Close Modal");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("register-claim-modal")).not.toBeInTheDocument();
  });

  test("handles missing claim_register_popup_content gracefully", () => {
    const modifiedLangData = {
      ...mockLangData,
      product: {
        ...mockLangData.product,
        claim_register_popup_content: undefined,
      },
    };

    render(<ClaimRegistrationDetails langData={modifiedLangData} />);

    expect(screen.getByText("Claim Registration Details")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Read More/i })).toBeInTheDocument();
  });
});
