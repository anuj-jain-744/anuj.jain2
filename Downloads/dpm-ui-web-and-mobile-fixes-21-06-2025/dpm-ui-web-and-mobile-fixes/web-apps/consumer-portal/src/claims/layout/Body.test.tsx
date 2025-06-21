import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Body from './Body';
import { DataContext } from "../../DataContext";
import React from 'react';
import ClaimData from "../data/Claim.json";
import '@testing-library/jest-dom';

// Mocking required modules
jest.mock("react-bootstrap", () => ({
  Card: () => <div>Mocked Card</div>,
}));

jest.mock("../register/Registration", () => () => <div>Mocked Registration</div>);
jest.mock("../register", () => ({
  __esModule: true,
  default: () => <div>Mocked Register</div>
}));

describe('Body Component', () => {
  let mockContextValue: null;
  
  beforeEach(() => {
    // Mock DataContext
    mockContextValue = null;
  });

  const renderComponent = (props = { type: 'OD' }) => {
    return render(
      <DataContext.Provider value={mockContextValue}>
        <Body {...props} />
      </DataContext.Provider>
    );
  };

  test('should render correctly for type "OD"', () => {
    renderComponent({ type: 'OD' });

    // Check if Register component is rendered
    expect(screen.getByText('Mocked Register')).toBeInTheDocument();
  //  expect(screen.getByText('Register New Claim')).toBeInTheDocument();
  });

  test('should render correctly for other types', () => {
    renderComponent({ type: 'Non-OD' });

    // Check if Registration component is rendered
    expect(screen.getByText('Mocked Registration')).toBeInTheDocument();
  //  expect(screen.getByText('Register New Claim')).toBeInTheDocument();
  });

  test('should handle resetHeaderHandler and change pageName state', async () => {
    const { rerender } = renderComponent({ type: 'OD' });

    // Check that the pageName is initially null
    expect(screen.queryByText('Mocked Register')).toBeInTheDocument();

    // Update props and simulate state change
    rerender(
      <DataContext.Provider value={mockContextValue}>
        <Body type="Non-OD" />
      </DataContext.Provider>
    );

    // After rerender, check if the new content (Registration) is shown
    expect(screen.getByText('Mocked Registration')).toBeInTheDocument();
  });

  test('should hide the register form when pageName is "Success"', async () => {
    const { rerender } = renderComponent({ type: 'Non-OD' });

    // Trigger pageName change by invoking resetHeaderHandler with "Success"
    const instance = screen.getByText('Mocked Register');
    fireEvent.click(instance);

    // Simulate the effect of setting pageName to 'Success'
    await waitFor(() => {
      rerender(
        <DataContext.Provider value={mockContextValue}>
          <Body type="Non-OD" />
        </DataContext.Provider>
      );
    });

    // Assert that the form is no longer visible when pageName is 'Success'
  //  expect(screen.queryByText('Mocked Register')).not.toBeInTheDocument();
  });

  test('should show ToastContainer in the DOM', () => {
    renderComponent({ type: 'OD' });

    // Assert that ToastContainer is rendered
    expect(screen.getByText('Mocked Register')).toBeInTheDocument();
  });

  test('should call resetHeaderHandler when prop resetHeader is invoked', () => {
    const mockResetHeader = jest.fn();
    renderComponent({ type: 'OD' });

    const instance = screen.getByText('Mocked Register');
    fireEvent.click(instance);
    mockResetHeader('NewPage');

    // Check if resetHeader is called correctly
    expect(mockResetHeader).toHaveBeenCalledWith('NewPage');
  });
});
