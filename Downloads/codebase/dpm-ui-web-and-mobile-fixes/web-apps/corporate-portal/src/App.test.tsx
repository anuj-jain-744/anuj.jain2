import { render, screen } from "@testing-library/react";
import App from "./App"; // Import the App component

// Describe block groups related tests together
describe("App Component", () => {
  // Test case to check if the component renders correctly
  test("renders Welcome text", () => {
    // Render the App component
    render(<App />);
    
    // Check if the text "Welcome to Corporate Portal" is displayed
    const welcomeText = screen.getByText(/Welcome to/);
    expect(welcomeText).toBeInTheDocument();
  });

  // Test case to check if the name "Walaa" is displayed
  test("renders user name Walaa", () => {
    render(<App />);
    
    // Check if the name "Walaa" is rendered in the header
    const nameText = screen.getByText(/Walaa/);
    expect(nameText).toBeInTheDocument();
  });

  // Test case to check if the paragraph is rendered correctly
  test("renders lead paragraph", () => {
    render(<App />);
    
    // Check if the paragraph text is displayed
    const paragraphText = screen.getByText(/This is a basic template to get you started/);
    expect(paragraphText).toBeInTheDocument();
  });

  // Test case to check if the span is present inside the header
  test("renders span element inside header", () => {
    render(<App />);
    
    // Check if the <span> element is in the document
    const spanElement = screen.getByText(/Corporate Portal/);
    expect(spanElement).toBeInTheDocument();
  });

  // Test case to check for the app-container class
  test("renders app-container div", () => {
    const { container } = render(<App />);
    
    // Check if the div with class "app-container" exists
    const appContainer = container.querySelector(".app-container");
    expect(appContainer).toBeInTheDocument();
  });
});
