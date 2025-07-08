import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DocumentLibraryLayout } from "./index";

jest.mock("components/LayoutTab", () => ({
  LayoutTab: ({ activeLayout, handleLayout }: any) => (
    <button data-testid="layout-tab" onClick={() => handleLayout("grid")}>
      Active: {activeLayout}
    </button>
  ),
}));

jest.mock("components/MultiLayoutCard", () => ({
  MultiLayoutCard: ({ label, link, navigateTo, layout }: any) => (
    <div data-testid="multi-layout-card" data-label={label} data-layout={layout}>
      {label}
    </div>
  ),
}));

describe("DocumentLibraryLayout", () => {
  const description = "Sample description";
  const documents = [
    { file_name: "File 1", file_url: "https://example.com/file1" },
    { file_name: "File 2", file_url: "https://example.com/file2" },
  ];
  const navigateTo = jest.fn();

  it("renders the document library layout component", () => {
    render(
      <DocumentLibraryLayout
        description={description}
        documents={[]}
        navigateTo={navigateTo}
      />
    );

    expect(screen.getByText("Sample description")).toBeInTheDocument();
  });

  it("renders LayoutTab with correct activeLayout prop", () => {
    render(
      <DocumentLibraryLayout
        description={description}
        documents={[]}
        navigateTo={navigateTo}
      />
    );

    expect(screen.getByTestId("layout-tab")).toHaveTextContent("Active: list");
  });

  it("renders MultiLayoutCard components for each document", () => {
    render(
      <DocumentLibraryLayout
        description={description}
        documents={documents}
        navigateTo={navigateTo}
      />
    );

    const cards = screen.getAllByTestId("multi-layout-card");
    expect(cards).toHaveLength(documents.length);

    documents.forEach((doc, idx) => {
      expect(cards[idx]).toHaveTextContent(doc.file_name);
      expect(cards[idx]).toHaveAttribute("data-layout", "list");
    });
  });

  it("changes layout when LayoutTab triggers handleLayout", () => {
    render(
      <DocumentLibraryLayout
        description={description}
        documents={documents}
        navigateTo={navigateTo}
      />
    );

    const layoutTabButton = screen.getByTestId("layout-tab");

    expect(layoutTabButton).toHaveTextContent("Active: list");

    fireEvent.click(layoutTabButton);

    expect(layoutTabButton).toHaveTextContent("Active: grid");

    const cards = screen.getAllByTestId("multi-layout-card");
    cards.forEach((card) => {
      expect(card).toHaveAttribute("data-layout", "grid");
    });
  });

  it("renders nothing when documents array is empty", () => {
    render(
      <DocumentLibraryLayout
        description={description}
        documents={[]}
        navigateTo={navigateTo}
      />
    );
    expect(screen.queryAllByTestId("multi-layout-card")).toHaveLength(0);
  });
});
