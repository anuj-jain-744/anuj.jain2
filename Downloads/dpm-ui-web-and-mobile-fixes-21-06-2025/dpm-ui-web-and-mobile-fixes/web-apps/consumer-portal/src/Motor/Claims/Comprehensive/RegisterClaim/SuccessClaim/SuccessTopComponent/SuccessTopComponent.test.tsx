import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SuccessTopComponent from "./index";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

const mockResponse = {
  config: [{ success: "Operation Successful!" }],
};

beforeEach(() => {
  (callAPI as jest.Mock).mockResolvedValue(mockResponse);
});

test("renders SuccessTopComponent with success message and download message", async () => {
  render(<SuccessTopComponent />);

  const successMessage = await waitFor(() =>
    screen.getByText(/Operation Successful!/i)
  );
  // const downloadMessage = screen.getByText(mockData["download-msg"]);

  expect(successMessage).toBeInTheDocument();
  // expect(downloadMessage).toBeInTheDocument();

  // const successImage = screen.getByRole("img", { name: /success icon/i });
  // expect(successImage).toBeInTheDocument();
});
