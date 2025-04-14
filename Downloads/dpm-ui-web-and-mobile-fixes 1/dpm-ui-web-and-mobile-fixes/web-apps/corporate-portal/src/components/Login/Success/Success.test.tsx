import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Success } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';

jest.mock('../useLoginAndSignupContext');

describe('Success Component', () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;

  const renderComponent = (props = {}) => {
    return render(
      <Success
        formElementsData={{ data: { login_now: 'Login Now' } }}
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
});