import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Claims from './index';
import { callAPI } from '@dpm/shared-module';
import { DataContext } from '../DataContext';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

jest.mock('./layout/Body', () => ({
  __esModule: true,
  default: () => <div data-testid="body">Body Component</div>,
}));

describe('Claims', () => {
  const mockResponse = {
    config: [{ language: 'en', data: 'mockData' }],
  };

  beforeEach(() => {
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('renders Claims component and fetches data', async () => {
    render(<Claims />);

    expect(screen.getByText('Body Component')).toBeInTheDocument();

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith('get', expect.stringContaining('en/api/consumerportal-config'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });
  });

  it('provides languageData to DataContext', async () => {
    render(<Claims />);

    await waitFor(() => {
      expect(callAPI).toHaveBeenCalledWith('get', expect.stringContaining('en/api/consumerportal-config'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });

    expect(screen.getByTestId('body')).toBeInTheDocument();
  });
});