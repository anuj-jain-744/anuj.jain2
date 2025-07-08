import React from "react";
import {render, screen} from '@testing-library/react';
import BuyProductHeading from "./index";

describe('BuyProductHeading Component', () => {
    it('BuyProductHeading with heading', () => {
        render(<BuyProductHeading heading={"test heading"} />);
        const headingProduct = screen.getByText(/test heading/i);
        expect(headingProduct).toBeInTheDocument();
    })
})