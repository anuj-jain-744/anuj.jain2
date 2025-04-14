import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TravellerInfoSuccess from "./TravellerInfoSuccess";


describe("TravellerInfoSuccess Component", () => {
    it("should render the component without crashing", () => {
      const mockLanguageData = {
        travellerType: "Traveller Type",
        noOfTravellers: "Number of Travellers",
      };
  
      const { container } = render(
        <TravellerInfoSuccess
          travellerType="Solo"
          noOfTravellers={1}
          languageData={mockLanguageData}
        />
      );
  
      expect(container).toBeInTheDocument();
    });
  
    it("should display the correct traveller type", () => {
      const mockLanguageData = {
        travellerType: "Traveller Type",
        noOfTravellers: "Number of Travellers",
      };
  
      const { getByText } = render(
        <TravellerInfoSuccess
          travellerType="Solo"
          noOfTravellers={1}
          languageData={mockLanguageData}
        />
      );
  
      expect(getByText("Traveller Type")).toBeInTheDocument();
      expect(getByText("Solo")).toBeInTheDocument();
    });
  
    it("should display the correct number of travellers", () => {
      const mockLanguageData = {
        travellerType: "Traveller Type",
        noOfTravellers: "Number of Travellers",
      };
  
      const { getByText } = render(
        <TravellerInfoSuccess
          travellerType="Solo"
          noOfTravellers={3}
          languageData={mockLanguageData}
        />
      );
  
      expect(getByText("Number of Travellers")).toBeInTheDocument();
      expect(getByText("3")).toBeInTheDocument();
    });
  
    it("should render empty strings when props are null or undefined", () => {
      const mockLanguageData = {
        travellerType: "Traveller Type",
        noOfTravellers: "Number of Travellers",
      };
  
      const { getByText } = render(
        <TravellerInfoSuccess
          travellerType={null}
          noOfTravellers={undefined}
          languageData={mockLanguageData}
        />
      );
    
      waitFor(() => {  
        expect(getByText("Traveller Type")).toBeInTheDocument();
      expect(getByText("")).toBeInTheDocument();
      expect(getByText("Number of Travellers")).toBeInTheDocument();
      expect(getByText("")).toBeInTheDocument();
    });
      
    });
  
    it("should render correctly with languageData props", () => {
      const mockLanguageData = {
        travellerType: "Type of Traveller",
        noOfTravellers: "Travellers Count",
      };
  
      const { getByText } = render(
        <TravellerInfoSuccess
          travellerType="Group"
          noOfTravellers={5}
          languageData={mockLanguageData}
        />
      );
  
      expect(getByText("Type of Traveller")).toBeInTheDocument();
      expect(getByText("Group")).toBeInTheDocument();
      expect(getByText("Travellers Count")).toBeInTheDocument();
      expect(getByText("5")).toBeInTheDocument();
    });
  });