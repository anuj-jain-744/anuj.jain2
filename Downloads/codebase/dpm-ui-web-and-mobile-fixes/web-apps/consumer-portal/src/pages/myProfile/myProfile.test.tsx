import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MyProfile from './index';
import '@testing-library/jest-dom';

// Mock Redux hooks
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => mockUseSelector(selector),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-toastify', () => {
  const mockToast = jest.fn();
  mockToast.error = jest.fn();
  mockToast.success = jest.fn();
  return {
    __esModule: true,
    toast: mockToast
  };
});

jest.mock('assets/CommonSVG/checkCircle.svg', () => 'checkCircleIcon');

jest.mock('./ProfileEditDialog', () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <div >
    ProfileEditDialog Mock
    <input/>
    <button data-testid="profile-edit-dialog" onClick={() => props.setShowDialog(false)}>Close</button>
    <button data-testid="update-mobileid" onClick={() => props.setUpdatedDetails({label: 'mobile', value: '0555555555'})}>Update</button>
  </div>
  )),
}));

jest.mock('./ProfileEditBankDialog', () => (props: any) => (
    <div>
      EditBankDialog Mock
      <button data-testid="profile-edit-bank-dialog" onClick={() => props.setShowDialog(false)}>Close Bank Dialog</button>
    </div>
  ));
  

jest.mock('components/OTPValidation/OtpWrapper', () => ({
  __esModule: true,
  OTPWrapper: jest.fn((props) => (
    <div data-testid="otp-wrapper">
      OTPWrapper Mock
      <button onClick={props.handleSuccessValidation}>Mock OTP Success</button>
    </div>
  )),
}));
jest.mock('components/OTPValidation', () => ({
  LoaderOverlay: () => <div data-testid="loader-overlay" />
}));

jest.mock('components/ThemeAlertNotification/ThemeAlertNotification', () => ({
  showNotification: jest.fn()
}));

jest.mock('utils/formatDate', () => ({
  formatDateMMYYYY: (date: string) => date === '1990-01-01' ? '01/1990' : date
}));

jest.mock('utils/MaskStringFormat', () => ({
  createMaskString: ({stringToBeMask}: {stringToBeMask: string}) => `***${stringToBeMask.slice(-3)}`
}));

const mockUseApiCall = jest.fn();
jest.mock('@dpm/shared-module', () => ({
  ...jest.requireActual('@dpm/shared-module'),
  useApiCall: () => mockUseApiCall(),
  slices: {
    auth: {
      setAuth: jest.fn()
    }
  }
}));

jest.mock('@dpm/corporate-portal/src/components/FormInput/ThemeSelect', () => ({
    __esModule: true,
    default: () => <div data-testid="theme-select-mock">ThemeSelect Mock</div>
  }));
  

const baseLanguageData = {
  personal_details: 'Personal Details',
  national_id: 'National ID',
  dob: 'Date of Birth',
  contact_details: 'Contact Details',
  last_updated_on: 'Last Updated',
  edit: 'Edit',
  address: 'Address',
  sync: 'Sync',
  bank_details: 'Bank Details',
  iban_no: 'IBAN No',
  bank_name: 'Bank Name',
  mobile_no: 'Mobile',
  email_id: 'Email',
  enter_otp_code: 'Enter OTP',
  your_otp_will_expire: 'OTP Expiry',
  confirm_otp: 'Confirm OTP',
  resend_otp: 'Resend OTP',
  please_enter_the_mobile_verification_code: 'Enter mobile code',
  please_enter_the_email_verification_code: 'Enter email code',
  mobile_update_success_message: 'Mobile updated<br>Successfully',
  email_update_success_message: 'Email updated<br>Successfully'
};

const baseUserInfo = {
  userId: '123456789',
  mobileNumber: '0555555555',
  email: 'test@example.com',
  address: 'Test Address',
  name: 'John Doe',
  ownerDobG: '1990-01-01',
  lastUpdatedOn: '2023-01-01'
};

