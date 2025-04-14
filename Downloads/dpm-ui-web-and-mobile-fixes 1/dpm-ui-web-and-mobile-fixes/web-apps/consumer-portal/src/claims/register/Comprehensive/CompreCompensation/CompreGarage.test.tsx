import React from "react";
import { render, screen } from "@testing-library/react";
import CompreGarage from "./CompreGarage";
import { DataContext } from "../../../../DataContext";

const mockData = {
  city: "City",
  garage_select_any_3: "Select any 3 garages",
};

describe("CompreGarage", () => {
  it("renders correctly with provided data", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreGarage />
      </DataContext.Provider>
    );

    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Select any 3 garages")).toBeInTheDocument();
  });

  it("renders ThemeSelect components", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreGarage />
      </DataContext.Provider>
    );

    const themeSelects = screen.getAllByRole("combobox");
    expect(themeSelects.length).toBe(2);
  });
});