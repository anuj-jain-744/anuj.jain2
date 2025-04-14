import React from "react";
import { render } from "@testing-library/react";
import ListItemIcon from ".";

describe("ListItemIcon", () => {
    it("should render DoneIcon", () => {
        const { container } = render(<ListItemIcon title="Test Title" />);
        const icon = container.querySelector(".list-item-icn");
        expect(icon).toBeInTheDocument();
        expect(icon?.querySelector("svg")).toBeInTheDocument();
    });

    it("should render TypographyAndIcon with correct text", () => {
        const { getByText } = render(<ListItemIcon title="Test Title" />);
        expect(getByText("Test Title")).toBeInTheDocument();
    });

    it("should apply correct classes", () => {
        const { container } = render(<ListItemIcon title="Test Title" />);
        expect(container.querySelector(".list-item-icn")).toBeInTheDocument();
        expect(container.querySelector(".list-item-sub-title")).toBeInTheDocument();
    });
});