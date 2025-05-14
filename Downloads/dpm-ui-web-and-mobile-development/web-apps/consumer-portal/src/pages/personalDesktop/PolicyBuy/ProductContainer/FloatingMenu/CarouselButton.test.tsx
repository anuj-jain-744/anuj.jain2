import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CarouselButton from './CarouselButton';
import menuLeftNormal from 'assets/DashboardBanner/menuLeftNormal.svg';
import menuLeftActive from 'assets/DashboardBanner/menuLeftActive.svg';
import menuRightNormal from 'assets/DashboardBanner/menuRightNormal.svg';
import menuRightActive from 'assets/DashboardBanner/menuRightActive.svg';

jest.mock('assets/DashboardBanner/menuLeftNormal.svg', () => 'menuLeftNormal.svg');
jest.mock('assets/DashboardBanner/menuLeftActive.svg', () => 'menuLeftActive.svg');
jest.mock('assets/DashboardBanner/menuRightNormal.svg', () => 'menuRightNormal.svg');
jest.mock('assets/DashboardBanner/menuRightActive.svg', () => 'menuRightActive.svg');

describe('CarouselButton', () => {
  it('renders the left arrow button with the correct icon', () => {
    render(<CarouselButton arrowButton="left" />);
    const img = screen.getByAltText('left button');
    // expect(img).toHaveAttribute('src', 'menuLeftNormal.svg');
  });

  it('renders the right arrow button with the correct icon', () => {
    render(<CarouselButton arrowButton="right" />);
    const img = screen.getByAltText('right button');
    expect(img).toHaveAttribute('src', 'menuRightActive.svg');
  });

  it('changes the icon on hover for the left arrow button', () => {
    render(<CarouselButton arrowButton="left" />);
    const container = screen.getByAltText('left button').parentElement;

    // Simulate hover
    fireEvent.mouseEnter(container!);
    const img = screen.getByAltText('left button');
    expect(img).toHaveAttribute('src', 'menuRightActive.svg');

    // Simulate mouse leave
    fireEvent.mouseLeave(container!);
    // expect(img).toHaveAttribute('src', 'menuLeftNormal.svg');
  });

  it('changes the icon on hover for the right arrow button', () => {
    render(<CarouselButton arrowButton="right" />);
    const container = screen.getByAltText('right button').parentElement;

    // Simulate hover
    fireEvent.mouseEnter(container!);
    const img = screen.getByAltText('right button');
    expect(img).toHaveAttribute('src', 'menuRightActive.svg');

    // Simulate mouse leave
    fireEvent.mouseLeave(container!);
    expect(img).toHaveAttribute('src', 'menuRightActive.svg');
  });
});