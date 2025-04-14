//refactor import statements
import { Container } from "react-bootstrap";
import EastIcon from "@mui/icons-material/East";

import HighlighterBanner from "../../../../corporate-portal/src/components/HighlighterBanner";
import { GetQuoteWidget } from "../../../../corporate-portal/src/components/GetQuoteWidget";
import { ClaimCard } from "../../../../corporate-portal/src/components/ClaimCard";

import "./index.scss";
import { useState } from "react";

interface RegisterClaimProps {
  breadcrumbData: any; // Replace 'any' with the appropriate type
  claim_form: any; // Replace 'any' with the appropriate type
  common_data: {
    register_claim: string;
    tooltip: string;
    track_your_claim: string;
    track_your_claim_link: string;
  };
  data: any; // Replace 'any' with the appropriate type
  handleNavigate: (link: string) => void;
  showCardFooter: boolean;
  setShowCardFooter: (show: boolean) => void;
  languageData?: { [key: string]: string };
  homeLanguageData?: { [key: string]: string };
}

export const RegisterClaim: React.FC<RegisterClaimProps> = ({
  breadcrumbData,
  claim_form,
  common_data,
  data,
  handleNavigate,
  showCardFooter,
  setShowCardFooter,
  languageData,
  homeLanguageData
}) => {
  const { register_claim, tooltip, tooltip2: refNoTooltip, track_your_claim, track_your_claim_link } =
    common_data;
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
  const [productSelectedTabName, setProductSelectedTabName] = useState<string | null>(null);

  //Back button Click handler fn
  const backbtnClickHandler = () => {
    setShowCardFooter(true);
  };

  const displayTitle = (selectedProduct: string|null) => {
    return isFirstPage ? register_claim : (
      selectedProduct === 'Motor' ?
        languageData?.register_a_claim_motor : homeLanguageData?.claim_title
    )
  }

  return (
    <div className="claim-wrapper register-claim-wrapper">
      <HighlighterBanner
        showInput={true}
        title={displayTitle(productSelectedTabName)}
        breadcrumbsData={breadcrumbData}
        classApply={"policy-title"}
        navigateTo={handleNavigate}
      />
      <div className={isFirstPage ? "claim-content" : "claim-content claim-second-page"}>
        <Container fluid id="custom-container-fluid">
          {isFirstPage && (
            <div className="content-header d-flex walaa-medium-500">
              <div className="claim-title"></div>
              <div
                className="claim-navigation d-flex"
                onClick={() => handleNavigate(track_your_claim_link)}
              >
                <span>{track_your_claim}</span>
                <EastIcon />
              </div>
            </div>
          )}
          <GetQuoteWidget products={claim_form || []} customTheme={true} tooltip={tooltip}
            refNoTooltip={refNoTooltip}
            setShowCardFooter={setShowCardFooter}
            languageData={languageData}
            homeLanguageData={homeLanguageData}
            setIsFirstPage={setIsFirstPage}
            setProductSelectedTabName={setProductSelectedTabName}
            // backbtn click handler
            backBtnClickHandler={backbtnClickHandler}
          />
        </Container>
        {showCardFooter && (
          <ClaimCard
            cardContent={data && data}
          />
        )}
      </div>
    </div>
  );
};
