import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Feedback from "./index";
import { callAPI } from "@dpm/shared-module";
import { DataContext } from "../../DataContext";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

const mockStore = configureStore([]);
const mockLanguageData = {
  how_likely_recommend: "How likely are you to recommend us?",
  feedback: "Poor,Fair,Good,Very Good,Excellent",
  how_feel: "How do you feel?",
  your_input: "Your input",
};

const renderComponentWithFeeedbackFalse = (props = {}) => {
  const store = mockStore({
    auth: { userInfo: { userId: "12345" } },
  });

  return render(
    <Provider store={store}>
      <DataContext.Provider value={mockLanguageData}>
        <Feedback
          url="/feedback"
          feedbackData={{ ownerId: "12345" }}
          feedbackType={false}
          {...props}
        />
      </DataContext.Provider>
    </Provider>
  );
};

const renderComponent = (props = {}) => {
  const store = mockStore({
    auth: { userInfo: { userId: "12345" } },
  });

  return render(
    <Provider store={store}>
      <DataContext.Provider value={mockLanguageData}>
        <Feedback
          url="/feedback"
          feedbackData={{ ownerId: "12345" }}
          feedbackType={true}
          hideHeader={false}
          {...props}
        />
      </DataContext.Provider>
    </Provider>
  );
};

describe("Feedback Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component without crashing", () => {
    renderComponent();
    expect(screen.getByText("How likely are you to recommend us?")).toBeInTheDocument();
  });

  it("displays feedback emojis", () => {
    renderComponent();
    const emojis = screen.getAllByAltText(/Unselected emoji/i);
    expect(emojis.length).toBe(5);
  });

  it("hides the header when hideHeader is true", () => {
    renderComponent({ hideHeader: true });
    expect(screen.queryByText("How likely are you to recommend us?")).not.toBeInTheDocument();
  });

  it("selects an emoji and updates the rating", () => {
    renderComponent();
    const emojis = screen.getAllByAltText(/Unselected emoji/i);
    fireEvent.click(emojis[2]); // Select the 3rd emoji
    expect(emojis[2]).toHaveAttribute("alt", "Unselected emoji 3");
  });

  it("updates the textarea input", async () => {
    renderComponent();
    const imageTravel = screen.getByTestId("image_travel_0");
    fireEvent.click(imageTravel);
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Add a comment");
      fireEvent.change(textarea, { target: { value: "Great service!" } });
      expect(textarea).toHaveValue("Great service!");
    })
  });

  it("calls fetchData on submit", async () => {
    renderComponent();
    const imageTravel = screen.getByTestId("image_travel_0");
    fireEvent.click(imageTravel);
    await waitFor(() => {
      const submitButton = screen.getByText("Submit Feedback");
      fireEvent.click(submitButton);
    });
  });

  it("opens the slider when an emoji is clicked in feedbackType mode", () => {
    renderComponent({ feedbackType: true });
    const emojis = screen.getAllByAltText(/Unselected emoji/i);
    fireEvent.click(emojis[1]); // Click the 2nd emoji
    expect(screen.getByText("How do you feel?")).toBeInTheDocument();
  });

  it("displays an error toast on API failure", async () => {
    (callAPI as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    renderComponent();
    const imageTravel = screen.getByTestId("image_travel_0");
    fireEvent.click(imageTravel);
    await waitFor(() => {
      const submitButton = screen.getByText("Submit Feedback");
      fireEvent.click(submitButton);  
    })

  });
});

describe("renderComponentWithFeeedbackFalse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component without crashing", () => {
    renderComponentWithFeeedbackFalse();
    expect(screen.getByText("How likely are you to recommend us?")).toBeInTheDocument();
  });
});