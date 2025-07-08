import { render, screen } from "@testing-library/react";
import BenefitCard from "./BenefitCard";

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn((amount) => amount ? `SAR ${amount}` : 'N/A'),
}));

jest.mock("assets/Home/home_benefits.png", () => 'home-icon');
const onToggle = jest.fn();


describe("BenefitCard Component", () => {
  it('renders a list of coverage description related to code from the array of object', ()=>{
    const items = [
      {'code':'EE', 'description':'Test data'}
    ];
    render(<BenefitCard isHome={false} title="tenant liability" benefitCode="EE" description={items} price="200" isAdded={true} onToggle={onToggle} languageData={{"sar":"SAR"}} />);
    expect(screen.getByText("Test data")).toBeInTheDocument();
  })

  test("renders BenefitCard component", () => {
    render(<BenefitCard isHome={false} title="tenant liability" description="tenant liability" price="200" isAdded={true} onToggle={onToggle} languageData={{"sar":"SAR"}} />);
    const element = screen.getByTestId('benefit-card').querySelector(".card-title-content");
    expect(element).toHaveTextContent('tenant liability');
  });

  test('alt contains correct value', () => {
    render(<BenefitCard isHome={false} title="tenant liability" description="tenant liability" price="200" isAdded={true} onToggle={onToggle} languageData={{"sar":"SAR"}} />);
    const testImage = document.querySelector("img") as HTMLImageElement;
    expect(testImage.alt).toContain("Benefit Icon");
  });

  test('renders component with svg', () => {
    render(<BenefitCard isHome={false} title="tenant liability" description="tenant liability" price="200" isAdded={true} onToggle={onToggle} languageData={{"sar":"SAR"}} />);
    const testImage = screen.getByAltText("Benefit Icon");
    expect(testImage).toHaveAttribute("src", "home-icon");
  })
 });