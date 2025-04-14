import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TravelSuccessLeft from './index';
import { Card } from 'react-bootstrap';
import ThemeButton from '../../Motor/Endorsement/sharedComponent/ThemeButton';

jest.mock('assets/SuccessPage/Line_new.svg', () => 'Line');
jest.mock('assets/SuccessPage/Download.svg', () => 'Download');
jest.mock('assets/SuccessPage/Whatsapp.svg', () => 'Whatsapp');
jest.mock('assets/SuccessPage/Mail.svg', () => 'Mail');
jest.mock('assets/SuccessPage/Branch.svg', () => 'Branch');
jest.mock('assets/SuccessPage/FeedBack.svg', () => 'FeedBack');
jest.mock('../../assets/QuoteAndBuy/travelinfo.svg', () => 'travelinfo');
jest.mock('react-bootstrap', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
jest.mock('../../Motor/Endorsement/sharedComponent/ThemeButton', () => () => <div>ThemeButton</div>);

describe('TravelSuccessLeft', () => {
  const defaultProps = {
    status: true,
    data: {
      policyNumber: '12345'
    }
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <TravelSuccessLeft {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  it('renders the component with images and ThemeButton', () => {
    renderComponent();

    expect(screen.getByAltText('Line')).toBeInTheDocument();
    expect(screen.getByAltText('Download')).toBeInTheDocument();
    expect(screen.getByAltText('Whatsapp')).toBeInTheDocument();
    expect(screen.getByAltText('Mail')).toBeInTheDocument();
    expect(screen.getByAltText('Branch')).toBeInTheDocument();
    expect(screen.getByAltText('FeedBack')).toBeInTheDocument();
    expect(screen.getByAltText('Travel Info')).toBeInTheDocument();
    expect(screen.getByText('ThemeButton')).toBeInTheDocument();
  });

  it('displays the policy number when status is true and data is provided', () => {
    renderComponent();

    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('does not display the policy number when status is false', () => {
    renderComponent({ status: false });

    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });

  it('does not display the policy number when data is not provided', () => {
    renderComponent({ data: null });

    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });
});