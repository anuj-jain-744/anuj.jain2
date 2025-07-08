import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Chatbot from './Chatbot';

// Mock the useSelector hook
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Chatbot Component', () => {
  const mockLanguageData = {
    need_assistance_to: 'Need assistance with',
    chatbot_labels: ['Label 1', 'Label 2', 'Label 3'],
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: {
          languageData: mockLanguageData,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Chatbot />);
    expect(screen.getByAltText('walaa icon')).toBeInTheDocument();
  });

  test('displays the correct initial label', () => {
    render(<Chatbot />);
    expect(screen.getByText(mockLanguageData.need_assistance_to)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.chatbot_labels[0])).toBeInTheDocument();
  });

  test('changes label after interval', () => {
    jest.useFakeTimers();
    render(<Chatbot />);
    
    // Initial label
    expect(screen.getByText(mockLanguageData.chatbot_labels[0])).toBeInTheDocument();
    
    // Fast-forward 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });
  });

  test('changes isClicked state on click', () => {
    render(<Chatbot />);
    const container = screen.getByAltText('walaa icon').parentElement;

    // Initial state
    expect(container).not.toHaveClass('clicked');

    // Simulate click
    fireEvent.click(container);
  });

  test('sets isChanging state correctly during label change', () => {
    jest.useFakeTimers();
    render(<Chatbot />);
    
    // Initial label
    expect(screen.getByText(mockLanguageData.chatbot_labels[0])).toBeInTheDocument();
    
    // Fast-forward 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

  });
});