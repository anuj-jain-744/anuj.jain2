import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmBox } from './index'; // Adjust import path

// Mock icons to prevent them from interfering with the test output
jest.mock('@mui/icons-material/CancelOutlined', () => () => <div>Cancel Icon</div>);
jest.mock('@mui/icons-material/CheckCircleOutlineOutlined', () => () => <div>Check Icon</div>);

describe('ConfirmBox', () => {
  const mockSetConfirmYes = jest.fn();
  const mockSetConfirmNo = jest.fn();

  it('should render the modal when showConfirmModal is true', () => {
    render(
      <ConfirmBox
        title="Confirm"
        showConfirmModal={true}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
      />
    );

    // Check if the modal is rendered
    expect(screen.getByText('Your update is not saved. Do you wish to continue?')).toBeInTheDocument();
  });

  it('should not render the modal when showConfirmModal is false', () => {
    render(
      <ConfirmBox
        title="Confirm"
        showConfirmModal={false}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
      />
    );

    // Check if the modal is not rendered
    expect(screen.queryByText('Your update is not saved. Do you wish to continue?')).toBeNull();
  });

  it('should call setConfirmYes when the "Yes" button is clicked', () => {
    render(
      <ConfirmBox
        title="Confirm"
        showConfirmModal={true}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
      />
    );

    // Click the "Yes" button
    fireEvent.click(screen.getByText('Check Icon'));

    // Verify that the setConfirmYes function was called
    expect(mockSetConfirmYes).toHaveBeenCalledWith(false);
  });

  it('should call setConfirmNo when the "No" button is clicked', () => {
    render(
      <ConfirmBox
        title="Confirm"
        showConfirmModal={true}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
      />
    );

    // Click the "No" button
    fireEvent.click(screen.getByText('Cancel Icon'));

    // Verify that the setConfirmNo function was called
    expect(mockSetConfirmNo).toHaveBeenCalledWith(false);
  });

  it('should display the title from props', () => {
    const title = 'Confirm Action';
    render(
      <ConfirmBox
        title={title}
        showConfirmModal={true}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
      />
    );

    // Check if the title is rendered correctly
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should handle languageData props if provided', () => {
    const languageData = { confirmMessage: 'Your changes are not saved' };
    render(
      <ConfirmBox
        title="Confirm"
        showConfirmModal={true}
        setConfirmYes={mockSetConfirmYes}
        setConfirmNo={mockSetConfirmNo}
        languageData={languageData}
      />
    );

    // Check if the text from languageData is rendered correctly
    expect(screen.getByText(languageData.confirmMessage)).toBeInTheDocument();
  });
});
