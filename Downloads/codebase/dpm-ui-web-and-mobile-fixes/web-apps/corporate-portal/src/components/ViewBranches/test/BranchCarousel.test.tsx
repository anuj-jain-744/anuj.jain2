import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import BranchCarousel from '../BranchCarousel';
import { renderBranchCard } from '../renderBranchCard';



jest.mock('../renderBranchCard');
jest.mock("../../../constant", () => ({
    VITE_CONTENT_BASE_URI: "mockedBaseUri",
    VITE_BACKEND_BASE_URL: "mockedBaseUri2",
    VITE_GOOGLE_MAPS_EMBED_API_KEY: "mockedBaseUri3",
    VITE_GOOGLE_MAPS_API_KEY: "mockedBaseUri4",
  }));
jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('BranchCarousel', () => {
  const mockHandleCardClick = jest.fn();
  const mockRenderBranchCard = renderBranchCard as jest.Mock;

  const branches = [
    {
      title: 'Branch 1',
      address: 'Address 1',
      phone: 'Phone 1',
      email: 'Email 1',
      working_hours: '9:00 AM - 5:00 PM',
      working_days: 'Mon-Fri',
      working_hours_data: '{}',
    },
    {
      title: 'Branch 2',
      address: 'Address 2',
      phone: 'Phone 2',
      email: 'Email 2',
      working_hours: '10:00 AM - 6:00 PM',
      working_days: 'Mon-Sat',
      working_hours_data: '{}',
    },
  ];

  const commonLabels = {
    working_hours_label: 'Working Hours',
    workschedule_label: 'Work Schedule',
  };

  beforeEach(() => {
    mockRenderBranchCard.mockImplementation(
      (
        title,
        address,
        phone,
        email,
        working_hours,
        working_days,
        working_hours_data,
        bIndex,
        commonLabels,
        activeCardIndex,
        handleCardClick
      ) => (
        <div key={bIndex} data-testid={`branch-card-${bIndex}`}>
          {title}
        </div>
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders BranchCarousel with branches', () => {
    render(
      <BranchCarousel
        filteredBranch={branches}
        activeCardIndex={0}
        handleCardClick={mockHandleCardClick}
        commonLabels={commonLabels}
      />
    );

    expect(screen.getByTestId('branch-card-0')).toHaveTextContent('Branch 1');
    expect(screen.getByTestId('branch-card-1')).toHaveTextContent('Branch 2');
  });

});