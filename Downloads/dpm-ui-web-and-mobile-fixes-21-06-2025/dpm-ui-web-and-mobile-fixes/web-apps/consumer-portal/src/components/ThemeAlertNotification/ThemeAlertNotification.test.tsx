import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
import style from './ThemeAlertNotification.module.scss';
import {
  showNotification,
  NotificationContainer,
} from './ThemeAlertNotification';

// Mock timer for autoClose
jest.useFakeTimers();

describe('ThemeAlertNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = ''; // Clear toasts between tests
  });

  test('should show a toast with role alert', () => {
    render(<NotificationContainer />);
  
    act(() => {
      showNotification({
        title: 'Test Alert',
        description: 'Testing alert role',
        type: 'info',
      });
    });
  
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
  });
  test('should display a notification', () => {
    render(<NotificationContainer />);
    
    act(() => {
      showNotification({
        title: 'Success!',
        description: 'Operation completed.',
        type: 'success',
      });
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed.')).toBeInTheDocument();
  });

  test('should not show duplicate notifications', () => {
    render(<NotificationContainer />);
    
    act(() => {
      showNotification({
        title: 'Duplicate',
        description: 'This is a duplicate test.',
        type: 'info',
      });
    });

    act(() => {
      showNotification({
        title: 'Duplicate',
        description: 'This is a duplicate test.',
        type: 'info',
      });
    });

    const instances = screen.getAllByText('Duplicate');
    expect(instances.length).toBe(1);
  });

  test('should remove toast from active set on close', () => {
    render(<NotificationContainer />);
    
    act(() => {
      showNotification({
        title: 'AutoClose',
        description: 'Will auto close.',
        type: 'warning',
        duration: 3000, 
      });
    });

    // Check if the notification appears
    expect(screen.getByText('AutoClose')).toBeInTheDocument();

    // Fast-forward timer to trigger autoClose
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Wait for DOM update
    setTimeout(() => {
      expect(screen.queryByText('AutoClose')).not.toBeInTheDocument();
    }, 500);
  });
  test('should display a notification with a custom icon', () => {
    render(<NotificationContainer />);
  
    const customIcon = <span data-testid="custom-icon">🔥</span>;
  
    act(() => {
      showNotification({
        title: 'Custom Icon Test',
        description: 'This notification has a custom icon.',
        type: 'info',
        icon: customIcon,
      });
    });
  
    expect(screen.getByText('Custom Icon Test')).toBeInTheDocument();
    expect(screen.getByText('This notification has a custom icon.')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
