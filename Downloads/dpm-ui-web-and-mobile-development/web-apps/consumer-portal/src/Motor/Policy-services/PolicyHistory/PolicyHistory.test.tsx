import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import PolicyHistory from './PolicyHistory';
import { useDownloadPDF } from "hook/common/useDownloadPdf";
import { RootState, useApiCall } from '@dpm/shared-module';

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: jest.fn(),
  };
});

jest.mock('@dpm/shared-module', () => {
  const actualSharedModule = jest.requireActual('@dpm/shared-module');
  return {
    ...actualSharedModule,
    useApiCall: jest.fn(),
  };
});

jest.mock('hook/common/useDownloadPdf', () => ({
  useDownloadPDF: jest.fn(() => ({
    processPDFs: jest.fn(),
  })),
}));

jest.mock('Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createZip: jest.fn(),
  })),
}));

describe('PolicyHistory Component', () => {
  (useSelector as unknown as jest.Mock).mockImplementation(
    (selector: (state: RootState) => unknown) => selector({
      policyHistory: {
        policyHistory: [
          {
            endorsementType: 'Initial Policy',
            nationalID: '1234567890',
            policyNo: 'P12345',
            premium: 1000,
            productCode: 'MOTOR',
            endoSubType: null,
            endorsementNo: null,
            issueDate: '2024-01-01',
            coverage: 'Comprehensive',
            repairType: 'Agency',
            name: 'John Doe',
          },
          {
            endorsementType: 'Endorsement',
            nationalID: '1234567890',
            policyNo: 'P12345',
            premium: 1100,
            productCode: 'MOTOR',
            endoSubType: 'Address Change',
            endorsementNo: 'E123',
            issueDate: '2024-02-01',
            coverage: 'Comprehensive',
            repairType: 'Agency',
            name: 'John Doe',
          },
        ],
      },
      dashbaordLanguageData: {
        languageData: {
          policy_history: 'Policy History',
          your_policy_timeline: 'Your Policy Timeline',
          type_of_endorsement: 'Type of Endorsement',
          premium_change: 'Premium Change',
          name_label: 'Name',
          date: 'Date',
          download_document: 'Download Document',
          motor_policy_no: 'Policy No.',
          coverage: 'Coverage',
          repair_type: 'Repair Type',
        },
      },
    } as unknown)
  );

  interface PolicyData {
    endorsementType: string;
    nationalID: string;
    policyNo: string;
    premium: number;
    productCode: string;
    endoSubType: string;
    endorsementNo: string;
  }

  const policyData: PolicyData = {
    policyNo: 'P12345',
    productCode: 'MOTOR',
    endorsementType: 'Initial Policy',
    nationalID: '1234567890',
    premium: 1000,
    endoSubType: 'Endo Sub Type',
    endorsementNo: 'Endorsement No',
  };

  const navigateTo = jest.fn();

  it('renders without crashing', () => {
    render(
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    );
  });

  it('displays policy history items', () => {
    render(
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    );

    expect(screen.getByText('Initial Policy')).toBeInTheDocument();
    expect(screen.getByText('Endorsement')).toBeInTheDocument();
  });

  it('sorts policy history items by issue date in descending order', () => {
    render(
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    );

    const policyItems = screen.getAllByText(/^(Initial Policy|Endorsement)$/);
    expect(policyItems[0]).toHaveTextContent('Endorsement');
    expect(policyItems[1]).toHaveTextContent('Initial Policy');
  });

  it('toggles accordion on click', () => {
    render(
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    );

    const expandButtons = screen.getAllByRole('button');
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText('Type of Endorsement')).toBeVisible();
    fireEvent.click(expandButtons[0]);
  });

  it('calls download document function when download button is clicked', async () => {
    const mockPolicyApiCall = jest.fn().mockResolvedValue(undefined);
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockPolicyApiCall,
      data: [{ name: 'test.pdf', url: 'test.pdf' }],
    });

    const mockProcessPDFs = jest.fn().mockResolvedValue(undefined);
    (useDownloadPDF as jest.Mock).mockReturnValue({
      processPDFs: mockProcessPDFs,
    });

    render(
      <PolicyHistory policyData={policyData} navigateTo={navigateTo} />
    );

    const expandButtons = screen.getAllByRole('button');
    fireEvent.click(expandButtons[0]);
    const downloadButton = screen.getByText('Download Document');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockPolicyApiCall).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockProcessPDFs).toHaveBeenCalled();
    });
  });
});
