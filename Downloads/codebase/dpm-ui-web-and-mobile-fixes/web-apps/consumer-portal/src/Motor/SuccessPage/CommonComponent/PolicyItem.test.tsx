import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyItem from './PolicyItem';

describe('PolicyItem Component', () => {
  it('renders correctly with given props', () => {
    render(<PolicyItem label="Policy Number" value="POL123" />);
    expect(screen.getByText('Policy Number')).toBeInTheDocument();
    expect(screen.getByText('POL123')).toBeInTheDocument();
  });

  it('renders endorsement policy with image and correct classes', () => {
    render(
      <PolicyItem
        label="Endorsement Policy"
        value="END456"
        isEndosementPolicy={true}
        imgSrc="test-image.jpg"
      />
    );
    expect(screen.getByText('Endorsement Policy')).toBeInTheDocument();
    expect(screen.getByText('END456')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Endorsement Policy').parentElement).toHaveClass(
      'endorsementPolicyLabel'
    );
  });

  it('applies premium styling when isPremium is true', () => {
    render(<PolicyItem label="Premium Amount" value="$500" isPremium={true} />);
    expect(screen.getByText('Premium Amount')).toHaveClass('premium-label');
    expect(screen.getByText('$500')).toHaveClass('premium-value');
  });

  it('uses default props when not provided', () => {
    render(<PolicyItem label="Default Policy" value="DEFAULT123" />);
    expect(screen.getByText('Default Policy')).toBeInTheDocument();
    expect(screen.getByText('DEFAULT123')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders correctly without crashing when value is ReactNode', () => {
    render(
      <PolicyItem
        label="Custom Value"
        value={<span data-testid="custom-node">Custom Node</span>}
      />
    );
    expect(screen.getByText('Custom Value')).toBeInTheDocument();
    expect(screen.getByTestId('custom-node')).toBeInTheDocument();
  });
});