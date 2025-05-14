import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ClaimWidget, ClaimWidgetProps } from "./index";
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('../../constant', () => ({
  SECRET_KEY : ""
}));

const mockFormHeaderData = {
  registerclaim: "Register Claim",
  registerclaimlink: "/register-claim",
  trackyourclaim: "Track Your Claim",
  trackyourclaimlink: "/track-claim",
  trackyourclaimdesc: "You can track your claims here.",
  iconimages: {
    url: "icon-url.png",
    alt: "Claim Icon",
    title: "Claim Icon Title",
  },
  formInputData: [
    {
      field_name: "name",
      field_type: "textfield",
      field_title: "Name",
      field_placeholder: "Enter your name",
      field_required: true,
      field_options: {},
      field_validation: {
        required: {
          "message": "true",
        }
      },
    },
  ],
};

const mockClaimConfigData = {
  decryption_failed: "Decryption Failed",
  there_was_an_error_decrypt: "There was an error decrypting the data.",
  no_parameters_found: "No Parameters Found",
  the_url_does_not_contain: "The URL does not contain the required parameters.",
  enter_otp_code: "Enter OTP Code",
  your_otp_will_expire: "Your OTP will expire in",
  confirm_otp: "Confirm OTP",
  resend_otp: "Resend OTP",
  please_enter_the_otp: "Please enter the OTP",
  change_mobile_no: "Change Mobile Number",
};

const mockNavigateTo = jest.fn();

const renderComponent = (props: Partial<ClaimWidgetProps> = {}) => {
  const defaultProps: ClaimWidgetProps = {
    formHeaderData: mockFormHeaderData,
    claimConfigData: mockClaimConfigData,
    navigateTo: mockNavigateTo,
  };
  return render(
    <Router>
      <ClaimWidget {...defaultProps} {...props} />
    </Router>
  );
};

describe('ClaimWidget', () => {
  test('renders ClaimWidget component', () => {
    renderComponent();
    expect(screen.getByText('Register Claim')).toBeInTheDocument();
    expect(screen.getByText('You can track your claims here.')).toBeInTheDocument();
    expect(screen.getByAltText('Claim Icon')).toBeInTheDocument();
  });

  test('handles form input change', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(input).toHaveValue('John Doe');
  });

  test('handles form submission', () => {
    renderComponent();
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockNavigateTo).not.toHaveBeenCalled(); // Assuming navigateTo is not called immediately
  });

});

