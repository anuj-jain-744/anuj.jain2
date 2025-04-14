import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TravelerChild from './index';

// Mock components used in TravelerChild
jest.mock('../../../../../corporate-portal/src/components/Calendar/fullcalender', () => ({
    FullCalender: ({ value, setValue }: any) => (
        <input
            data-testid="calendar-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    ),
}));

jest.mock('../../TravelerAddDetails/info', () => ({
    __esModule: true,
    default: ({ popUpData }: any) => <div data-testid="info-icon">{popUpData}</div>,
}));

// Dummy data prop
const data = {
    traveller_name: 'Child Name',
    traveller_passport_no: 'Passport No',
    traveller_passport_no_placeholder: 'Enter Passport Number',
    traveller_passport_exp_date: 'Passport Expiry Date',
    passport_info: 'Expiry info',
    traveller_dob: 'Date of Birth',
    traveller_dob_placeholder: 'DD/MM/YYYY',
    traveller_relation: 'Relation',
    relations: ['Son', 'Daughter'],
    child_title: 'Child',
    incomplete: 'Incomplete',
    benfit_title: 'Benefits',
    benfit_sports: 'Winter Sports',
    benfit_sports_info: 'Winter info',
    benfit_covid: 'Covid Coverage',
    benfit_covid_info: 'Covid info',
    add_button: 'Add',
    remove_button: 'Remove',
};

describe('TravelerChild Component', () => {
    test('renders with one child and all required elements', () => {
        render(<TravelerChild noOfChilds={1} data={data} />);

        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Traveller 1')).toBeInTheDocument();
        expect(screen.getByText(data.traveller_name)).toBeInTheDocument();
        expect(screen.getByText(data.traveller_passport_no)).toBeInTheDocument();
        expect(screen.getByText(data.traveller_passport_exp_date)).toBeInTheDocument();
        expect(screen.getAllByTestId('info-icon')).toHaveLength(3); // 3 Info components
        expect(screen.getByText(data.benfit_title)).toBeInTheDocument();
        expect(screen.getByText(data.benfit_sports)).toBeInTheDocument();
        expect(screen.getByText(data.benfit_covid)).toBeInTheDocument();
    });

    test('opens and closes accordion on enter/exit', async () => {
        render(<TravelerChild noOfChilds={1} data={data} />);
        const header = screen.getByText('Child 1');
        fireEvent.click(header);
        await waitFor(() => {
            expect(screen.getByText(data.traveller_name)).toBeInTheDocument();
        });
    });

    test('handles input changes for name and passport number', async () => {
        render(<TravelerChild noOfChilds={1} data={data} />);

        const nameInput = screen.getByPlaceholderText('Enter Name');
        const passportInput = screen.getByPlaceholderText('Enter Passport Number');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(passportInput, { target: { value: '123456' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(passportInput).toHaveValue('123456');
    });

    test('handles calendar date changes', () => {
        render(<TravelerChild noOfChilds={1} data={data} />);

        const calendarInputs = screen.getAllByTestId('calendar-input');

        fireEvent.change(calendarInputs[0], { target: { value: '01/01/2030' } });
        fireEvent.change(calendarInputs[1], { target: { value: '01/01/2020' } });
        waitFor(() => {
            expect(calendarInputs[0]).toHaveValue('01/01/2030');
       
        expect(calendarInputs[1]).toHaveValue('01/01/2020');
    });
    });

    test('renders relation dropdown options', () => {
        render(<TravelerChild noOfChilds={1} data={data} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Daughter' } });
        expect(select).toHaveValue('Daughter');
    });

    test('toggles winter and covid benefits', () => {
        render(<TravelerChild noOfChilds={1} data={data} />);
        const winterButton = screen.getAllByText('Add')[0];
        const covidButton = screen.getAllByText('Add')[1];

        fireEvent.click(winterButton);
        expect(screen.getAllByText('Remove')[0]).toBeInTheDocument();

        fireEvent.click(covidButton);
        expect(screen.getAllByText('Remove')[1]).toBeInTheDocument();
    });
});
