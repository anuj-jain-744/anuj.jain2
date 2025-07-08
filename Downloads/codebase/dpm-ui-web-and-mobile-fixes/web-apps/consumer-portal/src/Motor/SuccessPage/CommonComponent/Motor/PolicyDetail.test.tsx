import React from "react";
import { render, screen } from "@testing-library/react";
import { PolicyDetail } from "./PolicyDetail"; // adjust import path as needed

describe("PolicyDetail component", () => {
  it("renders the data correctly", () => {
    const testData = [
      { label: "Policy Number", value: "12345", class: "policyValue" },
      { label: "Premium", value: 5000, class: "policyValue" },
      { label: "Status", value: "Active" }, // class is optional
    ];

    render(<PolicyDetail data={testData} />);

    // Check if each label is rendered
    testData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    // Check if each value is rendered with the correct class
    testData.forEach((item) => {
      const valueElement = screen.getByText(String(item.value));
      expect(valueElement).toBeInTheDocument();

      // If class is provided, check for it
      if (item.class) {
        expect(valueElement).toHaveClass(item.class);
      }
    });
  });
});
