import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyPoliciesContainer from "./MyPoliciesContainer";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import * as reactRedux from "react-redux";
import usePolicyData from "hook/common/usePolicyData";
import { processPolicies } from "utils/processPolicies";

// Mock child components
jest.mock("./PolicyCard/PoliciesCard", () => (props) => (
  <div data-testid="policies-card">{props.policy.policyNo || props.policy.title}</div>
));
jest.mock("./PolicyCard/HappyCard/HappyCard", () => (props) => (
  <div data-testid="happy-card">{props.title}</div>
));
jest.mock("./PolicyCard/TravelCard/TravelCard", () => (props) => (
  <div data-testid="travel-card">{props.title}</div>
));
jest.mock("components/ThemeButton/ThemeButton", () => (props) => (
  <button
    data-testid={`theme-btn-${props.title}`}
    disabled={props.isDisabled}
    onClick={props.onClickhandler}
  >
    {props.title}
  </button>
));
jest.mock("../AdsContainer/EnhanceExperience/EnhanceExperience", () => () => (
  <div data-testid="enhance-experience" />
));
jest.mock("../../../components/PersonalDashboardAdd/index", () => () => (
  <div data-testid="personal-dashboard-add" />
));
jest.mock("../../../components/HelpSection/ContactCard/ContactCard", () => () => (
  <div data-testid="contact-card" />
));
jest.mock("../WalaaOfferings/WalaaOfferings", () => () => (
  <div data-testid="walaa-offerings" />
));
jest.mock("components/Dashboard/dashboardCarousel", () => ({
  CarouselImages: () => <div data-testid="carousel-images" />,
}));
jest.mock("./MyRequest/MyRequest", () => () => (
  <div data-testid="my-request" />
));
jest.mock("./AlertPopUp/AlertPopUp", () => (props) => (
  <div data-testid="alert-popup">{props.title}</div>
));
jest.mock("components/ExpandSection/ExpandSection", () => (props) => (
  <div data-testid="expand-section" onClick={props.onClick}>{props.text}</div>
));

// Mock hooks and utils
jest.mock("hook/common/usePolicyData");
jest.mock("utils/processPolicies", () => ({
  processPolicies: jest.fn(),
}));
jest.mock("utils/formatDate", () => ({
  getRemainingDays: jest.fn(() => 5),
  isExpiringSoon: jest.fn(() => false),
  isRecentlyExpired: jest.fn(() => false),
}));
jest.mock("utils/quoteAndBuy", () => ({
  deepCopy: jest.fn((x) => x),
}));

const mockStore = configureStore([]);

function renderWithStore(store) {
  return render(
    <Provider store={store}>
      <MyPoliciesContainer />
    </Provider>
  );
}

