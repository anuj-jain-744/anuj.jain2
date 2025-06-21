import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadDocStatus from './UploadDocStatus';
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

// Mock the `useClaimContext` hook
jest.mock('Motor/ClaimHooks/useClaimContext', () => ({
  useClaimContext: jest.fn(),
}));

describe('UploadDocStatus Component', () => {
  // Define the mock data here directly in the test
  const mockTrackNewData = {
    claimNo: '12345',
    claimTrackingDetails: [
      {
        taskStatus: 'Pending',
        uploadDocumnets: [
          { documentName: 'Document A' },
          { documentName: 'Document B' },
        ],
      },
      {
        taskStatus: 'Completed',
        uploadDocumnets: [
          { documentName: 'Document C' },
        ],
      },
    ],
  };

  const mockSetIsSuccess = jest.fn();

  // Set up the mock context for each test
  beforeEach(() => {
    useClaimContext.mockReturnValue({
      trackNewData: mockTrackNewData,
      setIsSuccess: mockSetIsSuccess,
    });
  });

  // it('should render without crashing', () => {
  //   render(<UploadDocStatus />);
  //   expect(screen.getByText(/Pending/)).toBeInTheDocument();
  // });

  // it('should display the claim number and pending documents', () => {
  //   render(<UploadDocStatus />);
  //   expect(screen.getByText('Claim Number: 12345')).toBeInTheDocument();  // Adjust text based on real data
  //   expect(screen.getByText('Document A, Document B')).toBeInTheDocument();
  // });

  // it('should toggle success state when the button is clicked', async () => {
  //   render(<UploadDocStatus />);
    
  //   // Find the button or trigger that toggles the success state
  //   const toggleButton = screen.getByText(/Submit/); // Replace with correct button text
    
  //   // Simulate a click event
  //   fireEvent.click(toggleButton);

  //   await waitFor(() => {
  //     expect(mockSetIsSuccess).toHaveBeenCalledTimes(1);
  //   });
  // });

  // it('should render UploadDocs component when isSuccess is true', () => {
  //   render(<UploadDocStatus />);
  //   expect(screen.getByText('Upload Documents')).toBeInTheDocument(); // Modify based on actual text
  // });

  it('should not render UploadDocs component when isSuccess is false', () => {
    // Set mock context to simulate `isSuccess` being false
    useClaimContext.mockReturnValueOnce({
      trackNewData: mockTrackNewData,
      setIsSuccess: false,
    });
    
    render(<UploadDocStatus />);
    expect(screen.queryByText('Upload Documents')).not.toBeInTheDocument();
  });
});
