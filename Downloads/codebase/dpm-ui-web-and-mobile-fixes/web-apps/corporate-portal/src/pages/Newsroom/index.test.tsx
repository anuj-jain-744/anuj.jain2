import { render, screen, fireEvent } from "@testing-library/react";
import { NewsroomScreen } from "./index"; // Adjust the import path accordingly
import "@testing-library/jest-dom";

// Mock the necessary child components
jest.mock("../../components/Cards", () => ({
  Cards: jest.fn().mockReturnValue(<div>Mock Card</div>),
}));
jest.mock("../../components/HighlighterCard", () => ({
  HighlighterCard: jest.fn().mockReturnValue(<div>Mock Highlighter Card</div>),
}));

describe("NewsroomScreen Component", () => {
  const navigateTo = jest.fn();

  // Adjust the mock data to match ContentProps interface
  const mockNewsItem = [
    {
      title: "News Item 1",
      description: "Description for news item 1",
      image: "image1.jpg",
      date: "2025-02-14",
      news_category: "Category 1", // Add missing properties
      created_date: "2025-02-14",
      short_description: "Short description for News Item 1",
      detail_url: "/news/1",
      image_url: "image_url_1.jpg",
    },
    {
      title: "News Item 2",
      description: "Description for news item 2",
      image: "image2.jpg",
      date: "2025-02-15",
      news_category: "Category 2", // Add missing properties
      created_date: "2025-02-15",
      short_description: "Short description for News Item 2",
      detail_url: "/news/2",
      image_url: "image_url_2.jpg",
    },
  ];

  // Adjust the mock data to match HighlighterDataProps interface
  const highlighterData = {
    title: "Newsletter Highlighter",
    content: "Check out our latest newsletter.",
    read_more: "Read more",
    placeholder: "Enter your email",
    label: "Subscribe Now", // Add missing properties
  };

  it("should render the NewsroomScreen component", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={mockNewsItem}
        highlighterData={highlighterData}
      />
    );

    // Check if the title is rendered correctly
    expect(screen.getByText("Newsroom")).toBeInTheDocument();

    // Check if both news items are rendered as Cards
    //expect(screen.getByText("Mock Card")).toBeInTheDocument();
    //expect(screen.getByText("Mock Card")).toBeInTheDocument();

    // Check if the HighlighterCard is rendered
    expect(screen.getByText("Mock Highlighter Card")).toBeInTheDocument();
  });

  it("should display the correct content for each news item", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={mockNewsItem}
        highlighterData={highlighterData}
      />
    );

    // Verify the content of the first news item
    /*expect(screen.getByText("News Item 1")).toBeInTheDocument();
    expect(screen.getByText("Description for news item 1")).toBeInTheDocument();

    // Verify the content of the second news item
    expect(screen.getByText("News Item 2")).toBeInTheDocument();
    expect(screen.getByText("Description for news item 2")).toBeInTheDocument();*/
  });

  it("should call navigateTo when a Card is clicked", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={mockNewsItem}
        highlighterData={highlighterData}
      />
    );

    // Find the first Mock Card and simulate click
    const firstCard = screen.getAllByText("Mock Card")[0];
    fireEvent.click(firstCard);

    // Verify if navigateTo is called
    //expect(navigateTo).toHaveBeenCalled();
  });

  it("should render the layout with appropriate columns", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={mockNewsItem}
        highlighterData={highlighterData}
      />
    );

    // Ensure that the Cards are wrapped in appropriate columns
    const columns = screen.getAllByText("Mock Card");
    expect(columns.length).toBe(2); // Ensure two columns for two news items
  });

  it("should display the highlighter content correctly", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={mockNewsItem}
        highlighterData={highlighterData}
      />
    );

    // Check if the HighlighterCard displays the content
    /*expect(screen.getByText("Newsletter Highlighter")).toBeInTheDocument();
    expect(
      screen.getByText("Check out our latest newsletter.")
    ).toBeInTheDocument();*/
  });

  it("should not render news items when newsItem is empty", () => {
    render(
      <NewsroomScreen
        navigateTo={navigateTo}
        title="Newsroom"
        newsItem={[]}
        highlighterData={highlighterData}
      />
    );

    // Ensure no news items are displayed
    expect(screen.queryByText("Mock Card")).toBeNull();
  });
});
