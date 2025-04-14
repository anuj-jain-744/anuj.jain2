import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Feedback from './index';
import { DataContext } from '../../DataContext';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
 
const mockStore = configureMockStore({});
 
const mockLanguageData = {
  how_likely_recommend: 'How likely are you to recommend us?',
  feedback: 'Poor,Fair,Good,Very Good,Excellent',
  feedback_window_description: 'Please provide your feedback',
  feed_back_text: 'Feedback',
};
 
const mockFeedbackData = {
  rating: 0,
  message: '',
};
 
const renderComponent = (props = {}) => {
    const mockUser = { userId: "123" }; 
    const mstore = mockStore({
        auth: { userInfo: mockUser }, // Mock the Redux state here
      });
  return render(
<Provider store={mstore}>
<DataContext.Provider value={mockLanguageData}>
<Feedback
          url="/feedback"
          feedbackData={mockFeedbackData}
          {...props}
        />
</DataContext.Provider>
</Provider>
  );
};
 
describe('Feedback Component', () => {
  test('renders feedback component with language data', () => {
    renderComponent();
    expect(screen.getByText(mockLanguageData.how_likely_recommend)).toBeInTheDocument();
  });
 
  test('renders smiley images', () => {
    renderComponent();
    const smileyImages = screen.getAllByRole('img');
    expect(smileyImages.length).toBe(5);
  });
 
  test('opens modal on smiley click', () => {
    renderComponent({ feedbackType: true });
    const smileyImages = screen.getAllByRole('img');
    fireEvent.click(smileyImages[0]);
    expect(screen.getByText(mockLanguageData.feed_back_text)).toBeInTheDocument();
  });
 
  test('submits feedback and shows success toast', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'SUCCESS', data: { message: 'Feedback submitted successfully' } }),
      })
    );
 
    renderComponent({ feedbackType: true });
    const smileyImages = screen.getAllByRole('img');
    fireEvent.click(smileyImages[0]);
    fireEvent.click(screen.getByText('Submit Feedback'));
 
    await waitFor(() => {
        expect(screen.queryByText(/Feedback submitted successfully/i)).toBeInTheDocument();
      });
  });
 
  test('shows error toast on feedback submission failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Feedback Submit Failed With Error'))
    );
 
    renderComponent({ feedbackType: true });
    const smileyImages = screen.getAllByRole('img');
    fireEvent.click(smileyImages[0]);
    fireEvent.click(screen.getByText('Submit Feedback'));
 
    await waitFor(() => {
      expect(screen.getByText('Feedback Submit Failed With Error')).toBeInTheDocument();
    });
  });
});
