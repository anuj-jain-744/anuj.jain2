import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ManagementTeam } from "./index";

const teamHeading = {
    walaa_team_title: "Walaa Team",
};

const teamData = [
    {
        title: "Johnson Varughese ",
        designation: "Chief Executive Officer",
        content:
            "Walaa Cooperative Insurance Co.’s capital hike aims to support growth plans in all activities and maintain good solvency in line with current levels,said company CEO Johnson Varughese. In addition, the move aims to maintain the company’s rating.",
        image_url:
            "https://storage.googleapis.com/walaa-bucket/2024-10/johnson 1.png",
        image_alt: "johnson",
        weight: "0",
        member_role_name: "CEO",
    },
    {
        title: "Mohannad Al Desouki",
        designation: "CHIEF FINANCIAL OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image1.png",
        image_alt: "Mohannad",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Turki Al-Buraik",
        designation: "CHIEF OPERATING OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image2.png",
        image_alt: "Turki",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Wasif F. Minhas",
        designation: "CHIEF GENERAL INSURANCE OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image3.png",
        image_alt: "Wasif",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Ghayas Khan",
        designation: "CHIEF LIFE & MEDICAL INSURANCE OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image4.png",
        image_alt: "Ghayas",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Fahad Aba Alkhail",
        designation: "CHIEF CORPORATE SALES OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image5.png",
        image_alt: "Fahad Aba Alkhail",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Wail Alahmed",
        designation: "CHIEF COMMERCIAL OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image6.png",
        image_alt: "Wail Alahmed",
        weight: "0",
        member_role_name: "Officers",
    },
    {
        title: "Turki Al Mulhem",
        designation: "CHIEF MOTOR INSURANCE OFFICER",
        content:
            "One of the primary reasons I chose Walaa for travel insurance was to get protection against medical emergencies while travelling. It not only covered emergency medical expenses but also my Pre existing illness, ensuring that I would receive the necessary treatment without worrying about costs.<br>&nbsp;",
        image_url: "https://storage.googleapis.com/walaa-bucket/2024-10/image7.png",
        image_alt: "Turki Al Mulhem",
        weight: "0",
        member_role_name: "Officers",
    },
];

describe("Walaa Management Team", () => {
    test("Load the Team heading Properly", () => {
        render(<ManagementTeam teamData={teamData} teamHeading={teamHeading} />);
        expect(screen.getByText(teamHeading.walaa_team_title)).toBeInTheDocument();
    });

    test("renders all the teammembers with correct names and designation", () => {
        render(<ManagementTeam teamData={teamData} teamHeading={teamHeading} />);

        teamData.forEach((member, index) => {
            const titleElement = screen.getByTestId(`team-member-title-${index}`);
            expect(titleElement).toHaveTextContent(member.title.trim());

            const designationElement = screen.getByTestId(
                `team-member-designation-${index}`
            );
            expect(designationElement).toHaveTextContent(member.designation.trim());

            const imageElement = screen.getByTestId(`team-member-image-${index}`);
            expect(imageElement).toHaveAttribute("src", member.image_url);
        });
    });

    test("render the correct number of team member cards", () => {
        render(<ManagementTeam teamData={teamData} teamHeading={teamHeading} />);

        const temmemberCards = screen.queryAllByTestId((testId) =>
            testId.startsWith("team-member-col-")
        );

        expect(temmemberCards.length).toBe(teamData.length);
    });
});
