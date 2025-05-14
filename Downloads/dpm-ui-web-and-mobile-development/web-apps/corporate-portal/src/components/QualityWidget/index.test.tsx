import React from 'react';
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QualityWidget } from './index'; 
import { sanitizeHtml } from '@dpm/shared-module';

// Mocking sanitizeHtml function
jest.mock('@dpm/shared-module', () => ({
  sanitizeHtml: jest.fn((html) => html), 
}));

describe('QualityWidget Component', () => {
  const data = '<p>Test HTML Content</p>';
  const icons:any = ['icon1.png', 'icon2.png'];

  it('renders without crashing', () => {
    const { container } = render(<QualityWidget data={data} icons={icons} />);
    expect(container).toBeInTheDocument();
  });

  it('renders sanitized HTML content', () => {
    const { getByText } = render(<QualityWidget data={data} icons={icons} />);
    expect(getByText('Test HTML Content')).toBeInTheDocument();
    expect(sanitizeHtml).toHaveBeenCalledWith(data);
  });

  it('renders the icons correctly', () => {
    const { container } = render(<QualityWidget data={data} icons={icons} />);
    icons.forEach((iconUrl:string) => {
      expect(container.querySelector(`img[src="${iconUrl}"]`)).toBeInTheDocument();
    });
  });

  it('renders without icons', () => {
    const { container } = render(<QualityWidget data={data} icons={[]} />);
    expect(container.querySelectorAll('img').length).toBe(0);
  });
});
