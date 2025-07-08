import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TravelerSenior from "./index";

// Mocks
jest.mock("../../../../../corporate-portal/src/components/Calendar/fullcalender", () => ({
  FullCalender: ({ setValue }: any) => (
    <input
      type="date"
      data-testid="mock-calendar"
      onChange={(e) => setValue(e.target.value)}
    />
  ),
}));

jest.mock("../../TravelerAddDetails/info", () => () => <span data-testid="info-icon">i</span>);

jest.mock("../../../assets/Travel/Delete.svg", () => "delete-icon.svg");

// Sample props
const mockData = {
  traveller_name: "Name",
  traveller_passport_no: "Passport No",
  traveller_passport_exp_date: "Passport Expiry Date",
  traveller_passport_exp_date_placeholder: "Select passport expiry date",
  traveller_dob: "Date of Birth",
  traveller_dob_placeholder: "Select DOB",
  traveller_relation: "Relation",
  relations: ["Spouse", "Parent"],
  sr_citizen_title: "Senior Citizen",
  sr_citizen_info: "Senior citizen travel insurance applies.",
  benfit_title: "Additional Benefits",
  benfit_sports: "Winter Sports",
  benfit_sports_info: "Coverage for skiing etc.",
  benfit_covid: "Covid Coverage",
  benfit_covid_info: "Covid-related medical expenses",
  add_button: "Add",
  remove_button: "Remove",
  incomplete: "Incomplete",
};

describe("TravelerSenior", () => {
  it("renders without crashing and displays accordion header", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    expect(screen.getByText(/Senior Citizen 1/i)).toBeInTheDocument();
  });

  it("renders traveler input fields and allows input changes", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    const nameInput = screen.getByPlaceholderText("Enter Name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput).toHaveValue("John Doe");
  });

  it("toggles accordion open and close", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    const accordionHeader = screen.getByText(/Senior Citizen 1/i);
    fireEvent.click(accordionHeader);
  });

  it("renders Info icons and benefits section", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    expect(screen.getAllByTestId("info-icon").length).toBeGreaterThan(0);
    expect(screen.getByText(/Winter Sports/i)).toBeInTheDocument();
    expect(screen.getByText(/Covid Coverage/i)).toBeInTheDocument();
  });

  it("toggles winter benefit correctly", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    waitFor(() => {
      const addBtn = screen.getByText(/Add/i);
      fireEvent.click(addBtn);
      expect(screen.getByText(/Remove/i)).toBeInTheDocument();
    });
  });

  it("toggles covid benefit correctly", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    const covidAddBtn = screen.getAllByText(/Add/i)[1];
    fireEvent.click(covidAddBtn);
    expect(screen.getAllByText(/Remove/i).length).toBeGreaterThan(0);
  });

  it("selects passport and dob dates", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    const calendarInputs = screen.getAllByTestId("mock-calendar");
    fireEvent.change(calendarInputs[0], { target: { value: "2025-04-08" } });
    fireEvent.change(calendarInputs[1], { target: { value: "1950-01-01" } });
  });

  it("renders relation select options", () => {
    render(<TravelerSenior noOfsrCitizens={1} data={mockData} />);
    expect(screen.getByText("Spouse")).toBeInTheDocument();
    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("renders multiple seniors when noOfsrCitizens > 1", () => {
    render(<TravelerSenior noOfsrCitizens={2} data={mockData} />);
    expect(screen.getAllByText(/Senior Citizen/i).length).toBe(4);
  });
});
