import { fireEvent, render, screen } from "@testing-library/react";
import BuyProductFooter from "./index";

jest.mock('assets/TrackYourClaim/upload.svg', () => 'mock-success-icon-path');

test('renders BuyProductFooter without crashing', () => {
    render(<BuyProductFooter isBackButtonHide={false} languageData={{ back: 'Back' }} />);
  });
  
  test('renders the Back button when isBackButtonHide is false', () => {
    render(<BuyProductFooter isBackButtonHide={false} languageData={{ back: 'Back' }} />);
    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeInTheDocument();
  });
  
  test('does not render the Back button when isBackButtonHide is true', () => {
    render(<BuyProductFooter isBackButtonHide={true} languageData={{ back: 'Back' }} />);
    const backButton = screen.queryByText(/Back/i);
    expect(backButton).toBeNull();
  });
  
  test('renders the main button with the correct title', () => {
    render(<BuyProductFooter isBackButtonHide={true} buttonTitle="Next" languageData={{ back: 'Back' }} />);
    const mainButton = screen.getByText(/Next/i);
    expect(mainButton).toBeInTheDocument();
  });
  
  test('disables the main button when isDisabledButton is true', () => {
    render(<BuyProductFooter isBackButtonHide={true} buttonTitle="Next" isDisabledButton={true} languageData={{ back: 'Back' }} />);
    const mainButton = screen.getByText(/Next/i);
    expect(mainButton).toBeDisabled();
  });
  
  test('calls handleOnClickHandler when the main button is clicked', () => {
    const handleOnClickHandler = jest.fn();
    render(<BuyProductFooter isBackButtonHide={true} buttonTitle="Next" handleOnClickHandler={handleOnClickHandler} languageData={{ back: 'Back' }} />);
    const mainButton = screen.getByText(/Next/i);
    fireEvent.click(mainButton);
    expect(handleOnClickHandler).toHaveBeenCalled();
  });
  
  test('calls handleBackBtn when the Back button is clicked', () => {
    const handleBackBtn = jest.fn();
    render(<BuyProductFooter isBackButtonHide={false} handleBackBtn={handleBackBtn} languageData={{ back: 'Back' }} />);
    const backButton = screen.getByText(/Back/i);
    fireEvent.click(backButton);
    expect(handleBackBtn).toHaveBeenCalled();
  });
  