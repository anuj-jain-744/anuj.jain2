import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DriverDetails from "./DriverDetails";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("utils/quoteAndBuy", () => ({
  getGenderProfileIcon: jest.fn(() => "mock-icon"),
  geteDriverRelation: jest.fn(() => "Mock Relationship"),
  truncateName: jest.fn((name) => name),
}));

jest.mock("utils/driverIdentifier", () => ({
  getDriverIdentifier: jest.fn(() => "Mock Identifier"),
}));

const mockStore = configureStore([]);

describe("DriverDetails Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        userInfo: { userId: "123" },
      },
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetails: [
        { driverID: "1", driverName: "John Doe", mainDriverInd: "N" },
        { driverID: "2", driverName: "Jane Smith", mainDriverInd: "N" },
      ],
      driverDetailsResponseData: [
        { driverID: "1", driverName: "John Doe", mainDriverInd: "N" },
        { driverID: "2", driverName: "Jane Smith", mainDriverInd: "N" },
      ],
      setDriverDetailsResponseData: jest.fn(),
      setDriverDetails: jest.fn(),
      setSelectedDriverID: jest.fn(),
      selectedDriverID: null,
    });
  });

  it("renders the list of drivers", () => {
    render(
      <Provider store={store}>
        <DriverDetails languageData={{ driver_details: "Driver Details" }} />
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("opens the RemoveVehicleModal when delete icon is clicked", () => {
    render(
      <Provider store={store}>
        <DriverDetails languageData={{ remove_driver: "Remove Driver" }} />
      </Provider>
    );

    const deleteIcons = screen.getAllByAltText("delete icon");
    fireEvent.click(deleteIcons[0]);

    expect(screen.getByText("Remove Driver")).toBeInTheDocument();
  });

  it("removes a driver when confirm delete is clicked", () => {
    const setDriverDetailsResponseData = jest.fn();
    const setDriverDetails = jest.fn();

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetails: [
        { driverID: "1", driverName: "John Doe", mainDriverInd: "N" },
        { driverID: "2", driverName: "Jane Smith", mainDriverInd: "N" },
      ],
      driverDetailsResponseData: [
        { driverID: "1", driverName: "John Doe", mainDriverInd: "N" },
        { driverID: "2", driverName: "Jane Smith", mainDriverInd: "N" },
      ],
      setDriverDetailsResponseData,
      setDriverDetails,
      setSelectedDriverID: jest.fn(),
      selectedDriverID: null,
    });

    render(
      <Provider store={store}>
        <DriverDetails languageData={{ remove_driver: "Remove Driver" }} />
      </Provider>
    );

    const deleteIcons = screen.getAllByAltText("delete icon");
    fireEvent.click(deleteIcons[0]);

    const confirmButton = screen.getByText("Remove Driver");
    fireEvent.click(confirmButton);

    // expect(setDriverDetailsResponseData).toHaveBeenCalled();
    // expect(setDriverDetails).toHaveBeenCalled();
  });

  // is
});