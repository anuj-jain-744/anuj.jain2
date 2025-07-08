import React from "react";
import { render, screen } from "@testing-library/react";
import ClaimRegisDetModalContent from "./ClaimRegisDetModalContent";
import { DataContext } from "../../../../../../../DataContext";

const mockData = {
  popup_subtitle_one: "<b>Subtitle One</b>",
  popup_body_content_one: [
    { value: "Step 1" },
    { value: "Step 2" },
  ],
  popup_subtitle_two: "<i>Subtitle Two</i>",
  popup_body_content_two: [
    { value: "Requirement A" },
    { value: "Requirement B" },
  ],
};

const renderWithContext = (data = mockData) =>
  render(
    <DataContext.Provider value={data}>
      <ClaimRegisDetModalContent />
    </DataContext.Provider>
  );

describe("ClaimRegisDetModalContent", () => {
  test("renders both subtitles using HTML content", () => {
    renderWithContext();

    expect(screen.getByText("Subtitle One")).toBeInTheDocument();
    expect(screen.getByText("Subtitle Two")).toBeInTheDocument();
  });

  test("renders all items from popup_body_content_one", () => {
    renderWithContext();

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
  });

  test("renders all items from popup_body_content_two", () => {
    renderWithContext();

    expect(screen.getByText("Requirement A")).toBeInTheDocument();
    expect(screen.getByText("Requirement B")).toBeInTheDocument();
  });
});
