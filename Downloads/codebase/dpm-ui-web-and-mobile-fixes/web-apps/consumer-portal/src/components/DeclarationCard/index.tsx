import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import ToggleButton from "Motor/QuoteAndBuy/VehicleDetailsModal/ToggleButton/ToggleButton";
import { useLocation } from "react-router-dom";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import CustomAlertBox from "components/CustomAlertBox";
import { commonKeywords } from "constant";


export interface DeclarationProps {
  label: string;
  key: string;
  value: string;
}

interface DeclarationCardProps {
  declare: DeclarationProps[];
  declareHead: string;
  languageData?: LanguageData;
}

const DeclarationCard: React.FC<DeclarationCardProps> = ({
  declare,
  declareHead,
  languageData,
}) => {

  const {
    warningLabel,
    options,
  } = commonKeywords;

  const {
    declaration,
    setDeclaration
  } = usePHQuoteBuyContext();

  const location = useLocation();
  const propsData = location?.state?.data;
  const ownerFullNameEnglishCapitalized = capitalizeNameFirstLetter(propsData?.ownerDetail?.ownerFullNameEnglish);

  const showMoreCount = 3;
  const [showItems, setShowItems] = useState<boolean>(false);

  const onChangeHandler = (key: string, value: string) => {
    setDeclaration((val:{}) => ({ ...val, [key]: !value }));
  };

  const onExpand = () => {
    setShowItems(key => !key)
  }

  function mapDeclarationItems(items: DeclarationProps[], starts: number) {
    return items?.map((declareItem, idx: number) => {
      const declaredItems = declaration?.hasOwnProperty(declareItem?.key);
      const active = declaredItems ? declaration[declareItem?.key] : options[declareItem?.value];
      return (
        <React.Fragment key={declareItem.key || idx}>
          <div className="declare-container">
            <div className="declare-txt">
              <span className="declare-bold">{idx + starts}. </span>
              {declareItem.label}
            </div>
            <div className="declare-toggle">
              <ToggleButton
                leftLabel={languageData?.yes ? languageData?.yes.toString() : ""}
                rightLabel={languageData?.no ? languageData?.no.toString() : ""}
                isActive={active}
                onChange={() => onChangeHandler(declareItem?.key, active)}
              />
            </div>
          </div>
          {declaredItems && declareItem?.value && options[declareItem?.value] !== declaration[declareItem?.key] && (
            <div className="coastal-line">
              <CustomAlertBox variant={warningLabel}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: languageData?.propertyNearCoastlineWarning,
                  }}
                />
              </CustomAlertBox>
            </div>
          )}
        </React.Fragment>
      );
    });
  }

  return (
    <div className="card-section-declare background-color-white">
      <div className="motor-card-heading" data-testid="vehicalHead">
        {declareHead}
      </div>
      <div className="declare-wrap">
        {languageData?.welcome_message && <div className="welcome-message">{ownerFullNameEnglishCapitalized}, {languageData?.welcome_message_declaration}</div>}
        {mapDeclarationItems(declare?.slice(0, showMoreCount), 1)}
        {showItems && mapDeclarationItems(declare?.slice(showMoreCount, declare.length), 4)}
        {declare?.length > showMoreCount && <button className="show-more-btn" onClick={onExpand}>{showItems ? languageData?.show_less : languageData?.show_more}</button>}
      </div>
    </div>
  );
};

export default DeclarationCard;
