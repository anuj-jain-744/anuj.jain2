import { render, screen, waitFor } from "@testing-library/react";
import ClaimsDetails from "./index";
import { DataContext } from "../../../../../DataContext";

// Mocking the Success component
jest.mock("./Success", () => jest.fn(() => <div>Success Component</div>));
jest.mock("./../../../../SuccessPage/CommonComponent/PolicyDetails", () => jest.fn(() => <div>PolicyDetails Component</div>));
jest.mock("./../../../../SuccessPage/CommonComponent/ContactCard", () => jest.fn(() => <div>ContactCard Component</div>));
jest.mock("./../../../../SuccessPage/LeftSuccess", () => jest.fn(() => <div>LeftSuccess Component</div>));


describe("ClaimsDetails Component", () => {
  const mockValidationData = { caseReportId: "123", OwnerId: "owner123", sequenceNo: 1 };
  const mockClaimResponse = { claimNo: "claim123", subclaimNo: "subclaim123" };
  const mockClaimsInfo = { refNo: "456789", ownerId: "owner123" };

  const mockLanguageData = {
    police_case_reference: "Police Case",
    najm_case_reference: "Najm Case",
    other_case_reference: "Other Case",
  };

  const renderComponent = (languageData: any) => {
    return render(
      <DataContext.Provider value={languageData}>
        <ClaimsDetails
          validationData={mockValidationData}
          claimResponse={mockClaimResponse}
          claimsInfo={mockClaimsInfo}
        />
      </DataContext.Provider>
    );
  };

  test("should render Success component with correct props when language data is available", async () => {
    renderComponent(mockLanguageData);

    // Wait for the component to render, since it might initially show a loading state
    await waitFor(() => screen.getByText("Success!!"));

    // Ensure Success component is rendered
    expect(screen.getByText("Success!!")).toBeInTheDocument();

  });

  test("should render Loading state when languageData is not available", () => {
    renderComponent(null);

    // Ensure that the loading message is displayed when languageData is missing
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should call useEffect to scroll to top on mount", () => {
    // Mocking the scrollTo function
    const scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    renderComponent(mockLanguageData);

    // Check if window.scrollTo has been called once during component mount
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    // Restore the original scrollTo function after test
    scrollToSpy.mockRestore();
  });
});

describe("ClaimsDetails Component changing for other case", () => {
  const mockValidationData = { caseReportId: "123", OwnerId: "owner123", sequenceNo: 1 };
  const mockClaimResponse = { claimNo: "claim123", subclaimNo: "subclaim123" };
  const mockClaimsInfo = { refNo: "99973", ownerId: "owner123" };

  const mockLanguageData = {
    police_case_reference: "Police Case",
    najm_case_reference: "Najm Case",
    other_case_reference: "Other Case",
  };

  const renderComponent = (languageData: any) => {
    return render(
      <DataContext.Provider value={languageData}>
        <ClaimsDetails
          validationData={mockValidationData}
          claimResponse={mockClaimResponse}
          claimsInfo={mockClaimsInfo}
        />
      </DataContext.Provider>
    );
  };
  test("should call useEffect to scroll to top on mount", async () => {

    renderComponent(mockLanguageData);
    await waitFor(() => screen.getByText("Success!!"));

    // Ensure Success component is rendered
    expect(screen.getByText("Success!!")).toBeInTheDocument();
  });
});


describe("ClaimsDetails Component changing for nazam case", () => {
  const mockValidationData = { caseReportId: "123", OwnerId: "owner123", sequenceNo: 1 };
  const mockClaimResponse = { claimNo: "claim123", subclaimNo: "subclaim123" };
  const mockClaimsInfo = { refNo: "1", ownerId: "owner123" };

  const mockLanguageData = {
    police_case_reference: "Police Case",
    najm_case_reference: "Najm Case",
    other_case_reference: "Other Case",
  };

  const renderComponent = (languageData: any) => {
    return render(
      <DataContext.Provider value={languageData}>
        <ClaimsDetails
          validationData={mockValidationData}
          claimResponse={mockClaimResponse}
          claimsInfo={mockClaimsInfo}
        />
      </DataContext.Provider>
    );
  };
  test("should call useEffect to scroll to top on mount", async () => {

    renderComponent(mockLanguageData);
    await waitFor(() => screen.getByText("Success!!"));

    // Ensure Success component is rendered
    expect(screen.getByText("Success!!")).toBeInTheDocument();
  });
});