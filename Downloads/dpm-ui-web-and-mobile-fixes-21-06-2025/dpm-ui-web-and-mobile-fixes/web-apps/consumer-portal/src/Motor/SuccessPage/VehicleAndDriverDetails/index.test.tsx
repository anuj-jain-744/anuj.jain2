import React from "react";
import { render, screen } from "@testing-library/react";
import VehicleAndDriverDetails from "./index";

jest.mock("assets/SuccessPage/Nissan.svg", () => "nissan.svg");
jest.mock("assets/SuccessPage/Download.svg", () => "download.svg");
jest.mock("assets/QuoteAndBuy/driver.svg", () => "driver.svg");

const langData = {
  sponsor_name: "Sponsor Name",
  driver_name: "Driver Name",
  iqama_no: "Iqama No",
  relationship: "Relationship",
  not_applicable: "N/A",
  endorsement_schedule: "Endorsement Schedule",
  payment_receipt: "Payment Receipt",
};

const data = {
  policyDataDetail: {
    policyCard: {
      customerNameEnglish: "John Doe",
    },
  },
  benefits: {
    drivers: [
      { driverName: "Driver 1", driverID: "12345" },
      { driverName: "Driver 2", driverID: "67890" },
    ],
  },
};

describe("VehicleAndDriverDetails component", () => {
  test("renders vehicle and sponsor details", () => {
    render(<VehicleAndDriverDetails langData={langData} data={data} />);
    
    expect(screen.getByText("Nissan Magnite XE")).toBeInTheDocument();
    expect(screen.getByText("7403 - RUA")).toBeInTheDocument();
    expect(screen.getByText(langData.sponsor_name)).toBeInTheDocument();
    expect(screen.getByText(data.policyDataDetail.policyCard.customerNameEnglish)).toBeInTheDocument();
  });

  test("renders driver details", () => {
    render(<VehicleAndDriverDetails langData={langData} data={data} />);
    
    data.benefits.drivers.forEach((driver) => {
      expect(screen.getByText(driver.driverName)).toBeInTheDocument();
      expect(screen.getByText(driver.driverID)).toBeInTheDocument();
    });

    expect(screen.getAllByText(langData.relationship)[0]).toBeInTheDocument();
    expect(screen.getAllByText(langData.not_applicable)[0]).toBeInTheDocument();
  });

  test("renders download section", () => {
    render(<VehicleAndDriverDetails langData={langData} data={data} />);

    expect(screen.getByText(langData.endorsement_schedule)).toBeInTheDocument();
    expect(screen.getByText(langData.payment_receipt)).toBeInTheDocument();
  });
});
