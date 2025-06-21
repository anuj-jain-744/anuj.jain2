import React, { useState } from "react";
import "./styles.scss";
import { CompensationTypeKeys } from "types/coverageplan";
import { Modal } from "react-bootstrap";
import CoverageItem from "./CoverageItem";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface CTData {
  [key: number]: string | number;
  length: number;
  push: any;
  map: any
}

const homeCoveragePlans = (coverageTypes: CTData, accordians: string[], headers: string[], languageData: any, coveragePlanSelected: CompensationTypeKeys) => {
  if (coverageTypes && coverageTypes.length > 0) {
    return coverageTypes;
  }
  const plan1: string = headers[1].replace(/\s+/g, '').toLowerCase();
  const plan2: string = headers[2].replace(/\s+/g, '').toLowerCase();
  const plan1Content = languageData[coveragePlanSelected][0][plan1];
  const plan2Content = languageData[coveragePlanSelected][0][plan2];
  let isAccordian = '';
  languageData[coveragePlanSelected][0].benefits.forEach((data: string, index: number) => {
    const isCheckInAccordians = accordians.indexOf(data);
    if (!isAccordian && isCheckInAccordians === -1) {
      coverageTypes.push({ 'type': data, type1: plan1Content[index], type2: plan2Content[index], classname: 'content-benefits' });
    } else if (isAccordian && isCheckInAccordians === -1) {
      coverageTypes[coverageTypes.length - 1].type.push({ 'type': data, type1: plan1Content[index], type2: plan2Content[index] })
    }
    if (accordians.indexOf(data) !== -1) {
      isAccordian = data;
      coverageTypes.push({ 'type': data, 'child': true });
      coverageTypes.push({ 'type': [], 'key': data });
    }
  })
  return coverageTypes;
}



function HomeBenefitModal({ showCompareBenefits, languageData, coveragePlanSelected, onClose }) {
  const accordians = languageData[`${coveragePlanSelected}_accordians`];
  const headers = languageData[`${coveragePlanSelected}_headers`];
  const coverageTypes: CTData = [];

  const [openAccordion, setOpenAccordion] = useState(accordians);
  homeCoveragePlans(coverageTypes, accordians, headers, languageData, coveragePlanSelected);

  const triggerViewBenefit = (key: string) => {
    setOpenAccordion([key]);
  }

  const {
    homePremiumResponse,
  } = useQuoteAndBuyContext();


  const plan1: string = headers[1].replace(/\s+/g, '').toLowerCase();
  const plan2: string = headers[2].replace(/\s+/g, '').toLowerCase();

  const plan1OptionData: Record<string, any> = { [plan1]: homePremiumResponse[plan1] };
  const price1Data = calculatePremium(plan1OptionData);
  const price1 = price1Data.minFinalPrice;

  const plan2OptionData: Record<string, any> = { [plan2]: homePremiumResponse[plan2] };
  const price2Data = calculatePremium(plan2OptionData);
  const price2 = price2Data.minFinalPrice;


  return (
    <Modal
      size="xl"
      show={showCompareBenefits}
      onHide={onClose}
      className="compare-benefit-container"
    >
      <Modal.Header closeButton className="header">
        <div className="header-content walaa-medium-500">
          {languageData?.compare_benefits}
        </div>
      </Modal.Header>
      <div className="sub-heading">
        <div className="sub-sub-heading">
          <div className="coverage walaa-medium-500">
            {headers[0]}
          </div>
          <div className="repair-right-side">
            <div className="repair-top walaa-medium-500">{headers[1]}</div>
            <div className="sar-value">
              <span className="price1">{getAmountWithIcon(price1)}</span>
            </div>
          </div>

          <div className="repair-right-side1">
            <div className="repair-top1 walaa-medium-500">{headers[2]}</div>
            <div className="sar-value">
              <span className="price1">{getAmountWithIcon(price2)}</span>
            </div>
          </div>
        </div>

        <div className="auto-scroll">
          {coverageTypes.map((item, index: number) => (
            typeof item.type === 'object' ? (
              item.key && openAccordion.indexOf(item.key) !== -1 ?
                item.type.map((subitems, index) => (
                  <CoverageItem key={index} triggerViewBenefit={triggerViewBenefit} items={subitems} openAccordion={openAccordion} />
                )) : '')
              : (
                <CoverageItem key={index} triggerViewBenefit={triggerViewBenefit} items={item} openAccordion={openAccordion} />
              )))}
        </div>
      </div>
    </Modal>
  );
}

export default HomeBenefitModal;