import React from "react";
import { render, screen } from "@testing-library/react";
import ViewBenefitModal from "./index";
import { useApiCall } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

const mockMakeApiCall = jest.fn();
const mockCmsData = {
  config: [
    {
      coverage_type: "Coverage Type",
      sar: "SAR",
      approved: "Approved",
      notApproved: "Not Approved",
    },
  ],
};

(useApiCall as jest.Mock).mockReturnValue({
  makeApiCall: mockMakeApiCall,
  isLoading: false,
  errors: null,
  data: mockCmsData,
});

describe("ViewBenefitModal Component", () => {
  test("renders ViewBenefitModal component", () => {
    render(
      <ViewBenefitModal
        show={true}
        onHide={jest.fn()}
        repairType="Workshop Repair"
        price={1000}
      />
    );

    const modalTitle = screen.getByRole("heading", {
      name: /Workshop Repair/i,
    });
    const coverageType = screen.getByText("Coverage Type");

    expect(modalTitle).toBeInTheDocument();
    expect(coverageType).toBeInTheDocument();
  });

  test("modal visibility", () => {
    const { rerender } = render(
      <ViewBenefitModal
        show={true}
        onHide={jest.fn()}
        repairType="Workshop Repair"
        price={1000}
      />
    );
    expect(screen.getByRole("dialog")).toBeVisible();

    rerender(
      <ViewBenefitModal
        show={false}
        onHide={jest.fn()}
        repairType="Workshop Repair"
        price={1000}
      />
    );
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  test("renders coverage items", () => {
    render(
      <ViewBenefitModal
        show={true}
        onHide={jest.fn()}
        repairType="Workshop Repair"
        price={1000}
      />
    );
    const coverageTypes = [
      "Cover against Loss/Damage to own Vehicle",
      "Third Party Liability upto 10m SR",
      "Emergency Medical Expenses",
      "Theft",
      "No Claims Discount",
      "Loyalty Discount",
      "Personal Accident (Passengers)",
      "Personal Accident (Driver)",
      "Roadside Assistance",
    ];
    coverageTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  test("renders correct approval status for coverage items", () => {
    render(
      <ViewBenefitModal
        show={true}
        onHide={jest.fn()}
        repairType="Workshop Repair"
        price={1000}
      />
    );
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("alt", "Not Approved");
    expect(images[1]).toHaveAttribute("alt", "Approved");
    expect(images[2]).toHaveAttribute("alt", "Not Approved");
    expect(images[3]).toHaveAttribute("alt", "Not Approved");
    expect(images[4]).toHaveAttribute("alt", "Not Approved");
    expect(images[5]).toHaveAttribute("alt", "Approved");
    expect(images[6]).toHaveAttribute("alt", "Approved");
  });
});
