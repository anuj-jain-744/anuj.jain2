import { render } from "@testing-library/react";
import { VisibilityWrapper } from "./index";
import "@testing-library/jest-dom";

beforeEach(() => {
    const observe = jest.fn();
    const unobserve = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
        observe,
        unobserve,
        disconnect: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: "0.1",
        thresholds: [0.1]
    }));
});

test("Render child component", () => {
    const childProps = "Child Component";
    const ChildComponent = () => <div>{childProps}</div>;
    const { getByText } = render(
        <VisibilityWrapper>
            <ChildComponent />
        </VisibilityWrapper>
    );

    expect(getByText(childProps)).toBeInTheDocument();
});
