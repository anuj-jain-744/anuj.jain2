import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "./index";
import "@testing-library/jest-dom";

const mockProps = {
  companyInfo: "<p>Company Info</p>",
  footerMenus: {
    Menu1: [{ menuUrl: "/menu1", linkName: "Menu 1" }],
    Menu2: [{ menuUrl: "/menu2", linkName: "Menu 2" }],
  },
  copyRight: "© 2023 Company",
  downloadApp: {
    data: [{ image: "app1.png" }, { image: "app2.png" }],
  },
  privacy: {
    data: [{ linkName: "Privacy Policy" }, { linkName: "Terms of Service" }],
  },
  socialHandles: {
    data: [{ menuicon: "facebook.png" }, { menuicon: "twitter.png" }],
  },
  showAppDownload: true,
};

const mockItem = {
  label: "Test Label",
  subLabel: [
    { linkName: "Sub Item 1", menuUrl: "/sub-item-1" },
    { linkName: "Sub Item 2", menuUrl: "/sub-item-2" },
  ],
};

const mockExpandedItems = {
  "Test Label": false,
};

const mockHandleExpandToggle = jest.fn();

describe("Footer Component", () => {
  test("renders company info", () => {
    render(<Footer {...mockProps} />);
    const companyInfoElement = screen.getByText(/Company Info/i);
    expect(companyInfoElement).toBeInTheDocument();
  });

  test("renders footer menus", () => {
    render(<Footer {...mockProps} />);
    const menu1Element = screen.getByText(/Menu 1/i);
    const menu2Element = screen.getByText(/Menu 2/i);
    expect(menu1Element).toBeInTheDocument();
    expect(menu2Element).toBeInTheDocument();
  });

  test("renders copyright text", () => {
    render(<Footer {...mockProps} />);
    const copyRightElement = screen.getByText(/© 2023 Company/i);
    expect(copyRightElement).toBeInTheDocument();
  });

  test("renders download app section", () => {
    render(<Footer {...mockProps} />);
   // const downloadAppTitle = screen.getByText(/Download our app/i);
   // expect(downloadAppTitle).toBeInTheDocument();
    const appImages = screen.getAllByAltText(/apps/i);
    expect(appImages.length).toBe(2);
  });

  test("renders social handles", () => {
    render(<Footer {...mockProps} />);
    // const followUsTitle = screen.getByText(/Follow Us/i);
    // expect(followUsTitle).toBeInTheDocument();
    const socialIcons = screen.getAllByAltText(/socials/i);
    expect(socialIcons.length).toBe(2);
  });

  test("scrolls to top on scroll up icon click", () => {
    window.scrollTo = jest.fn();
    render(<Footer {...mockProps} />);
    const scrollUpIcon = screen.getByAltText(/scroll-up/i);
    fireEvent.click(scrollUpIcon);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  test("handleFooterCollapse function toggles footerCollapsed state", () => {
    const { container } = render(<Footer {...mockProps} />);
    const collapseIcon = container.querySelector(".accordian-down");
    fireEvent.click(collapseIcon!);
    expect(collapseIcon).toHaveClass("icon-up");
    fireEvent.click(collapseIcon!);
    expect(collapseIcon).not.toHaveClass("icon-up");
  });
});

describe("FooterContentList", () => {
  test("does not render sub items when not expanded", () => {
    render(<Footer {...mockProps} />);

    expect(screen.queryByText("Sub Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Sub Item 2")).not.toBeInTheDocument();
  });

  it("should render footer menu items and handle expand/collapse", () => {
    render(<Footer {...mockProps} />);
    expect(screen.getByText("Menu1")).toBeInTheDocument();
    expect(screen.getByText("Menu2")).toBeInTheDocument();

    expect(screen.getByText("Menu 1")).toBeInTheDocument();
    expect(screen.getByText("Menu 1")).toBeInTheDocument();

    const expandLessIcons = screen.getAllByTestId("expand-less-icon");
    const expandMoreIcons = screen.queryAllByTestId("expand-more-icon");
    expect(expandLessIcons.length).toBe(2);
    expect(expandMoreIcons.length).toBe(0);

    fireEvent.click(expandLessIcons[0]);
    expect(screen.queryByText("Menu 1")).not.toBeInTheDocument();
    expect(screen.getByTestId("expand-more-icon")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("expand-more-icon"));
    expect(screen.getByText("Menu 1")).toBeInTheDocument();
  });
});
