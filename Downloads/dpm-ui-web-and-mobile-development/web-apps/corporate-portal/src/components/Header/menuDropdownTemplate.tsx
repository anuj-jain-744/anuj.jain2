import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { sanitizeHtml } from "@dpm/shared-module";

import { IconsSet } from "../../utils/icons";
import {
  MenuDropdownTemplateProps,
  ActiveProduct,
  ActiveMenuDropdownItem,
  RenderContentNavigateToProps
} from "./types/menuDropdownTemplate.types";

export const RenderContentNavigateTo: React.FC<RenderContentNavigateToProps> = ({
  cIdx,
  menuUrl,
  linkName,
  navigateTo,
  attributes,
}) => {
  return (
    <div
      className="app-content-wrapper walaa-medium-500"
      key={cIdx}
      onClick={() => navigateTo(menuUrl)}
    >
      {IconsSet[attributes?.class[0]] && (
        <img src={IconsSet[attributes?.class[0]]} alt="product" />
      )}
      <span>{linkName}</span>
      <ArrowForwardIcon />
    </div>
  );
};

const MenuDropdownTemplate: React.FC<MenuDropdownTemplateProps> = ({
  activeNavItem,
  activeMenuDropdown,
  handleOnMouse,
  navigateTo,
}) => {
  
  const [activeProduct, setActiveProduct] = useState<ActiveProduct>({
    index: 0,
    label: "Personal",
  });
  const { linkName, selectedIndex } = activeNavItem;
  let attributes: ActiveMenuDropdownItem["attributes"] = { class: [] },
    childrens: ActiveMenuDropdownItem["childrens"],
    link_content: ActiveMenuDropdownItem["link_content"],
    menuimage: ActiveMenuDropdownItem["menuimage"],
    media_type_val: ActiveMenuDropdownItem["media_type_val"],
    video_url: ActiveMenuDropdownItem["video_url"];

  if (activeMenuDropdown) {
    ({
      attributes,
      childrens,
      link_content,
      menuimage,
      media_type_val,
      video_url,
    } = activeMenuDropdown);
  }

  const handleProductToggleClick = (index: number, label: string) => {
    setActiveProduct({ index, label });
  };

  const renderTemplate = (templateType: string) => {
    switch (templateType) {
      case "product":
        return (
          <React.Fragment>
            <Col
              md={
                childrens[activeProduct?.index]?.menuimage &&
                childrens[activeProduct?.index]?.menuimage?.image_urls
                  ? 6
                  : 12
              }
              className="product-content-container"
            >
              <div className="product-toggle-wrapper-Ui-Tabs">
                <div className="product-toggle walaa-medium-500">
                  {childrens?.map((productOption, index) => (
                    <div
                      key={index}
                      className={`${
                        activeProduct.index === index ? "selected" : "default"
                      }`}
                      onClick={() =>
                        handleProductToggleClick(index, productOption?.linkName)
                      }
                    >
                      <span>{productOption?.linkName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Row>
                {activeProduct &&
                  childrens[activeProduct?.index]?.childrens?.map(
                    ({ linkName, attributes, menuUrl }, cIdx) => (

                      <Col md={activeProduct.label !== 'SME' ? '6' : '12'} key={cIdx} className="product-wrapper-col">
                        <RenderContentNavigateTo
                            cIdx={cIdx}
                            attributes={attributes}
                            navigateTo={navigateTo}
                            linkName={linkName}
                            menuUrl={menuUrl}
                          />
                        
                      </Col>
                    )
                  )}
              </Row>
            </Col>

            {childrens[activeProduct?.index]?.menuimage &&
              childrens[activeProduct?.index]?.menuimage?.image_urls && (
                <Col md={4} className="product-banner-wrapper">
                  <div className="product-banner-content">
                    <div className="banner-image-wrapper">
                      <img
                        src={
                          childrens[activeProduct?.index]?.menuimage
                            ?.image_urls[0]?.url
                        }
                        alt="banner"
                      />
                    </div>
                    <div
                      className="product-banner-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          sanitizeHtml(childrens[activeProduct?.index]?.link_content || ""),
                      }}
                    />
                  </div>
                </Col>
              )}
          </React.Fragment>
        );
      case "general":
        return (
          <React.Fragment>
            {media_type_val && !video_url && (
              <React.Fragment>
                <Col md={7} className="app-content-col">
                  <Row>
                    {childrens.map(
                      ({ linkName, attributes, menuUrl }, cIdx) => (
                        <Col md={6} key={cIdx} className="app-internal-col">
                          <RenderContentNavigateTo
                            cIdx={cIdx}
                            attributes={attributes}
                            navigateTo={navigateTo}
                            linkName={linkName}
                            menuUrl={menuUrl}
                          />
                        </Col>
                      )
                    )}
                  </Row>
                </Col>
                <Col md={5} className="app-downloads-wrapper">
                  <div className="app-download-content">
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(link_content) }}
                      className="content-wrapper-element"
                    />
                    <div className="download-app-images">
                      {menuimage?.image_urls?.map(({ url }, idx) => (
                        <img src={url} alt="download-apps" key={idx} />
                      ))}
                    </div>
                  </div>
                </Col>
              </React.Fragment>
            )}
            {!video_url && !media_type_val && (
              <Col md={6} xl={5} className="app-content-col">
                <Row>
                  {childrens.map(({ linkName, attributes, menuUrl }, cIdx) => (
                    <Col md={6} key={cIdx} className="app-internal-col">
                       <RenderContentNavigateTo
                            cIdx={cIdx}
                            attributes={attributes}
                            navigateTo={navigateTo}
                            linkName={linkName}
                            menuUrl={menuUrl}
                          />
                    </Col>
                  ))}
                </Row>
              </Col>
            )}
            {video_url && (
              <React.Fragment>
                <Col md={5} className="video-banner-wrapper">
                  <iframe
                    width="100%"
                    height="315"
                    src={video_url}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <h3 className="video-title walaa-medium-500">
                    {link_content}
                  </h3>
                </Col>
                <Col md={7}>
                  <Row className="video-banner-row">
                    {childrens.map(({ linkName, menuUrl }, cIdx) => (
                      <Col md={12} key={cIdx} className="video-banner-col">
                        <div
                          className="video-banner-content walaa-medium-500"
                          onClick={() => navigateTo(menuUrl)}
                        >
                          <span>{linkName}</span>
                          <ArrowForwardIcon />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <Row
      onMouseEnter={() => handleOnMouse(linkName, true, selectedIndex)}
      onMouseLeave={() => handleOnMouse("", false, 0)}
    >
      {renderTemplate(attributes?.class[0])}
    </Row>
  );
};

export default MenuDropdownTemplate;
