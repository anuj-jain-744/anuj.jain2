import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Register from './index';
import { DataContext } from '../../DataContext';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

jest.mock('../components/ThemeTextbox', () => () => <input data-testid="textbox" />);
jest.mock('../components/ThemeButton', () => ({ onClickhandler }: { onClickhandler: () => void }) => (
  <button data-testid="button" onClick={onClickhandler}>Continue</button>
));
jest.mock('../components/TypographyAndIcon', () => () => <div data-testid="typography-and-icon" />);
jest.mock('../../components/OTPComponent', () => () => <div data-testid="otp-component" />);
jest.mock('./compensation', () => () => <div data-testid="compensation" />);
jest.mock('../register/SeqNoDate', () => () => <div data-testid="seq-no-date" />);
jest.mock('../layout/Header', () => () => <div data-testid="header" />);
jest.mock('../layout/BodyTP', () => () => <div data-testid="body-tp" />);
jest.mock('../layout/BodyComp', () => () => <div data-testid="body-comp" />);

const mockData = {
  case_reference: 'Case Reference',
  owner_id: 'Owner ID',
  continue: 'Continue',
  enter: 'Enter ',
  invalid_dynamic_input: 'Invalid input for <DYNAMIC>',
  otp_info_message: 'OTP Info Message',
  your_otp_will_expire: 'Your OTP will expire',
  confirm_otp: 'Confirm OTP',
  resend_otp: 'Resend OTP',
  enter_otp_code: 'Enter OTP Code',
};

const mockPropData = {
  type: 'type',
  module: 'module',
};

const mockDataArray = [
  {
    title: 'Title 1',
    iseditable: true,
    compotype: 'textbox',
    classes: 'class1',
    key: 'Case_Reference_Number',
  },
  {
    title: 'Title 2',
    iseditable: true,
    compotype: 'textbox',
    classes: 'class2',
    key: 'Owner_ID',
  },
  {
    title: 'Title 3',
    iseditable: true,
    compotype: 'button',
    classes: 'class3',
  },
];

describe('Register Component', () => {
  beforeEach(() => {
    callAPI.mockResolvedValue({ message: 'SUCCESS', data: { mobile: '966123456789' } });
  });

  const renderComponent = () =>
    render(
      <DataContext.Provider value={mockData}>
        <Register
          propData={mockPropData}
          data={mockDataArray}
          resetHeader={jest.fn()}
          show={true}
          CardclassName="card-class"
          headersrc="header-src"
          headeralt="header-alt"
          headerclassName="header-class"
          headertitleclassName="header-title-class"
          headertitle="Header Title"
        />
      </DataContext.Provider>
    );

  test('renders Register component', () => {
    renderComponent();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByTestId('otp-component')).toBeInTheDocument();
  });

  test('handles input changes and button click', async () => {
    renderComponent();

    const caseRefInput = screen.getAllByTestId('textbox')[0];
    const ownerIdInput = screen.getAllByTestId('textbox')[1];
    const continueButton = screen.getByTestId('button');

    fireEvent.change(caseRefInput, { target: { name: 'Case_Reference_Number', value: 'AB1234567890' } });
    fireEvent.change(ownerIdInput, { target: { name: 'Owner_ID', value: '1234567890' } });

    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith('post', expect.any(String), expect.any(Object));
    });
  });

  test('displays error message on invalid OTP', async () => {
    callAPI.mockResolvedValueOnce({ message: 'ERROR', error: { errorMessage: 'Invalid OTP' } });

    renderComponent();

    const otpInput = screen.getByTestId('otp-component');
    fireEvent.change(otpInput, { target: { value: '123456' } });

    await waitFor(() => {
      expect(screen.getByText('Entered OTP is not valid')).toBeInTheDocument();
    });
  });

  test('handles successful OTP validation', async () => {
    renderComponent();

    const otpInput = screen.getByTestId('otp-component');
    fireEvent.change(otpInput, { target: { value: '123456' } });

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith('post', expect.any(String), expect.any(Object));
    });
  });
});