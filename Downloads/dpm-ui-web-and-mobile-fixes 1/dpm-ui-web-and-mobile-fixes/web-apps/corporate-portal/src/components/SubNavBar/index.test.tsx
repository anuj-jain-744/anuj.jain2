import { render, fireEvent } from "@testing-library/react";
import { SubNavBar } from "./index";

describe("SubNavBar Component", () => {
  const content = [{ value: "Tab 1" }, { value: "Tab 2" }, { value: "Tab 3" }];

  it("renders the correct number of tabs", () => {
    const { getAllByTestId } = render(<SubNavBar content={content} />);
    const tabs = getAllByTestId(/productToggle-/);
    expect(tabs.length).toBe(content.length);
  });

  it("sets the correct tab as active on click", () => {
    const { getAllByTestId } = render(<SubNavBar content={content} />);
    const tabs = getAllByTestId(/productToggle-/);

    // Click the second tab
    fireEvent.click(tabs[1]);

    // Check if the second tab is active
    expect(tabs[1]).toHaveClass("active");
    // Check if the first tab is not active
    expect(tabs[0]).not.toHaveClass("active");
  });

  it("initially sets the first tab as active", () => {
    const { getAllByTestId } = render(<SubNavBar content={content} />);
    const tabs = getAllByTestId(/productToggle-/);

    expect(tabs[0]).toHaveClass("active");
  });
});
