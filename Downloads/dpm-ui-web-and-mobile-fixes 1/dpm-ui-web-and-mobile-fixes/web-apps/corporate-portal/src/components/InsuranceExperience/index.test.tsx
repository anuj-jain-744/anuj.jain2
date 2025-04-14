import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InsuranceExperience } from './index';
import { SliderItem, MobileDownloadItem } from './index'; 
import CarousalImg from './CarousalImg';

// Mock data for the tests
const mockSliderData: SliderItem[] = [
  {
    slider_image_url: 'https://example.com/slide1.jpg',
    slider_title: 'Slide 1',
    slider_description: 'Description 1',
  },
  {
    slider_image_url: 'https://example.com/slide2.jpg',
    slider_title: 'Slide 2',
    slider_description: 'Description 2',
  },
];

const mockMobileDownload: MobileDownloadItem[] = [
  {
    app_image_title: 'App 1',
    app_image_url: 'https://example.com/app1.png',
    app_url: 'https://example.com/app1',
  },
  {
    app_image_title: 'QR Code',
    app_image_url: 'https://example.com/qr.png',
    app_url: 'https://example.com/qr',
  },
];

const mockProps = {
  title: 'Insurance Experience',
  description: 'Experience the best insurance with us.',
  downLoadApp: 'Download Our App',
  mobileDownload: mockMobileDownload,
  sliderData: mockSliderData,
};

describe('Insurance Experience Component', () => {

  test('renders without crashing', () => {
    act(() => {
      render(<InsuranceExperience {...mockProps} />);
    });
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  test('displays QR code in the download section', () => {
    act(() => {
      render(<InsuranceExperience {...mockProps} />);
    });
    const qrCodeImage = screen.getByAltText('QR Code');
    expect(qrCodeImage).toBeInTheDocument();
    expect(qrCodeImage).toHaveAttribute('src', mockMobileDownload[1].app_image_url);
  });

  
  test('Not displays QR code in the download section', () => {
    act(() => {
      render(<InsuranceExperience 
        {...mockProps}
        mobileDownload={[{
          app_image_title: 'App 1',
          app_image_url: 'https://example.com/app1.png',
          app_url: 'https://example.com/app1',
          }]}
        isVisible={true}
        />);
    });
    const qrCodeImage = screen.queryByText('QR Code');
    expect(qrCodeImage).not.toBeInTheDocument();
  });

  test('renders download links correctly', () => {
    act(() => {
      render(<InsuranceExperience {...mockProps} />);
    });
    const downloadLinks = screen.getAllByRole('link');
    expect(downloadLinks).toHaveLength(1); // Only one non-QR code app link
    expect(downloadLinks[0]).toHaveAttribute('href', mockMobileDownload[0].app_url);
    expect(downloadLinks[0].querySelector('img')).toHaveAttribute('src', mockMobileDownload[0].app_image_url);
  });

  test('updates active slider on interval', async () => {
    jest.useFakeTimers();
    act(() => {
      render(<InsuranceExperience {...mockProps} />);
    });
    
    // Initial slider
    expect(screen.getByText(mockSliderData[0].slider_title)).toBeInTheDocument();
 
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Next slider
    await waitFor(() => expect(screen.getByText(mockSliderData[1].slider_title)).toBeInTheDocument());
    jest.useRealTimers();
  });
});

describe('CarousalImg Component', () => {
  test('renders with provided slideItem', () => {
    const slideItem = {
      slider_image_url: 'https://example.com/slide1.jpg',
    };

    render(<CarousalImg slideItem={slideItem} />);

    const imgElement = screen.getByAltText('slider-img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', slideItem.slider_image_url);
  });

  test('renders with empty slideItem', () => {
    const slideItem = {};

    render(<CarousalImg slideItem={slideItem} />);

    const imgElement = screen.getByAltText('slider-img');
    expect(imgElement).toBeInTheDocument();
  });
});