import React from "react";
import { render, screen } from "@testing-library/react";
import Endorsement from "./endorsement";
import { useEndorsementAddBenefitApi } from "./hook/useEndorsementAddBenefit";
import { useReviewPolicy } from "./../../Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import { callAPI } from "@dpm/shared-module";

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
  data: {
    model: {
      vehicles: Vehicle[];
    };
  };
};

type PolicyRisk = {
  vehicleModel: string;
  plateNo: string;
  manufactureYear: string;
  vehicleColour: number;
  chassisNo: string;
  vehicleSequenceNo: string;
};

type PolicyData = {
  policyBasic: {
    policyNumber: string;
    effectiveDate: string;
    expiryDate: string;
  };
  policyLob: Array<{
    policyRisk: PolicyRisk[];
  }>;
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
const mockedCallAPI = callAPI as jest.MockedFunction<typeof callAPI>;

const mockBenefitData: BenefitData = {
  data: {
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
  },
};

const mockPolicyData: PolicyData = {
  policyBasic: {
    policyNumber: "POL123456",
    effectiveDate: "2024-01-01",
    expiryDate: "2025-01-01",
  },
  policyLob: [
    {
      policyRisk: [
        {
          vehicleModel: "Nissan Altima",
          plateNo: "ABC123",
          manufactureYear: "2022",
          vehicleColour: 0,
          chassisNo: "CHAS123456",
          vehicleSequenceNo: "1",
        },
      ],
    },
  ],
};

describe("Endorsement Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
      data: mockPolicyData,
    });

    mockedCallAPI.mockResolvedValue({
      config: [
        {
          manage_drivers: "Manage Drivers",
          change_vehicle_information: "Change Vehicle Information",
          choose_extra_benefits_add: "Choose Extra Benefits",
        },
      ],
    });
  });

  // test("renders main endorsement sections", async () => {
  //   render(<Endorsement policyNo={undefined} navigateTo={undefined} />);
  //   expect(screen.getByText(/POL123456/i)).toBeInTheDocument();
  // });

  test("handles APIs", async () => {
    mockedUseReviewPolicy.mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: "API Error",
      data: null,
    });

    render(<Endorsement policyNo={undefined} navigateTo={undefined} />);
  });
});
