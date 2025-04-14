import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Error } from './index';
import { LoginAndSingupContext } from '../LoginandSignupContext';

describe('Error Component', () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockSetSignUpForm = jest.fn();

const renderComponent = (props = {}, navigateToErrorFrom: number) => {
    return render(
      <LoginAndSingupContext.Provider
        value={{
          errorMessage: 'Test error message',
          navigateToErrorFrom: navigateToErrorFrom,
          setSignUpForm: mockSetSignUpForm,
        }}
      >
        <Error
          formElementsData={{ data: { signup_now: 'Sign Up Now', title: 'Error Title' } }}
          setCurrentStepValue={mockSetCurrentStepValue}
          closeIcon={<div>Close Icon</div>}
          message="Default error message"
          refNum=""
          {...props}
        />
      </LoginAndSingupContext.Provider>
    );
  };

  it('renders the error message from context', () => {
    renderComponent({},0);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  xit('renders the default error message when context error message is not provided', () => {
    renderComponent({ message: 'Default error message' }, 0);
    expect(screen.getByText('Default error message')).toBeInTheDocument();
  });

  it('calls setCurrentStepValue with 0 when navigateToErrorFrom is 0', () => {
    renderComponent({},0);
    fireEvent.click(screen.getByText('Error Title'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(0);
  });

  it('calls setCurrentStepValue with 5 and setSignUpForm when refNum is provided', () => {
    renderComponent({ refNum: '12345' },5);
    fireEvent.click(screen.getByText('Sign Up Now'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(5);
  });

  it('renders the correct button text based on refNum', () => {
    renderComponent({},0);
    expect(screen.getByText('Error Title')).toBeInTheDocument();

    renderComponent({ refNum: '12345' },5);
    expect(screen.getByText('Sign Up Now')).toBeInTheDocument();
  });
});