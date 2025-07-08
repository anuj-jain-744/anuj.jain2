import { render, screen } from "@testing-library/react";
import { AcadamyVision } from "./index";

const mockProps = {
  visionTitle: "Our Vision",
  visionDescription: "To inspire the future.",
  missionTitle: "Our Mission",
  missionDescription: "To empower through education.",
  aimTitle: "Our Aim",
  aimDescription: "To achieve lifelong learning.",
  visionImage: "/vision.png",
  missionImage: "/mission.png",
  aimImage: "/aim.png",
};

describe("AcadamyVision Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes("max-width: 768px"),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("renders all titles and descriptions", () => {
    render(<AcadamyVision {...mockProps} />);

    expect(screen.getByText(mockProps.visionTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.visionDescription)).toBeInTheDocument();
    expect(screen.getByText(mockProps.missionTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.missionDescription)).toBeInTheDocument();
    expect(screen.getByText(mockProps.aimTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.aimDescription)).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    render(<AcadamyVision {...mockProps} />);

    expect(screen.getByAltText("Our Vision Icon")).toBeInTheDocument();
    expect(screen.getByAltText("Our Mission Icon")).toBeInTheDocument();
    expect(screen.getByAltText("Our Aim Icon")).toBeInTheDocument();
  });

  it("renders correct number of card elements", () => {
    const { container } = render(<AcadamyVision {...mockProps} />);
    const cards = container.querySelectorAll(".cards-icon-cards-2");
    expect(cards.length).toBe(3);
  });
});
