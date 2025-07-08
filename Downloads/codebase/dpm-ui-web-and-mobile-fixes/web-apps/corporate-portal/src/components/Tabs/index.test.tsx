import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tabs } from "./index";

jest.mock("../../utils/icons", () => ({
  IconsSet: {
    icon1: "icon1.png",
    icon2: "icon2.png",
  },
}));
const mockTabItems = [
  { class: "icon1", name: "Tab 1" },
  { class: "icon2", name: "Tab 2" },
];
const mockActiveTabItem = { index: 0 };
const mockHandleSelectTab = jest.fn();

describe("src/components/Tabs/index.tsx", () => {
  beforeEach(() => {
    render(
      <Tabs
        tabItems={mockTabItems}
        activeTabItem={mockActiveTabItem}
        handleSelectTab={mockHandleSelectTab}
      />
    );
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test("renders Tabs with tab items", () => {
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
  });

  test("highlights the active tab", () => {
    expect(screen.getByText("Tab 1").closest(".tab-item")).toHaveClass(
      "active"
    );
    expect(screen.getByText("Tab 2").closest(".tab-item")).not.toHaveClass(
      "active"
    );
  });

  test("calls handleSelectTab when a tab is clicked", () => {
    fireEvent.click(screen.getByText("Tab 2"));
    expect(mockHandleSelectTab).toHaveBeenCalledWith(mockTabItems[1], 1);
  });
});

describe("src/components/Tabs/index.tsx - Render Empty Tabs", () => {
  test("renders nothing when tabItems is empty", () => {
    render(
      <Tabs
        tabItems={[]}
        activeTabItem={mockActiveTabItem}
        handleSelectTab={mockHandleSelectTab}
      />
    );
    expect(screen.queryByText("Tab 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Tab 2")).not.toBeInTheDocument();
  });
});
