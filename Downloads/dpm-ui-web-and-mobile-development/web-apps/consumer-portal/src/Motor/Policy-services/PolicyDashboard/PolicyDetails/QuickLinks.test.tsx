import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickLinks } from './QuickLinks';
import tokenAdd from 'assets/PolicyDetails/tokenAdd.svg';
import Contract_Delete from 'assets/PolicyDetails/Contract_Delete.svg';
import History from 'assets/PolicyDetails/History.svg';
import Download from 'assets/PolicyDetails/Download.svg';

describe('QuickLinks Component', () => {
  const mockNavigateTo = jest.fn();

  const links = [
    {
      icon: tokenAdd,
      text: 'Endorsements',
      url: '/Motor/Claim/Endorsement'
    },
    {
      icon: Contract_Delete,
      text: 'Cancel Policy',
      url: '/Motor/Claim/Policy-Cancellation'
    },
    {
      icon: History,
      text: 'Policy History',
      url: ''
    },
    {
      icon: Download,
      text: 'Policy Documents',
      url: '/Motor/Claim/Policy-Dcouments'
    }
  ];

  beforeEach(() => {
    render(<QuickLinks navigateTo={mockNavigateTo} />);
  });

  it('should render all quick links', () => {
    links.forEach(link => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
      expect(screen.getByAltText(link.text)).toBeInTheDocument();
    });
  });

  it('should call navigateTo with correct URL when a link is clicked', () => {
    links.forEach(link => {
      const linkElement = screen.getByText(link.text);
      fireEvent.click(linkElement);
      expect(mockNavigateTo).toHaveBeenCalledWith(link.url,  {"allPolicy": [], "policyNo": undefined});
      mockNavigateTo.mockClear();
    });
  });
});