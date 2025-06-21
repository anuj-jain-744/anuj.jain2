import React from "react";
import { render, screen } from "@testing-library/react";
import Registration from "./Registration";
import { DataContext } from "../../DataContext";

const mockData = {
  popup_subtitle_one: "Subtitle One",
  popup_body_content_one: [{ value: "Content One" }],
  popup_subtitle_two: "Subtitle Two",
  popup_body_content_two: [{ value: "Content Two" }],
};

describe("Registration Component", () => {
  test("renders RegisterModalDialog component", () => {
    render(
      <DataContext.Provider value={mockData}>
        <Registration />
      </DataContext.Provider>
    );

    expect(screen.getByText("Registration Details")).toBeInTheDocument();
    expect(screen.getByText("Subtitle One")).toBeInTheDocument();
    expect(screen.getByText("Content One")).toBeInTheDocument();
    expect(screen.getByText("Subtitle Two")).toBeInTheDocument();
    expect(screen.getByText("Content Two")).toBeInTheDocument();
  });
});