import React, { useState, useEffect } from "react";
import { IconsSet } from "../../utils/icons";
import { Container, Col, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordians } from "../../components/Accordians";
import { Searchbar } from "./Searchbar";
import { ActiveTab, Category } from "./types";
import "./FaqResponsive.scss";

interface TabItem {
  class: string;
  name: string;
}

interface ActiveTabItem {
  index: number;
}

interface TabsProps {
  tabItems: TabItem[];
  activeTabItem: ActiveTabItem;
  handleSelectTab: (item: TabItem, index: number) => void;
}

interface ChildProps {
  categories: Category[];
  accordianData: Record<string, { qns: string; ans: string }[]>;
  activeResTab: ActiveTab[];
  navigateTo?: (path: string) => void;
}

interface Multiprops extends ChildProps, TabsProps {}

export const FaqResponsive: React.FC<Multiprops> = ({
  tabItems,
  categories,
  accordianData,
  activeTabItem,
  navigateTo,
}) => {
  tabItems = categories;
  // Categories are mapped with TabItewm

  const [activeTab, setActiveTab] = useState<ActiveTab>({
    index: 0,
    item: { name: "", class: "" },
  });

  activeTabItem = activeTab;
  // this assignment should be  after useState Action , So It will get Data From tabsItem

  const [label, setLabel] = useState({ title: "", faq: "" });

  useEffect(() => {
    if (categories?.length > 0) {
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
  };

  return (
    <div className="faq-wrapper">
      <Searchbar navigateTo={navigateTo} setLabel={setLabel} />

      <Container fluid id="accordian-faq">
        <Row>
          <Col lg={4} className="faq-trim-padding">
            <div className="topic-title walaa-medium-500">{label.title}</div>

            <Col sm={12} className="faq-dropdown-wrapper">
              <DropdownButton
                data-testid="dropdownToogleClick-button"
                title={
                  <div className="faq-drop-txt-wrap">
                    {activeTab.item.name && (
                      <>
                        <span className="faq-drop-img">
                          <img
                            src={IconsSet[activeTab.item.class]}
                            alt="get-quote-dropdown"
                          />
                        </span>
                        <span className="walaa-semibold-600 faq-drop-txt">
                          {activeTab.item.name}
                        </span>
                      </>
                    )}
                    <ExpandMoreIcon />
                  </div>
                }
              >
                {tabItems.length > 0 &&
                  tabItems.map((item, idx) => (
                    <React.Fragment>
                      <Dropdown.Item
                        data-testid="dropdownToogleClick"
                        className="faq-dropdown-label unactive"
                        onClick={() => handleSelectTab(item, idx)}
                      >
                        <span className="drop-item-wrap">
                          <span className="drop-img">
                            <img
                              src={IconsSet[item.class]}
                              alt="get-quote-dropdown"
                            />
                          </span>

                          <span className="drop-txt">{item.name}</span>
                        </span>
                      </Dropdown.Item>
                    </React.Fragment>
                  ))}
              </DropdownButton>
            </Col>
          </Col>
          {activeTab.item.name && (
            <Col lg={8} className="faq-trim-padding">
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
