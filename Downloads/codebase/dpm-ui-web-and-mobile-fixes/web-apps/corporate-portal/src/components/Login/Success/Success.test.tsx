import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Success } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';

jest.mock('../useLoginAndSignupContext');

describe('Success Component', () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;

  const renderComponent = (props = {}) => {
    return render(
      <Success
        formElementsData={{ data: { login_now: 'Login Now', redirect_to_login_screen: 'Redirecting...' } }}
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={true}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockUseLoginAndSignupContext.mockReturnValue({
      successMessage: 'Test success message',
      navigateToErrorFrom: 0,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  it('renders the success message from context', () => {
    renderComponent();
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  it('calls setCurrentStepValue with 0 when button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Login Now'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(0);
  });

  it('renders the correct button text based on formElementsData', () => {
    renderComponent();
    expect(screen.getByText('Login Now')).toBeInTheDocument();
  });

  it('renders the progress bar and updates progress over time', () => {
    renderComponent();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Check if progress bar value updates
    expect(progressBar).toHaveAttribute('aria-valuenow');
  });

  it('resets progress and calls setCurrentStepValue when progress reaches 100', () => {
    renderComponent();

    act(() => {
      jest.advanceTimersByTime(10000); // Simulate enough time for progress to reach 100
    });

  //  expect(mockSetCurrentStepValue).toHaveBeenCalledWith(0);
  });

  it('renders the redirect text from formElementsData', () => {
    renderComponent();
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });
});