// ClaimRegistrationDetails.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ClaimRegistrationDetails from "."; 
import { DataContext } from "../../../../../../DataContext";

// Mock the ModalDialogBox component
jest.mock("Motor/Claims/Comprehensive/Components/ModalDialogBox", () => ({
  __esModule: true,
  default: ({ isModal, handleClose }: { isModal: boolean; handleClose: () => void }) => {
    if (!isModal) return null;
    return (
      <div role="dialog" aria-labelledby="modal-title">
        <button onClick={handleClose}>Close Modal</button>
        <p>Modal Content</p>
      </div>
    );
  }
}));

describe('ClaimRegistrationDetails', () => {
  const mockData = {
    claim_registration_details: "Test Claim Registration Details",
    popup_body_content_one: [{ value: "Test Content for Read More" }],
  };

  // Helper function to render component with context
  const renderWithContext = (contextValue: any) => {
    return render(
      <DataContext.Provider value={contextValue}>
        <ClaimRegistrationDetails />
      </DataContext.Provider>
    );
  };

  it('renders ClaimRegistrationDetails component', () => {
    renderWithContext(mockData);

    // Check if the claim registration details are rendered
    expect(screen.getByText("Test Claim Registration Details")).toBeInTheDocument();

    // Check if the "Read More" button is rendered
    expect(screen.getByText("Read More")).toBeInTheDocument();
  });

  it('should open and close modal on button click', () => {
    renderWithContext(mockData);

    // Ensure modal is not visible initially
    expect(screen.queryByRole("dialog")).toBeNull();

    // Click the "Read More" button to open the modal
    fireEvent.click(screen.getByText("Read More"));

    // Check if the modal is displayed
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click the "Close Modal" button to close the modal
    fireEvent.click(screen.getByText("Close Modal"));

    // Check if the modal is closed
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it('renders image and content properly', () => {
    renderWithContext(mockData);

    // Check if the image with the claim registration details is rendered
    const image = screen.getByAltText("claim_reg_det");
    expect(image).toBeInTheDocument();

    // Check if the popup content is rendered
    expect(screen.getByText("Test Content for Read More")).toBeInTheDocument();
  });
});
