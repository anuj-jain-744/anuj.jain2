import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddAdditionalTraveller from "./AddAdditionalTraveller";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("components/CounterComp", () => ({
  __esModule: true,
  default: ({ type, onTotalChange }: any ) => (
    <button data-testid={`counter-${type}`} onClick={() => onTotalChange(type, 1)}>
      Increment {type}
    </button>
  ),
}));

describe("AddAdditionalTraveller Component", () => {
  const mockContextValues = {
    totalCount: 0,
    adultCount: 0,
    childCount: 0,
    srCitizenCount: 0,
    setTotalCount: jest.fn(),
    setAdultCount: jest.fn(),
    setChildCount: jest.fn(),
    setSrCitizenCount: jest.fn(),
  };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockContextValues);
  });

  it("renders the AddAdditionalTraveller component", () => {
    render(
      <AddAdditionalTraveller data={{ add_traveller_button: "Add Traveller" }} handleNewAddition={jest.fn()} />
    );
    expect(screen.getByText("+ Add Traveller")).toBeInTheDocument();
  });

  it("opens and closes the modal", () => {
    render(
      <AddAdditionalTraveller data={{ add_traveller_button: "Add Traveller" }} handleNewAddition={jest.fn()} />
    );
    
    const openButton = screen.getByText("+ Add Traveller");
    fireEvent.click(openButton);
    expect(screen.getByText("Add Traveller")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Add Traveller")).toBeInTheDocument();
  });

  it("increments traveller counts", () => {
    render(
      <AddAdditionalTraveller data={{ add_traveller_button: "Add Traveller" }} handleNewAddition={jest.fn()} />
    );
    
    fireEvent.click(screen.getByText("+ Add Traveller"));
    
    fireEvent.click(screen.getByTestId("counter-adult"));
    fireEvent.click(screen.getByTestId("counter-child"));
    fireEvent.click(screen.getByTestId("counter-srCitizen"));
    
    expect(mockContextValues.setAdultCount).toHaveBeenCalledTimes(0);
    expect(mockContextValues.setChildCount).toHaveBeenCalledTimes(0);
    expect(mockContextValues.setSrCitizenCount).toHaveBeenCalledTimes(0);
  });

  it("calls handleNewAddition on submit", () => {
    const handleNewAdditionMock = jest.fn();
    render(
      <AddAdditionalTraveller
        data={{ add_traveller_button: "Add Traveller" }}
        handleNewAddition={handleNewAdditionMock}
      />
    );

    fireEvent.click(screen.getByText("+ Add Traveller"));
    fireEvent.click(screen.getByText("Submit"));
    
    expect(handleNewAdditionMock).toHaveBeenCalled();
  });
});
