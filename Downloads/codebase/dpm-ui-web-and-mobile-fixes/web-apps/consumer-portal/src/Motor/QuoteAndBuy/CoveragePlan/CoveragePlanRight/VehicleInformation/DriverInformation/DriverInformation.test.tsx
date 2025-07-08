// DriverInformation.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverInformation from '.';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useHandleDriverData from 'hook/motor/useHandleDriverData';

// Mock the child component
jest.mock('./DriverNameCard', () => ({
  __esModule: true,
  default: ({ isMounted }: { isMounted: boolean }) => (
    <div data-testid="mock-driver-name-card">{`Mocked DriverNameCard isMounted=${isMounted}`}</div>
  ),
}));

// Mock other hooks and components
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('hook/motor/useHandleDriverData');
jest.mock('components/AddDriver', () => ({
  AddDriver: (props: any) => <div data-testid="mock-add-driver" {...props}>Mocked AddDriver</div>
}));
jest.mock('components/AlertBox', () => ({
  AlertBox: (props: any) => <div data-testid="mock-alert-box" {...props}>Mocked AlertBox</div>
}));

describe('DriverInformation', () => {
  const mockHandleDriverAdded = jest.fn();

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetailsResponseData: [
        { driverID: '1', driverName: 'Driver One' },
        { driverID: '2', driverName: 'Driver Two' }
      ]
    });
    (useHandleDriverData as jest.Mock).mockReturnValue({
      handleDriverAdded: mockHandleDriverAdded
    });
  });

  it('renders DriverNameCard mock and add driver button', () => {
    render(<DriverInformation languageData={{ additional_drivers: 'Additional Drivers', add_driver: 'Add Driver' }} />);
    expect(screen.getByTestId('mock-driver-name-card')).toBeInTheDocument();
    expect(screen.getByText('Add Driver')).toBeInTheDocument();
  });

  it('shows AddDriver modal when add driver is clicked', () => {
    render(<DriverInformation languageData={{ additional_drivers: 'Additional Drivers', add_driver: 'Add Driver' }} />);
    fireEvent.click(screen.getByText('Add Driver'));
    expect(screen.getByTestId('mock-add-driver')).toBeInTheDocument();
  });

  it('disables add driver when more than 3 drivers', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      driverDetailsResponseData: [
        { driverID: '1', driverName: 'Driver One' },
        { driverID: '2', driverName: 'Driver Two' },
        { driverID: '3', driverName: 'Driver Three' },
        { driverID: '4', driverName: 'Driver Four' }
      ]
    });
    render(<DriverInformation languageData={{ additional_drivers: 'Additional Drivers', add_driver: 'Add Driver' }} />);
    const addDriverDiv = screen.getByText('Add Driver').closest('div.add-driver-container');
    expect(addDriverDiv).toHaveClass('disabledDriver');
  });
});
