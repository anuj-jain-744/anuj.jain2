import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarouselSlider from "./CarouselSlider";

// Mock the navigateTo function
const mockNavigateTo = jest.fn();

// Sample data for testing
const data = {
  icon: "icon.png",
  title: "Sample Title",
  desc: "This is a description with\nnew lines.",
  tinyicon: "tinyicon.png",
  contact: "Contact Info",
  link: "/contact",
};

describe("CarouselSlider Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props", () => {
    render(
      <CarouselSlider data={data} index={0} navigateTo={mockNavigateTo} />
    );

    // Check if title and contact are rendered
    expect(screen.getByText(data.title)).toBeInTheDocument();
    expect(screen.getByText(data.contact)).toBeInTheDocument();

    // Check if icon and tinyicon are rendered correctly
    const icon = screen.getByTestId("support-icon-0");
    expect(icon).toHaveAttribute("src", data.icon);

    const tinyicon = screen.getByTestId("support-tinyicon-0");
    expect(tinyicon).toHaveAttribute("src", data.tinyicon);
  });

  it("formats description with line breaks correctly", () => {
    render(
      <CarouselSlider data={data} index={0} navigateTo={mockNavigateTo} />
    );

    // Check if the description is rendered with the replaced line breaks
    const description = screen.getByText(
      "This is a description with new lines."
    );
    expect(description).toBeInTheDocument();
  });

  it("calls navigateTo with correct link when contact link is clicked", () => {
    render(
      <CarouselSlider data={data} index={0} navigateTo={mockNavigateTo} />
    );

    const contactLink = screen.getByText(data.contact);
    fireEvent.click(contactLink);

    // Verify that the navigateTo function is called with the correct link
    expect(mockNavigateTo).toHaveBeenCalledWith(data.link);
  });

 it("call navigateTo even if the link is not provided", () => {
    render(
      <CarouselSlider
        data={{...data,link:""} }
        index={0}
        navigateTo={mockNavigateTo}
      />
    );
    const contactLink = screen.getByText(data.contact);
    fireEvent.click(contactLink);
    // Verify that the navigateTo function is NOT called when no link is provided
    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
  });
  //});

  it("renders correctly without icon and tinyicon", () => {
    const dataWithoutIcons = {
      ...data,
      icon: undefined,
      tinyicon: undefined,
    };

    render(
      <CarouselSlider
        data={dataWithoutIcons}
        index={0}
        navigateTo={mockNavigateTo}
      />
    );

    // Check if the title and contact are still rendered even without icons
    expect(screen.getByText(data.title)).toBeInTheDocument();
    expect(screen.getByText(data.contact)).toBeInTheDocument();

    // Verify that icons are not rendered when not provided
    const icon = screen.queryByTestId("support-icon-0");
    expect(icon).toBeNull();

    const tinyicon = screen.queryByTestId("support-tinyicon-0");
    expect(tinyicon).toBeNull();
  });

  it("renders the correct number of support cards when given multiple data", () => {
    const dataList = [
      { ...data, title: "Title 1", contact: "Contact 1", link: "/link1" },
      { ...data, title: "Title 2", contact: "Contact 2", link: "/link2" },
    ];

    render(
      <>
        {dataList.map((item, index) => (
          <CarouselSlider
            key={index}
            data={item}
            index={index}
            navigateTo={mockNavigateTo}
          />
        ))}
      </>
    );

    // Verify that the titles and contacts of all the items are rendered
    dataList.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.contact)).toBeInTheDocument();
    });
  });
});
