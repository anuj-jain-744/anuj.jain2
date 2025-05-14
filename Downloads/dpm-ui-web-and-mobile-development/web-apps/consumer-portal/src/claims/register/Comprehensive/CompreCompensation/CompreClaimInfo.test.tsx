import React from "react";
import { render, screen } from "@testing-library/react";
import CompreClaimInfo from "./CompreClaimInfo";
import iconCar from "../../../../assets/Claims/Car.svg";
import { Card } from "react-bootstrap";

describe("CompreClaimInfo Component", () => {
  test("renders CompreClaimInfo component with correct content", () => {
    render(<CompreClaimInfo />);

    // Check if the horizontal rule is rendered
    expect(screen.getByRole("separator")).toBeInTheDocument();

    // Check if the card body is rendered
    expect(screen.getByRole("region", { name: /register-card-body register-compre-card-body/i })).toBeInTheDocument();

    // Check if the image is rendered with correct src and alt attributes
    const img = screen.getByAltText("type icon");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", iconCar);

    // Check if the claim number title is rendered
    expect(screen.getByText("Motor Claim No.")).toBeInTheDocument();

    // Check if the claim number value is rendered
    expect(screen.getByText("C-E00-23-310-004679-001")).toBeInTheDocument();
  });
});