import React from "react";
import { render } from "@testing-library/react";
import Support from "./index";
import CarouselSlider from "./CarouselSlider";

describe("Support Component", () => {
  const supportData = [
    {
      title: "Support 1",
      desc: "Description 1",
      contact: "Contact 1",
      icon: "icon1.png",
      tinyicon: "tinyicon1.png",
      link: "/support1",
    },
    {
      title: "Support 2",
      desc: "Description 2",
      contact: "Contact 2",
      icon: "icon2.png",
      tinyicon: "tinyicon2.png",
      link: "/support2",
    },
  ];

  it("renders the component with support data", () => {
    const { getByText, getAllByAltText, getByTestId } = render(
      <Support
        supportData={supportData}
        title="Support Title"
        description="Support Description"
        navigateTo={() => {}}
      />
    );

    // Assert that the component renders the title and description
    expect(getByText("Support Title")).toBeInTheDocument();
    expect(getByText("Support Description")).toBeInTheDocument();

    // Assert that the component renders the support cards
    expect(getByText("Support 1")).toBeInTheDocument();
    expect(getByText("Support 2")).toBeInTheDocument();

    // Assert that the component renders the support card icons
    const icons = getAllByAltText("support");
    expect(icons[0]).toHaveAttribute("src", "icon1.png");
    expect(icons[1]).toHaveAttribute("src", "icon2.png");

    // Assert that the component renders the support card tiny icons
    expect(icons[2]).toHaveAttribute("src", "tinyicon1.png");
    expect(icons[3]).toHaveAttribute("src", "tinyicon2.png");

    // Assert that the component renders the support card contact information
    expect(getByText("Contact 1")).toBeInTheDocument();
    expect(getByText("Contact 2")).toBeInTheDocument();
  });

  it("renders the CarouselSlider component with data", () => {
    const data = {
      title: "Support 1",
      desc: "Description 1",
      contact: "Contact 1",
      icon: "icon1.png",
      tinyicon: "tinyicon1.png",
      link: "/support1",
    };

    const { getByText, getByTestId } = render(
      <CarouselSlider data={data} index={0} navigateTo={() => {}} />
    );

    // Assert that the component renders the title and description
    expect(getByText("Support 1")).toBeInTheDocument();
    expect(getByText("Description 1")).toBeInTheDocument();

    // Assert that the component renders the support card icon
    expect(getByTestId("support-icon-0")).toHaveAttribute("src", "icon1.png");

    // Assert that the component renders the support card contact information
    expect(getByText("Contact 1")).toBeInTheDocument();
  });
});
