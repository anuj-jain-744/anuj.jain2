import StopRefreshBackButton from ".";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('StopRefreshBackButton', () => {
    let mockHandleRefresh: jest.Mock;
    let mockNavigate: jest.Mock;
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
  
    beforeEach(() => {
      mockHandleRefresh = jest.fn();
      mockNavigate = jest.fn();
      Object.defineProperty(window, 'performance', {
        value: {
          ...window.performance,
          getEntriesByType: jest.fn().mockImplementation((type) => {
            if (type === 'navigation') {
              return [{ type: 'reload' } as PerformanceNavigationTiming];
            }
            return [];
          }),
        },
        writable: true,
      });
    });
    
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('calls handleRefresh on beforeunload event', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  
      render(<StopRefreshBackButton handleRefresh={mockHandleRefresh} />);
  
      const beforeUnloadCallback = addEventListenerSpy.mock.calls.find(
        ([event]) => event === 'beforeunload'
      )?.[1];
  
      expect(beforeUnloadCallback).toBeDefined();
  
      if (beforeUnloadCallback) {
        const event = { preventDefault: jest.fn(), returnValue: '' };
        if (typeof beforeUnloadCallback === 'function') {
          const newEvent = new Event('beforeunload');
          beforeUnloadCallback(newEvent);
        }
  
        expect(mockHandleRefresh).toHaveBeenCalled();
      }
  
      removeEventListenerSpy.mock.calls.forEach(([event, callback]) => {
        if (event === 'beforeunload') {
          expect(callback).toBe(beforeUnloadCallback);
        }
      });
  
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });  
  });