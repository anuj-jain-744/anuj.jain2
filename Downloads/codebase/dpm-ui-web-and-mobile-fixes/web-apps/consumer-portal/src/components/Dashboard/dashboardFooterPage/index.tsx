import React from "react";
import "./index.scss";
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
  hideBanner?: boolean;
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
  hideBanner,
}) => {

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="footer-section-dashboard">
      <div className="footer-curve-wrapper">
        <div className="footer-scroll-up-container"></div>
      </div>
      <Container
        fluid
        className={`${
          hideBanner ? "footer-container" : ""
        } footer-content-next`}
      >
        <div className="container-middle">
          <Row className="footer-content-wrapper">
            <Col lg={3} md={6} sm={12} className="icon-wrapper">
              <ul className="list-unstyled">
                <li>
                  <div
                    className={`logo-container walaa-regular-400 footer-collapsed`}
                    onClick={() => navigateTo && navigateTo("/faqsearch")} //To Do : add test
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(companyInfo),
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        navigateTo && navigateTo("/faqsearch");
                      }
                    }}
                  />
                </li>
              </ul>
            </Col>
            <Col lg={9} md={6} sm={12} className="footer-content-row">
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
            <div
              className={`${
                hideBanner ? "copyright-border" : ""
              } copyright-links`}
            >
              <div className="copyright-text walaa-medium-500">{copyRight}</div>
              <div className="copyright-hyperlinks-wrapper">
                {privacy?.data?.length > 0 &&
                  privacy.data.map((item, index) => (
                    <div
                      className="copyright-hyperlinks walaa-regular-400"
                      key={index}
                      onClick={() => navigateTo && navigateTo(item?.menuUrl)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          navigateTo && navigateTo(item?.menuUrl);
                        }
                      }}
                    >
                      <span
                        onClick={handleScrollToTop}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleScrollToTop();
                          }
                        }}
                      >
                        {item.linkName}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Row>
        </div>
      </Container>
    </section>
  );
};
