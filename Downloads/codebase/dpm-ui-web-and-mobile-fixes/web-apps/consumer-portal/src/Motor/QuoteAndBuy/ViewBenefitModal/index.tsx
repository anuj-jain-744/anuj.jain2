import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import data from "./ViewBenefitModal.json";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import CoverageItem from "./CoverageItem";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { productIDs } from "constant";
import { getAmountWithIcon } from "@app-shell/utils/common";

const homeCoveragePlans = (coverageTypes, accordians, languageData, coveragePlanSelected, repairType) => {
  if (coverageTypes && coverageTypes.length > 0) {
    return coverageTypes;
  }
  const coverageType = repairType.replace(/\s+/g, '').toLowerCase();
  const coverageValue = languageData[coveragePlanSelected][0][coverageType];
  if (!coverageValue) {
    return coverageTypes;
  }
  let isAccordian = '';
  languageData[coveragePlanSelected][0].benefits.forEach((data: string, index: number) => {
    const isCheckInAccordians = accordians.indexOf(data);
    if (!isAccordian && isCheckInAccordians === -1) {
      coverageTypes.push({ 'type': data, value: coverageValue[index], classname: 'benefits' });
    } else if (isAccordian && isCheckInAccordians === -1) {
      coverageTypes[coverageTypes.length - 1].type.push({ 'type': data, value: coverageValue[index] })
    }
    if (accordians.indexOf(data) !== -1) {
      isAccordian = data;
      coverageTypes.push({ 'type': data, 'child': true });
      coverageTypes.push({ 'type': [], 'key': data });
    }
  })
  return coverageTypes;
}


function ViewBenefitModal({ show, coveragePlanSelected, languageData, onHide, repairType, price }) {
  const { homePremiumResponse, productName } = useQuoteAndBuyContext();

  const coverageTypes: any = [];
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const accordians = languageData[`${coveragePlanSelected}_accordians`];
  const [openAccordion, setOpenAccordion] = useState(accordians);
  const coverageType = repairType.replace(/\s+/g, '').toLowerCase();

  if (homePremiumResponse && productName === productIDs.home) {
    const repairOptionData: Record<string, any> = { [coverageType]: homePremiumResponse[coverageType] };
    const priceData = calculatePremium(repairOptionData);
    price = priceData.minFinalPrice;
  }

  const coverageItems = isHome ? homeCoveragePlans(coverageTypes, accordians, languageData, coveragePlanSelected, repairType) : data.coverageTypes[repairType];

  const triggerViewBenefit = (key: string) => {
    setOpenAccordion([key]);
  }


  return (
    <Modal className="view-benefits-modal" show={show} onHide={onHide} aria-labelledby="view-benefits-modal">
      <div className="modalContainer">
        <div className='frame'>
          <div className='heading'>{repairType}</div>
          <img
            src={closeIcon}
            alt="close icon"
            className='btn-close-icon'
            onClick={onHide}
          />
        </div>
        <div className="sub-heading">
          <div className="table-scroll">
            <div className="sub-sub-heading table-header-row">
              <div className="coverage walaa-medium-500">
                {languageData?.coverage_type}
              </div>
              <div className="repair-right-side">
                <div className="repair-top1 walaa-medium-500">{repairType}</div>
                <div className="sar-value">
                  <span className="price1">{getAmountWithIcon(price)}</span>
                </div>
              </div>
            </div>

            <div className="w-100">
              {coverageItems?.map((item, index) => (
                typeof item.type === 'object' ?
                  item.key && openAccordion.indexOf(item.key) !== -1 ? item.type.map((subitems, index) => (
                    <CoverageItem key={index} openAccordion={openAccordion} triggerViewBenefit={triggerViewBenefit} accordians={accordians} items={subitems} />
                  )) : ''
                  :
                  <CoverageItem key={index} openAccordion={openAccordion} triggerViewBenefit={triggerViewBenefit} accordians={accordians} items={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ViewBenefitModal;
