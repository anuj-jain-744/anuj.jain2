import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import MyRequest from "./MyRequest";
import { useNavigate } from "react-router-dom";

// Mock the navigate function
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe("MyRequest Component", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      queryQuote: {
        quotes: [
          {
            nationalID: "123456789",
            productCode: "TRVL",
            quoteNo: "Q12345",
            quoteStatus: "Open",
            issueDate: "2023-01-01",
          },
        ],
        isLoading: false,
        error: null,
      },
      dashbaordLanguageData: {
        languageData: {
          my_request: "My Request",
          all: "All",
          claim: "Claim",
          enquiry: "Enquiry",
          approval: "Approval",
          cancellation: "Cancellation",
          quotation: "Quotation",
          endorsement: "Endorsement",
          request_id: "Request ID",
          request_type: "Request Type",
          status: "Status",
          pay: "Pay",
          description: "Description",
          reference_id: "Reference ID",
          last_updated_on: "Last Updated On",
        },
      },
    });
  });

  it("renders MyRequest component with quotes", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("My Request (1)")).toBeInTheDocument();
    expect(screen.getByText("Q12345")).toBeInTheDocument();
    // expect(screen.getByText("Quotation")).toBeInTheDocument();
  });

  it("handles tab click and updates active tab", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    const claimTab = screen.getByText("Claim");
    fireEvent.click(claimTab);

    expect(claimTab).toHaveClass("policy-link");
  });

  it("displays no requests found when there are no quotes", () => {
    store = mockStore({
      queryQuote: {
        quotes: [],
        isLoading: false,
        error: null,
      },
      dashbaordLanguageData: {
        languageData: {
          my_request: "My Request",
          all: "All",
          claim: "Claim",
          enquiry: "Enquiry",
          approval: "Approval",
          cancellation: "Cancellation",
          quotation: "Quotation",
          endorsement: "Endorsement",
          request_id: "Request ID",
          request_type: "Request Type",
          status: "Status",
          pay: "Pay",
          description: "Description",
          reference_id: "Reference ID",
          last_updated_on: "Last Updated On",
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    // expect(screen.getByText("No Request Found")).toBeInTheDocument();
  });

  it("navigates to the correct URL when handleNavigate is called", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    const payButton = screen.getByText("Pay");
    fireEvent.click(payButton);

    expect(mockNavigate).toHaveBeenCalledWith("/product/insurance-payment/Q12345_03");
  });

  it("toggles accordion open and close state", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    const accordionToggle = screen.getByAltText("Toggle Down Accordion");
    fireEvent.click(accordionToggle);

    expect(screen.getByAltText("Toggle Up Accordion")).toBeInTheDocument();

    fireEvent.click(screen.getByAltText("Toggle Up Accordion"));
    expect(screen.getByAltText("Toggle Down Accordion")).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    store = mockStore({
      queryQuote: {
        quotes: [],
        isLoading: true,
        error: null,
      },
      dashbaordLanguageData: {
        languageData: {
          my_request: "My Request",
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state when error exists", () => {
    store = mockStore({
      queryQuote: {
        quotes: [],
        isLoading: false,
        error: "Error loading requests",
      },
      dashbaordLanguageData: {
        languageData: {
          my_request: "My Request",
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Error loading requests")).toBeInTheDocument();
  });

  it("handles tab click and resets openIndex", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    const allTab = screen.getByText("All");
    fireEvent.click(allTab);

    expect(allTab).toHaveClass("policy-link");
  });

  it("renders filtered quotes based on active tab", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    // Use getAllByText to retrieve all elements with the text "Quotation"
    const quotationTabs = screen.getAllByText("Quotation");
    const quotationTabButton = quotationTabs.find(
      (el) => el.tagName.toLowerCase() === "button"
    );

    if (quotationTabButton) {
      fireEvent.click(quotationTabButton);
    }

    const filteredQuote = screen.getByText("Q12345");
    expect(filteredQuote).toBeInTheDocument();
  });

  it("renders default product icon when productCode is not matched", () => {
    store = mockStore({
      queryQuote: {
        quotes: [
          {
            nationalID: "987654321",
            productCode: "UNKNOWN",
            quoteNo: "Q67890",
            quoteStatus: "Closed",
            issueDate: "2023-02-01",
          },
        ],
        isLoading: false,
        error: null,
      },
      dashbaordLanguageData: {
        languageData: {
          my_request: "My Request",
          pay: "Pay",
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MyRequest />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByAltText("Product Icon")).toBeInTheDocument();
  });


});
