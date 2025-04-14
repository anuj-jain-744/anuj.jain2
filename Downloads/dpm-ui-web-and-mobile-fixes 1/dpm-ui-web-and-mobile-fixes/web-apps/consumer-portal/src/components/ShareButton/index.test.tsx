import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShareButton from "./index";

describe("ShareButton", () => {
    const paymentLanguageData = {
        field_share: "Share",
    };

    it("renders the ShareButton component", () => {
        render(
            <ShareButton
                paymentLanguageData={paymentLanguageData}
                handleDownload={() => {}}
            />
        );

        const shareButton = screen.getByTestId("link");
        expect(shareButton).toBeInTheDocument();
    });

    it("calls handleDownload when clicked", () => {
        const handleDownload = jest.fn();
        render(
            <ShareButton
                paymentLanguageData={paymentLanguageData}
                handleDownload={handleDownload}
            />
        );

        const shareButton = screen.getByTestId("link");
        fireEvent.click(shareButton);

        expect(handleDownload).toHaveBeenCalled();
    });
});