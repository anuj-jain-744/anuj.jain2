import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Endorsement from "./endorsement";
import { useEndorsementAddBenefitApi } from "./hook/useEndorsementAddBenefit";
import { useReviewPolicy } from "./../../Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import { callAPI } from "@dpm/shared-module";
import mockPolicy from  "./mockPolicy.json";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock('@dpm/shared-module', () => ({
  isValidEmail: jest.fn((email) => email === 'valid@example.com'),
  capitalizeNameFirstLetter:  jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
  callAPI: jest.fn(),
  sanitizeHtml: jest.fn((html) => html),
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));
type Benefit = {
  benefitId: number;
  benefitNameEn: string;
  benefitPrice: number;
  vatAmount: number;
};

type Vehicle = {
  benefits: Benefit[];
};

type BenefitData = {
    model: {
      vehicles: Vehicle[];
    };
};


jest.mock("./hook/useEndorsementAddBenefit");
jest.mock(
  "./../../Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy"
);
jest.mock("@dpm/shared-module");

const mockedUseEndorsementAddBenefitApi =
  useEndorsementAddBenefitApi as jest.MockedFunction<
    typeof useEndorsementAddBenefitApi
  >;
const mockedUseReviewPolicy = useReviewPolicy as jest.MockedFunction<
  typeof useReviewPolicy
>;

const mockBenefitData: BenefitData = {
    model: {
      vehicles: [
        {
          benefits: [
            {
              benefitId: 107001067,
              benefitNameEn: "Death Package",
              benefitPrice: 100.0,
              vatAmount: 15.0,
            },
            {
              benefitId: 107001069,
              benefitNameEn: "Roadside Assistance",
              benefitPrice: 50.0,
              vatAmount: 7.5,
            },
            {
              benefitId: 107001068,
              benefitNameEn: "Accident Coverage",
              benefitPrice: 75.0,
              vatAmount: 11.25,
            },
          ],
        },
      ],
    },
};


describe("Endorsement Component", () => {
   const mockResponse = {
      code: 200,
      config: [{
        endorsement: "Endorsement",
        manage_drivers: 'Manage Drivers',
        manage_vehicles: "Manage vehicles",
        add_benefits: "Add benefits",
        did_you_know_text: "Did You Know",
        did_you_know_content: "<ol><li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li><li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li></ol>",
      }],
    };
  
  beforeEach(() => {
    jest.clearAllMocks();

    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    mockedUseEndorsementAddBenefitApi.mockReturnValue({
      makeAddBenefitApiCall: jest.fn().mockResolvedValue(undefined),
      benefitData: mockBenefitData,
      isLoading: false,
      error: null,
    });

    mockedUseReviewPolicy.mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: null,
      data: mockPolicy,
    });
  });

  test("handles APIs", async () => {

    render(<Endorsement navigateTo={undefined} policyDetailObj={{
      policyNo: "P-ER1-24-330-048631",
      productCode: "Motor"
    }} />);

    sessionStorage.setItem(
      "selectedPolicyNumber",
      "P-ER1-24-330-048631"
    );

    const buttons = screen.getByRole("button");
    expect(buttons).toBeInTheDocument();
    fireEvent.click(buttons);

    const manageDriver = screen.getByText("Back");
    expect(manageDriver).toBeInTheDocument();

  });

  test("handles APIs vehicle color ", async () => {
    render(<Endorsement navigateTo={undefined} policyDetailObj={{
      policyNo: "P-ER1-24-330-048631",
      productCode: "Motor"
    }} />);

    sessionStorage.setItem(
      "selectedPolicyNumber",
      "P-ER1-24-330-048631"
    );
    
    const buttons = screen.getByRole("button");
    expect(buttons).toBeInTheDocument();
    fireEvent.click(buttons);

    const backElem = screen.getByText("Back");
    expect(backElem).toBeInTheDocument();

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith( "get", "undefineden/api/consumerportal-config");
    });

    const manageDriver = screen.getByTestId("test-Manage Drivers");
    expect(manageDriver).toBeInTheDocument();
    fireEvent.click(manageDriver);

    const managevehicles = screen.getByTestId("test-Manage vehicles");
    expect(managevehicles).toBeInTheDocument();
    fireEvent.click(managevehicles);

    const addBenefit = screen.getByTestId("test-Add benefits");
    expect(addBenefit).toBeInTheDocument();
    fireEvent.click(addBenefit);
  });
});
