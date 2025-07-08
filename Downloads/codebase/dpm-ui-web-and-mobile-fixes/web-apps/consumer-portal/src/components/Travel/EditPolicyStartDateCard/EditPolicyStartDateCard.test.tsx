import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import EditPolicyStartDateCard from './EditPolicyStartDateCard';
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { DateObject } from "react-multi-date-picker";

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
    useQuoteAndBuyContext: jest.fn(),
}));

describe('<EditPolicyStartDateCard/>', () => {

    beforeEach(() => {
        const travelStartDate = new DateObject();
        const travelEndDate = new DateObject(travelStartDate).add(12, 'days');

        useQuoteAndBuyContext.mockReturnValue({
            travelDateRange: [travelStartDate, travelEndDate]
        });

    })
    const languageData: LanguageData = {
        policy_start_date: 'Policy Start Date',
        start_date_message: 'This date is same as Travel Start Date.'
    };

    it('should render the component without any error', () => {
        render(<EditPolicyStartDateCard languageData={languageData} setLeftStep={jest.fn()} />);
        expect(screen.getByTestId("edit_policy_start_date-container_card")).toBeInTheDocument();
        expect(screen.getByTestId("edit_policy_start_date-edit_start_date")).toBeInTheDocument();
    })
    it('should render correct date from context', async () => {
        render(<EditPolicyStartDateCard languageData={languageData} setLeftStep={jest.fn()} />);
        expect(await screen.findByText((new DateObject).format('DD/MM/YYYY'))).toBeInTheDocument();
    })
    it('should set the leftStep to 1 when edit icon ic clicked', async() => {
        const setLeftStepMock = jest.fn()
        render(<EditPolicyStartDateCard languageData={languageData} setLeftStep={setLeftStepMock} />);
        const editIcon = screen.getByTestId("edit_policy_start_date-edit_start_date")
        fireEvent.click(editIcon);
        expect(setLeftStepMock).toHaveBeenCalled();
        expect(setLeftStepMock).toHaveBeenCalledTimes(1);
        expect(setLeftStepMock).toHaveBeenCalledWith(1);

    })

})
