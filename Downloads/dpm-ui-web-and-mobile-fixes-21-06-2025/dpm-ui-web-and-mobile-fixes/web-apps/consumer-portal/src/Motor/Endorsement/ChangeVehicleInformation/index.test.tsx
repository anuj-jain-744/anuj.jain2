import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChangeVehicleInformation from "./index";
import { DataContext } from "../../../DataContext";

// Mock components
jest.mock("./VehicleInformation", () => (props: any) => (
  <div onClick={() => props.onChangehandler(props.radiokey, !props.isChecked)}>
    {props.titleText}
  </div>
));

jest.mock("./AdditionalVehicle", () => () => <div>Mocked AdditionalVehicle</div>);
jest.mock("./CustomCardVehSequence", () => () => <div>Mocked CustomCardVehSequence</div>);

describe("ChangeVehicleInformation Component", () => {
  const mockData = {
    change_vehicle_information: "Change Vehicle Info",
    change_from_custom_card_no: "Change from Custom Card",
    add_additional_vehicle: "Add Additional Vehicle",
  };

  const renderComponent = () =>
    render(
      <DataContext.Provider value={mockData}>
        <ChangeVehicleInformation />
      </DataContext.Provider>
    );

  test("renders titles and initial component", () => {
    renderComponent();

    expect(screen.getByText("Change Vehicle Info")).toBeInTheDocument();
    expect(screen.getByText("Change from Custom Card")).toBeInTheDocument();
    expect(screen.getByText("Add Additional Vehicle")).toBeInTheDocument();
    expect(screen.getByText("Mocked CustomCardVehSequence")).toBeInTheDocument();
  });

  test("switches to AdditionalVehicle component when selected", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Add Additional Vehicle"));
    expect(screen.getByText("Mocked AdditionalVehicle")).toBeInTheDocument();
  });

  test("switches back to CustomCardVehSequence when 'Change from Custom Card' is selected", () => {
    renderComponent();

    // Toggle to AdditionalVehicle first
    fireEvent.click(screen.getByText("Add Additional Vehicle"));
    expect(screen.getByText("Mocked AdditionalVehicle")).toBeInTheDocument();

    // Toggle back
    fireEvent.click(screen.getByText("Change from Custom Card"));
    expect(screen.getByText("Mocked CustomCardVehSequence")).toBeInTheDocument();
  });
});
