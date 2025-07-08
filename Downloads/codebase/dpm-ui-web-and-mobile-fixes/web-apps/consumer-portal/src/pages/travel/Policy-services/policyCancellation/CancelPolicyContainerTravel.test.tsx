import React from "react";
import { render, screen } from "@testing-library/react";
import CancelPolicyContainer from "./CancelPolicyContainer";
import CancelPolicy from "./CancelPolicy";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("./CancelPolicy", () => jest.fn(() => <div data-testid="cancel-policy">CancelPolicy Component</div>));

describe("CancelPolicyContainer Component", () => {
  const mockNavigateTo = jest.fn();

  const renderWithRouter = (state = {}) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: "/", state }]}>
        <Routes>
          <Route path="/" element={<CancelPolicyContainer navigateTo={mockNavigateTo} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders CancelPolicyContainer without crashing", () => {
    renderWithRouter();
    expect(screen.getByTestId("cancel-policy")).toBeInTheDocument();
  });

  test("passes navigateTo function to CancelPolicy", () => {
    renderWithRouter();
    expect(CancelPolicy).toHaveBeenCalledWith(
      expect.objectContaining({
        navigateTo: mockNavigateTo,
      }),
      {}
    );
  });

  test("renders CancelPolicy component wrapped in TravelPolicyProvider", () => {
    const policyData = { policyNumber: "12345" };
    const { getByText } = renderWithRouter({ data: policyData });

    expect(getByText("CancelPolicy Component")).toBeInTheDocument();

    expect(CancelPolicy).toHaveBeenCalledWith(
      expect.objectContaining({
        policyDataObj: policyData,
        navigateTo: mockNavigateTo,
      }),
      {}
    );
  });

  test("renders CancelPolicy with undefined policyDataObj if no location state", () => {
    renderWithRouter();

    expect(CancelPolicy).toHaveBeenCalledWith(
      expect.objectContaining({
        policyDataObj: undefined,
        navigateTo: mockNavigateTo,
      }),
      {}
    );
  });
});
