import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { animated } from "@react-spring/web";

import "./index.scss";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconsInfo } from "../../assets/MotorInsuranceProducts";
import { ResponsiveMotorProduct } from "./responsiveMotorProduct";
import { BreakPoints, productIDs } from "../../constant";
import { createTableSpring } from "utils/createtableSpring";

interface HeaderItem {
  title: string;
  tooltip: string;
}
interface LegendItem {
  title: string;
  icons: string;
}
interface ProductMatrix {
  benefits: string[];
  comprehensive: string[];
  thirdparty: string[];
}

interface Products {
  title: string;
  description: string;
  header: { data: HeaderItem[] };
  legends: { title: string; data: LegendItem[] };
  prodmatrix: ProductMatrix[];
}

export interface ProductProps {
  data: Products;
  isVisible?: boolean;
}
const { Tablet_Min, Tablet_Max } = BreakPoints;

type BootstrapTableColSizes = { [key: string]: Array<number> };

const bootstrapTableColSizes: BootstrapTableColSizes = {
  [productIDs.motor]: [4, 5, 3],
  [productIDs.travel]: [4, 8],
  [productIDs.home]: [4, 4, 4]
};
const icons: Array<string> = ["yes", "no", "addon"];

export const MotorProducts: React.FC<ProductProps> = ({
  data,
  isVisible = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setplandetails] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const { product_name } = useParams<{ product_name: string }>();

  const openModal = (modalTitle: string, modalData: string) => {
    if (modalData) {
      setModalTitle(modalTitle);
      setplandetails(modalData);
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= Tablet_Min
  );
  const [isScreenTablet, setIsScreenTablet] = useState<boolean>(
    document.documentElement.clientWidth <= Tablet_Max
  );

  const headerSprings = createTableSpring(
    isVisible,
    "translateX(50%) translateY(0%)",
    "translateX(50%) translateY(0%)",
    0
  );
  const tableSprings = createTableSpring(
    isVisible,
    "translateX(0%) translateY(100%)",
    "translateX(0%) translateY(100%)",
    300
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= Tablet_Min);
      setIsScreenTablet(document.documentElement.clientWidth <= Tablet_Max);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colSizes: Array<number> = useMemo(() => {
    let result: Array<number> = bootstrapTableColSizes[productIDs.motor];
    if (product_name && product_name in bootstrapTableColSizes)
      result = bootstrapTableColSizes[product_name];
    return result;
  }, [product_name]);

  return (
    <>
      {isSmallScreen || isScreenTablet ? (
        // Mobile View

        Array.isArray(data.prodmatrix) &&
        data.prodmatrix.length > 0 && (
          <ResponsiveMotorProduct
            data={data}
            tabletView={isScreenTablet}
            mobileView={isSmallScreen}
          />
        )
      ) : (
        // Desktop View

        <Container
          id="productToggle-1"
          fluid
          className="py-3 insurance-container"
        >
          <div className="outer-div">
            <animated.div style={isVisible ? headerSprings : {}}>
              <h1 className="heading-text walaa-medium-500">{data.title}</h1>
              <p
                className="desc-text"
                dangerouslySetInnerHTML={{
                  __html: data.description,
                }}
              ></p>
            </animated.div>
            {/* first row heading */}
            <animated.div style={isVisible ? tableSprings : {}}>
              <Row className="header-row">
                <Col md={colSizes[0]} className="empty-column"></Col>
                {data.header.data.map((headerItem, index) => (
                  <Col
                    key={index}
                    md={colSizes[index + 1]}
                    className={
                      data?.header.data.length == 2
                        ? index === 0
                          ? "left-top-border walaa-medium-500"
                          : "custom-col-tab walaa-medium-500 border-top-right"
                        : "left-top-border walaa-medium-500 border-top-right"
                    }
                  >
                    {headerItem.title}
                    {product_name === productIDs.motor && ( 
                    <img
                      src={IconsInfo}
                      className="icon-pointer"
                      alt={headerItem.title}
                      onClick={() =>
                        openModal(headerItem.title, headerItem.tooltip)
                      }
                    />
                    )}
                  </Col>
                ))}
              </Row>
              {/* second row heading */}
              <Row className="sub-header-row">
                <Col
                  md={colSizes[0]}
                  className="benefit-column walaa-medium-500 left-border"
                >
                  {data.prodmatrix[0].benefits[0]}
                </Col>
                <Col md={colSizes[1]} className="sub-header walaa-medium-500">
                  <div className="d-flex">
                    {data.prodmatrix[0].comprehensive.map(
                      (compItem, compIndex) => (
                        <Col key={compIndex}>
                          <span className="span-align">{compItem}</span>
                        </Col>
                      )
                    )}
                  </div>
                </Col>
                {colSizes[2] && (
                  <Col
                    md={colSizes[2]}
                    className="sub-header walaa-medium-500 bg-col2"
                  >
                    <div className="d-flex">
                      {data.prodmatrix[0].thirdparty.map(
                        (compItem, compIndex) => (
                          <Col key={compIndex}>
                            <span className="span-align">{compItem}</span>
                          </Col>
                        )
                      )}
                    </div>
                  </Col>
                )}
              </Row>
              {data.prodmatrix.slice(1).map((matrix, index) => (
                <Row key={index} className="data-row">
                  <Col
                    md={colSizes[0]}
                    className={`benefit-column benefit-sub-column ${
                      data.prodmatrix.length - 2 === index
                        ? "left-bottom-border"
                        : ""
                    }`}
                  >
                    {matrix.benefits[0]}
                  </Col>
                  <Col md={colSizes[1]} className="comprehensive-column">
                    <div className="d-flex align-items-center">
                      {matrix.comprehensive.map((compValue, compIndex) => (
                        <Col key={compIndex}>
                          {icons.includes(compValue.toLowerCase()) ? (
                            <span className="icon-align">
                              {renderIcon(compValue)}
                            </span>
                          ) : (
                            compValue
                          )}
                        </Col>
                      ))}
                    </div>
                  </Col>
                  {colSizes[2] && (
                    <Col md={colSizes[2]} className="thirdparty-column bg-col2">
                      <div className="d-flex w-100">
                        {matrix.thirdparty.map((compValue, compIndex) => (
                          <Col key={compIndex}>
                            {icons.includes(compValue.toLowerCase()) ? (
                              <span className="icon-align">
                                {renderIcon(compValue)}
                              </span>
                            ) : (
                              compValue
                            )}
                          </Col>
                        ))}
                      </div>
                    </Col>
                  )}
                </Row>
              ))}

              <Row className="custom-row-bottom">
                <Col md={colSizes[0]} className=""></Col>
                <Col
                  md={colSizes[1]}
                  className="custom-col-tab-bottom left-bottom-border bg-col1"
                ></Col>
                {data?.header.data.length == 2 && (
                  <Col
                    md={colSizes[2]}
                    className="custom-col-tab-bottom right-bottom-border bg-col2"
                  />
                )}
              </Row>
            </animated.div>

            <Row className="product-table-footer">
              <Col md={colSizes[0]}></Col>
              <Col md={12 - colSizes[0]} className="legengs-data">
                <span className="legend-color walaa-medium-500">
                  {data.legends.title}
                </span>
                {data?.legends?.data.map((legendItem, legendIndex) => (
                  <span
                    key={legendIndex}
                    className="legend-title-color walaa-medium-500"
                  >
                    {renderIcon(legendItem.icons)} {legendItem.title}
                  </span>
                ))}
              </Col>
            </Row>
          </div>
          <div>
            {/* </div> */}
            <Modal
              show={showModal}
              onHide={closeModal}
              centered
              dialogClassName="custom-modal"
            >
              <Modal.Header closeButton className="no-border">
                <Modal.Title className="cutom-title walaa-medium-500">
                  {modalTitle}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <h4 className="modal-heading walaa-medium-500">{modalTitle}</h4> */}
                <div
                  className="main-section"
                  dangerouslySetInnerHTML={{
                    __html: modalData,
                  }}
                ></div>
              </Modal.Body>
              {/* <Modal.Footer className="no-border"></Modal.Footer> */}
            </Modal>
          </div>
        </Container>
      )}
      {/* if condition ends here */}
    </>
  );
};

const renderIcon = (iconval: string) => {
  // debugger;
  const normalizedValue = iconval.toLocaleLowerCase();

  switch (normalizedValue) {
    case "yes":
      return <CheckIcon className="icon-yes" />;
    case "no":
      return <CloseIcon className="icon-no" />;
    case "addon":
      return <AddCircleOutlineIcon className="icon-addon" />;
    default:
      return null;
  }
};
