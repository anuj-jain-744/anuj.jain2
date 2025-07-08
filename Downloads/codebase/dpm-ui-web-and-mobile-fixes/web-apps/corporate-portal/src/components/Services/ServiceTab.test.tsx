// ServicesTab.test.tsx
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ServicesTab from "./ServiceTab";
import "../../constant";
import { CommonProvider } from "@dpm/shared-module";

const mockServicesData = {
  Renewal: {
    Tab1: [{ title: "Item1", id: 1 }],
    Tab2: [{ title: "Item2", id: 2 }],
  },
  Policy: {
    Tab1: [{ title: "Item3", id: 3 }],
  },
};

jest.mock("../../constant", () => ({
  BreakPoints: {
    Tablet_Min: 769,
    Tablet_Max: 1200,
    Inner_Width: 1024,
  },
}));

describe("ServicesTab", () => {
  test("renders main tabs and sub-tabs correctly", () => {
    render(
      <CommonProvider>
        <ServicesTab
          servicesData={mockServicesData}
          labels={{
            renewal_label: "Renewal",
            policy_servicing_label: "Policy",
          }}
        />
      </CommonProvider>
    );

    expect(screen.getByText("Renewal")).toBeInTheDocument();
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByTestId("activeSubTab-0")).toBeInTheDocument();
  });

  test("switches sub-tabs on click", () => {
    render(
      <CommonProvider>
        <ServicesTab
          servicesData={mockServicesData}
          labels={{
            renewal_label: "Renewal",
            policy_servicing_label: "Policy",
          }}
        />
      </CommonProvider>
    );

    const tab = screen.getByTestId("activeSubTab-0");
    fireEvent.click(tab);
    expect(tab).toHaveClass("active");
  });

  test("hides tab UI if hide flags are true", () => {
    render(
      <CommonProvider>
        <ServicesTab
          hideProductTab={true}
          hideSubButtons={true}
          servicesData={mockServicesData}
          labels={{}}
        />
      </CommonProvider>
    );

    expect(screen.queryByTestId("productToggle-0")).not.toBeInTheDocument();
    expect(screen.queryByTestId("activeSubTab-0")).not.toBeInTheDocument();
  });

  test("shows loading message with no data", () => {
    render(
      <CommonProvider>
        <ServicesTab servicesData={{}} labels={{}} />{" "}
      </CommonProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("updates active product and resets sub-tab when product toggle clicked", () => {
    render(
      <CommonProvider>
        <ServicesTab servicesData={mockServicesData} labels={{}} />
      </CommonProvider>
    );
    const toggle = screen.getByTestId("productToggle-1");
    fireEvent.click(toggle);
    expect(toggle).toHaveClass("selected");
  });

  test("activates product toggle on Enter key press", () => {
    render(
      <CommonProvider>
        <ServicesTab
          servicesData={mockServicesData}
          labels={{ renewal_label: "Renewal" }}
        />
      </CommonProvider>
    );
    const toggle = screen.getByTestId("productToggle-0");
    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(toggle).toHaveClass("selected");
  });

  test("renders loading state when servicesData is empty object", () => {
    render(
      <CommonProvider>
        <ServicesTab servicesData={{}} labels={{}} />
      </CommonProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("applies animation styles when isVisible is true", () => {
    render(
      <CommonProvider>
        <ServicesTab
          servicesData={mockServicesData}
          isVisible={true}
          labels={{}}
        />
      </CommonProvider>
    );
    const tabButtons = document.querySelector(".tab-buttons");
    expect(tabButtons?.getAttribute("style")).toMatch(/translateX/); // Animations applied
  });

  test("renders content of second main tab when selected", () => {
    render(
      <CommonProvider>
        <ServicesTab
          servicesData={mockServicesData}
          labels={{
            renewal_label: "Renewal",
            policy_servicing_label: "Policy",
          }}
        />
      </CommonProvider>
    );

    const secondTab = screen.getByTestId("productToggle-1");
    fireEvent.click(secondTab);

    expect(secondTab).toHaveClass("selected");
  });
});
