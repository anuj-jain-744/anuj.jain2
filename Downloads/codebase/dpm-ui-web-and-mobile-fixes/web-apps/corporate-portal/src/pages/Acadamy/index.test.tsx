import React from "react";
import { render, screen } from "@testing-library/react";
import { Acadamy, AcadamyProps } from "./index";

// Mocks
jest.mock("./AcademyVision", () => ({
  AcadamyVision: () => <div data-testid="academy-vision" />,
}));
jest.mock("./WalaaObjective", () => ({
  WalaaObjective: () => <div data-testid="walaa-objective" />,
}));
jest.mock("../../components/RelatedLink", () => ({
  RelatedLink: () => <div data-testid="related-link" />,
}));
jest.mock("../../utils", () => ({
  navigateTo: jest.fn(),
}));

jest.mock("../../constant", () => ({
  commonKeywords: {},
}));

jest.mock("../../../../app-shell/src/utils", () => {});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const props: AcadamyProps = {
  content: "<h1>Main Content</h1>",
  relatedTitle: "Related Title",
  relatedlink: [{ title: "Story", description: "Description", url: "#" }],
  trainingdiscription: "<p>Training content</p>",
  trainingimageurl: "training.jpg",
  trainingimagealt: "Training Image",
  visiontitle: "Vision",
  visiondiscription: "Vision desc",
  visionimageurl: "vision.jpg",
  visionimagealt: "Vision Image",
  missiontitle: "Mission",
  missiondiscription: "Mission desc",
  missionimageurl: "mission.jpg",
  missionimagealt: "Mission Image",
  aimtitle: "Aim",
  aimdiscription: "Aim desc",
  aimimageurl: "aim.jpg",
  aimimagealt: "Aim Image",
  objectivesTitle: "Objectives",
  objectivesPoints: [{ icon: "icon.png", description: "Desc" }],
  sidebarTitle: "Sidebar Title",
  sidebarButton: "Click Me",
  sidebarImage: "sidebar.jpg",
  sidebar_button_link: "/sidebar-link",
};

describe("Acadamy Component", () => {
  it("renders main content and vision/mission/aim sections", () => {
    render(<Acadamy {...props} />);

    expect(screen.getByText("Sidebar Title")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
    expect(screen.getByAltText("Training Image")).toBeInTheDocument();
    expect(screen.getByTestId("academy-vision")).toBeInTheDocument();
  });

  it("renders WalaaObjective section if objectives are provided", () => {
    render(<Acadamy {...props} />);
    expect(screen.getByTestId("walaa-objective")).toBeInTheDocument();
  });
});
