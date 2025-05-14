import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import configureStore from "redux-mock-store";
import PolicyHistoryContainer from "./PolicyHistoryContainer";
import * as usePolicyHistoryHook from "../../../hook/dashboard/usePolicyHistory";
import { slices } from "@dpm/shared-module";
import { act } from "react-dom/test-utils";

const mockStore = configureStore([]);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../../../hook/dashboard/usePolicyHistory");

describe("PolicyHistoryContainer", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      policyHistory: {
        data: null,
        isLoading: false,
        error: null,
      },
      dashbaordLanguageData: {
        translations: {
            someKey: "someValue",
          },
      }
    });

    store.dispatch = jest.fn();

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        data: {
          policyNo: "12345",
          nationalID: "987654321",
          productCode: "ABC",
        },
      },
    });

    (usePolicyHistoryHook.usePolicyHistory as jest.Mock).mockReturnValue({
      data: { data: { result: "mockPolicyData" } },
      isLoading: false,
      error: null,
    });
  });

  it("renders PolicyHistoryContainer and passes props to PolicyHistory", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PolicyHistoryContainer navigateTo={() => {}} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/mockPolicyData/i)).toBeInTheDocument();
  });

  it("dispatches setpolicyHistoryLoading and setpolicyHistory on successful data fetch", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PolicyHistoryContainer navigateTo={() => {}} />
          </MemoryRouter>
        </Provider>
      );
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      slices.policyHistorySlice.setpolicyHistoryLoading(false)
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      slices.policyHistorySlice.setpolicyHistory("mockPolicyData")
    );
  });

  it("dispatches setpolicyHistoryError on error", async () => {
    (usePolicyHistoryHook.usePolicyHistory as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Test error"),
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PolicyHistoryContainer navigateTo={() => {}} />
          </MemoryRouter>
        </Provider>
      );
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      slices.policyHistorySlice.setpolicyHistoryError("Test error")
    );
  });

  it("renders loading state when isLoading is true", () => {
    (usePolicyHistoryHook.usePolicyHistory as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PolicyHistoryContainer navigateTo={() => {}} />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      slices.policyHistorySlice.setpolicyHistoryLoading(true)
    );
  });
});