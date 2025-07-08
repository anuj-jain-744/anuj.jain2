import React, { useState } from 'react';
import promoCodeIconWhite from "assets/QuoteAndBuy/promoCodeIconWhite.svg";
import crossWhite from "assets/QuoteAndBuy/crossWhite.svg";
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { Modal, Button } from 'react-bootstrap';
import useLanguageData from "../../hook/common/useLanguageData";

interface SchemeCodeAppliedProps {
    promoCodeApplied: string;
    callhandleCalculatePremium?: () => void;
    setLeftStep?: (val: number) => void;
}

const SchemeCodeApplied: React.FC<SchemeCodeAppliedProps> = ({ promoCodeApplied, setLeftStep, callhandleCalculatePremium }) => {
    const { setSchemeCode } = useQuoteAndBuyContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    const { languageData, isLoading } = useLanguageData();

    const handleCloseModal = () => setShowModal(false);
    const handleOpenModal = () => setShowModal(true);

    const handleRemovePromoCode = () => {
        setSchemeCode(null);
        if (callhandleCalculatePremium) {
            callhandleCalculatePremium();
            setTimeout(() => {
                setLeftStep && setLeftStep(2);
            }, 5000);
            setShowModal(false);
        }
    };

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
                centered
                data-testid="motor-apply-remove-promocode-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="walaa-medium-500">
                        {languageData?.promo_code || "Remove Promo Code"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column registration-det-body">
                        <div className="fw-medium">
                            {languageData?.remove_promo_code_message}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="register-call2action walaa-medium-400"
                        onClick={handleCloseModal}
                    >
                        {languageData?.cancel}
                    </Button>
                    <Button
                        className="register-call2action walaa-medium-400"
                        onClick={handleRemovePromoCode}
                    >
                        {languageData?.yes}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="scheme-code-applied">
                <img src={promoCodeIconWhite} alt={promoCodeApplied} />
                <p className="walaa-medium-500">{promoCodeApplied}</p>
                <img className="cursor-pointer" onClick={handleOpenModal} src={crossWhite} alt={promoCodeApplied} />
            </div>
        </>
    );
};

export default SchemeCodeApplied;