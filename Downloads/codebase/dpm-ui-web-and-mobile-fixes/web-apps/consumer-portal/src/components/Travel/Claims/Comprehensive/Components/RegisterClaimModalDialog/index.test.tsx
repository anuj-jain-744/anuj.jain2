import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterClaimModalDialog from "./index";

const mockLangData = {
  consumer: { ok: "OK" },
  product: {
    claim_registration_details: "Claim Registration Details",
    claim_register_popup_content: ["Content line 1", "Content line 2"],
    claim_register_popup_list_content_one_title: "List Title",
    claim_register_popup_list_content_one_list_items: ["Item 1", "Item 2"],
  },
};

describe("RegisterClaimModalDialog", () => {
  it("renders modal with correct content and handles close", () => {
    const setShowRegModal = jest.fn();

    render(
      <RegisterClaimModalDialog
        showRegModal={true}
        setShowRegModal={setShowRegModal}
        langData={mockLangData}
      />
    );

    expect(screen.getByText("Claim Registration Details")).toBeInTheDocument();
    expect(screen.getByText("Content line 1")).toBeInTheDocument();
    expect(screen.getByText("Content line 2")).toBeInTheDocument();

    expect(screen.getByText("List Title")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    const okButton = screen.getByRole("button", { name: "OK" });
    expect(okButton).toBeInTheDocument();

    fireEvent.click(okButton);
    expect(setShowRegModal).toHaveBeenCalledWith(false);
  });
});
