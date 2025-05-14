import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ThemeButton from "./index";

describe("ThemeButton Component", () => {
  const mockHandleClick = jest.fn();
  const name = "Claim";
  const className = "testClass";

  it("renders correctly with given all props", () => {
    render(<ThemeButton
      name={name}
      handleClick={mockHandleClick}
      className={"testClass"}
      disabled={false}
    />);
    expect(screen.getByText(name)).toBeInTheDocument();

    const clearButton = screen.getByTestId(`themeButton${name.replace(" ", "")}`);
    expect(clearButton).toHaveClass(className);
    fireEvent.click(clearButton);
    expect(mockHandleClick).toHaveBeenCalled();
  });

  it("renders correctly with given all disable true", () => {
    render(<ThemeButton
      name={name}
      handleClick={mockHandleClick}
      disabled={true}
    />);
    const clearButton = screen.getByTestId(`themeButton${name.replace(" ", "")}`);
    expect(clearButton).toHaveClass("disabled-button");
  });

  it("renders correctly with given all disable undefined", () => {
    render(<ThemeButton
      name={name}
      handleClick={mockHandleClick}
    />);
    const clearButton = screen.getByTestId(`themeButton${name.replace(" ", "")}`);
    expect(clearButton).toHaveClass("theme-button");
  });
});