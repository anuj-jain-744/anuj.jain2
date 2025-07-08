import React from 'react';
import { render, screen } from '@testing-library/react';
import ClaimDetailCard from './ClaimDetailCard';

describe('ClaimDetailCard Component', () => {
  it('renders with full trackNewData and trackClaimInfo', () => {
    const props = {
      trackNewData: {
        vehicleMake: 'Honda',
        plateNo: 'XYZ 999',
        caseReferenceNo: 'REF-001',
        ownerID: 'OWNER-1',
      },
      trackClaimInfo: {
        not_applicable: 'N/A',
        Logo: '/logo.svg',
        case_reference_no: 'Case Ref',
        owner_id_label: 'Owner ID',
      },
    };

    render(<ClaimDetailCard {...props} />);

    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('XYZ-999')).toBeInTheDocument();
    expect(screen.getByText('REF-001')).toBeInTheDocument();
    expect(screen.getByText('Owner ID')).toBeInTheDocument();
    expect(screen.getByText('OWNER-1')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', '/logo.svg');
  });

  it('renders fallback for missing trackNewData fields', () => {
    const props = {
      trackNewData: {},
      trackClaimInfo: {
        not_applicable: 'N/A',
        Logo: '/logo.svg',
        case_reference_no: 'Case Ref',
        owner_id_label: 'Owner ID',
      },
    };

    render(<ClaimDetailCard {...props} />);
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
    expect(screen.getByText('Owner ID')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders correctly with only trackClaimInfo', () => {
    const props = {
      trackClaimInfo: {
        not_applicable: 'Not Applicable',
        Logo: '/logo.svg',
        case_reference_no: 'Claim-Ref-100',
        owner_id_label: 'Owner Info',
      },
    };

    render(<ClaimDetailCard {...props} />);

    expect(screen.getByText('Claim-Ref-100')).toBeInTheDocument();
    expect(screen.getByText('Owner Info')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute('src', '/logo.svg');
  });

  it('handles undefined plateNo without crashing', () => {
    const props = {
      trackNewData: {
        vehicleMake: 'Ford',
      },
      trackClaimInfo: {
        not_applicable: 'N/A',
        Logo: '/logo.svg',
      },
    };

    render(<ClaimDetailCard {...props} />);
    expect(screen.getByText('Ford')).toBeInTheDocument();
    const plate = screen.getByTestId('plate-number');
    expect(plate).toHaveTextContent('N/A');
  });
});
