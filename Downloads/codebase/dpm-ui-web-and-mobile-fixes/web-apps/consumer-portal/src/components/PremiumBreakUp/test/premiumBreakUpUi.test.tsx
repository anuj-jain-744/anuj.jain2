import { render, screen, fireEvent } from "@testing-library/react";
import PremiumBreakUpUi from "../premiumBreakUpUi";

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

const mockProps = {
  title: "Premium Breakdown",
  quoteHeading: "Your Quote",
  schemeCode: null,
  showSchemeCode: true,
  languageData: {
    apply_promo_code: "Apply Promo Code",
    net_premium: "Net Premium",
    sar: "SAR",
  },
  isToggled: false,
  setIsCouponApplied: jest.fn(),
  setIsToggled: jest.fn(),
  data: null,
  premium: 500,
  subTitle: "Details",
  premiumArr: [],
  priceAmount: 1000,
  homePriceAmount: null,
  isHome: false,
  repairTypeSelected: "Standard",
  selectedBenefits: [],
  subtotalAmount: 900,
  vatAmount: 100,
};

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("PremiumBreakUpUi Component", () => {
  test("renders the component with title", () => {
    render(<PremiumBreakUpUi {...mockProps} />);
    expect(screen.getByText("Premium Breakdown")).toBeInTheDocument();
  });

  test("shows apply promo code option when schemeCode is not applied", () => {
    render(<PremiumBreakUpUi {...mockProps} />);
    expect(screen.getByText("Apply Promo Code")).toBeInTheDocument();
  });

  test("toggles promo code switch", () => {
    render(<PremiumBreakUpUi {...mockProps} />);
    const switchElement = screen.getByRole("checkbox");
    fireEvent.click(switchElement);
    expect(mockProps.setIsCouponApplied).toHaveBeenCalledWith(false);
    expect(mockProps.setIsToggled).toHaveBeenCalledWith(true);
  });

  // test("displays net premium amount", () => {
  //   render(<PremiumBreakUpUi {...mockProps} />);
  //   expect(screen.getByText("SAR 500.00")).toBeInTheDocument();
  // });
});
