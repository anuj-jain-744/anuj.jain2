import React from "react";
import { render, screen } from "@testing-library/react";
import { BoardofDirector } from "./index";
import { ManagementTeam } from "components/ManagementTeam";

jest.mock("components/Chairman", () => ({
    Chairman: jest.fn(() => <div>Mock Chairman Component</div>),
}));

jest.mock("components/ManagementTeam", () => ({
    ManagementTeam: jest.fn(() => <div>Mock Management Team Component</div>),
}));

describe("BoardofDirector Component", () => {
    const mockDirectorsData = [
        {
            title: "Chairman",
            designation: "CEO",
            content: "Some content about the chairman",
            image_url: "chairman-image.jpg",
            image_alt: "Chairman Image",
            weight: "1",
            member_role_name: "Chairman",
        },
        {
            title: "Member",
            designation: "CFO",
            content: "Some content about the CFO",
            image_url: "cfo-image.jpg",
            image_alt: "CFO Image",
            weight: "1",
            member_role_name: "CFO",
        },
    ];

    const mockTeamHeading = {
        walaa_team_title: "Our Team",
    };

    it("renders without crashing", () => {
        render(<BoardofDirector directorsData={mockDirectorsData} teamHeading={mockTeamHeading} />);
        expect(screen.getByText("Mock Chairman Component")).toBeInTheDocument();
        expect(screen.getByText("Mock Management Team Component")).toBeInTheDocument();
    });

    it("should handle empty directorsData gracefully", () => {
        render(<BoardofDirector directorsData={[]} teamHeading={mockTeamHeading} />);
        expect(screen.getByText("Mock Chairman Component")).toBeInTheDocument();
        expect(screen.getByText("Mock Management Team Component")).toBeInTheDocument();
    });

    it("should display the correct team heading", () => {
        render(<BoardofDirector directorsData={mockDirectorsData} teamHeading={mockTeamHeading} />);
        expect(screen.getByText("Mock Management Team Component")).toBeInTheDocument();
        expect(ManagementTeam).toHaveBeenCalledWith(
            expect.objectContaining({
                teamHeading: mockTeamHeading,
            }),
            {}
        );
    });
});