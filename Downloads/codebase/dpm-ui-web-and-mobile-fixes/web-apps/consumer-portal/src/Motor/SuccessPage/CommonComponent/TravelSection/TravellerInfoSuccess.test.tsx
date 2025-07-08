import React from "react";
import { render } from "@testing-library/react";
import TravellerInfoSuccess from "./TravellerInfoSuccess";

describe("TravellerInfoSuccess Component", () => {
  const mockLanguageData = {
    travellerType: "Traveller Type",
    noOfTravellers: "Number of Travellers",
  };

  it("renders correctly with given props", () => {
    const { getByText, getByAltText } = render(
      <TravellerInfoSuccess
        travellerType="Business"
        noOfTravellers={3}
        languageData={mockLanguageData}
      />
    );

    // Check if travellerType is rendered
    expect(getByText("Traveller Type")).toBeInTheDocument();
    expect(getByText("Business")).toBeInTheDocument();

    // Check if noOfTravellers is rendered
    expect(getByText("Number of Travellers")).toBeInTheDocument();
    expect(getByText("3")).toBeInTheDocument();

    // Check if images are rendered
    expect(getByAltText("Travel")).toBeInTheDocument();
    expect(getByAltText("Line")).toBeInTheDocument();
  });

  it("renders empty values when props are null or undefined", () => {
    const { getByText } = render(
      <TravellerInfoSuccess
        travellerType={null}
        noOfTravellers={0}
        languageData={mockLanguageData}
      />
    );

    // Check if empty values are rendered
    expect(getByText("Traveller Type")).toBeInTheDocument();

    expect(getByText("Number of Travellers")).toBeInTheDocument();
    expect(getByText("0")).toBeInTheDocument();
  });
  
  it("renders correctly when languageData is missing", () => {
    const { queryByText } = render(
      <TravellerInfoSuccess
        travellerType="Business"
        noOfTravellers={3}
        languageData={null as any}
      />
    );

    // Check if languageData keys are not rendered
    expect(queryByText("Traveller Type")).not.toBeInTheDocument();
    expect(queryByText("Number of Travellers")).not.toBeInTheDocument();

    // Check if values are still rendered
    expect(queryByText("Business")).toBeInTheDocument();
    expect(queryByText("3")).toBeInTheDocument();
  });

  it("renders correctly with large number of travellers", () => {
    const { getByText } = render(
      <TravellerInfoSuccess
        travellerType="Group"
        noOfTravellers={123}
        languageData={mockLanguageData}
      />
    );

    // Check if large number of travellers is rendered correctly
    expect(getByText("Traveller Type")).toBeInTheDocument();
    expect(getByText("Group")).toBeInTheDocument();

    expect(getByText("Number of Travellers")).toBeInTheDocument();
    expect(getByText("123")).toBeInTheDocument();
  });

  it("renders correctly with special characters in travellerType", () => {
    const { getByText } = render(
      <TravellerInfoSuccess
        travellerType="VIP & Special"
        noOfTravellers={5}
        languageData={mockLanguageData}
      />
    );

    // Check if special characters are rendered correctly
    expect(getByText("Traveller Type")).toBeInTheDocument();
    expect(getByText("VIP & Special")).toBeInTheDocument();

    expect(getByText("Number of Travellers")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();
  });
});
