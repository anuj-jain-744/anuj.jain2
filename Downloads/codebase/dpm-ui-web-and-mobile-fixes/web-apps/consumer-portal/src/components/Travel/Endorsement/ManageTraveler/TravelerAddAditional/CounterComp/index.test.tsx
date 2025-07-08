import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CounterComponent from "./index";
import { TOTAL_LIMIT } from "constant";

describe("CounterComponent", () => {
  const onTotalChange = jest.fn();

  const defaultProps = {
    maxLimit: 3,
    totalLimit: TOTAL_LIMIT,
    onTotalChange,
    type: "adult",
    currentCounts: { adult: 0, child: 0, srCitizen: 0 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial count 0", () => {
    render(<CounterComponent {...defaultProps} />);
    expect(screen.getByRole("textbox")).toHaveValue("0");
  });

  it("increments count and calls onTotalChange", () => {
    render(<CounterComponent {...defaultProps} />);
    const plusBtn = screen.getByText("+");
    fireEvent.click(plusBtn);
    expect(screen.getByRole("textbox")).toHaveValue("1");
    expect(onTotalChange).toHaveBeenCalledWith("adult", 1);
  });

  it("decrements count and calls onTotalChange", () => {
    render(<CounterComponent {...defaultProps} />);
    const plusBtn = screen.getByText("+");
    const minusBtn = screen.getByText("-");

    fireEvent.click(plusBtn);
    expect(screen.getByRole("textbox")).toHaveValue("1");
    
    fireEvent.click(minusBtn);
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(onTotalChange).toHaveBeenCalledWith("adult", -1);
  });

  it("does not decrement below 0", () => {
    render(<CounterComponent {...defaultProps} />);
    const minusBtn = screen.getByText("-");
    expect(minusBtn).toBeDisabled();
    fireEvent.click(minusBtn);
    expect(screen.getByRole("textbox")).toHaveValue("0");
    expect(onTotalChange).not.toHaveBeenCalled();
  });

  it("disables increment button if maxLimit reached", () => {
    render(
      <CounterComponent
        {...defaultProps}
        maxLimit={0}
        currentCounts={{ adult: 0, child: 0, srCitizen: 0 }}
      />
    );
    const plusBtn = screen.getByText("+");
    expect(plusBtn).toBeDisabled();
  });

  it("disables increment button if totalLimit reached", () => {
    render(
      <CounterComponent
        {...defaultProps}
        currentCounts={{ adult: 3, child: 3, srCitizen: 4 }}
      />
    );
    const plusBtn = screen.getByText("+");
    expect(plusBtn).toBeDisabled();
  });

  it("disables increment if child limit (6) reached for type 'child'", () => {
    render(
      <CounterComponent
        {...defaultProps}
        type="child"
        maxLimit={10}
        currentCounts={{ adult: 0, child: 6, srCitizen: 0 }}
      />
    );
    const plusBtn = screen.getByText("+");
    expect(plusBtn).toBeDisabled();
  });

  it("enables increment button when limits not reached", () => {
    render(
      <CounterComponent
        {...defaultProps}
        maxLimit={5}
        currentCounts={{ adult: 1, child: 1, srCitizen: 0 }}
      />
    );
    const plusBtn = screen.getByText("+");
    expect(plusBtn).not.toBeDisabled();
  });
});
