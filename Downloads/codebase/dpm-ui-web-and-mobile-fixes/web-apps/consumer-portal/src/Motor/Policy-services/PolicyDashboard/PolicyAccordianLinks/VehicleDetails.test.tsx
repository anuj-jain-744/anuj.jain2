import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleDetails from './VehicleDetails';
import { useNavigate } from "react-router-dom";
import { callAPI } from "@dpm/shared-module";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('constant');
jest.mock('@dpm/shared-module', () => ({
    capitalizeNameFirstLetter:  jest.fn((name) => name.charAt(0).toUpperCase() + name.slice(1)),
    callAPI: jest.fn(),
  sanitizeHtml: jest.fn((html) => html),
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));
jest.mock("utils/getPlateNumber", () => ({ getPlateNumber: jest.fn(() => "ABC-1234") }));
jest.mock("utils/getModelIcon", () => ({ getModelIcon: jest.fn(() => "verticalLine") }));

// Mocking the assets used in the component
jest.mock('assets/PolicyDetails/carIconNissan.svg', () => 'carIconNissan');
jest.mock('assets/PolicyDetails/carIconMercedes.svg', () => 'carIconBenz');
jest.mock('assets/PolicyDetails/verticleLine.svg', () => 'verticalLine');

describe('VehicleDetails Component', () => {
    const mockNavigate=jest.fn();
    const defaultProps = {
      registrationPlateNo: "8707",
      registrationPlateText: "T - ط",
      vehicleMakeText: "Hyundai",
      vehicleModelText: "النترا",
      vehicleMakeTextEn: "Hyundai",
      vehicleModelTextEn: "Elantra",
      chassisNo: "KMHD841F8HU106605",
      typeOfChassis: "N/A",
      vehicleSequenceNo: "716706510",
      vehicleCustomID: "N/A",
      yearOfManufacture: 2017,
      vehicleColor: "Gray",
      transmission: "xyz",
      serialNo: "N/A",
      registrationPlateText1: "T - ط",
      registrationPlateText2: "",
      registrationPlateText3: "J - ح",
      repairCondition: "Workshop Repair",
      languageData:{
        changeToSequenceNumber:"Change to seq no",
        vehicle_sequence:"vehicle sequence no.",
        chassis_no: 'chassis no.',
        type_of_chassis: 'chassis type',
        year_of_manufacture:"year of manufacture",
        serial_no:"serial no",
        vehicle_color:" vehicle color",
        transmission:"transmission",
        custom_card_no:"Custom card no."

      },
      details:{
        vehicleDetails:[{vehicleCustomID:"123"}]
      }
    };
   const mockResponse={motor_makes:{abc:'abc'}}
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
         (callAPI as jest.Mock).mockResolvedValue(mockResponse);
      });

    it('renders without crashing', () => {
        render(<VehicleDetails {...defaultProps} />);
        expect(screen.getByText(/Hyundai/i)).toBeInTheDocument();
    });


    it('renders ViewField components with correct labels and values', () => {
        render(<VehicleDetails {...defaultProps} />);

        expect(screen.getByText(/chassis no./i)).toBeInTheDocument();
        expect(screen.getByText(/KMHD841F8HU106605/i)).toBeInTheDocument();


        expect(screen.getByText(/year of manufacture/i)).toBeInTheDocument();
        expect(screen.getByText(/2017/i)).toBeInTheDocument();

    });

    it('renders Benz icon when car model is Benz', () => {
        render(<VehicleDetails {...{ ...defaultProps, carModel: 'Benz' }} />);
        
        const benzIcon = screen.getByAltText('logo');
        expect(benzIcon).toHaveAttribute('src', 'verticalLine');
    });

    it('renders Nissan icon when car model is Nissan', () => {
        render(<VehicleDetails {...defaultProps} />);
        
        const nissanIcon = screen.getByAltText('logo');
        expect(nissanIcon).toHaveAttribute('src', 'verticalLine');
    });
});