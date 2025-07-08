import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CustomRenderNavDropdown, RenderChild } from "../NavDropdown";
import { Parent } from "../types/NavDropdown.types";


describe("CustomRenderNavDropdown", () => {
  const mockHandleDropdownEvent = jest.fn();
  const mockHandleProductToggleClick = jest.fn();

  const createParent = (linkName:string,className: string): Parent => ({
    linkName: linkName,
    attributes: { class: [className] },
    childrens: [
      {
        linkName: "Child Link 1",
        childrens: [{ linkName: "Sub Child Link 1" }],
      },
      {
        linkName: "Child Link 2",
        childrens: [{ linkName: "Sub Child Link 2" }],
      },
    ],
  });

  const dropdownStates = { linkName: "Parent Link" };

  const createProps = (parent: Parent, dropdownStates: { linkName: string }, navTheme:boolean) => ({
    parent,
    pIdx: 0,
    dropdownStates,
    handleDropdownEvent: mockHandleDropdownEvent,
    navbarTransparent: navTheme,
    activeProduct: 0,
    setActiveProduct: mockHandleProductToggleClick,
  });

  const parent = createParent("Parent Link","product");
  const parentNotProduct = createParent("Different Link","not-product");

  const props = createProps(parent, dropdownStates,true);
  const propsNotProduct = createProps(parentNotProduct, dropdownStates, false);

  it("renders correctly", () => {
    render(<CustomRenderNavDropdown {...props} />);
    expect(screen.getByText("Parent Link")).toBeInTheDocument();
  });

  it("renders non product template correctly", () => {
    render(<CustomRenderNavDropdown {...propsNotProduct} />);
    expect(screen.getByText("Different Link")).toBeInTheDocument();
  });

  it("displays the correct icon based on dropdown state", () => {
    render(<CustomRenderNavDropdown {...props} />);
    expect(screen.getByTestId("ExpandLessIcon")).toBeInTheDocument();
  });

   it("doesn't call handleDropdownEvent on mouse enter and calls handleDropdownEvent on leave", () => {
    render(<CustomRenderNavDropdown {...props} />);
    const dropdown = screen.getByText("Parent Link").closest(".dropdown");
    fireEvent.mouseEnter(dropdown!);
    expect(mockHandleDropdownEvent).not.toHaveBeenCalled();

  });

  it("calls handleDropdownEvent on click", () => {
    render(<CustomRenderNavDropdown {...props} />);
    const dropdown = screen.getByText("Parent Link").closest(".dropdown");
    fireEvent.click(dropdown!);
    expect(mockHandleDropdownEvent).toHaveBeenCalledWith(
      "Parent Link",
      true,
      0
    );
  });

  it("renders navbar color theme when false sent to navBarTransparent", () => {
    const { container } = render(<CustomRenderNavDropdown {...propsNotProduct} />);
    expect(container.querySelector(".navbar-color")).toBeInTheDocument();
  });
});

describe("Test Render Child", () => {
  const mockHandleProductToggleClick = jest.fn();
  const child = {
    linkName: "Child Link 1",
  };

  const props = {
    child,
    cIdx: 0,
    activeProduct: 0,
    handleProductToggleClick: mockHandleProductToggleClick,
  };

  test("renders child element correctly", () => {
    render(<RenderChild {...props} />);
    expect(screen.getByText("Child Link 1")).toBeInTheDocument();
  });

  test("applies correct class based on activeProduct", () => {
    const { rerender } = render(<RenderChild {...props} />);
    expect(screen.getByText("Child Link 1").closest("div")).toHaveClass(
      "selected"
    );

    rerender(<RenderChild {...props} activeProduct={1} />);
    expect(screen.getByText("Child Link 1").closest("div")).toHaveClass(
      "default"
    );
  });

  test("calls handleProductToggleClick on click", () => {
    render(<RenderChild {...props} />);
    const childDiv = screen.getByText("Child Link 1").closest("div");

    if (childDiv) {
      fireEvent.click(childDiv);
      expect(mockHandleProductToggleClick).toHaveBeenCalledWith(0);
    } else {
      throw new Error("Child Link 1 div not found");
    }
  });
});