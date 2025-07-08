import React from "react";
import { render, screen } from "@testing-library/react";
import { WalaaObjective } from "./index";
import { useCommonContext } from "@dpm/shared-module";

// Mock the carousel and button group
jest.mock("react-multi-carousel", () => ({ children, ...rest }: any) => (
  <div data-testid="mock-carousel">{children}</div>
));
jest.mock("../../Sustainability/buttonGroup", () => ({
  ButtonGroup: () => <div data-testid="mock-button-group" />,
}));

// Mock the context
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

describe("WalaaObjective Component", () => {
  const sampleCards = [
    { icon: "/icon1.png", alt: "icon 1", description: "Description 1" },
    { icon: "/icon2.png", alt: "icon 2", description: "Description 2" },
    { icon: "/icon3.png", alt: "icon 3", description: "Description 3" },
    { icon: "/icon4.png", alt: "icon 4", description: "Description 4" },
  ];

  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({ currentLanguage: "en" });
  });

  it("renders component with title and cards", () => {
    render(<WalaaObjective title="Our Goals" cards={sampleCards} />);

    expect(screen.getByText("Our Goals")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Description/).length).toBeGreaterThan(0);
  });

  it("renders correctly in RTL when language is Arabic", () => {
    (useCommonContext as jest.Mock).mockReturnValue({ currentLanguage: "ar" });
    render(<WalaaObjective title="أهدافنا" cards={sampleCards} />);
    expect(screen.getByText("أهدافنا")).toBeInTheDocument();
  });

  it("renders message when cards array is empty", () => {
    render(<WalaaObjective title="Empty Case" cards={[]} />);
    expect(screen.getByText("No items to display")).toBeInTheDocument();
  });

  it("renders without crashing with enableTransition = false", () => {
    render(<WalaaObjective title="Without Transition" cards={sampleCards} enableTransition={false} />);
    expect(screen.getByText("Without Transition")).toBeInTheDocument();
  });
});