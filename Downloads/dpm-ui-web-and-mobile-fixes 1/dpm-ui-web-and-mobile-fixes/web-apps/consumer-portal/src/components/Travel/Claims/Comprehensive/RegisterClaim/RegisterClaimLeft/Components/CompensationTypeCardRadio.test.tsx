import { render, screen, fireEvent } from '@testing-library/react';
import CompensationTypeCardRadio from './CompensationTypeCardRadio';  
import BankTransfer from 'assets/Claims/BankTransfer.png'; 
import DamageRepair from 'assets/Claims/DamageRepair.png'; 

describe('CompensationTypeCardRadio', () => {
  const mockChangeHandler = jest.fn();

  const defaultProps = {
    cardimgname: 'BankTransfer',
    radiobuttonname: 'bankTransfer',
    radioname: 'Bank Transfer',
    isradioSelected: false,
    changeHandler: mockChangeHandler,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the card with the correct image and radio button', () => {
    render(<CompensationTypeCardRadio {...defaultProps} />);

    // Check if the correct image is displayed
    const cardImage = screen.getByRole('img');
    expect(cardImage).toHaveAttribute('src', BankTransfer);  // BankTransfer image should be loaded

    // Check if the radio button is displayed with the correct label
    const radioButton = screen.getByLabelText('Bank Transfer');
    expect(radioButton).toBeInTheDocument();
  });

  it('renders the correct image for DamageRepair', () => {
    const props = { ...defaultProps, cardimgname: 'DamageRepair' };
    render(<CompensationTypeCardRadio {...props} />);

    // Check if the correct image is displayed when 'DamageRepair' is passed
    const cardImage = screen.getByRole('img');
    expect(cardImage).toHaveAttribute('src', DamageRepair);  // DamageRepair image should be loaded
  });

  it('applies correct class when radio is selected or not', () => {
    const { rerender } = render(<CompensationTypeCardRadio {...defaultProps} />);

    // Check if initial class is correct when the radio is not selected
    let card = screen.getByRole('img').parentElement?.parentElement;
    expect(card).toHaveClass('card-inactive');

    // Now select the radio button and check if the class changes
    rerender(
      <CompensationTypeCardRadio {...defaultProps} isradioSelected={true} />
    );
    card = screen.getByRole('img').parentElement?.parentElement;
    expect(card).toHaveClass('card-active');
  });

  it('calls changeHandler when radio button is clicked', () => {
    render(<CompensationTypeCardRadio {...defaultProps} />);

    // Find the radio button and click it
    const radioButton = screen.getByLabelText('Bank Transfer');
    fireEvent.click(radioButton);

    // Verify that changeHandler is called
    expect(mockChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('checks if the radio button is initially selected when defaultChecked is true', () => {
    render(<CompensationTypeCardRadio {...defaultProps} isradioSelected={true} />);

    // Check if the radio button is checked
    const radioButton = screen.getByLabelText('Bank Transfer');
    expect(radioButton).toBeChecked();
  });

  it('checks if the radio button is not selected when defaultChecked is false', () => {
    render(<CompensationTypeCardRadio {...defaultProps} isradioSelected={false} />);

    // Check if the radio button is not checked
    const radioButton = screen.getByLabelText('Bank Transfer');
    expect(radioButton).not.toBeChecked();
  });
});
