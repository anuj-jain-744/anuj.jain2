// CompensationTypeCardRadio.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import CompensationTypeCardRadio from "./CompensationTypeCardRadio"; // Adjust the import path accordingly

// Mocking assets
jest.mock("assets/Claims/BankTransfer.png", () => "bankTransferMockImage");
jest.mock("assets/Claims/DamageRepair.png", () => "damageRepairMockImage");

describe('CompensationTypeCardRadio', () => {
  const mockChangeHandler = jest.fn(); // Mocking the change handler function

  it('renders correctly and displays radio button', () => {
    render(
      <CompensationTypeCardRadio
        cardimgname="BankTransfer"
        radiobuttonname="bankTransfer"
        radioname="Bank Transfer"
        isradioSelected={false}
        changeHandler={mockChangeHandler}
      />
    );


    // Check if the radio button is rendered with the test id
    const radioLabel = screen.getByTestId("radio-checkBtn");
    expect(radioLabel).toBeInTheDocument();
  });

  it('should call changeHandler when radio button is clicked', () => {
    render(
      <CompensationTypeCardRadio
        cardimgname="DamageRepair"
        radiobuttonname="damageRepair"
        radioname="Damage Repair"
        isradioSelected={false}
        changeHandler={mockChangeHandler}
      />
    );

    // Find the radio button by test id
    const radioButton = screen.getByTestId("radio-checkBtn");

    // Simulate a change event (click)
    fireEvent.click(radioButton);

    // Check if the change handler was called once
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('should apply active class when radio button is selected', () => {
    render(
      <CompensationTypeCardRadio
        cardimgname="BankTransfer"
        radiobuttonname="bankTransfer"
        radioname="Bank Transfer"
        isradioSelected={true}
        changeHandler={mockChangeHandler}
      />
    );

    // Check if the "card-active" class is applied when the radio button is selected
    const card = screen.getByRole("img").closest("div"); // Get the closest div which is the card
    expect(card).toHaveClass("card-active");
  });

  it('should apply inactive class when radio button is not selected', () => {
    render(
      <CompensationTypeCardRadio
        cardimgname="DamageRepair"
        radiobuttonname="damageRepair"
        radioname="Damage Repair"
        isradioSelected={false}
        changeHandler={mockChangeHandler}
      />
    );

    // Check if the "card-inactive" class is applied when the radio button is not selected
    const card = screen.getByRole("img").closest("div"); // Get the closest div which is the card
    expect(card).toHaveClass("card-inactive");
  });
});
