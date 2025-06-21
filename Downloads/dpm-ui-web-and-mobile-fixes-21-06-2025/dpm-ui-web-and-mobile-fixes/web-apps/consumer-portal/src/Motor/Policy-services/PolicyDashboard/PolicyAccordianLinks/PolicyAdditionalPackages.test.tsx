import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PolicyAdditionalPackages from "./PolicyAdditionalPackages";
import { MemoryRouter, useLocation } from "react-router-dom";

// Mocking the image imports
jest.mock('assets/Dashboard/Road.svg', () => 'road-icon.svg');
jest.mock('assets/Dashboard/Personal_Injury.svg', () => 'injury-icon.svg');
jest.mock('assets/Endorsement/Car_Icon.svg', () => 'car-icon.svg');
jest.mock('assets/Endorsement/driver.svg', () => 'driver-icon.svg');
jest.mock('assets/Endorsement/Location.svg', () => 'location-icon.svg');

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn()
}));

const mockNavigateTo = jest.fn();

describe("PolicyAdditionalPackages Component", () => {
  const mockLanguageData = {
    policy_additional_packages: "Additional Packages",
    manage_add_benefit: "Manage Add Benefit",
    emergency_support_for: "Emergency support description"
  };

  const mockBenefitsList = [
    {
      benefitCode: "MRAS",
      benefitName: "Road Assistance"
    },
    {
      benefitCode: "MPAD",
      benefitName: "Personal Injury"
    },
    {
      benefitCode: "MRCR",
      benefitName: "comp"
    },
    {
      benefitCode: "MGAE-Bahrain",
      benefitName: "Geographical ncc"
    },
    {
      benefitCode: "MGAE-GCC",
      benefitName: "Geographical"
    },
    {
      benefitCode: "home",
      benefitName: "unknown"
    }
  ];

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({ state: { from: "test" } });

    render(
      <MemoryRouter>
        <PolicyAdditionalPackages
          languageData={mockLanguageData}
          navigateTo={mockNavigateTo}
          benefitsList={mockBenefitsList}
        />
      </MemoryRouter>
    );
  });

  it("renders the benefits correctly", () => {
    expect(screen.getByText("Road Assistance")).toBeInTheDocument();
    expect(screen.getByText("Personal Injury")).toBeInTheDocument();
    expect(screen.getAllByText("Emergency support description")).toHaveLength(6);
  });

  it("renders the 'Manage Add Benefit' button", () => {
    expect(screen.getByText("Manage Add Benefit")).toBeInTheDocument();
  });

  it("calls navigateTo on button click", () => {
    const button = screen.getByText("Manage Add Benefit");
    fireEvent.click(button);
    expect(mockNavigateTo).toHaveBeenCalledWith('/PolicyService/Endorsement', { from: "test" });
  });
});
