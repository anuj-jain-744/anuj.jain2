import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./index.scss";

interface HeaderItem {
  key: string;
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

interface Data {
  // Data  Interface

  resprodMatrix: ProductMatrix[];
}

interface ProductProps {
  data: Products;
  tabletView:boolean;
  mobileView:boolean;
}

export const ResponsiveMotorProduct: React.FC<ProductProps> = ({
  data,
  tabletView,
  mobileView
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [togleIndex, setTogleIndex] = useState<number | null>(null);
  const [showCompre, setShowCompre] = useState<boolean>(true);

  const hadleNextCompre = () => {
    if (data && currentIndex < data.prodmatrix[1].comprehensive.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const hadlePrevCompre = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTogleIndex = (idx: number | null) => {
    setTogleIndex(idx);

    idx === 0 ? setShowCompre(true) : setShowCompre(false);
  };

  const dataItem = data?.header?.data;

  useEffect(() => {
    if (dataItem.length > 0) {
      setTogleIndex(0);
    }
  }, []);

  return (
    <Container id="productToggle-1" fluid className="py-3 insurance-container">
      <div className="outer-div">
        <h1 className="heading-text walaa-medium-500">{data.title}</h1>
        <p
          className="desc-text"
          dangerouslySetInnerHTML={{
            __html: data.description,
          }}
        ></p>

        <Container className="comp-table">
          <div className="product-toggle-wrapper-Ui-Tabs">
            <div className="product-toggle walaa-medium-500">
              {data?.header?.data.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTogleIndex(idx)}
                  data-testid={`product-toggle-${idx}`}
                  className={`toggle-item ${
                    togleIndex === idx ? "selected" : "default"
                  }`}
                  role="button" tabIndex={0} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTogleIndex(idx)
                    }
                }}
                >
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {data && mobileView && (
            <>
              <Row className="sub-header-row">
                <Col className="benefit-column walaa-medium-500 left-border col-6">
                  {data.prodmatrix[0].benefits}
                </Col>

                <Col className="sub-header walaa-medium-500 col-6">
                  <div className="d-flex">
                    <Col className="col nav-col">
                      {showCompre && (
                        <Button
                          size="sm"
                          onClick={hadlePrevCompre}
                          disabled={currentIndex === 0}
                        >
                          <ArrowBackIosNewIcon />
                        </Button>
                      )}
                      <span className="span-align head-cell">
                        {showCompre
                          ? data.prodmatrix[0].comprehensive[currentIndex]
                          : ""}
                      </span>
                      {showCompre && (
                        <Button
                          size="sm"
                          onClick={hadleNextCompre}
                          disabled={
                            currentIndex ===
                            data.prodmatrix[1].comprehensive.length - 1
                          }
                        >
                          <ArrowForwardIosIcon />
                        </Button>
                      )}
                    </Col>
                  </div>
                </Col>
              </Row>

              {data.prodmatrix.slice(1).map((item, index) => {
                const curValue = item.comprehensive[currentIndex];
                const curThirdValue = item.thirdparty[0];

                return (
                  <Row className="data-row row" key={index}>
                    <Col className="benefit-column benefit-sub-column col-6">
                      {item.benefits}
                    </Col>

                    <Col className="comprehensive-column col-6">
                      <div className="d-flex align-items-center">
                        <div className="col">
                          <span className="icon-align">
                            {/* {curThirdValue} {item.thirdparty[0]} */}
                            {showCompre
                              ?  renderIcon(item.comprehensive[currentIndex])
                              :  renderIcon(item.thirdparty[0])}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </>
          )}
{/* Tablet view  code starts*/}

{ data && tabletView &&  !mobileView && (

          !showCompre ? (
          <>
            <Row className="sub-header-row">
               <Col className="benefit-column walaa-medium-500 left-border col-6">
                 {data.prodmatrix[0].benefits}
               </Col>

               <Col className="sub-header walaa-medium-500 col-6">
                 <div className="d-flex">
                   <Col className="col nav-col">
                     {showCompre && (
                       <Button
                         size="sm"
                         onClick={hadlePrevCompre}
                         disabled={currentIndex === 0}
                       >
                         <ArrowBackIosNewIcon />
                       </Button>
                     )}
                     <span className="span-align head-cell">
                       {showCompre
                         ? data.prodmatrix[0].comprehensive[currentIndex]
                         : ""}
                     </span>
                     {showCompre && (
                       <Button
                         size="sm"
                         onClick={hadleNextCompre}
                         disabled={
                           currentIndex ===
                           data.prodmatrix[1].comprehensive.length - 1
                         }
                       >
                         <ArrowForwardIosIcon />
                       </Button>
                     )}
                   </Col>

                 </div>
               </Col>
             </Row>

             {data.prodmatrix.slice(1).map((item, index) => {
               const curValue = item.comprehensive[currentIndex];
               const curThirdValue = item.thirdparty[0];

               return (
                 <Row className="data-row row" key={index}>
                   <Col className="benefit-column benefit-sub-column col-6">
                     {item.benefits}
                   </Col>

                   <Col className="comprehensive-column col-6">
                     <div className="d-flex align-items-center">
                       <div className="col">
                         <span className="icon-align">
                           {showCompre
                             ?  renderIcon(item.comprehensive[currentIndex])
                             :  renderIcon(item.thirdparty[0])}
                         </span>
                       </div>
                     </div>
                   </Col>
                 </Row>
               );
             })}
          </>


         ):(<>
          <Row className="header-row">
           <Col md={4} sm={4} className="empty-column"></Col>

         </Row>

         <Row className="sub-header-row">
           <Col
             md={6}
             sm={6}
             className="benefit-column walaa-medium-500 left-border"
           >
             {data.prodmatrix[0].benefits[0]}
           </Col>
           <Col md={6}  className="sub-header walaa-medium-500">
             <div className="d-flex">
               {data.prodmatrix[0].comprehensive.map((compItem, compIndex) => (
                 <Col key={compIndex}>
                   <span key={compIndex} className="span-align">
                     {compItem}
                   </span>
                 </Col>
               ))}
             </div>
           </Col>

         </Row>
         {data.prodmatrix.slice(1).map((matrix, index) => (
           <Row key={index} className="data-row">
             <Col
               md={6}
               className={`benefit-column benefit-sub-column ${
                 data.prodmatrix.length - 2 === index ? "left-bottom-border" : ""
               }`}
             >
               {matrix.benefits[0]}
             </Col>
             <Col md={6} className="comprehensive-column">
               <div className="d-flex align-items-center">
                 {matrix.comprehensive.map((compValue, compIndex) => (
                   <Col key={compIndex}><span className="icon-align">
                     {renderIcon(compValue)}
                   </span>
                   </Col>
                 ))}
               </div>
             </Col>

           </Row>
         ))}
         </>))}

       {/* Tablet view  code ends*/}
          <Row className="product-table-footer">
            <Col  md={12} lg={12} sm={12} className="legengs-data">
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
        </Container>
      </div>

      <div></div>
    </Container>
  );
}; //

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
      return iconval;
  }
};
