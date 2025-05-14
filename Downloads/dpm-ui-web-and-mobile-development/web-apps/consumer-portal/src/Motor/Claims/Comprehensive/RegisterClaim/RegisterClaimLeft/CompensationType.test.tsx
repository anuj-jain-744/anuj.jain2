import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompensationType from './CompensationType';  // Ensure correct path
import { DataContext } from "../../../../../DataContext";

// Mocking CompensationTypeCardRadio child component
jest.mock('./Components/CompensationTypeCardRadio', () => {
  return jest.fn(({ radioname, isradioSelected, changeHandler }) => (
    <div
      data-testid={radioname}
      className={`compensation-type-card ${isradioSelected ? 'selected' : ''}`}
      onClick={() => changeHandler({ target: { name: radioname } })}
    >
      {radioname}
    </div>
  ));
});

describe('CompensationType Component', () => {
  const mockChangeHandler = jest.fn();

  const mockDataContext = {
    bank_transfer: "Bank Transfer",
    damage_repair: "Damage Repair"
  };

  it('should render the CompensationType component with radio buttons', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <CompensationType
          isBankTransferSelected={false}
          isDamageRepairSelected={false}
          changeHandler={mockChangeHandler}
        />
      </DataContext.Provider>
    );

    // Check if radio buttons are rendered with correct labels
    expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    expect(screen.getByText('Damage Repair')).toBeInTheDocument();
  });

  it('should call changeHandler when Bank Transfer radio button is clicked', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <CompensationType
          isBankTransferSelected={false}
          isDamageRepairSelected={false}
          changeHandler={mockChangeHandler}
        />
      </DataContext.Provider>
    );

    // Simulate a click event on the "Bank Transfer" radio button
    fireEvent.click(screen.getByText('Bank Transfer'));

    // Ensure changeHandler was called with correct arguments
    expect(mockChangeHandler).toHaveBeenCalledWith({
      target: { name: 'Bank Transfer' }
    });
  });

  it('should call changeHandler when Damage Repair radio button is clicked', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <CompensationType
          isBankTransferSelected={false}
          isDamageRepairSelected={false}
          changeHandler={mockChangeHandler}
        />
      </DataContext.Provider>
    );

    // Simulate a click event on the "Damage Repair" radio button
    fireEvent.click(screen.getByText('Damage Repair'));

    // Ensure changeHandler was called with correct arguments
    expect(mockChangeHandler).toHaveBeenCalledWith({
      target: { name: 'Damage Repair' }
    });
  });

  it('should render Bank Transfer as selected when isBankTransferSelected is true', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <CompensationType
          isBankTransferSelected={true}
          isDamageRepairSelected={false}
          changeHandler={mockChangeHandler}
        />
      </DataContext.Provider>
    );

    // Check if the "Bank Transfer" radio button is selected
    const bankTransferButton = screen.getByText('Bank Transfer');
    expect(bankTransferButton).toHaveClass('selected');
  });

  it('should render Damage Repair as selected when isDamageRepairSelected is true', () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <CompensationType
          isBankTransferSelected={false}
          isDamageRepairSelected={true}
          changeHandler={mockChangeHandler}
        />
      </DataContext.Provider>
    );

    // Check if the "Damage Repair" radio button is selected
    const damageRepairButton = screen.getByText('Damage Repair');
    expect(damageRepairButton).toHaveClass('selected');
  });
});
