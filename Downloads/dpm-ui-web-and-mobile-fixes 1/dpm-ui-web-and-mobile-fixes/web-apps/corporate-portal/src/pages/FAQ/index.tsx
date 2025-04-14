import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import {scrollToElement} from "@dpm/shared-module";

import { IconsSet } from "../../utils/icons";
import { Tabs } from "../../components/Tabs";
import { Accordians } from "../../components/Accordians";
import { Searchbar } from "./Searchbar";
import { FAQScreenProps, ActiveTab, Category } from "./types";
import { FaqResponsive } from "./FaqResponsive";

import "./index.scss";

interface ChildProps {
  categories: Category[];
  accordianData: Record<string, { qns: string; ans: string }[]>;
  activeResTab: ActiveTab[];
  navigateTo: (path: string) => void;
  greet: (message: string) => void;
}

export const FAQScreen: React.FC<FAQScreenProps> = ({
  categories,
  accordianData,
  navigateTo,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>({
    index: 0,
    item: { name: "", class: "" },
  });

  const [label, setLabel] = useState({ title: "", faq: "" });

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab({
        index: 0,
        item: categories[0],
      });
    }
  }, [categories]);

  const handleSelectTab = (item: Category, index: number) => {
    setActiveTab({
      index: index,
      item: item,
    });
    scrollToElement("accordian-faq", -60);
  };

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 991);
  if (isMobile) {
    return (
      <FaqResponsive navigateTo={navigateTo} categories={categories} accordianData={accordianData} />
    );
  }

  return (
    <div className="faq-wrapper">
      <Searchbar navigateTo={navigateTo} setLabel={setLabel} />
      <Container fluid id="accordian-faq">
        <Row>
          <Col lg={4}>
            <div className="topic-title walaa-medium-500">{label.title}</div>
            <Tabs
              tabItems={categories}
              activeTabItem={activeTab}
              handleSelectTab={handleSelectTab}
            />
          </Col>
          {activeTab.item.name && (
            <Col lg={8}>
              <div className="result-title">
                <img
                  src={IconsSet[activeTab.item.class]}
                  alt="faq"
                  className="faq-title-icon"
                />
                <span className="walaa-medium-500">
                  {activeTab.item.name} {label.faq}
                </span>
              </div>
              <div className="accordian-wrapper">
                <Accordians content={accordianData[activeTab.item.name]} />
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};
