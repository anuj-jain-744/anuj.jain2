import { render, screen, fireEvent } from "@testing-library/react";
import { HiddenButtonWrapper } from "./index";

describe("HiddenButtonWrapper", () => {
  const buttonText = "Click Me";

  it("renders children inside the button", () => {
    render(
      <HiddenButtonWrapper onClick={jest.fn()}>
        <span>{buttonText}</span>
      </HiddenButtonWrapper>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(
      <HiddenButtonWrapper onClick={handleClick}>
        <span>{buttonText}</span>
      </HiddenButtonWrapper>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown when Enter is pressed", () => {
    const handleKeyDown = jest.fn();
    render(
      <HiddenButtonWrapper onClick={() => {}} onKeyDown={handleKeyDown}>
        <span>{buttonText}</span>
      </HiddenButtonWrapper>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("applies tabIndex when passed", () => {
    render(
      <HiddenButtonWrapper onClick={() => {}} tabIndex={-1}>
        <span>{buttonText}</span>
      </HiddenButtonWrapper>
    );
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
  });

  it("merges class names properly", () => {
    render(
      <HiddenButtonWrapper onClick={() => {}} className="extra-class">
        <span>{buttonText}</span>
      </HiddenButtonWrapper>
    );
    expect(screen.getByRole("button")).toHaveClass("hidden-button");
    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });
});
