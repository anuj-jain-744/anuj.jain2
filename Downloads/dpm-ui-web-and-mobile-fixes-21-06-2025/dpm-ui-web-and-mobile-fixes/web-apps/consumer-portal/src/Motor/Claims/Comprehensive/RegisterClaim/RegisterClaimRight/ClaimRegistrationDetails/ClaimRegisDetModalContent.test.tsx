// ClaimRegisDetModalContent.test.tsx
import { render, screen } from "@testing-library/react";
import ClaimRegisDetModalContent from "./ClaimRegisDetModalContent"; // Adjust the import path
import { DataContext } from "../../../../../../DataContext"; // Adjust the import path

// Mock the DataContext to provide the necessary values
const mockData = {
  popup_subtitle_one: "<b>Test Subtitle One</b>",
  popup_body_content_one: [
    { value: "Item 1 in body content one" },
    { value: "Item 2 in body content one" },
  ],
  popup_subtitle_two: "<b>Test Subtitle Two</b>",
  popup_body_content_two: [
    { value: "Item 1 in body content two" },
    { value: "Item 2 in body content two" },
  ],
};

const renderWithContext = (contextValue: any) => {
  return render(
    <DataContext.Provider value={contextValue}>
      <ClaimRegisDetModalContent />
    </DataContext.Provider>
  );
};

describe('ClaimRegisDetModalContent', () => {
  test('renders subtitles and lists correctly', () => {
    renderWithContext(mockData);

    // Test if the subtitle one is rendered correctly
    expect(screen.getByText(/Test Subtitle One/)).toBeInTheDocument();

    // Test if the first body content item is rendered
    expect(screen.getByText("Item 1 in body content one")).toBeInTheDocument();
    expect(screen.getByText("Item 2 in body content one")).toBeInTheDocument();

    // Test if subtitle two is rendered correctly
    expect(screen.getByText(/Test Subtitle Two/)).toBeInTheDocument();

    // Test if the first body content item in the second list is rendered
    expect(screen.getByText("Item 1 in body content two")).toBeInTheDocument();
    expect(screen.getByText("Item 2 in body content two")).toBeInTheDocument();
  });

  test('renders the link in the last item of popup_body_content_two', () => {
    renderWithContext(mockData);

    // Ensure the link is in the last item of the second list
    const link = screen.getByText("Walaa.com");
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://motorclaims.walaa.com/');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  test('renders HTML content correctly using dangerouslySetInnerHTML', () => {
    renderWithContext(mockData);

    // Test if the subtitle content is correctly rendered as HTML
    const subtitleOne = screen.getByText("Test Subtitle One");
    expect(subtitleOne).toBeInTheDocument();
  });
});
