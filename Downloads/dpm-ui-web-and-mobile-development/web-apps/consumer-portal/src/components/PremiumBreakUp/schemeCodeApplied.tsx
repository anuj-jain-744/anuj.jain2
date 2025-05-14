import React from 'react';
import promoCodeIconWhite from "assets/QuoteAndBuy/promoCodeIconWhite.svg";
import crossWhite from "assets/QuoteAndBuy/crossWhite.svg";
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

interface SchemeCodeAppliedProps {
    promoCodeApplied: string;
    callhandleCalculatePremium?: () => void;
}

const SchemeCodeApplied: React.FC<SchemeCodeAppliedProps> = ({ promoCodeApplied, callhandleCalculatePremium }) => {
    const { setSchemeCode } = useQuoteAndBuyContext();

    const handleClick = () => {
        setSchemeCode(null);
        if(callhandleCalculatePremium  ){
            callhandleCalculatePremium();
        }
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