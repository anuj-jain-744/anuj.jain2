import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { GetQuoteWidget } from "./index";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

jest.mock('../../constant', () => ({
  VITE_BACKEND_BASE_URL: 'https://mocked.url',
}));

describe("GetQuoteWidget Component", () => {
  const mockSetShowCardFooter = jest.fn();

  const mockProducts = {
    ProductA: [
      {
        product_name: "Product A",
        button_text: "Get Quote",
        class_name: "product-a",
        form_fields: [],
      },
    ],
    ProductB: [
      {
        product_name: "Product B",
        button_text: "Get Quote",
        class_name: "product-b",
        form_fields: [],
      },
    ],
  };

  const setup = (multiProduct = true) => {
    render(
      <GetQuoteWidget
        products={mockProducts}
        multiProduct={multiProduct}
        setShowCardFooter={mockSetShowCardFooter}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with multiple products", () => {
    setup();

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

});
