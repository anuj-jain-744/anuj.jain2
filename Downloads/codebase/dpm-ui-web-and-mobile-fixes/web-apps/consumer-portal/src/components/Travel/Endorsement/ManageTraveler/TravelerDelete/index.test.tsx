import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TravelerDelete, { Traveler } from "./index";

const mockData = {
  remove_traveler: "Remove Traveler",
  travel_endorsement_delete_content: "Are you sure you want to remove this traveler?",
  no: "No",
  yes: "Yes",
  remove_button: "Remove"
};

const mockTraveler: Traveler = {
  id: 42,
  name: "John Doe",
  passportNo: "A1234567",
  passportExpiry: "2030-01-01",
  dob: "1980-01-01",
  relation: "Son",
  type: "Adult",
};

describe("TravelerDelete component", () => {
  const handleAlert = jest.fn();
  const travelerDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders delete button with icon", () => {
    render(
      <TravelerDelete
        data={mockData}
        handleAlert={handleAlert}
        travelerDelete={travelerDelete}
        travelerData={mockTraveler}
      />
    );
    const deleteButton = screen.getByRole("button");
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByAltText("Delete Icon")).toBeInTheDocument();
  });

  it("renders delete button with correct alt text and is focusable", () => {
    render(
      <TravelerDelete
        data={mockData}
        handleAlert={handleAlert}
        travelerDelete={travelerDelete}
        travelerData={mockTraveler}
      />
    );
  
    const deleteImg = screen.getByAltText("Delete Icon");
    expect(deleteImg).toBeInTheDocument();
  
    const deleteButton = screen.getByRole("button");
    expect(deleteButton).toBeInTheDocument();
  
    deleteButton.focus();
    expect(deleteButton).toHaveFocus();
  });  

  it("opens modal when delete icon clicked", () => {
    render(
      <TravelerDelete
        data={mockData}
        handleAlert={handleAlert}
        travelerDelete={travelerDelete}
        travelerData={mockTraveler}
      />
    );

    fireEvent.click(screen.getByAltText("Delete Icon"));

    expect(screen.getByText(mockData.remove_traveler)).toBeInTheDocument();
    expect(screen.getByText(mockData.travel_endorsement_delete_content)).toBeInTheDocument();
    expect(screen.getByText(mockData.no)).toBeInTheDocument();
    expect(screen.getByText(`${mockData.yes}, ${mockData.remove_button}`)).toBeInTheDocument();
  });

  it("calls travelerDelete and handleAlert with correct args when Yes button is clicked", () => {
    render(
      <TravelerDelete
        data={mockData}
        handleAlert={handleAlert}
        travelerDelete={travelerDelete}
        travelerData={mockTraveler}
      />
    );

    fireEvent.click(screen.getByAltText("Delete Icon"));

    const yesButton = screen.getByText(`${mockData.yes}, ${mockData.remove_button}`);
    fireEvent.click(yesButton);

    expect(travelerDelete).toHaveBeenCalledTimes(1);
    expect(travelerDelete).toHaveBeenCalledWith(mockTraveler.id);

    expect(handleAlert).toHaveBeenCalledTimes(1);
    expect(handleAlert).toHaveBeenCalledWith(mockTraveler.name);
  });
});
