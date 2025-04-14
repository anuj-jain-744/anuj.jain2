import { render, screen } from '@testing-library/react';
import StatusTree from './StatusTree';

describe('StatusTree Component', () => {
  beforeEach(() => {
    render(<StatusTree />);
  });

  test('renders title', () => {
    expect(screen.getByText('Claim Track')).toBeInTheDocument();
  });
});