import React from "react";
import { NavDropdown, Row, Col } from "react-bootstrap";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconsSet } from "../../utils/icons";

import { Child, HandleProductToggleClick, CustomRenderNavDropdownProps } from "./types/NavDropdown.types";


export const RenderChild = ({
  child,
  cIdx,
  activeProduct,
  handleProductToggleClick,
}: {
  child: Child;
  cIdx: number;
  activeProduct: number;
  handleProductToggleClick: HandleProductToggleClick;
}) => {
  return (
    <div
      key={cIdx}
      className={`${activeProduct === cIdx ? "selected" : "default"}`}
      onClick={() => handleProductToggleClick(cIdx)}
      role="button" tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleProductToggleClick(cIdx);
        }
    }}
    >
      <span>{child?.linkName}</span>
    </div>
  );
};

export const CustomRenderNavDropdown: React.FC<
  CustomRenderNavDropdownProps
> = ({
  parent,
  pIdx,
  dropdownStates,
  handleDropdownEvent,
  navbarTransparent,
  activeProduct,
  setActiveProduct,
  navigateTo,
}) => {
  return (
    <NavDropdown
      title={
        <>
          {parent?.linkName}
          {parent?.childrens?.length !== 0 && (
            dropdownStates?.linkName === parent?.linkName ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )
          )}
        </>
      }
      id={parent?.linkName}
      key={pIdx}
      className={`${
        dropdownStates?.linkName === parent?.linkName ? "active" : ""
      } ${navbarTransparent ? "theme-transparent" : "navbar-color"}`}
      onClick={() => (parent?.menuUrl && navigateTo) ? navigateTo(parent?.menuUrl) : handleDropdownEvent(parent?.linkName ?? "", true, pIdx)}
    >
      {parent?.attributes?.class[0] === "product" ? (
        <React.Fragment>
          <NavDropdown.Header className="navbar-dropwdown-options content-header">
            <div className="product-toggle">
              {parent?.childrens &&
                parent?.childrens.length > 0 &&
                parent?.childrens.map((child, cIdx) => (
                  <React.Fragment key={cIdx}>
                    <RenderChild
                      child={child}
                      cIdx={cIdx}
                      activeProduct={activeProduct}
                      handleProductToggleClick={setActiveProduct}
                    />
                  </React.Fragment>
                ))}
            </div>
          </NavDropdown.Header>
          <Row>
            {parent?.childrens &&
              parent?.childrens[activeProduct]?.childrens?.map(
                (child, cIdx) => (
                  <Col md={6} key={cIdx} className="dropdown-item-wrapper">
                    <div className="custom-dropdown-div">
                      <NavDropdown.Item className="navbar-dropwdown-options walaa-medium-500"
                      onClick={() => navigateTo(child?.menuUrl)}
                      >
                        {child?.attributes?.class[0] && IconsSet[child?.attributes?.class[0]] && (
                      <img
                        src={IconsSet[child?.attributes?.class[0]]}
                        alt="product"
                        className="product-icon"
                      />
                    )}
                        {child?.linkName}
                      </NavDropdown.Item>
                    </div>
                  </Col>
                )
              )}
          </Row>
        </React.Fragment>
      ) : (
        <Row>
          {parent?.childrens?.map((child, cIdx) => (
            <Col md={6} key={cIdx} className="dropdown-item-wrapper">
              <div className="custom-dropdown-div">
                <NavDropdown.Item className="navbar-dropwdown-options walaa-medium-500"
                onClick={() => navigateTo(child?.menuUrl)}
                >
                  {child?.attributes?.class[0] && IconsSet[child?.attributes?.class[0]] && (
                    <img
                      src={IconsSet[child?.attributes?.class[0]]}
                      alt="product"
                      className="product-icon"
                    />
                  )}
                  {child?.linkName}
                </NavDropdown.Item>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </NavDropdown>
  );
};
