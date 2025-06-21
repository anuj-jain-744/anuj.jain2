import React from "react";
import { render, screen } from "@testing-library/react";
import VehicleInfo from "./VehicleInfo";
import * as getModelIconModule from "utils/getModelIcon";
import * as commonUtils from "@app-shell/utils/common";
import * as capitalizeUtils from "@dpm/shared-module";

jest.mock("utils/getModelIcon", () => ({
  getModelIcon: jest.fn(),
}));

jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));


jest.mock("@dpm/shared-module", () => ({
  capitalizeNameFirstLetter: jest.fn(),
}));

const mockGetModelIcon = getModelIconModule.getModelIcon as jest.Mock;
const mockGetAmountWithIcon = commonUtils.getAmountWithIcon as jest.Mock;
const mockCapitalize = capitalizeUtils.capitalizeNameFirstLetter as jest.Mock;

const mockPolicyData = {
  vehicleMakeText: "Toyota",
  vehicleModelText: "Corolla",
  plateNumber: "123ABC",
  vehicleMake: "Toyota",
  sumInsured: 50000,
  coverageName: "Comprehensive",
};

const mockLanguageData = {
  repair_type: "Repair Type",
  repair: "Repair",
  sum_insured: "Sum Insured",
};

const mockMakeModelResponse = [
  { image: "car.jpg", model: "Corolla", id: "1" },
];

describe("VehicleInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetModelIcon.mockReturnValue("car.jpg");
    mockGetAmountWithIcon.mockImplementation((val) => `${val}`);
    mockCapitalize.mockImplementation((str) => str.toUpperCase());
  });

  it("renders with full policy data", () => {
    render(
      <VehicleInfo
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        plateNumber="123ABC"
        repairCondition="Garage"
        makeModelResponse={mockMakeModelResponse}
        vehicleMakeTextEn="Toyota"
        vehicleMakeId="1"
      />
    );

    expect(mockGetModelIcon).toHaveBeenCalled();
    expect(screen.getByAltText("car icon")).toHaveAttribute("src", "car.jpg");
    expect(screen.getByText("TOYOTA COROLLA")).toBeInTheDocument();
    expect(screen.getByText("123ABC")).toBeInTheDocument();

    expect(screen.getByText("Repair Type")).toBeInTheDocument();
    expect(screen.getByText("Garage Repair")).toBeInTheDocument();

    expect(screen.getByText("Sum Insured")).toBeInTheDocument();
    expect(screen.getByText("SAR 50000")).toBeInTheDocument();
  });

  it("formats amount only when isAmount is true", () => {
    render(
      <VehicleInfo
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        plateNumber="123ABC"
        repairCondition="Garage"
      />
    );

    expect(mockGetAmountWithIcon).toHaveBeenCalledWith("SAR 50000");
  });
});
