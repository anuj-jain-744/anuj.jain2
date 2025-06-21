import React, {useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import DoneIcon from "@mui/icons-material/Done";
import PackageTypeModal from "../QuoteCard/PackageTypeModal";
import { Container, Row, Col } from "react-bootstrap";
import { CombinedData, LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";  

interface QuoteCardsProps { 
  languageData: LanguageData | CombinedData | undefined | null;
  setLeftStep: (val:number) => void;
  leftStep: number;
}

export interface PackageItem {
  itemname?: string;
  id?: number;
}

export interface PackageDataProps {
  title: string;
  key: string;
  image: string;
  details: PackageItem[]; 
}

const QuoteCards: React.FC<QuoteCardsProps> = ({  languageData, setLeftStep, leftStep }) => {
  const { coverageType, repairTypeSelected, homePremiumResponse , travelcoverage, travelcoveragePlan } = useQuoteAndBuyContext();
  const [packageData, setPackageData] = useState<PackageDataProps | null>(null);

  const [showPackageModal, setShowPackageModal] = useState(false);
  const handlePackage = () => {
    setShowPackageModal(true);
  };

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;


  const handleCloseModal = () => {
    setShowPackageModal(false);
  };
  

  useEffect(() => {
    if(languageData && !isHome ) {
      setPackageData(Array.isArray(languageData?.comprehensive_third_party) ? languageData?.comprehensive_third_party.find(val => val.key === coverageType) : null);
    }  
    else  {
      setPackageData(Array.isArray(languageData?.coverage_plan) ? languageData?.coverage_plan.find(val => val.key === coverageType) : null);
    }
  }, [languageData, coverageType, isHome])

  // For travel card
  useEffect(() => {
    if(travelcoverage) {
      const plan = languageData?.travel_coverage_plan?.find(plan => plan.codeid === travelcoverage);
      setPackageData(plan);
    }
  }, [languageData?.travel_coverage_plan, travelcoverage]);

  if (!packageData) {
    return <div>No coverage plan selected</div>;
  }
   
  
  return (
    <>
      <div className="quote-card">
        <Container fluid>
          <Row>
            <Col lg={6}>
              <div className="quote-img">
                <img src={packageData?.image} alt="" />
              </div>
            </Col>
            <Col lg={6} className="right-side-bg-column">
              <div className="quote-content">
                <div className="quote-head-content">
                  <div className="content">
                    <h3 className="quote-head">{packageData?.title}</h3>
                    <span className="quote-lable">{languageData?.traveller_tooltip_title}</span>
                  </div>

                  <div className="btn-container">
                    <button className="btn edit-btn" onClick={() => setLeftStep(2)}>{languageData?.edit_plan}</button>
                  </div>
                </div>

                <ul className="quote-list">
                  {Array.isArray(packageData?.details) && packageData?.details.slice(0, 3).map((packageitem: PackageItem, idx) => (
                    <li key={idx}>
                      <DoneIcon />
                      <div>{packageitem.itemname}</div>
                    </li>
                  ))}
                </ul>
                {Array.isArray(packageData?.details) && packageData?.details.length > 3 && (
                  <div className="pop-link" role="button" tabIndex={0} onClick={handlePackage}>
                    {languageData?.view_details}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {showPackageModal && (
        <PackageTypeModal
          show={showPackageModal}
          onHide={handleCloseModal}
          packageData={packageData?.details ?? []}  
          title={packageData?.title ?? ""}
        />
      )}
    </>
  );
};

export default QuoteCards;
