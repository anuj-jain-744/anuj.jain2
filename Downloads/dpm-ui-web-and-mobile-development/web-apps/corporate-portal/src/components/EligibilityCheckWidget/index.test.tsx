import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { EligibilityCheck } from './index';

const mockNavigateTo = jest.fn();

const mockContent = {
  sidebar_data: [
    {
      title: 'Check Your Eligibility',
      description: 'Find out if you are eligible for our services.',
      check_eligibility: 'Check Now',
      check_eligibility_link: '/check-eligibility'
    }
  ]
};

describe('EligibilityCheck', () => {
  beforeEach(() => {
    render(<EligibilityCheck content={mockContent} navigateTo={mockNavigateTo} />);
  });

  test('renders the widget with provided content', () => {
    const title = screen.getByTestId('chk-title');
    const description = screen.getByTestId('chk-desc');
    const button = screen.getByTestId('chk-btn');

    expect(title).toHaveTextContent(mockContent.sidebar_data[0].title);
    expect(description).toHaveTextContent(mockContent.sidebar_data[0].description);
    expect(button).toHaveTextContent(mockContent.sidebar_data[0].check_eligibility);
  });

  test('navigates to the correct URL on button click', () => {
    const button = screen.getByTestId('chk-btn');
    fireEvent.click(button);
    expect(mockNavigateTo).toHaveBeenCalledWith(mockContent.sidebar_data[0].check_eligibility_link);
  });

  test('does not navigate if check_eligibility_link is not provided', () => {
    const modifiedContent = {
      ...mockContent,
      sidebar_data: [
        {
          ...mockContent.sidebar_data[0],
          check_eligibility_link: null
        }
      ]
    };
    render(<EligibilityCheck content={modifiedContent} navigateTo={mockNavigateTo} />);

  });
});
