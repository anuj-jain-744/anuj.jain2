import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AcadamyVision } from "./index";

describe("AcadamyVision Component", () => {
  const mockProps = {
    visionTitle: "Our Vision",
    visionDescription: "To be a leader in education.",
    missionTitle: "Our Mission",
    missionDescription: "To provide quality education.",
    aimTitle: "Our Aim",
    aimDescription: "To inspire innovation.",
    visionImage: "vision.png",
    missionImage: "mission.png",
    aimImage: "aim.png",
  };

  it("renders vision section correctly", () => {
    render(<AcadamyVision {...mockProps} />);

    expect(screen.getByAltText("Vision Icon")).toHaveAttribute("src", mockProps.visionImage);
    expect(screen.getByText(mockProps.visionTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.visionDescription)).toBeInTheDocument();
  });

  it("renders mission section correctly", () => {
    render(<AcadamyVision {...mockProps} />);

    expect(screen.getByAltText("Mission Icon")).toHaveAttribute("src", mockProps.missionImage);
    expect(screen.getByText(mockProps.missionTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.missionDescription)).toBeInTheDocument();
  });

  it("renders aim section correctly", () => {
    render(<AcadamyVision {...mockProps} />);

    expect(screen.getByAltText("Aim Icon")).toHaveAttribute("src", mockProps.aimImage);
    expect(screen.getByText(mockProps.aimTitle)).toBeInTheDocument();
    expect(screen.getByText(mockProps.aimDescription)).toBeInTheDocument();
  });
});