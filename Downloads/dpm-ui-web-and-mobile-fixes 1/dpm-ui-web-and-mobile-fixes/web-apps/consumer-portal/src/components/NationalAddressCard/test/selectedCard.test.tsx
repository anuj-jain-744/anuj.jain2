
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SelectedCard } from '../selectedCard/index';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';

// Mock the context
jest.mock('context/PHQuoteBuyContext', () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

const mockContextValues = {
  homeConfig: {
    property_built_year_placeholder: 'Enter build year',
    not_applicable_to_apartments: 'N/A',
    view_property_location_map: 'View Property Location',
    property_form_values_string: {
      build_form: { label: 'Build Year', required: true, max_build_year: 2023, validationMessage: 'Invalid year' },
      floor_form: { label: 'Floor', required: true, floors_options: ['Option 1', 'Option 2'] },
      type_form: { label: 'Type', required: true, option: ['Option 1', 'Option 2'] },
    },
    totalfloor_tooltip_title: 'Total Floors',
    totalfloor_tooltip_description: 'Description of total floors',
  },
  formAddressSelection: {
    propertyType: { activeIndex: 0, activeLabel: '' },
    propertyFloor: '',
    propertyBuildYear: '',
  },
  setShowPropertyMap: jest.fn(),
  buildYearError: '',
  setBuildYearError: jest.fn(),
};

describe('SelectedCard Component', () => {
  beforeEach(() => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue(mockContextValues);
  });

  const handlePropertySelection = jest.fn();

  const props = {
    formDisabled: false,
    handlePropertySelection,
    latitude: '12.34',
    longitude: '56.78',
    propsData: { ownerId: '2000000000' },
  };

  test('renders SelectedCard component', () => {
    render(<SelectedCard {...props} />);
    expect(screen.getByText('Build Year')).toBeInTheDocument();
    expect(screen.getByText('Floor')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  test('handles build year input change', () => {
    render(<SelectedCard {...props} />);
    const buildYearInput = screen.getByPlaceholderText('Enter build year');
    fireEvent.change(buildYearInput, { target: { value: '2020' } });
    expect(handlePropertySelection).toHaveBeenCalledWith('propertyBuildYear', '2020');
  });

  test('triggers property location map', () => {
    render(<SelectedCard {...props} />);
    const viewPropertyLink = screen.getByText('View Property Location');
    fireEvent.click(viewPropertyLink);
    expect(mockContextValues.setShowPropertyMap).toHaveBeenCalledWith({
      show: true,
      latitude: '12.34',
      longitude: '56.78',
    });
  });

  test('shows and hides modal correctly', async () => {
    render(<SelectedCard {...props} />);
    const infoButton = screen.getByTestId("buttonTestId");
    fireEvent.click(infoButton);
    expect(screen.getByText('Total Floors')).toBeInTheDocument();
    const closeButton = screen.getByTestId("buttonTestId");
    fireEvent.click(closeButton);
    waitFor(() => { 
      expect(screen.queryByText('Total Floors')).not.toBeInTheDocument();
    });
   
  });
});
