import React, { useState } from "react";
import "./style.scss";
import { CompensationTypeKeys } from "types/coverageplan";
import { Modal } from "react-bootstrap";
import Approve from "assets/QuoteAndBuy/Approve.svg";

interface CoverageItemProps {
  items: any;
  accordians: string;
  openAccordion: string;
  triggerViewBenefit: () => void;
}

const CoverageItem: React.FC<CoverageItemProps> = ({ items, accordians = '', triggerViewBenefit, openAccordion = [] }) => {
  const { type, child, type1, type2 } = items

  const expandAccordion = (key: string, child: string) => () => {
    if (child) {
      triggerViewBenefit(key)
    }
  }

  return <div className="coverage-item">
    <button className="type" onClick={expandAccordion(type, child)}>
      {type} {child && '>>'}
    </button>
    <div className="value1">
      {type1 === 'Yes' ? <img src={Approve} alt={type1} /> : type1}
    </div>
    <div className="value2">
      {type2 === 'Yes' ? <img src={Approve} alt={type2} /> : type2}
    </div>
  </div>
};

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

const coverageTypes: CTData = [];

function HomeCompareBenefits({ showCompareBenefits, languageData, coveragePlanSelected, onClose }) {
  const accordians = languageData[`${coveragePlanSelected}_accordians`];
  const headers = languageData[`${coveragePlanSelected}_headers`];

  const [openAccordion, setOpenAccordion] = useState(accordians);
  homeCoveragePlans(coverageTypes, accordians, headers, languageData, coveragePlanSelected);

  const triggerViewBenefit = (key: string) => {
    setOpenAccordion([key]);
  }
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
            Coverage Type
          </div>
          <div className="repair-middle-side">
            <div className="repair-top walaa-medium-500">{headers[1]}</div>
            {languageData?.sar} {" "}
            <span className="price walaa-medium-500"></span>
          </div>
          <div className="repair-right-side">
            <div className="repair-top walaa-medium-500">{headers[2]}</div>
            {languageData?.sar} {" "}
            <span className="price walaa-medium-500"></span>
          </div>
        </div>
        {coverageTypes.map((item, index: number) => (
          typeof item.type === 'object' ? (
            item.key && openAccordion.indexOf(item.key) !== -1 ?
              item.type.map((subitems, index) => (
                <CoverageItem key={index} openAccordion={openAccordion} triggerViewBenefit={triggerViewBenefit} accordians={accordians} items={subitems} />
              )) : '')
            : (
              <CoverageItem key={index} openAccordion={openAccordion} triggerViewBenefit={triggerViewBenefit} accordians={accordians} items={item} />
            )))}
      </div>
    </Modal>
  );
}

export default HomeCompareBenefits;
