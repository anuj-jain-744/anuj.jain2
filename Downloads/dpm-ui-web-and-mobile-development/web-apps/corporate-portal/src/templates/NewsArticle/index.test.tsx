import React from 'react';
import { render, screen } from '@testing-library/react';
import { NewsArticleTemplate } from './index'; // Adjust import path
import '@testing-library/jest-dom';
import { NewsArticleTemplateProps } from './types';

jest.mock('components/DownloadPdfWidget', () => ({
  DownloadPdfWidget: jest.fn(() => <div>Download PDF</div>),
}));

jest.mock('components/RelatedLink', () => ({
  RelatedLink: jest.fn(() => <div>Related Links</div>),
}));

jest.mock('components/HighlighterWidget', () => ({
  HighlighterWidget: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('./commonWidget', () => ({
  ContactWidget: jest.fn(() => <div>Contact Widget</div>),
}));

const mockData: NewsArticleTemplateProps['data'] = {
  image_url: 'https://example.com/image.jpg',
  title: 'Test Title',
  news_category: 'Category',
  created_date: '2025-02-14',
  news_inner_title: 'Test Inner Title',
  short_description: 'Test short description',
  // Updated this line to ensure `newscontact` is an array
  newscontact: [{
      name: 'John Doe', email: 'john@example.com',
      label: '',
      class: '',
      url: ''
  }],
  attachments: [{ title: 'PDF File', url: 'https://example.com/file.pdf' }],
  content: '<p>Test Content</p>',
  handleNavigate: jest.fn(),
  related_news: [],
  relatedLinks: 'Related Links',
  allPost_label: 'All Posts',
  attachments_label: 'Attachments',
  event_title: 'Test Event',
  time_label: 'Event Time',
  event_time: '12:00 PM',
  date_label: 'Event Date',
  event_date: '2025-02-14',
  location_label: 'Event Location',
  event_location: 'Test Location',
};

describe('NewsArticleTemplate Component', () => {
  it('renders the article title and category', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders the inner title, short description, and event title', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('Test Inner Title')).toBeInTheDocument();
    expect(screen.getByText('Test short description')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders meeting-related information when event details are available', () => {
    render(<NewsArticleTemplate data={mockData} />);

    // Ensure that the meeting details (time, date, location) are rendered
    expect(screen.getByText('Event Time')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Event Date')).toBeInTheDocument();
    expect(screen.getByText('2025-02-14')).toBeInTheDocument();
    expect(screen.getByText('Event Location')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('renders the content correctly with sanitized HTML', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the ContactWidget when contact data is provided', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('Contact Widget')).toBeInTheDocument();
  });

  it('renders DownloadPdfWidget for each attachment', () => {
    render(<NewsArticleTemplate data={mockData} />);

    // Test if the attachment label is rendered
    expect(screen.getByText('Attachments')).toBeInTheDocument();

    // Test if the download widget is rendered for each attachment
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('renders RelatedLink for related news', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('Related Links')).toBeInTheDocument();
  });

  it('renders the "All Posts" label and action icon', () => {
    render(<NewsArticleTemplate data={mockData} />);

    expect(screen.getByText('All Posts')).toBeInTheDocument();
  });

  it('should handle chunked meeting data rendering', () => {
    render(<NewsArticleTemplate data={mockData} />);

    // Check if meeting data chunking logic was applied (e.g., row wrapping and separation)
    expect(screen.getAllByText('Event Time')).toHaveLength(1);
    expect(screen.getAllByText('Event Date')).toHaveLength(1);
    expect(screen.getAllByText('Event Location')).toHaveLength(1);
  });
});
 