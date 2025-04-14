import { render, screen } from '@testing-library/react';
import { DataContext } from "../../../../../../DataContext";
import NoteRight from '.';
import { Mock } from 'jest-mock'; // Make sure the jest-mock module is available

// Mock image import
jest.mock('assets/Claims/Idea.svg', () => 'mocked-idea.svg');

// Mock the DataContext provider
const mockData = {
  popup_subtitle_two: 'This is a subtitle',
  popup_body_content_two: [
    { value: 'First content line' },
    { value: 'Second content line' },
    { value: 'Third content line' },
  ],
};

describe('NoteRight Component', () => {
  it('renders the NoteRight component with correct content', () => {
    // Render the component with a mock value for DataContext
    render(
      <DataContext.Provider value={mockData}>
        <NoteRight />
      </DataContext.Provider>
    );

    // Check that the subtitle text is rendered correctly
    expect(screen.getByText(mockData.popup_subtitle_two)).toBeInTheDocument();

    // Check that the body content is rendered correctly (each content item)
    expect(screen.getByText(mockData.popup_body_content_two[0].value)).toBeInTheDocument();
    expect(screen.getByText(mockData.popup_body_content_two[1].value)).toBeInTheDocument();
    expect(screen.getByText(mockData.popup_body_content_two[2].value)).toBeInTheDocument();

    // Check that the additional tracking message is rendered correctly
    expect(
      screen.getByText('Also, you can Track your Claims through Walaa website Walaa.com.')
    ).toBeInTheDocument();

    // Check that the image is rendered correctly
    const image = screen.getByAltText('claim_reg_det');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-idea.svg');
  });
});
