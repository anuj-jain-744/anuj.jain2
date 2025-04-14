import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ServicesTab from "./ServiceTab";
import { useCommonContext } from "@dpm/shared-module";

// Mock the useCommonContext hook if necessary
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

describe("ServicesTab", () => {
  const mockNavigateTo = jest.fn();

  const servicesData = {
    "Service 1": {
      "SubTab 1": [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
      "SubTab 2": [{ id: 3, name: "Item 3" }],
    },
    "Service 2": {
      "SubTab 1": [{ id: 4, name: "Item 4" }],
    },
  };

  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });
  });

  test("renders correctly with provided services data", async () => {
    render(
      <ServicesTab servicesData={servicesData} navigateTo={mockNavigateTo} />
    );

    // Check if the first service toggle is rendered
    expect(screen.getByText("Service 1")).toBeInTheDocument();
    expect(screen.getByText("Service 2")).toBeInTheDocument();

    // Click on a service toggle
    fireEvent.click(screen.getByText("Service 1"));

    // Check if the correct sub-tabs are rendered
    expect(screen.getByText("SubTab 1")).toBeInTheDocument();
    expect(screen.getByText("SubTab 2")).toBeInTheDocument();

    // Click on a sub-tab and check the content
    fireEvent.click(screen.getByText("SubTab 1"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    // Ensure the carousel has the correct content
    const carousel = screen.getByRole("list");
    expect(carousel).toBeInTheDocument();
  });

  test('shows "No items available" if no data exists', () => {
    render(<ServicesTab servicesData={{}} navigateTo={mockNavigateTo} />);

    // Check if the "No items available" message is shown
    expect(
      screen.getByText("No items available for this tab.")
    ).toBeInTheDocument();
  });

  test("handles resizing and mobile view correctly", async () => {
    render(
      <ServicesTab servicesData={servicesData} navigateTo={mockNavigateTo} />
    );

    // Simulate window resize to mobile
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));

    await waitFor(() => {
      // Verify that the carousel is responsive
      const carousel = screen.getByRole("list");
      expect(carousel).toBeInTheDocument();
    });
  });

  test("displays loading message when services data is empty initially", () => {
    render(<ServicesTab servicesData={null} navigateTo={mockNavigateTo} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows the correct button group in carousel", () => {
    render(
      <ServicesTab servicesData={servicesData} navigateTo={mockNavigateTo} />
    );

    // Test for the previous and next buttons in the carousel
    expect(screen.getByTestId("carouselButtonPrevious")).toBeInTheDocument();
    expect(screen.getByTestId("carouselButtonNext")).toBeInTheDocument();
  });
});
