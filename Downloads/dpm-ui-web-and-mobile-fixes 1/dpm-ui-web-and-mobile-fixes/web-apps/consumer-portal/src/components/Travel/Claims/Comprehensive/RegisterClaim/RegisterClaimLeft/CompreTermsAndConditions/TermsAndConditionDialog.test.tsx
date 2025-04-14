import { render, screen, fireEvent } from '@testing-library/react';
import TermsAndConditionDialog from './TermsAndConditionDialog';  
import ThemeButton from 'components/ThemeComponents/ThemeButton';  

 

jest.mock('components/ThemeComponents/ThemeButton', () => ({
  __esModule: true,
  default: ({ onClickhandler, title, ...rest }: any) => (
    <button {...rest} onClick={onClickhandler}>
      {title}
    </button>
  ),
}));


describe('TermsAndConditionDialog', () => {
  const mockClickHandler = jest.fn();
  const mockClickHandlerAccept = jest.fn();

  const defaultProps = {
    showDialog: true,
    clickHandler: mockClickHandler,
    clickHandlerAccept: mockClickHandlerAccept,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with correct heading and content', () => {
    render(<TermsAndConditionDialog {...defaultProps} />);

    // Check if the heading and content are rendered
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    expect(screen.getByText('These are the terms and conditions for using our service...')).toBeInTheDocument();
    expect(screen.getByText('We respect your privacy and are committed to protecting your personal data...')).toBeInTheDocument();
  });

  it('renders the correct buttons with proper titles', () => {
    render(<TermsAndConditionDialog {...defaultProps} />);

    // Check if the "Close" and "Accept" buttons are rendered
    expect(screen.getByText('Mocked Button')).toBeInTheDocument();  // Since ThemeButton is mocked
    const buttons = screen.getAllByText('Mocked Button');
    expect(buttons).toHaveLength(2);  // There should be two buttons rendered
  });

  it('calls clickHandler when the Close button is clicked', () => {
    render(
      <TermsAndConditionDialog
        showDialog={true}
        clickHandler={mockClickHandler}
        clickHandlerAccept={mockClickHandlerAccept}
      />
    );

    // Ensure the Close button is in the document
    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();

    // Simulate clicking the Close button
    fireEvent.click(closeButton);

    // Verify that the clickHandler function is called once
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  it('calls clickHandlerAccept when the Accept button is clicked', () => {
    render(<TermsAndConditionDialog {...defaultProps} />);

    // Find the accept button (mocked button in this case)
    const acceptButton = screen.getAllByText('Mocked Button')[1];
    fireEvent.click(acceptButton);

    // Verify that the clickHandlerAccept function is called
    expect(mockClickHandlerAccept).toHaveBeenCalledTimes(1);
  });

  it('renders the modal correctly based on the showDialog prop', () => {
    const { rerender } = render(<TermsAndConditionDialog {...defaultProps} />);

    // Check if the modal is rendered (based on showDialog = true)
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();

    // Rerender with showDialog = false and check that the modal is not visible
    rerender(<TermsAndConditionDialog {...{ ...defaultProps, showDialog: false }} />);
    expect(screen.queryByText('Terms and Conditions')).toBeNull();  // Modal should not be in the document
  });
});
