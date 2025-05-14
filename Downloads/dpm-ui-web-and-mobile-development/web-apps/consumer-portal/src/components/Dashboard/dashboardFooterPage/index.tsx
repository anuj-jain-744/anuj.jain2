import React, { useEffect, useState } from "react";
import "./index.scss";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sanitizeHtml } from "@dpm/shared-module";

import { Container, Row, Col } from "react-bootstrap";

// Todo: DOM sanitization.
interface FooterProps {
  companyInfo: string;
  footerMenus: {
    [key: string]: { menuUrl: string; linkName: string }[];
  };
  copyRight: string;
  downloadApp: {
    title: string;
    data: { image: string }[];
  };
  privacy: {
    data: { linkName: string }[];
  };
  socialHandles: {
    title: string;
    data: { menuicon: string }[];
  };
  showAppDownload: boolean;
  navigateTo?: (url: string) => void;
}

interface ExpandedItems {
  [key: string]: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  companyInfo,
  footerMenus,
  copyRight,
  downloadApp,
  privacy,
  socialHandles,
  showAppDownload,
  navigateTo,
}) => {
  const [footerCollapsed, setFooterCollapsed] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    if (footerMenus) {
      const initialExpandedItems = Object.keys(footerMenus).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as ExpandedItems
      );
      setExpandedItems(initialExpandedItems);
    }
  }, [footerMenus]);

  const handleFooterCollapse = () => {
    setFooterCollapsed((prev) => !prev);
  };

  return (
    <section className="footer-section-dashboard">
      <div className="footer-curve-wrapper">
        <div className="footer-scroll-up-container"></div>
      </div>
      <Container fluid className="footer-content-next">
        <Row className="footer-content-wrapper">
        <Col lg={3} md={6} sm={12} className="icon-wrapper">
            <ul className="list-unstyled">
              <li>
                <div
                  className={`logo-container walaa-regular-400 ${
                    !footerCollapsed ? "footer-collapsed" : ""
                  }`}
                  onClick={()=>navigateTo && navigateTo("/faqsearch")} //To Do : add test
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(companyInfo) }}
                />
              </li>
            </ul>
          </Col>
          <Col lg={9} md={6} sm={12} className="footer-content-row">
            {footerCollapsed &&
              footerLink.map((row, rowIndex) => (
                <Row key={rowIndex} className="sitemap-row">
                  {row.map(
                    (
                      item: {
                        label: string;
                        subLabel: { menuUrl: string; linkName: string }[];
                      },
                      itemIndex: number
                    ) => (
                      <Col key={itemIndex} lg={3} md={6} sm={12}>
                        <div className="footer-content-list">
                          <ul className="list-unstyled">
                            <li className="list-header walaa-medium-500">
                              {item?.label}
                              {expandedItems[item.label] ? (
                                <ExpandLessIcon
                                  onClick={() => handleExpandToggle(item.label)}
                                  data-testid="expand-less-icon"
                                />
                              ) : (
                                <ExpandMoreIcon
                                  onClick={() => handleExpandToggle(item.label)}
                                  data-testid="expand-more-icon"
                                />
                              )}
                            </li>
                            {expandedItems[item.label] &&
                              item?.subLabel.map((subItem, subIndex) => (
                                <a
                                  onClick={() =>
                                    navigateTo && navigateTo(subItem?.menuUrl)
                                  }
                                  key={subIndex}
                                >
                                  <li
                                    className="list-content walaa-regular-400"
                                    key={subIndex}
                                  >
                                    {subItem?.linkName}
                                  </li>
                                </a>
                              ))}
                          </ul>
                        </div>
                      </Col>
                    )
                  )}
                </Row>
              ))}
            <Row className="social-wrapper">
              {showAppDownload && (
                <Col lg={8} md={12} sm={12}>
                  <h3 className="social-title download-apps walaa-medium-500">
                    {downloadApp?.title}
                  </h3>
                  <div className="download-app-wrapper">
                    {downloadApp?.data?.length > 0 &&
                      downloadApp?.data?.map((app, index) => (
                        <img
                          src={app.image}
                          alt="apps"
                          key={index}
                          className="download-app"
                          onClick={() => navigateTo && navigateTo(app?.url)} //To Do : add test
                        />
                      ))}
                  </div>
                </Col>
              )}

              <Col lg={4} md={12} sm={12}>
                <h3 className="social-title walaa-medium-500">
                  {socialHandles?.title}
                </h3>
                <div className="social-icons-wrapper">
                  {socialHandles?.data?.length > 0 &&
                    socialHandles?.data?.map((app, index) => (
                      <img
                        src={app.menuicon}
                        alt="socials"
                        key={index}
                        className="social-icons"
                        onClick={() => navigateTo && navigateTo(app?.menuUrl)} //To Do : add test
                      />
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="copyright-row">
          <div className="copyright-links">
            <div className="copyright-text walaa-medium-500">{copyRight}</div>
            <div className="copyright-hyperlinks-wrapper">
              {privacy?.data?.length > 0 &&
                privacy.data.map((item, index) => (
                  <div
                    className="copyright-hyperlinks walaa-regular-400"
                    key={index}
                    onClick={() => navigateTo && navigateTo(item?.menuUrl)}
                  >
                    <span onClick={handleScrollToTop}>{item.linkName}</span>
                  </div>
                ))}
            </div>
          </div>
        </Row>
      </Container>
    </section>
  );
};
