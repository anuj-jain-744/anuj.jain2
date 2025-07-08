import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeTextbox from "../ThemeTextbox";

describe("ThemeTextbox Component", () => {

	it("renders ThemeTextbox component", async () => {
		const mockChangeHandler = jest.fn();
		const mockPlaceHolder = "textbox Placeholder";
		const mockValue = "";
		render(
			<ThemeTextbox
				placeholder={mockPlaceHolder}
				value={mockValue}
				onChangehandler={mockChangeHandler}
				isRequired={false}
				name={"test"}
				type={"text"} />
		);
		const inputElement = screen.getByPlaceholderText(mockPlaceHolder) as HTMLInputElement;
		fireEvent.change(inputElement, { target: { value: "New value" } });
		expect(mockChangeHandler).toHaveBeenCalled();
	});

	it("renders ThemeTextbox component", async () => {
		const mockChangeHandler = jest.fn();
		const mockPlaceHolder = "textbox Placeholder";
		const mockValue = "";
		render(
			<ThemeTextbox
				placeholder={mockPlaceHolder}
				value={mockValue}
				onChangehandler={mockChangeHandler}
				isRequired={true}
				title="title test"
				name={"test"}
				type={"number"} 
				errorMessage="TESTS ERROR"
			/>
		);

		expect(screen.getByText('title test')).toBeInTheDocument();
		expect(screen.getByText('TESTS ERROR')).toBeInTheDocument();

	});
});