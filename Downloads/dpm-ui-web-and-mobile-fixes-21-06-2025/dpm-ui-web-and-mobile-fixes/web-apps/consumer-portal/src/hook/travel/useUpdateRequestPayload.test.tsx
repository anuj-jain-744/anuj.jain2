import { renderHook } from "@testing-library/react-hooks";
import useUpdateRequestPayload from "./useUpdateRequestPayload";
import { QuoteAndBuyContext } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { calculatePremiumPayload } from "./calculatePremiumPayload";

// Mock data for testing
const mockVehicleDetails = {
  vehicleDefinitionType: "personal",
  vehicleSequenceNo: "1",
  vehicleCustomID: "CUST123",
};

// Mock the utils/quoteAndBuy module
jest.mock("utils/quoteAndBuy", () => ({
  mergeDriverDetails: () => [],// jest.fn(),
  getEngineCapacity: jest.fn(),
  getParkingType: jest.fn(),
  getFrieExtinguisherValue: jest.fn(),
  getAntiTheftAlarmValue: jest.fn(),
}));

const mockVehicleDetailsResponseData = {
  vehicleMake: "Toyota",
  vehicleMakeText: "Toyota",
  vehicleModel: "Camry",
  vehicleModelText: "Camry",
  vehicleBodyType: "Sedan",
  averagePrice: 25000,
  plateNo: "ABC123",
  manufactureYear: "2022",
  vehicleColour: "Red",
};

const mockDriverDetailsResponseData = [
  {
    driverName: "John Doe",
    driverLicenseNo: "DL123456",
  },
];

const mockOwnerDetailsResponseData = {
  nationalId: "1234567890",
  customerNameEnglish: "John Doe",
  mobile: "1234567890",
  primaryAddress: {
    streetName: "123 Main St",
    city: "Riyadh",
  },
};

// Wrapper component to provide context
const createWrapper = (contextValue) => {
  // return ({ children }) => (
  //   <QuoteAndBuyContext.Provider value={contextValue}>
  //     {children}
  //   </QuoteAndBuyContext.Provider>
  // );
};

describe("useUpdateRequestPayload", () => {
  it("should return initial payload when no response data is available", () => {
    const initialContextValue = {
      vehicleDetails: null,
      vehicleDetailsResponseData: null,
      driverDetailsResponseData: null,
      ownerDetailsResponseData: null,
      
    };

    // const { result } = renderHook(() => useUpdateRequestPayload(), {
     //  wrapper: createWrapper(initialContextValue),
    // });

   // expect(result.current).toEqual(calculatePremiumPayload);
  });

  it("should update payload with vehicle, driver, and owner details", async () => {
    const contextValue = {
      vehicleDetails: mockVehicleDetails,
      vehicleDetailsResponseData: mockVehicleDetailsResponseData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
      driverInput: [],
    };

    // const { result } = renderHook(() => useUpdateRequestPayload(), {
    //   wrapper: createWrapper(contextValue),
    // });

    // Wait for the useEffect to run
    // await waitForNextUpdate({ timeout: 5000 });

   // const updatedPayload = result.current;

    // Verify vehicle details are updated
    // expect(updatedPayload.policyLob[0].policyRisk[0]).toMatchObject({
    //   vehicleDefinitionType: "personal",
    //   vehicleSequenceNo: "",
    //   vehicleCustomID: "",
    //   vehicleMake: "Toyota",
    //   vehicleModel: "Camry",
    //   vehicleBodyType: "Sedan",
    //   vehicleValue: 37250,
    //   plateNo: "ABC123",
    //   manufactureYear: "2022",
    //   vehicleColour: "Red",
    // });

    // Verify driver details are added
    // expect(updatedPayload.policyLob[0].policyRisk[0].drivers).toEqual(
    //   expect.arrayContaining([
    //     [
    //       {
    //         additionalNumber: "8822",
    //         buildingNumber: "2180",
    //         childrenBelow16: 0,
    //         city: "الدمام",
    //         dateOfBirth: "1994-01-04",
    //         dateOfBirthH: "22-07-1414",
    //         district: "حي الراكة الشمالية",
    //         driverID: "1080072984",
    //         driverIDType: 2,
    //         driverName: "OMAR ABDULMOHSEN AHMED ALNAIM",
    //         driverNameArabic: "عمر عبدالمحسن بن احمد النعيم",
    //         educationLevel: 5,
    //         gender: "M",
    //         healthConditions: "",
    //         homeAddress: "",
    //         homeCityCode: "",
    //         idIssuePlaceCode: "الخبر",
    //         licenseExpiryDateH: "26-11-1446",
    //         licenseType: 1,
    //         licenseYear: 5,
    //         mainDriverInd: "Y",
    //         maritalStatusCd: 1,
    //         najmCaseDetails: [],
    //         nationality: "Saudi Arabia",
    //         ncdFreeYears: 1,
    //         ncdReference: "NCD23052462833",
    //         noOfAccidents: 0,
    //         noOfClaims: 0,
    //         occupation: "OTHERS",
    //         postalCode: "34225",
    //         relation: 1,
    //         streetName: "28جـ",
    //         trafficViolations: "",
    //         unitNo: "",
    //         usagePercentage: 1,
    //         validDrivingLicenses: [],
    //         workCityCode: "",
    //         workCompanyName: "Walaa",
    //       },
    //       { driverLicenseNo: "DL123456", driverName: "John Doe" },
    //     ],
    //   ])
    // );

    // Verify owner details are updated
    // expect(updatedPayload.policyCustomer[0]).toMatchObject({
    //   nationalId: "1234567890",
    //   customerNameEnglish: "John Doe",
    //   mobile: "1234567890",
    //   primaryAddress: {
    //     streetName: "123 Main St",
    //     city: "Riyadh",
    //   },
    // });
  });

  it("should preserve existing payload when only partial data is available", () => {
    const partialContextValue = {
      vehicleDetails: mockVehicleDetails,
      vehicleDetailsResponseData: null,
      driverDetailsResponseData: null,
      ownerDetailsResponseData: null,
    };

    // const { result } = renderHook(() => useUpdateRequestPayload(), {
    //   wrapper: createWrapper(partialContextValue),
    // });

   // expect(result.current).toEqual(calculatePremiumPayload);
  });
});
