import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Success from "./index";
import SuccessTopComponent from "./SuccessTopComponent";
import { LanguageData } from "types/languageData";


// Mock child components
interface PolicyDetailsObj {
  policyNumber: string;
  vehicleDetails: {
    name: string;
    plateNumber: string;
    vehicleSequenceNo: string;
    chassisNo: string;
    manufactureYear: number;
  };
  refundValue: string;
}
jest.mock("./SuccessTopComponent", () => jest.fn(() => <div>SuccessTopComponent</div>));
jest.mock("./LeftSuccess", () => jest.fn(({
  data,
  status,
  setLoading,
  loading,
  isCancelSuccess,
  claimData,
  langData,
}:{
  data: PolicyDetailsObj;
  loading?: boolean;
  status: boolean;
  setLoading: (val: boolean) => void;
  isCancelSuccess: boolean;
  claimData?: { [key: string]: unknown };
  langData: LanguageData;
}) => <div onClick={()=>setLoading(false)}>LeftSuccess</div>));
jest.mock("./SuccesRightComponent", () => jest.fn(() => <div>SuccesRightComponent</div>));
jest.mock("components/Footer", () => jest.fn(() => <div>PolicyFooter</div>));

jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: {
      config: {
        field_payment: "",
      }
    },
    errors: null,
    isLoading: false
  }))
}));

describe("Success Component", () => {
  const mockData = {
    policyNumber: "12345",
    vehicleDetails: {
      name: "Car Model",
      plateNumber: "ABC123",
      vehicleSequenceNo: "SEQ123",
      chassisNo: "CHASSIS123",
      manufactureYear: 2020,
    },
    refundValue: "100.00",
  }; // Example data for the prop
  
  test("renders SuccessTopComponent with correct props", () => {
    const status = true;
    const flag = false;

    render(<Success status={status} data={mockData} flag={flag} />);

    // Ensure SuccessTopComponent is rendered with correct props
    expect(screen.getByText("SuccessTopComponent")).toBeInTheDocument();
    expect(SuccessTopComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        status,
        data: mockData,
        flag,
        loading: true,
        typeCode: true
      }),
      {}
    );
    
  });

  test("renders LeftSuccess and SuccesRightComponent with loading state", async () => {
    const status = true;
    const flag = false;

    render(<Success status={status} data={mockData} flag={flag} />);

    // Check if LeftSuccess component is rendered
    expect(screen.getByText("LeftSuccess")).toBeInTheDocument();

    // Initially loading should be true, so SuccesRightComponent should not be rendered
    expect(screen.queryByText("SuccesRightComponent")).not.toBeInTheDocument();

    // Change loading state to false and check if SuccesRightComponent appears
    fireEvent.click(screen.getByText("LeftSuccess")); // Assuming LeftSuccess triggers setLoading
    await waitFor(() => expect(screen.getByText("SuccesRightComponent")).toBeInTheDocument());
  });

  test("renders PolicyFooter when flag is true", () => {
    const status = true;
    const flag = true;

    render(<Success status={status} data={mockData} flag={flag} />);

    // Check if PolicyFooter is rendered when flag is true
    expect(screen.getByText("PolicyFooter")).toBeInTheDocument();
  });

  test("does not render PolicyFooter when flag is false", () => {
    const status = true;
    const flag = false;

    render(<Success status={status} data={mockData} flag={flag} />);

    // Ensure PolicyFooter is not rendered when flag is false
    expect(screen.queryByText("PolicyFooter")).not.toBeInTheDocument();
  });
  test("does not render PolicyFooter when flag is false", () => {
    const status = true;
    sessionStorage.setItem("isRefresh", "true");
    render(<Success status={status} data={mockData} />);

    // Ensure PolicyFooter is not rendered when flag is false
    expect(screen.queryByText("PolicyFooter")).not.toBeInTheDocument();
  });
});
