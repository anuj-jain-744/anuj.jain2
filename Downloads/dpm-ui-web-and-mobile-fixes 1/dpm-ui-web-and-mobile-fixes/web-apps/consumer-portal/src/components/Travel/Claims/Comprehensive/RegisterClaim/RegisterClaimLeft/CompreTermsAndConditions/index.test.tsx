import { render, screen, fireEvent, act } from '@testing-library/react';
import CompreTermsAndConditions from './index';  
 

// Mock the ThemeButton and ThemeRadioCheckbox components since they are used in the component
jest.mock('components/ThemeComponents/ThemeButton', () => ({
  __esModule: true,
  default: ({ onClickhandler, title, ...rest }: any) => (
    <button {...rest} onClick={onClickhandler}>
      {title}
    </button>
  ),
}));

jest.mock('components/ThemeComponents/ThemeRadioCheckbox', () => ({
  __esModule: true,
  default: ({ onChangehandler, checked, ...rest }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChangehandler}
      {...rest}
    />
  ),
}));

describe('CompreTermsAndConditions', () => {
  const mockChangeHandler = jest.fn();
  const defaultProps = {
    changeHandler: mockChangeHandler,
    isChecked: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checkbox and terms link', () => {
    render(<CompreTermsAndConditions {...defaultProps} />);

    // Ensure the checkbox and the "terms and conditions" link are present
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('terms and conditions.')).toBeInTheDocument();
  });

  it('calls changeHandler when checkbox is clicked and isChecked is true', () => {
    render(<CompreTermsAndConditions {...defaultProps} isChecked={true} />);

    // Simulate the checkbox change
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Ensure the changeHandler is called with the expected arguments
    expect(mockChangeHandler).toHaveBeenCalledWith('IAgree', true);
  });

  it('does not call changeHandler when checkbox is clicked and isChecked is false', () => {
    render(<CompreTermsAndConditions {...defaultProps} isChecked={false} />);

    // Simulate the checkbox change
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Ensure changeHandler is NOT called because isChecked is false
    expect(mockChangeHandler).not.toHaveBeenCalled();
  });

  it('opens the TermsAndConditionDialog when the "terms and conditions" link is clicked', () => {
    render(<CompreTermsAndConditions {...defaultProps} />);

    // Find and click the "terms and conditions" link
    const termsLink = screen.getByText('terms and conditions.');
    fireEvent.click(termsLink);

    // Ensure the TermsAndConditionDialog modal is shown
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
  });

  it('closes the TermsAndConditionDialog when the Close button is clicked', () => {
    render(<CompreTermsAndConditions {...defaultProps} />);

    // Open the dialog first
    const termsLink = screen.getByText('terms and conditions.');
    fireEvent.click(termsLink);

    // Find and click the Close button
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    // Ensure the TermsAndConditionDialog modal is not shown anymore
    expect(screen.queryByText('Terms and Conditions')).toBeNull();
  });

  it('calls clickHandlerAccept when the Accept button is clicked in the TermsAndConditionDialog', async () => {
    render(<CompreTermsAndConditions {...defaultProps} />);

    // Open the dialog first
    const termsLink = screen.getByText('terms and conditions.');
    fireEvent.click(termsLink);

    // Find and click the Accept button in the TermsAndConditionDialog
    const acceptButton = screen.getByText('Accept');
    await act(async () => {
      fireEvent.click(acceptButton);
    });

    // Ensure the clickHandlerAccept function was called
    expect(mockChangeHandler).toHaveBeenCalledWith('IAgree', true);
  });
});
