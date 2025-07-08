import React from "react";
import {render, screen} from '@testing-library/react';
import ErrorPage from "./Error";

describe('Error Component', () => {
    it('render error message', () => {
        render(<ErrorPage />);
        const errorMessage = screen.getByText(/something went wrong/i);
        expect(errorMessage).toBeInTheDocument();
    })
})