
import { render, screen } from '@testing-library/react';
import SuccessGreen from './index';
import '@testing-library/jest-dom'; // For custom matchers

describe('SuccessGreen', () => {
    it('should display the correct label text and message', () => {
        const lblText = 'Success!';
        const message = 'Your operation was successful.';
        
        render(<SuccessGreen lblText={lblText} message={message} />);
        
        const labelElement = screen.getByText(lblText);
        const messageElement = screen.getByText(message);
        
        expect(labelElement).toBeInTheDocument();
        expect(messageElement).toBeInTheDocument();
    });

    it('should display the success icon', () => {
        render(<SuccessGreen lblText="Success!" message="Your operation was successful." />);
        
        const iconElement = screen.getByAltText('Green Success Icon');
        
        expect(iconElement).toBeInTheDocument();
    });
});