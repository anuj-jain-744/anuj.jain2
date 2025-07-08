import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import EsgWorld from "./index";

describe("EsgWorld", () => {
    it("renders without crashing", () => {
        render(<EsgWorld iframeUrl="https://example.com" />);
    });
});