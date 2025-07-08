import React from 'react';
import promoCodeIconWhite from "assets/QuoteAndBuy/promoCodeIconWhite.svg";
import crossWhite from "assets/QuoteAndBuy/crossWhite.svg";
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

interface SchemeCodeAppliedProps {
    promoCodeApplied: string;
}

const SchemeCodeApplied: React.FC<SchemeCodeAppliedProps> = ({ promoCodeApplied }) => {
    const { setSchemeCode } = useQuoteAndBuyContext();

    const handleClick = () => {
        setSchemeCode(null);
    };

    return (
        <div className="scheme-code-applied">
            <img src={promoCodeIconWhite} alt={promoCodeApplied} />
            <p className="walaa-medium-500">{promoCodeApplied}</p>
            <img className="cursor-pointer" onClick={handleClick} src={crossWhite} alt={promoCodeApplied} />
        </div>
    );
};

export default SchemeCodeApplied;