import React from "react";
import { render } from "@testing-library/react";
import ThemeAlert from "./index";

describe("ThemeAlert", () => {
  it("renders the alert with the correct title and variant", () => {
    const { getByText } = render(
      <ThemeAlert title="Test Alert" variant="primary" classes="test-class" />
    );
    const alertElement = getByText("Test Alert");
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass("alert-primary");
    expect(alertElement).toHaveClass("test-class");
  });

  it("renders the alert with the correct variant class", () => {
    const { container } = render(
      <ThemeAlert title="Test Alert" variant="success" classes="test-class" />
    );
    const alertElement = container.querySelector(".alert-success");
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass("test-class");
  });
});