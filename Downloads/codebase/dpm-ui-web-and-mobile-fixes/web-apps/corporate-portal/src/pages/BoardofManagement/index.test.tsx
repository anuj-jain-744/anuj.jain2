import React from "react";
import { render, screen } from "@testing-library/react";
import { BoardofManagement, MangeDataProps } from "./index";
import { CeoSection } from "components/BoardofManagement";
import { ManagementTeam } from "components/ManagementTeam";

jest.mock("components/BoardofManagement", () => ({
  CeoSection: jest.fn(() => <div data-testid="ceo-section" />),
}));

jest.mock("components/ManagementTeam", () => ({
  ManagementTeam: jest.fn(() => <div data-testid="management-team" />),
}));

const mockData: MangeDataProps = {
  title: "John",
  designation: "CEO",
  content: ["Leader with vision"],
  image_url: "ceo.jpg",
  image_alt: "John",
  weight: "1",
  member_role_name: "Chief Executive Officer"
};

const mockHeading = {
  walaa_team_title: "Management Team"
};

describe("BoardofManagement Component", () => {
  it("renders without crashing", () => {
    render(<BoardofManagement managementData={mockData} teamHeading={mockHeading} />);

    expect(screen.getByTestId("ceo-section")).toBeInTheDocument();
    expect(screen.getByTestId("management-team")).toBeInTheDocument();
  });

  it("passes correct props to CeoSection", () => {
    render(<BoardofManagement managementData={mockData} teamHeading={mockHeading} />);

    expect(CeoSection).toHaveBeenCalledWith(
      { ceoData: mockData?.content[0] },
      {}
    );
  });

  it("passes correct props to ManagementTeam", () => {
    render(<BoardofManagement managementData={mockData} teamHeading={mockHeading} />);

    expect(ManagementTeam).toHaveBeenCalledWith(
      { teamData: mockData?.content?.slice(1), teamHeading: mockHeading },
      {}
    );
  });
});
