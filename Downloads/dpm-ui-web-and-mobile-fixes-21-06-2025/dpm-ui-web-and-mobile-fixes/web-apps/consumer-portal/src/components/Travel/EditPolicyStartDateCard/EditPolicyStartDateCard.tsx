import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import EditSquare from "assets/QuoteAndBuy/edit_square.svg";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { DATE_FORMATS } from "constant";
import { formatDateObjectTo } from "utils/formatDate";

interface IEditPolicyStartDateCard {
    languageData: LanguageData | undefined | null;
    setLeftStep: (step: number) => void;
}

const BASE_TEST_ID = "edit_policy_start_date";

const EditPolicyStartDateCard: React.FC<IEditPolicyStartDateCard> = ({ languageData, setLeftStep }) => {

    const {travelDateRange } = useQuoteAndBuyContext();
    const [travelStartDate,] = travelDateRange
    
    return (
        <React.Fragment>
            <Card className="policystart-card w-100">
                <Card.Body className="w-100" data-testid={`${BASE_TEST_ID}-container_card`}>
                    <Row>
                        <Col>
                            <Row className="align-items-center justify-content-between">
                                <Col>
                                    <Row className="align-items-center justify-content-between">
                                        <Col xs="auto" className="ps-2">
                                            {languageData?.policy_start_date}:
                                            <span className="px-1 walaa-medium-500">{formatDateObjectTo(travelStartDate, DATE_FORMATS["DD/MM/YYYY"])??''}</span>
                                        </Col>
                                        <Col xs="auto" className="policystart-icn-container" data-testid={`${BASE_TEST_ID}-edit_start_date`} onClick={() => setLeftStep(1)}>
                                            <img src={EditSquare} alt="edit" />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="travel-policy-start-text">{languageData?.start_date_message}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
export default EditPolicyStartDateCard;
