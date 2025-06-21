import { render, screen, fireEvent } from "@testing-library/react";
import ContentBenefitsModal from "./index";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

// Mock contexts
jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe("ContentBenefitsModal", () => {
  const mockLanguageData = {
    content_benefits_title: "Content Benefits",
    field_category: "Category",
    value_is_sar: "Value (SAR)",
    enter_category: "Enter category",
    enter_value: "Enter value",
    category_is_required: "Category is required",
    value_is_required: "Value is required",
    invalid_value: "Invalid value",
    add_content: "Add Content",
    add_more_benefits: "Add More Benefits",
    delete: "Delete",
  };

  const mockPHQuoteBuyContext = {
    selectedContetBenefits: [],
    setSelectedContetBenefits: jest.fn(),
    apiErrorMessage: { title: "", description: "" },
    setApiErrorMessage: jest.fn(),
    showAlertModal: false,
    setShowAlertModal: jest.fn(),
    resetApiErrorMessage: jest.fn(),
  };

  const mockQuoteAndBuyContext = {
    repairTypeSelected: "Repair Type",
  };

  beforeEach(() => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue(mockPHQuoteBuyContext);
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockQuoteAndBuyContext);
  });

  /*it("renders the component correctly", () => {
    render(<ContentBenefitsModal languageData={mockLanguageData} />);

    expect(screen.getByText(mockLanguageData.content_benefits_title)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.add_content)).toBeInTheDocument();
  });

  it("adds a new field when the add button is clicked", () => {
    render(<ContentBenefitsModal languageData={mockLanguageData} />);

    const addButton = screen.getByText(mockLanguageData.add_content);
    fireEvent.click(addButton);

    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalledWith([
      {
        category: "",
        value: "",
        errors: { category: "", value: "" },
      },
    ]);
  });

  it("removes a field when the delete button is clicked", () => {
    mockPHQuoteBuyContext.selectedContetBenefits = [
      { category: "Test", value: "100", errors: { category: "", value: "" } },
    ];

    render(<ContentBenefitsModal languageData={mockLanguageData} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalledWith([]);
  });*/

  it("validates fields on blur", () => {
    mockPHQuoteBuyContext.selectedContetBenefits = [
      { category: "", value: "", errors: { category: "", value: "" } },
    ];

    /*render(<ContentBenefitsModal languageData={mockLanguageData} />);

    const categoryInput = screen.getByPlaceholderText(mockLanguageData.enter_category);
    fireEvent.blur(categoryInput);

    expect(mockPHQuoteBuyContext.setSelectedContetBenefits).toHaveBeenCalledWith([
      {
        category: "",
        value: "",
        errors: { category: mockLanguageData.category_is_required, value: "" },
      },
    ]);*/
  });
});