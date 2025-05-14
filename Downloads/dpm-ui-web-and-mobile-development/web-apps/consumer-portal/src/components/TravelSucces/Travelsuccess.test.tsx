import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TravelSucces from './index';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn()
}));

jest.mock('../../Motor/SuccessPage/SuccesRightComponent', () => () => <div>SuccesRightComponent</div>);
jest.mock('../../Motor/SuccessPage/SuccessTopComponent', () => () => <div>SuccessTopComponent</div>);
jest.mock('../TravelSuccessLeft', () => () => <div>TravelSuccessLeft</div>);
jest.mock('components/Footer', () => () => <div>PolicyFooter</div>);
jest.mock('components/DomesticLabour', () => () => <div>DomesticLabourCard</div>);
jest.mock('components/Feedback', () => () => <div>Feedback</div>);
jest.mock('react-bootstrap', () => {
  const actual = jest.requireActual('react-bootstrap');
  return {
    ...actual,
    Modal: ({ show, onHide, children }: { show: boolean; onHide: () => void; children: React.ReactNode }) => (
      show ? <div>{children}</div> : null
    )
  };
});

describe('TravelSucces', () => {
  const defaultProps = {
    status: true,
    data: {
      policyNumber: '12345'
    },
    flag: false
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <TravelSucces {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  it('should render SuccessTopComponent', () => {
    renderComponent();
    expect(screen.getByText('SuccessTopComponent')).toBeInTheDocument();
  });

  it('should render SuccesRightComponent', () => {
    renderComponent();
    expect(screen.getByText('SuccesRightComponent')).toBeInTheDocument();
  });

  it('should render TravelSuccessLeft', () => {
    renderComponent();
    expect(screen.getByText('TravelSuccessLeft')).toBeInTheDocument();
  });

  it('should render DomesticLabourCard when status is true', () => {
    renderComponent();
    expect(screen.getByText('DomesticLabourCard')).toBeInTheDocument();
  });

  it('should render PolicyFooter when flag is false', () => {
    renderComponent({ flag: false });
    expect(screen.getByText('PolicyFooter')).toBeInTheDocument();
  });

  it('should not render PolicyFooter when flag is true', () => {
    renderComponent({ flag: true });
    expect(screen.queryByText('PolicyFooter')).not.toBeInTheDocument();
  });

  it('should render Feedback modal when feedbackpopup is true', () => {
    renderComponent();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('should close Feedback modal when handleClose is called', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Close')); 
    expect(screen.queryByText('Feedback')).not.toBeInTheDocument();
  });
});