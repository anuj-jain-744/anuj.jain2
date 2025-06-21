import * as components from './index'; 

import PolicyFooter from './Footer';
import ErrorPage from './ErrorComponent/Error';
import DefaultSpinner from './Spinner';
import ThemeButton from './ThemeButton/ThemeButton';
import BackFooter from './BackFooter/BackFooter';

describe('Component exports', () => {
  it('should export PolicyFooter correctly', () => {
    expect(components.PolicyFooter).toBe(PolicyFooter);
  });

  it('should export ErrorPage correctly', () => {
    expect(components.ErrorPage).toBe(ErrorPage);
  });

  it('should export DefaultSpinner correctly', () => {
    expect(components.DefaultSpinner).toBe(DefaultSpinner);
  });

  it('should export ThemeButton correctly', () => {
    expect(components.ThemeButton).toBe(ThemeButton);
  });

  it('should export BackFooter correctly', () => {
    expect(components.BackFooter).toBe(BackFooter);
  });
});