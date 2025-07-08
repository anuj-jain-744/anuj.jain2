import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Breadcrumbs } from "./index";

describe("Breadcrumbs Component", () => {
  const mockNavigateTo = jest.fn();
  const items = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Contact", route: "/contact" },
  ];

  it("renders correctly with given items", () => {
    render(<Breadcrumbs items={items} navigateTo={mockNavigateTo} />);

    items.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    const chevronIcons = screen.getAllByTestId("ChevronRightIcon");
    expect(chevronIcons).toHaveLength(items.length - 1);
  });

  it("calls navigateTo with the correct URL when a breadcrumb item is clicked", () => {
    render(<Breadcrumbs items={items} navigateTo={mockNavigateTo} />);

    const homeBreadcrumb = screen.getByText("Home");
    fireEvent.click(homeBreadcrumb);

    expect(mockNavigateTo).toHaveBeenCalledWith("/");
  });

  it("does not call navigateTo for the last breadcrumb item", () => {
    render(<Breadcrumbs items={items} navigateTo={mockNavigateTo} />);

    const contactBreadcrumb = screen.getByText("Contact");
    fireEvent.click(contactBreadcrumb);

    expect(mockNavigateTo).not.toHaveBeenCalledWith("/contact");
  });
});