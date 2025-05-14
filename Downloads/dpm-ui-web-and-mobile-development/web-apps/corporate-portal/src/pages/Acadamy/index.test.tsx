 

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Acadamy } from './index';
 
// Mock the child components
jest.mock('../../components/RelatedLink', () => ({
  RelatedLink: ({ type, relatedContent }: any) => (
<div data-testid="related-link">
<span>{type}</span>
<span>{JSON.stringify(relatedContent)}</span>
</div>
  ),
}));
 
 
describe('Acadamy Component', () => {
  const defaultProps = {
    content: '<p>Academy content</p>',
    trainingdiscription: '<p>Training description</p>',
    trainingimageurl: 'https://example.com/training.jpg',
    trainingimagealt: 'Training Image',
    visiontitle: 'Vision Title',
    visiondiscription: 'Vision description',
    imageurl: 'https://example.com/vision.jpg',
    imagealt: 'Vision Image',
    relatedTitle: 'Related Links',
    relatedlink: [
      { url: 'https://example.com/related1', title: 'Related Link 1' },
      { url: 'https://example.com/related2', title: 'Related Link 2' },
    ],
  };
 
  test('renders Academy content correctly', () => {
    render(<Acadamy {...defaultProps} />);
 
    expect(screen.getByText('Academy content')).toBeInTheDocument();
  });
 
  test('renders RelatedLink with correct props', () => {
    render(<Acadamy {...defaultProps} />);
  
    const relatedLink = screen.getByTestId('related-link');
    expect(relatedLink).toHaveTextContent('Academy');
    expect(relatedLink).toHaveTextContent(JSON.stringify(defaultProps.relatedlink));
  });
 
  
  test('renders training section correctly', () => {
    render(<Acadamy {...defaultProps} />); 
    const trainingImage = screen.getByAltText(defaultProps.trainingimagealt);
    expect(trainingImage).toHaveAttribute('src', defaultProps.trainingimageurl);
    expect(screen.getByText('Training description')).toBeInTheDocument();
  });

});
