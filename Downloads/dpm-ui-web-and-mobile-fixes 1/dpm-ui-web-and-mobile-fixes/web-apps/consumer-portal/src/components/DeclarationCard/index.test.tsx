import { render, screen, fireEvent,} from '@testing-library/react';
import DeclarationCard from './index';
import { commonKeywords } from '../../constant';
import { useLocation } from "react-router-dom";
import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';

// Mock the ToggleButton component
jest.mock('../../Motor/QuoteAndBuy/VehicleDetailsModal/ToggleButton/ToggleButton', () => (props: { onChange: () => void, isActive: boolean, leftLabel: string, rightLabel: string }) => {
  return (
    <button onClick={props.onChange} data-testid={`toggle-${props.isActive}`}>
      {props.isActive ? props.leftLabel : props.rightLabel}
    </button>
  );
});
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));
jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));
describe('DeclarationCard', () => {
  const mockDeclare = [
    { label: 'Declaration 1', key: 'pep', value: 'SomeValue1' },
    { label: 'Declaration 2', key: 'related_party', value: 'SomeValue2' },
  ];

  const mockLanguageData = {
    yes: 'Yes',
    no: 'No',
  };
  const mockSetDeclaration = jest.fn();
  
  const mockContextValue = {
    declaration: {},
    setDeclaration: mockSetDeclaration,
  };
  beforeEach(() => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue(mockContextValue);
  });
  test('Common Keywords destructuring it should correctly destructure warningLabel, options, declareOptions, and coastalLine from commonKeywords', () => {
    const { warningLabel, options, declareOptions, coastalLine } = commonKeywords;

    expect(warningLabel).toBe("warning");
    expect(options).toEqual({ Yes: true, No: false });
    expect(declareOptions).toEqual({ true: "Yes", false: "No" });
    expect(coastalLine).toBe("question4");
  });

  test('should capitalize the first letter of each word in the ownerFullNameEnglish', () => {
      // Mock the return value of useLocation to simulate the location state
      const mockLocation = {
        state: {
          data: {
            ownerDetail: {
              ownerFullNameEnglish: 'john doe', // The string to be capitalized
            },
          },
        },
      };
  
      // Mock the useLocation hook to return the mocked location
      (useLocation as jest.Mock).mockReturnValue(mockLocation);
      // Call the capitalizeNameFirstLetter function and check if it returns the expected result
      const capitalizedName = capitalizeNameFirstLetter(mockLocation.state.data.ownerDetail.ownerFullNameEnglish);
      console.log(capitalizedName);
      // Assert that the name is capitalized correctly
      expect(capitalizedName).toBe('John Doe');
    });
  test('renders DeclarationCard with declarations', () => {
    render(<DeclarationCard declare={mockDeclare} declareHead="Declarations" languageData={mockLanguageData} />);

    expect(screen.getByTestId('vehicalHead')).toHaveTextContent('Declarations');
    expect(screen.getByText('Declaration 1')).toBeInTheDocument();
    expect(screen.getByText('Declaration 2')).toBeInTheDocument();
  });

  test('toggles the state of the declaration', () => {
    const {debug} = render(<DeclarationCard declare={mockDeclare} declareHead="Declarations" languageData={mockLanguageData} />);
    //console.log(prettyDOM(container));
    const toggleButton = screen.getAllByTestId(/toggle-/);

    // Initial state
    expect(toggleButton[0]).toHaveTextContent('No');
    expect(toggleButton[1]).toHaveTextContent('No');

    // Click to toggle
    fireEvent.click(toggleButton[0]);
    fireEvent.click(toggleButton[1]);

    const togglePossstive = screen.getAllByTestId(/toggle-/);

    expect(togglePossstive[0]).toHaveTextContent('Yes');
    expect(togglePossstive[1]).toHaveTextContent('Yes');
    debug();
  });
});
