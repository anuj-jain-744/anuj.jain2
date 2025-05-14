import React from "react";
import ReactDOM from "react-dom/client";
import { render } from "@testing-library/react";
import App from "./App";
import './index.scss';

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe("main.tsx", () => {
  test("renders App component", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    require("./main");

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);
    expect(ReactDOM.createRoot(root).render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
});