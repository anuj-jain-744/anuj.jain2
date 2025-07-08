import React from 'react';
import { render, screen } from '@testing-library/react';
import ClaimsDetails from './index';
import { DataContext } from '../../../../../DataContext';

// Mock Success component
jest.mock('Motor/SuccessPage', () => (props: any) => (
  <div data-testid="Success">{JSON.stringify(props)}</div>
));

const mockLanguageData = {
  police_case_reference: 'Police Ref',
  najm_case_reference: 'Najm Ref',
  other_case_reference: 'Other Ref',
};

const validationData = { foo: 'bar' };
const claimResponse = { claimNo: 'CL123' };

const renderWithContext = (
  props: React.ComponentProps<typeof ClaimsDetails>,
  contextValue: any
) =>
  render(
    <DataContext.Provider value={contextValue}>
      <ClaimsDetails {...props} />
    </DataContext.Provider>
  );

describe('ClaimsDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading when languageData is not present', () => {
    renderWithContext(
      { validationData, claimResponse, claimsInfo: { refNo: '45abc' } },
      null
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders Success with POLICE label', () => {
    renderWithContext(
      { validationData, claimResponse, claimsInfo: { refNo: '45abc' } },
      mockLanguageData
    );
    const success = screen.getByTestId('Success');
    expect(success.textContent).toContain('Police Ref');
    expect(success.textContent).toContain('CL123');
  });

  it('renders Success with OTHERS label', () => {
    renderWithContext(
      { validationData, claimResponse, claimsInfo: { refNo: '23xyz' } },
      mockLanguageData
    );
    const success = screen.getByTestId('Success');
    expect(success.textContent).toContain('Other Ref');
  });

  it('renders Success with NAJM label', () => {
    renderWithContext(
      { validationData, claimResponse, claimsInfo: { refNo: 'a123' } },
      mockLanguageData
    );
    const success = screen.getByTestId('Success');
    expect(success.textContent).toContain('Najm Ref');
  });

  it('calls window.scrollTo on mount', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    renderWithContext(
      { validationData, claimResponse, claimsInfo: { refNo: '45abc' } },
      mockLanguageData
    );
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    scrollToSpy.mockRestore();
  });
});
