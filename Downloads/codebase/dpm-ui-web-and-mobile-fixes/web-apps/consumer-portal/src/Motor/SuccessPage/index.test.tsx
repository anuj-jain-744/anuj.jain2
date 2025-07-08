import React from "react";
import { render, screen, act } from "@testing-library/react";
import Success from "./index";

jest.mock("./SuccessTopComponent", () => () => <div data-testid="SuccessTopComponent" />);
jest.mock("./SuccesRightComponent", () => () => <div data-testid="SuccessRightComponent" />);
jest.mock("components/Footer", () => () => <div data-testid="SuccessBottomComponent" />);
jest.mock("./LeftSuccess", () => () => <div data-testid="SuccessLeftComponent" />);

const mockMakeApiCall = jest.fn();
const mockCmsPaymentApiCall = jest.fn();

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(() => ({
    makeApiCall: mockMakeApiCall,
    data: undefined,
  })),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: "/success" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe("Success Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    jest.mocked(require("@dpm/shared-module").useApiCall).mockImplementation(() => ({
      makeApiCall: mockMakeApiCall,
      data: undefined,
    }));
  });

  it("calls makeApiCall and cmsPaymentApiCall on mount", () => {
    let callCount = 0;
    jest.mocked(require("@dpm/shared-module").useApiCall).mockImplementation(() => {
      callCount++;
      if (callCount === 1)
        return { makeApiCall: mockCmsPaymentApiCall, data: { config: [{ some: "paymentLang" }] } };
      return { makeApiCall: mockMakeApiCall, data: { config: [{ some: "langData" }] } };
    });

    render(<Success status={true} data={{} as any} />);

    expect(mockMakeApiCall).toHaveBeenCalled();
    expect(mockCmsPaymentApiCall).toHaveBeenCalled();
  });

  it("navigates to /dashboard when isRefresh is set in sessionStorage", () => {
    sessionStorage.setItem("isRefresh", "true");
    const handleNavigate = jest.fn();

    render(<Success status={true} data={{} as any} handleNavigate={handleNavigate} />);

    expect(sessionStorage.getItem("isRefresh")).toBeNull();
    expect(handleNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("adds and removes popstate event listener", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<Success status={true} data={{} as any} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("handleBackButton navigates correctly based on userDetails in sessionStorage", () => {
    const handlers: Record<string, EventListener> = {};
  
    jest.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      handlers[event] = handler;
    });
  
    jest.spyOn(window, "removeEventListener").mockImplementation((event, handler) => {
      if (handlers[event] === handler) {
        delete handlers[event];
      }
    });
  
    render(<Success status={true} data={{} as any} />);
  
    const popstateEvent = new PopStateEvent("popstate");
  
    sessionStorage.setItem("userDetails", "someUser");
    act(() => {
      handlers["popstate"]?.(popstateEvent);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  
    mockNavigate.mockClear();
  
    sessionStorage.removeItem("userDetails");
    act(() => {
      handlers["popstate"]?.(popstateEvent);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("does not call handleNavigate if isRefresh is not set in sessionStorage", () => {
    const handleNavigate = jest.fn();
  
    render(<Success status={true} data={{} as any} handleNavigate={handleNavigate} />);
    
    expect(handleNavigate).not.toHaveBeenCalled();
  });
  
  it("does not render SuccessLeftComponent if paymentLang is undefined", () => {
    jest.mocked(require("@dpm/shared-module").useApiCall).mockImplementation(() => ({
      makeApiCall: jest.fn(),
      data: undefined,
    }));
  
    render(<Success status={true} data={{} as any} />);
  
    expect(screen.queryByTestId("SuccessLeftComponent")).not.toBeInTheDocument();
  });  
});
