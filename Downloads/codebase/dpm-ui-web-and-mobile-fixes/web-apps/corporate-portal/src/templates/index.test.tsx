import React from "react";
import { render, screen } from "@testing-library/react";
import { Template } from "./index";

jest.mock("./product", () => ({
  ProductsTemplate: ({ data }: { data: any }) => (
    <div data-testid="ProductsTemplate">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("./NewsArticle", () => ({
  NewsArticleTemplate: ({ data }: { data: any }) => (
    <div data-testid="NewsArticleTemplate">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("./SMEProduct", () => ({
  SMEProductTemplate: ({ data }: { data: any }) => (
    <div data-testid="SMEProductTemplate">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("./CorporateProduct", () => ({
  CorporateProductTemplate: ({ data }: { data: any }) => (
    <div data-testid="CorporateProductTemplate">{JSON.stringify(data)}</div>
  ),
}));

describe("Template component", () => {
  const sampleData = { id: 42, name: "Sample Data" };

  it("renders ProductsTemplate by default", () => {
    render(<Template data={sampleData} />);
    const element = screen.getByTestId("ProductsTemplate");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(JSON.stringify(sampleData));
  });

  it("renders ProductsTemplate when templateType is 'product'", () => {
    render(<Template templateType="product" data={sampleData} />);
    const element = screen.getByTestId("ProductsTemplate");
    expect(element).toBeInTheDocument();
  });

  it("renders NewsArticleTemplate when templateType is 'newsArticle'", () => {
    render(<Template templateType="newsArticle" data={sampleData} />);
    expect(screen.getByTestId("NewsArticleTemplate")).toBeInTheDocument();
  });

  it("renders SMEProductTemplate when templateType is 'smeProduct'", () => {
    render(<Template templateType="smeProduct" data={sampleData} />);
    expect(screen.getByTestId("SMEProductTemplate")).toBeInTheDocument();
  });

  it("renders CorporateProductTemplate when templateType is 'corporateProduct'", () => {
    render(<Template templateType="corporateProduct" data={sampleData} />);
    expect(screen.getByTestId("CorporateProductTemplate")).toBeInTheDocument();
  });
});
