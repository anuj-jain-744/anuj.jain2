import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TermsAndConditionDialog from '../TermsAndConditionDialog';
import MockData from '../../../../../../Endorsement/TermsAndConditionModel/mock.json';

describe('TermsAndConditionDialog', () => {
  test('renders correctly with given props', () => {
    render(
      <TermsAndConditionDialog
        showDialog={true}
        clickHandler={jest.fn()}
        clickHandlerAccept={jest.fn()}
      />
    );

    expect(screen.getByText(MockData["dialog-heading"])).toBeInTheDocument();
    expect(screen.getByText(MockData["content-one"])).toBeInTheDocument();
    expect(screen.getByText(MockData["content-two"])).toBeInTheDocument();
    expect(screen.getByText(MockData["close"])).toBeInTheDocument();
    expect(screen.getByText(MockData["accept"])).toBeInTheDocument();
  });

  test('calls clickHandler when close button is clicked', () => {
    const handleClick = jest.fn();
    render(
      <TermsAndConditionDialog
        showDialog={true}
        clickHandler={handleClick}
        clickHandlerAccept={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText(MockData["close"]));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('calls clickHandlerAccept when accept button is clicked', () => {
    const handleAccept = jest.fn();
    render(
      <TermsAndConditionDialog
        showDialog={true}
        clickHandler={jest.fn()}
        clickHandlerAccept={handleAccept}
      />
    );

    fireEvent.click(screen.getByText(MockData["accept"]));
    expect(handleAccept).toHaveBeenCalledTimes(1);
  });
});