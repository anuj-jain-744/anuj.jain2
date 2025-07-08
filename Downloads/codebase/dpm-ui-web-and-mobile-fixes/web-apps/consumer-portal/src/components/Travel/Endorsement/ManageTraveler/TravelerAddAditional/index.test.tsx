import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddAdditionalTraveller from "./index";

jest.mock("./CounterComp", () => (props: any) => {
  return (
    <button
      data-testid={`counter-${props.type}`}
      onClick={() => props.onTotalChange(props.type, 1)}
    >
      {props.type} count: {props.countReceived}
    </button>
  );
});

describe("AddAdditionalTraveller", () => {
  const dataMock = {
    add_traveller: "Add Traveller",
    add_traveller_button: "Add Traveller Modal",
    select_number_of_travellers: "Select number of travellers",
    children: "Children",
    adult: "Adult",
    senior_citizen: "Senior Citizen",
  };

  let setAdultCountMock: jest.Mock;
  let setChildCountMock: jest.Mock;
  let setSrCitizenCountMock: jest.Mock;
  let showTravelerAddFormMock: jest.Mock;
  let setAdditionalCountsMock: jest.Mock;

  beforeEach(() => {
    setAdultCountMock = jest.fn();
    setChildCountMock = jest.fn();
    setSrCitizenCountMock = jest.fn();
    showTravelerAddFormMock = jest.fn();
    setAdditionalCountsMock = jest.fn();
  });

  test("renders add traveller button", () => {
    render(
      <AddAdditionalTraveller
        adultCount={1}
        childCount={2}
        srCitizenCount={0}
        setAdultCount={setAdultCountMock}
        setChildCount={setChildCountMock}
        setSrCitizenCount={setSrCitizenCountMock}
        data={dataMock}
        showTravelerAddForm={showTravelerAddFormMock}
        setAdditionalCounts={setAdditionalCountsMock}
      />
    );
    expect(screen.getByText(/Add Traveller/i)).toBeInTheDocument();
  });

  test("opens and closes modal on button click and close button", async () => {
    render(
      <AddAdditionalTraveller
        adultCount={1}
        childCount={2}
        srCitizenCount={0}
        setAdultCount={setAdultCountMock}
        setChildCount={setChildCountMock}
        setSrCitizenCount={setSrCitizenCountMock}
        data={dataMock}
        showTravelerAddForm={showTravelerAddFormMock}
        setAdditionalCounts={setAdditionalCountsMock}
      />
    );

    expect(screen.queryByText(/Select number of travellers/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Add Traveller/i));
    expect(await screen.findByText(/Select number of travellers/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Close/i));
    await waitFor(() =>
      expect(screen.queryByText(/Select number of travellers/i)).not.toBeInTheDocument()
    );
  });

  test("increments counters and submits correctly", async () => {
    render(
      <AddAdditionalTraveller
        adultCount={1}
        childCount={2}
        srCitizenCount={0}
        setAdultCount={setAdultCountMock}
        setChildCount={setChildCountMock}
        setSrCitizenCount={setSrCitizenCountMock}
        data={dataMock}
        showTravelerAddForm={showTravelerAddFormMock}
        setAdditionalCounts={setAdditionalCountsMock}
      />
    );

    fireEvent.click(screen.getByText(/Add Traveller/i));

    fireEvent.click(screen.getByTestId("counter-child"));
    fireEvent.click(screen.getByTestId("counter-adult"));
    fireEvent.click(screen.getByTestId("counter-srCitizen"));

    fireEvent.click(screen.getByText(/Submit/i));

    expect(setChildCountMock).toHaveBeenCalledWith(3);
    expect(setAdultCountMock).toHaveBeenCalledWith(2);
    expect(setSrCitizenCountMock).toHaveBeenCalledWith(1);

    expect(setAdditionalCountsMock).toHaveBeenCalledWith({
      child: 3 - 2,
      adult: 2 - 1,
      srCitizen: 1 - 0,
    });

    expect(showTravelerAddFormMock).toHaveBeenCalled();
  });

  test("modal resets local counts to current prop values on open", async () => {
    const { rerender } = render(
      <AddAdditionalTraveller
        adultCount={1}
        childCount={2}
        srCitizenCount={0}
        setAdultCount={setAdultCountMock}
        setChildCount={setChildCountMock}
        setSrCitizenCount={setSrCitizenCountMock}
        data={dataMock}
        showTravelerAddForm={showTravelerAddFormMock}
        setAdditionalCounts={setAdditionalCountsMock}
      />
    );

    fireEvent.click(screen.getByText(/Add Traveller/i));
    expect(await screen.findByText(/Select number of travellers/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("counter-child"));

    fireEvent.click(screen.getByText(/Close/i));
    await waitFor(() =>
      expect(screen.queryByText(/Select number of travellers/i)).not.toBeInTheDocument()
    );

    rerender(
      <AddAdditionalTraveller
        adultCount={2}
        childCount={3}
        srCitizenCount={1}
        setAdultCount={setAdultCountMock}
        setChildCount={setChildCountMock}
        setSrCitizenCount={setSrCitizenCountMock}
        data={dataMock}
        showTravelerAddForm={showTravelerAddFormMock}
        setAdditionalCounts={setAdditionalCountsMock}
      />
    );

    fireEvent.click(screen.getByText(/Add Traveller/i));
    
    expect(screen.getByTestId("counter-adult")).toHaveTextContent("adult count: 2");
    expect(screen.getByTestId("counter-child")).toHaveTextContent("child count: 3");
    expect(screen.getByTestId("counter-srCitizen")).toHaveTextContent("srCitizen count: 1");
  });
});
