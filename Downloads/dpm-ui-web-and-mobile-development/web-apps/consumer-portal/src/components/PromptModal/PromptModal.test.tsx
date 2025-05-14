import { render, screen, fireEvent } from '@testing-library/react';
import PromptModal from './index';

describe('PromptModal', () => {
  const mockOnHide = jest.fn();
  const mockLanguageData = {
    remove_vehicle: 'Remove Vehicle',
    are_you_sure_you_want_to: 'Are you sure you want to remove this vehicle?',
    no: 'No',
    yes_remove: 'Yes, Remove',
  };

  it('renders correctly with language data', () => {
    render(
      <PromptModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes, Remove')).toBeInTheDocument();
  });

  it('calls onHide when No button is clicked', () => {
    render(
      <PromptModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByText('No'));
    expect(mockOnHide).toHaveBeenCalled();
  });

  it('calls setStepValue and onHide when Yes, Remove button is clicked', () => {
    render(
      <PromptModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByText('Yes, Remove'));
    expect(mockOnHide).toHaveBeenCalled();
  });

  it('calls onHide when close icon is clicked', () => {
    render(
      <PromptModal
        show={true}
        onHide={mockOnHide}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByAltText('close icon'));
    expect(mockOnHide).toHaveBeenCalled();
  });
});