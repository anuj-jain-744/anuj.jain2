import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterModalDialog from "./RegisterModalDialog";
import { DataContext } from "../../DataContext";

const mockData = {
  popup_subtitle_one: "Subtitle One",
  popup_body_content_one: [{ value: "Content One" }],
  popup_subtitle_two: "Subtitle Two",
  popup_body_content_two: [{ value: "Content Two" }],
};

describe("RegisterModalDialog", () => {
  test("renders modal with content", () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterModalDialog />
      </DataContext.Provider>
    );

    expect(screen.getByText("Registration Details")).toBeInTheDocument();
    expect(screen.getByText("Subtitle One")).toBeInTheDocument();
    expect(screen.getByText("Content One")).toBeInTheDocument();
    expect(screen.getByText("Subtitle Two")).toBeInTheDocument();
    expect(screen.getByText("Content Two")).toBeInTheDocument();
  });

  test("closes modal on button click", () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterModalDialog />
      </DataContext.Provider>
    );

    fireEvent.click(screen.getByText("Ok"));
    expect(screen.queryByText("Registration Details")).not.toBeInTheDocument();
  });

  test("renders Walaa.com link", () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterModalDialog />
      </DataContext.Provider>
    );

    expect(screen.getByText("Walaa.com")).toBeInTheDocument();
    expect(screen.getByText("Walaa.com").closest("a")).toHaveAttribute(
      "href",
      "https://motorclaims.walaa.com/"
    );
  });
});