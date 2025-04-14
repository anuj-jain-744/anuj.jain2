import { render, screen, waitFor } from "@testing-library/react";
import ClaimsDetails from "./index";
import { DataContext } from "../../../../../DataContext";
import Success from "./Success";

// Mocking the Success component
jest.mock("./Success", () => jest.fn(() => <div>Success Component</div>));

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
    await waitFor(() => screen.getByText("Success Component"));

    // Ensure Success component is rendered
    expect(screen.getByText("Success Component")).toBeInTheDocument();

    // Ensure the Success component receives the correct props
    expect(Success).toHaveBeenCalledWith(
      expect.objectContaining({
        status: true,
        claimLabel: "Police Case", // Based on the `getCaseRefNoLabel` logic
        claimNo: "claim123",
        validationData: mockValidationData,
        claimsInfo: mockClaimsInfo,
        claimResponse: mockClaimResponse,
      }),
      {}
    );
  });

  test("should render Loading state when languageData is not available", () => {
    renderComponent(null);

    // Ensure that the loading message is displayed when languageData is missing
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should call getCaseRefNoLabel and return correct label for 'POLICE' case", () => {
    const caseRefNoLabel = new ClaimsDetails({
      validationData: mockValidationData,
      claimResponse: mockClaimResponse,
      claimsInfo: mockClaimsInfo,
    }).getCaseRefNoLabel("456789");

    // Test the result of `getCaseRefNoLabel`
    expect(caseRefNoLabel).toBe("Police Case");
  });

  test("should call getCaseRefNoLabel and return correct label for 'NAJM' case", () => {
    const caseRefNoLabel = new ClaimsDetails({
      validationData: mockValidationData,
      claimResponse: mockClaimResponse,
      claimsInfo: mockClaimsInfo,
    }).getCaseRefNoLabel("12345");

    // Test the result of `getCaseRefNoLabel`
    expect(caseRefNoLabel).toBe("Najm Case");
  });

  test("should call getCaseRefNoLabel and return correct label for 'OTHERS' case", () => {
    const caseRefNoLabel = new ClaimsDetails({
      validationData: mockValidationData,
      claimResponse: mockClaimResponse,
      claimsInfo: mockClaimsInfo,
    }).getCaseRefNoLabel("789123");

    // Test the result of `getCaseRefNoLabel`
    expect(caseRefNoLabel).toBe("Other Case");
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
