import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactCard,{ContactSection,SupportSection} from "./ContactCard"; // Adjust import path as necessary
import { BrowserRouter as Router } from "react-router-dom"; // Wrap the component with Router
import { Provider } from "react-redux"; // Wrap with Provider for Redux store
import { createStore } from "redux"; // Create a simple mock Redux store
import { IconsSet } from "@dpm/corporate-portal/src/utils/icons"; // Import your icons if necessary

// Mock Redux store for testing
const mockState = {
  headerMenuLanguage: {
    languageData: {
      4: {
        childrens: [
          { attributes: { class: ["mobile-icon"] }, linkName: "Mobile Label", menuUrl: "tel:+123456789" },
          { attributes: { class: ["whatsapp-icon"] }, linkName: "WhatsApp Label", menuUrl: "https://wa.me/123456789" },
          { attributes: { class: ["email-icon"] }, linkName: "Email Label", menuUrl: "mailto:test@example.com" },
          { attributes: { class: ["branch-icon"] }, linkName: "Branch Label", menuUrl: "/branch" },
          { attributes: { class: ["feedback-icon"] }, linkName: "Feedback Label", menuUrl: "/feedback" },
        ],
      },
    },
  },
  dashbaordLanguageData: {
    languageData: {
      please_get_in_touch_with_us: "Please get in touch with us",
    },
  },
};

const mockStore = createStore(() => mockState);

jest.mock("@dpm/corporate-portal/src/utils/icons", () => ({
  IconsSet: {
    "mobile-icon": "mock-mobile-icon-path",
    "whatsapp-icon": "mock-whatsapp-icon-path",
    "email-icon": "mock-email-icon-path",
    "branch-icon": "mock-branch-icon-path",
    "feedback-icon": "mock-feedback-icon-path",
  },
}));

// Mocking useNavigate from react-router-dom
const mockNavigate = jest.fn();

// Mocking window.open
global.open = jest.fn();

// Test the ContactCard component
describe("ContactCard", () => {
  it("renders contact information correctly", () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <ContactCard />
        </Router>
      </Provider>
    );

    // Check if the main title is rendered
    expect(screen.getByText("Please get in touch with us")).toBeInTheDocument();

    // Verify if support sections are rendered correctly
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Label")).toBeInTheDocument();
    expect(screen.getByText("Email Label")).toBeInTheDocument();
    expect(screen.getByText("Branch Label")).toBeInTheDocument();
    expect(screen.getByText("Feedback Label")).toBeInTheDocument();
  });

  it("calls handleNavigate when a contact item is clicked", () => {
    // Mock navigate function
    render(
      <Provider store={mockStore}>
        <Router>
          <ContactCard />
        </Router>
      </Provider>
    );

    // Simulate click on the mobile number (which should call handleNavigate)
    fireEvent.click(screen.getByText("Mobile"));

    // Verify that the navigation was called with the correct URL
    waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("tel:+123456789"));
  });

  it("opens external URLs in a new tab (mailto or wa.me)", () => {
    render(
      <Provider store={mockStore}>
        <Router>
          <ContactCard />
        </Router>
      </Provider>
    );

    // Click on the WhatsApp label
    fireEvent.click(screen.getByText("WhatsApp Label"));

    // Verify that the external URL (wa.me) opens in a new tab
    expect(window.open).toHaveBeenCalledWith("https://wa.me/123456789", "_blank");
  });
});

// Test SupportSection Component
describe("SupportSection", () => {
  it("displays the correct mobile label and number", () => {
    const mockData = {
      mobile: {
        imageURL: "mobile-icon",
        label: "Mobile Label",
        linkURL: "tel:+123456789",
      },
      whatsapp: {
        imageURL: "whatsapp-icon",
        label: "WhatsApp Label",
        linkURL: "https://wa.me/123456789",
      },
      email: {
        imageURL: "email-icon",
        label: "Email Label",
        linkURL: "mailto:test@example.com",
      },
      branch: {
        imageURL: "branch-icon",
        label: "Branch Label",
        linkURL: "/branch",
      },
      feedback: {
        imageURL: "feedback-icon",
        label: "Feedback Label",
        linkURL: "/feedback",
      },
    };

    render(
      <SupportSection contactData={mockData} handleNavigate={mockNavigate} />
    );

    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("handles navigation for mobile click", () => {
    const mockData = {
      mobile: {
        imageURL: "mobile-icon",
        label: "Mobile Label",
        linkURL: "tel:+123456789",
      },
      whatsapp: {
        imageURL: "whatsapp-icon",
        label: "WhatsApp Label",
        linkURL: "https://wa.me/123456789",
      },
      email: {
        imageURL: "email-icon",
        label: "Email Label",
        linkURL: "mailto:test@example.com",
      },
      branch: {
        imageURL: "branch-icon",
        label: "Branch Label",
        linkURL: "/branch",
      },
      feedback: {
        imageURL: "feedback-icon",
        label: "Feedback Label",
        linkURL: "/feedback",
      },
    };

    render(
      <SupportSection contactData={mockData} handleNavigate={mockNavigate} />
    );

    fireEvent.click(screen.getByText("WhatsApp Label"));
   waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("https://wa.me/123456789")) 
  });
});
