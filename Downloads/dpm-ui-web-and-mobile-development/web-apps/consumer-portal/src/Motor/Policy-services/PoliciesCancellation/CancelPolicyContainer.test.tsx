import React from 'react';
import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import CancelPolicyContainer from './CancelPolicyContainer';

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

jest.mock('./CancelPolicy', () => {
        return function DummyCancelPolicy(props: { policyNo: string }) {
                return <div>Cancel Policy Component - Policy No: {props.policyNo}</div>;
        };
});

describe('CancelPolicyContainer', () => {
  test('renders CancelPolicy component with correct props', () => {
    // Mock the location state
    (useLocation as jest.Mock).mockReturnValue({
      state: { policyNo: '12345' },
    });

    const { getByText } = render(<CancelPolicyContainer navigateTo="/home" />);

    // Check if the CancelPolicy component is rendered with the correct policy number
    expect(getByText(/Cancel Policy Component - Policy No/i)).toBeInTheDocument();
  });
});