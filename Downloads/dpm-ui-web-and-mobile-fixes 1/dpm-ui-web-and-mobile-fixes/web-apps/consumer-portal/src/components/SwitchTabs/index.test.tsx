import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SwitchTabs } from "./index";

describe("SwitchTabs", () => {
  const tabsData = [
    { webform_name: "Tab 1" },
    { webform_name: "Tab 2" },
    { webform_name: "Tab 3" },
  ];
  const setActiveTabMock = jest.fn();
  const activeTab = { activeIndex: 0, activelabel: "Tab 1" };

  beforeEach(() => {
    setActiveTabMock.mockClear();
  });

  test("renders the component with tabs", () => {
    render(
      <SwitchTabs
        tabsData={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTabMock}
      />
    );

    tabsData.forEach((tab) => {
      expect(screen.getByText(tab.webform_name)).toBeInTheDocument();
    });
  });

  test("sets the active tab correctly", () => {
    render(
      <SwitchTabs
        tabsData={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTabMock}
      />
    );

    const tabElements = screen.getAllByRole("button");
    expect(tabElements[0]).toHaveClass("selected");
    expect(tabElements[1]).not.toHaveClass("selected");

    fireEvent.click(tabElements[1]);
    expect(setActiveTabMock).toHaveBeenCalledWith(1, "Tab 2");
  });

  test("handles tab click", () => {
    render(
      <SwitchTabs
        tabsData={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTabMock}
      />
    );

    const tabElements = screen.getAllByRole("button");

    fireEvent.click(tabElements[1]);
    expect(setActiveTabMock).toHaveBeenCalledWith(1, "Tab 2");

    fireEvent.click(tabElements[2]);
    expect(setActiveTabMock).toHaveBeenCalledWith(2, "Tab 3");
  });

  test("handles keyboard navigation", () => {
    render(
      <SwitchTabs
        tabsData={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTabMock}
      />
    );

    const tabElements = screen.getAllByRole("button");

    fireEvent.keyDown(tabElements[1], { key: "Enter", code: "Enter" });
    expect(setActiveTabMock).toHaveBeenCalledWith(1, "Tab 2");

    fireEvent.keyDown(tabElements[2], { key: "Enter", code: "Enter" });
    expect(setActiveTabMock).toHaveBeenCalledWith(2, "Tab 3");
  });
});