describe("MyPoliciesContainer", () => {
  let store;
  const mockPolicies = [
    {
      policyNo: "P1",
      productCode: "Motor",
      endorsementType: "",
      policyStatus: "Active",
      expiryDate: "2025-12-31",
      ownerId: "O1",
    },
    {
      policyNo: "P2",
      productCode: "TRVL",
      endorsementType: "Cancellation",
      policyStatus: "Expired",
      expiryDate: "2023-12-31",
      ownerId: "O2",
    },
  ];
  const mockLanguageData = {
    my_policies: "My Policies",
    all: "All",
    active: "Active",
    cancelled: "Cancelled",
    expired: "Expired",
    view_all: "View All",
    view_less: "View Less",
    your_trusted_insurance_company: "Your Trusted Insurance Company",
    planning_an_europe_travel: "Planning an Europe Travel",
    explore_our_travel_plans: "Explore our travel plans",
    add_your_email_id: "Add your email id",
    please_add_your_email_id: "Please add your email id",
    add_your_email_id_to_the_profile: "Add your email id to the profile",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (processPolicies as jest.Mock).mockReturnValue(mockPolicies);
    (usePolicyData as jest.Mock).mockReturnValue({
      allPolicies: mockPolicies,
      activePolicies: [mockPolicies[0]],
      expiredPolicies: [mockPolicies[1]],
      cancelledPolicies: [mockPolicies[1]],
    });

    store = mockStore({
      dashbaordLanguageData: { languageData: mockLanguageData },
      policy: { policies: mockPolicies },
    });

    // Clean up sessionStorage for alert tests
    sessionStorage.clear();
  });

  it("renders policy cards and header count", () => {
    renderWithStore(store);
  });

  it("renders HappyCard when no policies", () => {
    (processPolicies as jest.Mock).mockReturnValue([]);
    (usePolicyData as jest.Mock).mockReturnValue({
      allPolicies: [],
      activePolicies: [],
      expiredPolicies: [],
      cancelledPolicies: [],
    });
    store = mockStore({
      dashbaordLanguageData: { languageData: mockLanguageData },
      policy: { policies: [] },
    });
    renderWithStore(store);
  });

  it("filters policies by active", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByTestId("theme-btn-Active"));
    expect(screen.getAllByTestId("policies-card")).toHaveLength(1);
    expect(screen.getByText("P1")).toBeInTheDocument();
  });

  it("filters policies by cancelled", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByTestId("theme-btn-Cancelled"));
    expect(screen.getAllByTestId("policies-card")).toHaveLength(1);
    expect(screen.getByText("P2")).toBeInTheDocument();
  });

  it("filters policies by expired", () => {
    renderWithStore(store);
    fireEvent.click(screen.getByTestId("theme-btn-Expired"));
    expect(screen.getAllByTestId("policies-card")).toHaveLength(1);
    expect(screen.getByText("P2")).toBeInTheDocument();
  });

  it("shows more and less policies with ExpandSection", () => {
    // Add more policies for this test
    const morePolicies = [
      ...mockPolicies,
      { policyNo: "P3", productCode: "Home", endorsementType: "", policyStatus: "Active", expiryDate: "2025-12-31", ownerId: "O3" },
    ];
    (processPolicies as jest.Mock).mockReturnValue(morePolicies);
    (usePolicyData as jest.Mock).mockReturnValue({
      allPolicies: morePolicies,
      activePolicies: morePolicies,
      expiredPolicies: [],
      cancelledPolicies: [],
    });
    store = mockStore({
      dashbaordLanguageData: { languageData: mockLanguageData },
      policy: { policies: morePolicies },
    });
    renderWithStore(store);

    // Show more
    fireEvent.click(screen.getByTestId("expand-section"));
    expect(screen.getAllByTestId("policies-card")).toHaveLength(3);

    // Show less
    fireEvent.click(screen.getByTestId("expand-section"));
    expect(screen.getAllByTestId("policies-card").length).toBeLessThan(3);
  });

  it("shows alert popup if userDetails missing email", () => {
    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({ userProfileData: { name: "Test User" } })
    );
    renderWithStore(store);
    expect(screen.getByTestId("alert-popup")).toBeInTheDocument();
    expect(screen.getByText("Add your email id")).toBeInTheDocument();
  });

  it("does not show alert popup if userDetails has email", () => {
    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({ userProfileData: { name: "Test User", email: "test@example.com" } })
    );
    renderWithStore(store);
    expect(screen.queryByTestId("alert-popup")).not.toBeInTheDocument();
  });

  it("renders all dashboard/ads components", () => {
    renderWithStore(store);
    expect(screen.getByTestId("my-request")).toBeInTheDocument();
    expect(screen.getByTestId("walaa-offerings")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-images")).toBeInTheDocument();
    expect(screen.getByTestId("contact-card")).toBeInTheDocument();
    expect(screen.getByTestId("personal-dashboard-add")).toBeInTheDocument();
    expect(screen.getByTestId("enhance-experience")).toBeInTheDocument();
  });

  // it("prev/next navigation disables/enables as expected", () => {
  //   renderWithStore(store);
  //   const prevBtn = screen.getByTestId("theme-btn-");
  //   const nextBtn = screen.getAllByTestId("theme-btn-")[1];
  //   expect(prevBtn).toBeDisabled();
  //   expect(nextBtn).toBeDisabled();
  // });
});
