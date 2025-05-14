import React from "react";
import { render } from "@testing-library/react";
import { DocumentLibraryLayout } from "./index";

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
        documents={documents}
        navigateTo={navigateTo}
      />
    );

    // Add your assertions here
  });
});
