import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeButton/ThemeButton";
import PoliciesCard from "./PolicyCard/PoliciesCard";
import { DEFAULT_CARD_TOSHOW, endorseTypes } from "../../../../../../../constant";
import "./SelectPolicyCard.scss";

interface SelectPolicyCardProps {
  onPolicySelect: (policyNumber: string) => void;
  selectedPolicy?: string;
  allPolicy: string[];
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
}

const SelectPolicyCard: React.FC<SelectPolicyCardProps> = ({
  onPolicySelect,
  selectedPolicy,
  allPolicy,
  langData,
}) => {
  const [slectedPolicyNumber, setSlectedPolicyNumber] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const handlePolicySelect = (PolicyNum: string) => {
    setSlectedPolicyNumber(PolicyNum)
    onPolicySelect?.(PolicyNum)
  }
  const today = new Date();
  const addDays = 28 * 24 * 60 * 60 * 1000;
  const filteredPolicies = Array.isArray(allPolicy)
    ? allPolicy.filter((policy) => {
      if (!policy.effectiveDate || !policy.expiryDate || policy.endorsementType === endorseTypes.cancel) {
        return false;
      } else {
        const startDate = new Date(policy.effectiveDate);
        const expiryDate = new Date(policy.expiryDate);
        const expiryPlus28Days = new Date(
          expiryDate.getTime() + addDays
        );
        return today >= startDate && today <= expiryPlus28Days;
      }
    })
    : [];

  const totalItems = filteredPolicies.length;
  const renderCards = () => {
    return filteredPolicies
      .slice(currentIndex, currentIndex + DEFAULT_CARD_TOSHOW)
      .map((card, index) => (
        <PoliciesCard
          key={index}
          policy={card}
          isSelected={slectedPolicyNumber === card.policyNo}
          navigateTo={undefined}
          onClick={handlePolicySelect}
          languageData={langData}
        />
      ));
  };
  const handlePrevClick = () => {
    setCurrentIndex((prev) => Math.max(0, prev - DEFAULT_CARD_TOSHOW));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) =>
      Math.min(totalItems - DEFAULT_CARD_TOSHOW, prev + DEFAULT_CARD_TOSHOW)
    );
  };
  return (
    <Card className="select-policy-left-card">
      <div className="select-policy-card">
        <div className="select-policy-header walaa-medium-500">
          {langData?.product.select_policy}
        </div>
        <hr className="horizontal-line" />
        <div className="dashboard-container">
          <div className="policies-section">
            <div className="policies-list-container">
              <div className="policies-header">
                <div className="policies-title walaa-medium-500"></div>
                <div className="scroll-navigation walaa-regular-400">
                  <div className="prev-button">
                    <ThemeButton
                      icon={true}
                      iconName="ChevronLeft"
                      variant="dashboardSlide"
                      isDisabled={currentIndex === 0}
                      title={""}
                      classes={currentIndex === 0 ? "disabled" : "button-text-medium walaa-medium-500"}
                      onClickhandler={handlePrevClick}
                    />
                  </div>
                  <div className="next-button">
                    <ThemeButton
                      icon={true}
                      iconName="ChevronRight"
                      variant="dashboardSlide"
                      isDisabled={currentIndex + DEFAULT_CARD_TOSHOW >= totalItems}
                      title={""}
                      classes={`${currentIndex + DEFAULT_CARD_TOSHOW >= totalItems ? "disabled" : ""} button-text-medium walaa-medium-500`}
                      onClickhandler={handleNextClick}
                    />
                  </div>
                </div>
              </div>
              <div className="policies-cards-container">{renderCards()}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SelectPolicyCard;
