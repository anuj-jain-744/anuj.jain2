import { render, screen } from '@testing-library/react';
import ContactCard from './ContactCard'; // Adjust import path if necessary
import { useClaimContext } from 'Motor/ClaimHooks/useClaimContext';

// Mock the useClaimContext hook
jest.mock('Motor/ClaimHooks/useClaimContext', () => ({
  useClaimContext: jest.fn(),
}));

jest.mock('../../../../../../../corporate-portal/src/utils/icons', () => ({
  IconsSet: {
    icon1: 'path/to/icon1.svg',
    icon2: 'path/to/icon2.svg',
  },
}));

describe('ContactCard Component', () => {
  const mockTrackClaimInfo = { contact_walaa: 'Contact Walaa Info' };
  const mockHandleNavigate = jest.fn();
  const mockContactData = [
    {
      linkName: 'Contact Us',
      childrens: [
        {
          linkName: 'Menu Item 1',
          menuUrl: '/menu1',
          link_content: '<div>Some HTML Content</div>',
          attributes: { class: ['icon1'] },
        },
        {
          linkName: 'Menu Item 2',
          menuUrl: '/menu2',
          link_content: null,
          attributes: { class: ['icon2'] },
        },
      ],
    },
  ];

  beforeEach(() => {
    useClaimContext.mockReturnValue({
      trackClaimInfo: mockTrackClaimInfo,
      contactData: mockContactData,
      handleNavigate: mockHandleNavigate,
    });
  });

  it('should render without crashing', () => {
    render(<ContactCard />);
    expect(screen.getByText('Contact Walaa Info')).toBeInTheDocument();
  });

  // it('should render contact menu items', () => {
  //   render(<ContactCard />);
  //   expect(screen.getByText('Menu Item 1')).toBeInTheDocument();
  //   expect(screen.getByText('Menu Item 2')).toBeInTheDocument();
  // });

  it('should render link content for the first menu item', () => {
    render(<ContactCard />);
    expect(screen.getByText('Some HTML Content')).toBeInTheDocument();
  });

  // it('should call handleNavigate when menu items are clicked', () => {
  //   render(<ContactCard />);

  //   const menuItem1 = screen.getByText('Menu Item 1');
  //   fireEvent.click(menuItem1);
  //   expect(mockHandleNavigate).toHaveBeenCalledWith('/menu1');

  //   const menuItem2 = screen.getByText('Menu Item 2');
  //   fireEvent.click(menuItem2);
  //   expect(mockHandleNavigate).toHaveBeenCalledWith('/menu2');
  // });

  // it('should display an icon for each menu item', () => {
  //   render(<ContactCard />);
  //   const menuItem1Icon = screen.getByAltText('shuffle-icon');
  //   expect(menuItem1Icon).toHaveAttribute('src', 'path/to/icon1.svg');
  //   const menuItem2Icon = screen.getByAltText('shuffle-icon');
  //   expect(menuItem2Icon).toHaveAttribute('src', 'path/to/icon2.svg');
  // });

  // it('should not render link content if it is null', () => {
  //   render(<ContactCard />);
  //   const linkContent = screen.queryByText('Some HTML Content');
  //   expect(linkContent).not.toBeInTheDocument();
  // });

  it('should render the contact card header', () => {
    render(<ContactCard />);
    expect(screen.getByText('Contact Walaa Info')).toBeInTheDocument();
  });

  // it('should render menu items with class names for icons', () => {
  //   render(<ContactCard />);
  //   const firstMenuItem = screen.getByText('Menu Item 1');
  //   expect(firstMenuItem).toBeInTheDocument();
  // });
});
