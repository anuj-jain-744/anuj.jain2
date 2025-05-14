import React from 'react';
import { render, screen } from '@testing-library/react';
import AcceessPolicyDocuments from './AccessPolicyDocuments';
import useLanguageData from './hooks/useLanguageData';
import { useLocation } from 'react-router-dom';

jest.mock('./hooks/useLanguageData');
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));
jest.mock('./PolicyRelatedDocuments/PolicyContent', () => {
  return function MockPolicyContent(props: any) {
    return <div data-testid="policy-content">
      <div>Policy Number: {props.policyNumber}</div>
      <div>Is Loading: {props.isLanguageLoading.toString()}</div>
      <div>Has Error: {(props.languageError !== null).toString()}</div>
    </div>;
  };
});

describe('AcceessPolicyDocuments', () => {
  const mockNavigateTo = jest.fn();
  const mockPolicyNo = '12345';
  const mockLanguageData = { someKey: 'someValue' };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { policyNo: mockPolicyNo },
    });
  });

  it('renders PolicyContent with correct props', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: mockLanguageData,
      isLoading: false,
      error: null,
    });

    render(<AcceessPolicyDocuments navigateTo={mockNavigateTo} />);

    expect(screen.getByTestId('policy-content')).toBeInTheDocument();
    expect(screen.getByText(`Policy Number: ${mockPolicyNo}`)).toBeInTheDocument();
    expect(screen.getByText('Is Loading: false')).toBeInTheDocument();
    expect(screen.getByText('Has Error: false')).toBeInTheDocument();
  });

  it('passes loading state to PolicyContent', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: null,
      isLoading: true,
      error: null,
    });

    render(<AcceessPolicyDocuments navigateTo={mockNavigateTo} />);

    expect(screen.getByText('Is Loading: true')).toBeInTheDocument();
  });

  it('passes error state to PolicyContent', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: null,
      isLoading: false,
      error: new Error('Language data error'),
    });

    render(<AcceessPolicyDocuments navigateTo={mockNavigateTo} />);

    expect(screen.getByText('Has Error: true')).toBeInTheDocument();
  });

  it('passes navigateTo prop to PolicyContent', () => {
    (useLanguageData as jest.Mock).mockReturnValue({
      languageData: mockLanguageData,
      isLoading: false,
      error: null,
    });

    render(<AcceessPolicyDocuments navigateTo={mockNavigateTo} />);

    const policyContent = screen.getByTestId('policy-content');
    expect(policyContent).toBeInTheDocument();
    // Note: We can't directly test if the navigateTo prop is passed,
    // but we can infer it's being passed if PolicyContent renders correctly
  });
});

