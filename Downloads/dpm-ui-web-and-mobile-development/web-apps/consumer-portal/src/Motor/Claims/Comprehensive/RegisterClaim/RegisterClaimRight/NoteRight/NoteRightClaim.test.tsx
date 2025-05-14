import React from 'react';
import { render } from '@testing-library/react';
import NoteRight from '.';
import { DataContext } from '../../../../../../DataContext';

describe('NoteRight Component', () => {
    const mockData = {
        popup_subtitle_two: 'Subtitle Two',
        popup_body_content_two: [
            { value: 'Content One' },
            { value: 'Content Two' },
            { value: 'Content Three' },
        ],
    };

    it('renders without crashing', () => {
        render(
            <DataContext.Provider value={mockData}>
                <NoteRight />
            </DataContext.Provider>
        );
    });

    it('displays the correct subtitle', () => {
        const { getByText } = render(
            <DataContext.Provider value={mockData}>
                <NoteRight />
            </DataContext.Provider>
        );
        expect(getByText('Subtitle Two')).toBeInTheDocument();
    });

    it('displays the correct body content', () => {
        const { getByText } = render(
            <DataContext.Provider value={mockData}>
                <NoteRight />
            </DataContext.Provider>
        );
        expect(getByText('1.')).toBeInTheDocument();
        expect(getByText('Content One')).toBeInTheDocument();
        expect(getByText('2.')).toBeInTheDocument();
        expect(getByText('Content Two')).toBeInTheDocument();
        expect(getByText('3.')).toBeInTheDocument();
        expect(getByText('Content Three')).toBeInTheDocument();
        expect(getByText('4.')).toBeInTheDocument();
        expect(getByText('Also, you can Track your Claims through Walaa website Walaa.com.')).toBeInTheDocument();
    });
});