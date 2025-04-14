import React from 'react';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom"; 
import { AboutWalaa } from './index'; 
import { SubNavBar } from '../../components/SubNavBar';
import { Support, QualityWidget, ManagementTeam, OurJourney, RelatedLink } from '../../components';
import { sanitizeHtml } from '@dpm/shared-module';

// Mock the imported components
jest.mock('../../components', () => ({
  SubNavBar: jest.fn(() => <div>SubNavBar Component</div>),
  Support: jest.fn(() => <div>Support Component</div>),
  QualityWidget: jest.fn(() => <div>QualityWidget Component</div>),
  ManagementTeam: jest.fn(() => <div>ManagementTeam Component</div>),
  OurJourney: jest.fn(() => <div>OurJourney Component</div>)
}));

jest.mock('../../components/RelatedLink', () => ({
  RelatedLink: jest.fn(() => <div>RelatedLink Component</div>)
}));

jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html) // Mock implementation
}));

describe('AboutWalaa Component', () => {
  const props = {
    content: '<p>About Walaa Content</p>',
    relatedTitle: 'Related Links Title',
    relatedlink: [{ title: 'Link 1', url: 'https://example.com' }],
    tabs: ['Tab 1', 'Tab 2'],
    visionmission: '<h3>Our Mission</h3><p>Our mission description.</p>',
    missionCards: [{ title: 'Mission 1', description: 'Description 1' }],
    quality: 'Quality content',
    qualityIcons: ['icon1.png', 'icon2.png'],
    creditTitle: '<h3>Credit Title</h3><p>Credit description.</p>',
    creditData: [{ name: 'Credit Data 1' }],
    ourJourneyData: 'Our journey content',
    ourJourneyVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };

  it('renders without crashing', () => {
    const { container } = render(<AboutWalaa content={props.content}
        relatedTitle={props.relatedTitle}
        relatedlink={[]}
        tabs={[]}
        visionmission={props.visionmission}
        missionCards={[]}
        quality={props.quality}
        qualityIcons={[]}
        creditTitle={props.creditTitle}
        creditData={[]}
        ourJourneyData={props.ourJourneyData}
        ourJourneyVideo={props.ourJourneyVideo} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the main content correctly', () => {
    const { getByText } = render(<AboutWalaa content={props.content}
        relatedTitle={props.relatedTitle}
        relatedlink={[]}
        tabs={[]}
        visionmission={props.visionmission}
        missionCards={[]}
        quality={props.quality}
        qualityIcons={[]}
        creditTitle={props.creditTitle}
        creditData={[]}
        ourJourneyData={props.ourJourneyData}
        ourJourneyVideo={props.ourJourneyVideo} />);
    expect(getByText('About Walaa Content')).toBeInTheDocument();
    expect(sanitizeHtml).toHaveBeenCalledWith(props.content);
  });

  it('renders the main content without data', () => {
    const { getByText } = render(<AboutWalaa content={props.content}
        relatedTitle={props.relatedTitle}
        relatedlink={[]}
        tabs={[]}
        visionmission={''}
        missionCards={[]}
        quality={props.quality}
        qualityIcons={[]}
        creditTitle={''}
        creditData={[]}
        ourJourneyData={props.ourJourneyData}
        ourJourneyVideo={props.ourJourneyVideo} />);
    expect(getByText('About Walaa Content')).toBeInTheDocument();
    expect(sanitizeHtml).toHaveBeenCalledWith(props.content);
  });
});

