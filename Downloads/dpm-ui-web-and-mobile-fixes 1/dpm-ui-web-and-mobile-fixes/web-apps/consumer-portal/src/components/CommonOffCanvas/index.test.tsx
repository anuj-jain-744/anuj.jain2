import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommonOffCanvas from './index'; // Adjust import path
import { PLACEMENTS } from 'constant'; // Assuming PLACEMENTS is a constant that has possible placement values

// Mock the react-bootstrap Offcanvas component for easier testing
// Remove the unused 'Body' component

describe('CommonOffCanvas', () => {
    const mockSetShowCanvas = jest.fn();

    it('should render the offcanvas when showCanvas is true', () => {
        render(
            <CommonOffCanvas
                placement="end" // Use a valid value from PLACEMENTS
                title="Test Title"
                showCanvas={true}
                setShowCanvas={mockSetShowCanvas}
            >
                <div>Test Content</div>
            </CommonOffCanvas>
        );

        // Check if the offcanvas is rendered
        expect(screen.getByTestId('offcanvas')).toBeInTheDocument();
    });

    it('should not render the offcanvas when showCanvas is false', () => {
        render(
            <CommonOffCanvas
                placement="end"
                title="Test Title"
                showCanvas={false}
                setShowCanvas={mockSetShowCanvas}
            >
                <div>Test Content</div>
            </CommonOffCanvas>
        );

        // Check if the offcanvas is not rendered
        expect(screen.queryByTestId('offcanvas')).toBeNull();
    });

it('should render the correct placement class', () => {
        const placement: keyof typeof PLACEMENTS = 'END'; // Ensure this matches your PLACEMENTS structure
        render(
                        <CommonOffCanvas
                                        title="Test Title"
                                        showCanvas={true}
                                        setShowCanvas={mockSetShowCanvas}
                                        placement={'start'}
                        >
                                        <div>Test Content</div>
                        </CommonOffCanvas>
        );

        // Ensure the offcanvas has the correct placement class
        expect(screen.getByTestId('offcanvas')).toHaveClass(`offcanvas-${placement}`);
});

    it('should render the title inside the Offcanvas header', () => {
        render(
            <CommonOffCanvas
                placement="end"
                title="Test Title"
                showCanvas={true}
                setShowCanvas={mockSetShowCanvas}
            >
                <div>Test Content</div>
            </CommonOffCanvas>
        );

        // Check if the title is rendered correctly
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render children inside the Offcanvas body', () => {
        render(
            <CommonOffCanvas
                placement="end"
                title="Test Title"
                showCanvas={true}
                setShowCanvas={mockSetShowCanvas}
            >
                <div>Test Content</div>
            </CommonOffCanvas>
        );

        // Check if the children content is rendered inside the body
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should call setShowCanvas with false when the close button is clicked', () => {
        render(
            <CommonOffCanvas
                placement="end"
                title="Test Title"
                showCanvas={true}
                setShowCanvas={mockSetShowCanvas}
            >
                <div>Test Content</div>
            </CommonOffCanvas>
        );

        // Click the close button
        fireEvent.click(screen.getByText('Close'));

        // Ensure that setShowCanvas is called with false
        expect(mockSetShowCanvas).toHaveBeenCalledWith(false);
    });
});
