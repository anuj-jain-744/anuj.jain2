import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PanelRight from './index';

const mockStore = configureStore([]);

describe('PanelRight Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore({
            consumerCmsLanguageData: {
                languageData: {
                    config: [
                        {
                            summary_details: 'Summary Details Text',
                        },
                    ],
                },
            },
        });
    });

    it('should render children when not on mobile', () => {
        // Mock window.innerWidth to simulate desktop
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1300 });
        window.dispatchEvent(new Event('resize'));

        render(
            <Provider store={store}>
                <PanelRight>
                    <div>Child Content</div>
                </PanelRight>
            </Provider>
        );

        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render the sliding panel on mobile', () => {
        // Mock window.innerWidth to simulate mobile
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
        window.dispatchEvent(new Event('resize'));

        render(
            <Provider store={store}>
                <PanelRight>
                    <div>Child Content</div>
                </PanelRight>
            </Provider>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Summary Details Text')).toBeInTheDocument();
    });

  it('should close the drawer when the close button is clicked', () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    window.dispatchEvent(new Event('resize'));

    render(
        <Provider store={store}>
            <PanelRight>
                <div>Child Content</div>
            </PanelRight>
        </Provider>
    );

    const slidingPanel = screen.getByRole('button');
    fireEvent.click(slidingPanel);

    // Use getAllByAltText and filter for the close button
    const closeButton = screen.getAllByAltText('summary-details-icon')[1]; // Select the second element
    fireEvent.click(closeButton);

    expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
});
});