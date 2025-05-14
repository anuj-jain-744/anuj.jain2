import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterClaimModalDialog from '.';
import { DataContext } from 'DataContext';  

// Mock data for the DataContext
const mockData = {
  popup_subtitle_one: '<h2>Registration Details</h2>',
  popup_body_content_one: [
    { value: 'Item 1' },
    { value: 'Item 2' },
  ],
  popup_subtitle_two: '<h3>Additional Information</h3>',
  popup_body_content_two: [
    { value: 'Detail 1' },
    { value: 'Detail 2' },
  ],
  https_motorclaims_walaa_co: 'https://example.com',
  walaa_com: 'Example.com',
};

describe('RegisterClaimModalDialog', () => {
  const mockSetShowRegModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with correct data', () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterClaimModalDialog showRegModal={true} setShowRegModal={mockSetShowRegModal} />
      </DataContext.Provider>
    );

    // Check modal visibility and content
    expect(screen.getByText('Registration Details')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Detail 1')).toBeInTheDocument();
    expect(screen.getByText('Detail 2')).toBeInTheDocument();
  });

  it('calls setShowRegModal when clicking the "Ok" button', async () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterClaimModalDialog showRegModal={true} setShowRegModal={mockSetShowRegModal} />
      </DataContext.Provider>
    );

    // Check modal is visible initially
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click the "Ok" button to close the modal
    fireEvent.click(screen.getByText('Ok'));

    // Wait for modal to disappear
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // Verify that setShowRegModal is called with false
    expect(mockSetShowRegModal).toHaveBeenCalledWith(false);
  });

  it('renders the correct subtitle and link in the modal body', () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterClaimModalDialog showRegModal={true} setShowRegModal={mockSetShowRegModal} />
      </DataContext.Provider>
    );

    // Check subtitle one and link
    expect(screen.getByText('Registration Details')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    const link = screen.getByText('Example.com');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render modal when showRegModal is false', () => {
    render(
      <DataContext.Provider value={mockData}>
        <RegisterClaimModalDialog showRegModal={false} setShowRegModal={mockSetShowRegModal} />
      </DataContext.Provider>
    );

    // Ensure modal is not rendered
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders custom language data when provided', () => {
    const customData = {
      popup_subtitle_one: '<h2>New Registration Details</h2>',
      popup_body_content_one: [
        { value: 'Custom Item 1' },
        { value: 'Custom Item 2' },
      ],
      popup_subtitle_two: '<h3>New Additional Information</h3>',
      popup_body_content_two: [
        { value: 'Custom Detail 1' },
        { value: 'Custom Detail 2' },
      ],
      https_motorclaims_walaa_co: 'https://new-example.com',
      walaa_com: 'New Example.com',
    };

    render(
      <DataContext.Provider value={customData}>
        <RegisterClaimModalDialog showRegModal={true} setShowRegModal={mockSetShowRegModal} />
      </DataContext.Provider>
    );

    // Check that the custom data renders correctly
    expect(screen.getByText('New Registration Details')).toBeInTheDocument();
    expect(screen.getByText('Custom Item 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Item 2')).toBeInTheDocument();
    expect(screen.getByText('New Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Custom Detail 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Detail 2')).toBeInTheDocument();

    const newLink = screen.getByText('New Example.com');
    expect(newLink).toHaveAttribute('href', 'https://new-example.com');
  });
});
