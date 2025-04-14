import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import QuoteCarouselItems from "../QuoteCarouselItems";

describe('QuoteCarouselItems', () => {
    const mockSetShowProductDetailTooltip = jest.fn();
    const mockHandleToggleClick = jest.fn();
    const activeTabRef = { current: document.createElement('div') };

    const defaultProps = {
        showProductDetailTooltip: { show: false, index: null },
        index: 1,
        productName: 'Test Product',
        className: 'test-class',
        activeProduct: { category: { label: 'Test Category', index: 1 } },
        activeTabRef: activeTabRef,
        handleToggleClick: mockHandleToggleClick,
        setShowProductDetailTooltip: mockSetShowProductDetailTooltip,
    };

    test("GetQuoteWidget with QuoteCarouselItems component", async () => {
        window.innerWidth = 1100;
        const showProductDetailTooltip = { show: true, index: 0 };
        const index = 0;
        const productName = "Motor";
        const className = "motor";
        const activeProduct = {
            product: { label: "MotorProduct", index: 0 },
            category: { label: "SMEProduct", index: 0 },
        };
        const activeTabRef = { current: null };
        const handleToggleClick = jest.fn();
        const setShowProductDetailTooltip = jest.fn();
    
        await act(async () => {
            render(
                <QuoteCarouselItems
                    key={index}
                    showProductDetailTooltip={showProductDetailTooltip}
                    index={index}
                    productName={productName}
                    className={className}
                    activeProduct={activeProduct}
                    activeTabRef={activeTabRef}
                    handleToggleClick={handleToggleClick}
                    setShowProductDetailTooltip={setShowProductDetailTooltip}
                />
            );
        });
    
        await act(async () => {
            fireEvent.click(screen.getByTestId('categoryCauroselToggle-0'));
        });
    
        expect(handleToggleClick).toHaveBeenCalled();
    });

    it('should call setShowProductDetailTooltip with correct arguments onMouseOver', () => {
        const { getByTestId } = render(<QuoteCarouselItems {...defaultProps} />);
        const toggleElement = getByTestId('categoryCauroselToggle-1');

        fireEvent.mouseOver(toggleElement);

        expect(mockSetShowProductDetailTooltip).toHaveBeenCalledWith({
            show: true,
            index: 1,
        });
    });

    it('should call setShowProductDetailTooltip with correct arguments onMouseLeave', () => {
        const { getByTestId } = render(<QuoteCarouselItems {...defaultProps} />);
        const toggleElement = getByTestId('categoryCauroselToggle-1');

        fireEvent.mouseLeave(toggleElement);

        expect(mockSetShowProductDetailTooltip).toHaveBeenCalledWith({
            show: false,
            index: null,
        });
    });
});