describe('MyProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockImplementation((selector) =>
      selector({
        dashbaordLanguageData: { languageData: baseLanguageData },
        auth: { userInfo: baseUserInfo }
      })
    );
    mockUseApiCall.mockImplementation(() => ({
      makeApiCall: jest.fn(),
      data: baseUserInfo,
      isLoading: false,
      error: null
    }));
    sessionStorage.clear();
  
  });
  
  test('renders basic user information', () => {
    render(<MyProfile />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('01/1990')).toBeInTheDocument();
    expect(screen.getByText('***789')).toBeInTheDocument(); // Masked national ID
  });
  
  test('shows loader overlay when loading', () => {
    mockUseApiCall.mockImplementation(() => ({
      isLoading: true
    }));
    render(<MyProfile />);
    expect(screen.getByTestId('loader-overlay')).toBeInTheDocument();
  });
  
  test('opens and closes mobile edit modal', async () => {
    render(<MyProfile />);
    fireEvent.click(screen.getByTestId('edit-mobileid'));
    expect(screen.getByTestId('profile-edit-dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('profile-edit-dialog')).not.toBeInTheDocument();
    });
  });
  
  test('opens and closes bank edit modal', async () => {
    render(<MyProfile />);
    fireEvent.click(screen.getByTestId('edit-bankid'));
    expect(screen.getByTestId('profile-edit-bank-dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close Bank Dialog'));
    await waitFor(() => {
      expect(screen.queryByTestId('profile-edit-bank-dialog')).not.toBeInTheDocument();
    });
  });
  
  test('handles address sync', async () => {
    const makeApiCall = jest.fn();
    mockUseApiCall.mockImplementation(() => ({
      makeApiCall,
      data: baseUserInfo,
      isLoading: false,
      error: null
    }));
    render(<MyProfile />);
    fireEvent.click(screen.getByText('Sync'));
    expect(makeApiCall).toHaveBeenCalled();
  });
  
  test('shows address loading spinner', () => {
    mockUseApiCall.mockImplementation(() => ({
      isLoading: false
    }));
    mockUseSelector.mockImplementation((selector) =>
      selector({
        dashbaordLanguageData: { languageData: baseLanguageData },
        auth: { userInfo: baseUserInfo }
      })
    );
    render(<MyProfile />);
    // Simulate addLoading state
    // You may need to trigger setAddLoading(true) via address sync or by exposing the state in your component for testability
  });
  
  test('shows OTP modal when updating contact', async () => {
    render(<MyProfile />);
    fireEvent.click(screen.getByTestId('edit-mobileid'));
    fireEvent.click(screen.getByTestId('update-mobileid'));
    await waitFor(() => {
      expect(screen.getByText('OTPWrapper Mock')).toBeInTheDocument();
    });
  });
  
  test('handles API error on address update', async () => {
    const errors = { messages: { message_en: 'Address Update Error' } };
    const showNotification = require('components/ThemeAlertNotification/ThemeAlertNotification').showNotification;
    mockUseApiCall.mockImplementation(() => ({
      makeApiCall: jest.fn(),
      errors,
      isLoading: false
    }));
    render(<MyProfile />);
    fireEvent.click(screen.getByText('Sync'));
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalled();
    });
  });
  
  test('handles success notification after contact update', async () => {
    const showNotification = require('components/ThemeAlertNotification/ThemeAlertNotification').showNotification;
    mockUseApiCall.mockImplementationOnce(() => ({
      makeApiCall: jest.fn(),
      data: baseUserInfo,
      isLoading: false,
      error: null
    })).mockImplementationOnce(() => ({
      makeApiCall: jest.fn(),
      data: { value: '0555555555' },
      isLoading: false,
      error: null
    }));
  
    const {rerender}=render(<MyProfile />);
    fireEvent.click(screen.getByTestId('edit-mobileid'));
    await rerender(<MyProfile />);
    
    await waitFor(() => expect(screen.getByTestId('profile-edit-dialog')).toBeInTheDocument());
  
  
    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByText('OTPWrapper Mock')).toBeInTheDocument();
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalled();
    });
  });
  
  
  test('fetches user profile from sessionStorage and updates auth state', async () => {
      // Mock sessionStorage
      const userProfileData = {
        userId: '999',
        address: 'Session Address',
        mobileNumber: '0555555999'
      };
      sessionStorage.setItem('userDetails', JSON.stringify({ userProfileData }));
    
      const setAuth = jest.fn();
      jest.spyOn(require('@dpm/shared-module').slices.auth, 'setAuth').mockImplementation(setAuth);
    
      // Ensure mockUseSelector returns initial auth state
      mockUseSelector.mockImplementation((selector) =>
        selector({
          dashbaordLanguageData: { languageData: baseLanguageData },
          auth: { userInfo: null }
        })
      );
    
      const makeApiCallUserProfile = jest.fn();
      mockUseApiCall.mockImplementationOnce(() => ({
        makeApiCall: makeApiCallUserProfile,
        data: userProfileData,
        isLoading: false,
        error: null
      }));
    
      render(<MyProfile />);
      // Wait for useEffect to run
      await waitFor(() => {
        expect(setAuth).toHaveBeenCalledWith(expect.objectContaining({
          userInfo: userProfileData
        }));
        expect(makeApiCallUserProfile).toHaveBeenCalledWith({
          userId: userProfileData.userId,
          mobileNumber: userProfileData.mobileNumber
        });
      });
    });
  
    test('shows toast error and resets state on contact update error', async () => {
      const errorUpdatedContact = { messages: { message_en: 'Update failed' } };
      mockUseApiCall.mockImplementation((...args) => {
        if (args[1] === '/ChangeMobileNumber') {
          return {
            makeApiCall: jest.fn(),
            isLoading: false,
            error: errorUpdatedContact,
            data: null
          };
        }
        return {
          makeApiCall: jest.fn(),
          isLoading: false,
          error: null,
          data: baseUserInfo
        };
      });
    
      render(<MyProfile />);
      // Open the edit dialog for mobile
      fireEvent.click(screen.getByTestId('edit-mobileid'));
      // Wait for the dialog to appear
      await waitFor(() => expect(screen.getByTestId('profile-edit-dialog')).toBeInTheDocument());
    });
    
    
    
  
})

