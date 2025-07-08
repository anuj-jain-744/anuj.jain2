import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeButton from "./ThemeButton"; // adjust path accordingly

describe("ThemeButton", () => {
  it("renders with correct title and classes", () => {
    render(<ThemeButton title="Click Me" classes="my-button" />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("my-button");
    expect(button).toHaveClass("register-call2action");
  });

  it("renders enabled button without disabled class", () => {
    render(<ThemeButton title="Active" classes="btn" isDisabled={false} />);
    const button = screen.getByRole("button", { name: /active/i });
    expect(button).not.toHaveClass("disabled");
    expect(button).not.toBeDisabled();
  });

  it("renders disabled button with disabled class and disabled attribute", () => {
    render(<ThemeButton title="Disabled" classes="btn" isDisabled />);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toHaveClass("disabled");
    expect(button).toBeDisabled();
  });

  it("applies the correct variant, defaults to primary", () => {
    const { rerender } = render(
      <ThemeButton title="Default Variant" classes="btn" />
    );
    expect(screen.getByRole("button")).toHaveClass("btn-primary");

    rerender(
      <ThemeButton title="Link Variant" classes="btn" variant="link" />
    );
    expect(screen.getByRole("button")).toHaveClass("btn-link");
  });

  it("calls onClickhandler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <ThemeButton
        title="Clickable"
        classes="btn"
        onClickhandler={handleClick}
      />
    );
    const button = screen.getByRole("button", { name: /clickable/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders left icon when iconLeft is true", () => {
    render(
      <ThemeButton
        title="Left Icon"
        classes="btn"
        iconLeft
        iconName="ChevronLeftIcon"
      />
    );
    expect(screen.getByTestId("ChevronLeftIcon")).toBeInTheDocument();
  });

  it("renders right icon when iconRight is true", () => {
    render(
      <ThemeButton
        title="Right Icon"
        classes="btn"
        iconRight
        iconName="ChevronRightIcon"
      />
    );
    expect(screen.getByTestId("ChevronRightIcon")).toBeInTheDocument();
  });
});
