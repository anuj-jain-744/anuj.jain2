import React, { useState, useEffect } from "react";

import { Container, Row, Col, Nav, Accordion } from "react-bootstrap";
import "./index.scss";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { sanitizeHtml } from "@dpm/shared-module";

interface OverviewData {
  corporate_overview_title: string | null;
  data: {
    title: string;
    description: string;
  }[];
}

interface OverviewProps {
  content: OverviewData;
}

export const Overview: React.FC<OverviewProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (content.data.length > 0) {
      setActiveTab(content.data[0].title);
    }
  }, [content.data]);

  return (
    <Container id="productToggle-0" fluid className="overview-main-container">
      <div className="overview-wrapper ">
       {/* Desktop and Tablet View */}
      <div className="desktop-view d-none d-md-block">
        <Row>
          <Col className="col-xl-4 col-lg-5 col-md-5 col-sm-12 col-xs-12 col left-section">
            <h3 className="section-title">
            {content?.corporate_overview_title || ""}
            </h3>
            <Nav className="flex-column tabs-list">
              {content.data.map((tab) => (
                <Nav.Item key={tab.title}>
                  <Nav.Link
                    className="tab-link"
                    data-active={activeTab === tab.title}
                    onClick={() => setActiveTab(tab.title)}
                  >
                    {tab.title}
                    <span className="material-icons arrow-icon">
                      <ArrowForward />
                    </span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col className="col-xl-8 col-lg-7 col-md-7 col-sm-12 col-xs-12 col right-section">
            {content.data.map((tab) =>
              activeTab === tab.title ? (
                <div key={tab.title} className="tab-content">
                  <div dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(tab.description),
              }}></div>
                </div>
              ) : null
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile View */}
      <div className="mobile-view d-block d-md-none">
        <Accordion>
          {content.data.map((tab, index) => (
            <Accordion.Item eventKey={index.toString()} key={tab.title}>
              <Accordion.Header>{tab.title} </Accordion.Header>
              <Accordion.Body>
                <div dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(tab.description),
                  }}></div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
      </div>
    </Container>
  );
};
