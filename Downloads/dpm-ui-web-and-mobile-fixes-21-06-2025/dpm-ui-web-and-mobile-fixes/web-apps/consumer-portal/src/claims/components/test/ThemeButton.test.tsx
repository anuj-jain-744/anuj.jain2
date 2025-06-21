import { render, screen, fireEvent } from "@testing-library/react";
import ThemeButton from "../ThemeButton";
import React from "react";

describe("ThemeButton Component", () => {
  test("renders button with provided title", () => {
    render(<ThemeButton isDisabled={false} title="Click Me" classes="btn-test" />);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("disables the button when isDisabled is true", () => {
    render(<ThemeButton isDisabled={true} title="Disabled" classes="btn-test" />);
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
  });

  test("calls onClickhandler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <ThemeButton
        isDisabled={false}
        title="Click Me"
        classes="btn-test"
        onClickhandler={handleClick}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders icon when icon prop is true", () => {
    render(
      <ThemeButton
        isDisabled={false}
        title="Icon Button"
        classes="btn-test"
        icon={true}
        iconName="ChevronLeftIcon"
      />
    );
    expect(screen.getByTestId("ChevronLeftIcon")).toBeInTheDocument();
  });

  test("renders icon on right when iconRight is true", () => {
    render(
      <ThemeButton
        isDisabled={false}
        title="Icon Right"
        classes="btn-test"
        iconRight={true}
        iconName="ChevronRightIcon"
      />
    );
    expect(screen.getByTestId("ChevronRightIcon")).toBeInTheDocument();
  });
});
