import React from "react";
import { render, screen } from "@testing-library/react";
import { FeaturedJobs } from "./index";
import { MemoryRouter } from "react-router-dom";

describe("FeaturedJobs Component", () => {
  const mockJobsData = {
    featured_title: "Featured Jobs",
    featured_description: "Explore our featured job opportunities.",
    jobs_data: [
      {
        job_title: "Software Engineer",
        job_location: "New York",
        posted_on: "2023-01-01",
        closing_on: "2023-01-31",
      },
      {
        job_title: "Product Manager",
        job_location: "San Francisco",
        posted_on: "2023-02-01",
        closing_on: "2023-02-28",
      },
    ],
  };

  const mockCommonLabels = {
    location: "Location",
    job_posted_on: "Posted On",
    job_closing_on: "Closing On",
    apply: "Apply Now",
  };

  it("renders the featured title and description", () => {
    render(
      <MemoryRouter>
        <FeaturedJobs jobsdata={mockJobsData} commonlables={mockCommonLabels} />
      </MemoryRouter>
    );
    expect(screen.getByText("Featured Jobs")).toBeInTheDocument();
    expect(screen.getByText("Explore our featured job opportunities.")).toBeInTheDocument();
  });

  it("renders the job list with correct details", () => {
    render(
      <MemoryRouter>
        <FeaturedJobs jobsdata={mockJobsData} commonlables={mockCommonLabels} />
      </MemoryRouter>
    );
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Location: New York")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("Location: San Francisco")).toBeInTheDocument();
  });

  it("renders the apply button for each job", () => {
    render(
      <MemoryRouter>
        <FeaturedJobs jobsdata={mockJobsData} commonlables={mockCommonLabels} />
      </MemoryRouter>
    );
    const applyButtons = screen.getAllByText("Apply Now");
    expect(applyButtons).toHaveLength(2); // Two jobs, so two buttons
  });
});