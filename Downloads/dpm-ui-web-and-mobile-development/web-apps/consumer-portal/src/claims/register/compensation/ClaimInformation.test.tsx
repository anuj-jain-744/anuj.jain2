import React from "react";
import { render } from "@testing-library/react";
import { DataContext } from "../../../DataContext";
import ClaimInformation from "../../../claims/register/compensation/ClaimInformation";
import iconCar from "../../../assets/Claims/Car.svg";

describe("ClaimInformation", () => {
  it("renders correctly with context data", () => {
    const mockData = {
      police_case_reference: "Police Case Reference",
      owner_id_label: "Owner ID Label",
      vehicle_sequence: "Vehicle Sequence",
    };

    const mockProps = {
      validationData: {
        caseReportId: "Case Report ID",
        ownerId: "Owner ID",
        sequenceNo: "Sequence No",
      },
    };

    const { getByText, getByAltText } = render(
      <DataContext.Provider value={null}>
        <ClaimInformation {...mockProps} />
      </DataContext.Provider>
    );

    expect(getByText("Police Case Reference")).toBeInTheDocument();
    expect(getByText("Case Report ID")).toBeInTheDocument();
    expect(getByText("Owner ID Label")).toBeInTheDocument();
    expect(getByText("Owner ID")).toBeInTheDocument();
    expect(getByText("Vehicle Sequence")).toBeInTheDocument();
    expect(getByText("Sequence No")).toBeInTheDocument();
    expect(getByAltText("type icon")).toHaveAttribute("src", iconCar);
  });
});