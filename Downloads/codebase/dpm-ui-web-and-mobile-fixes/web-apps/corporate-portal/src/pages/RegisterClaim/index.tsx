//refactor import statements
import { Container } from "react-bootstrap";
import EastIcon from "@mui/icons-material/East";

import HighlighterBanner from "../../../../corporate-portal/src/components/HighlighterBanner";
import { GetQuoteWidget } from "../../../../corporate-portal/src/components/GetQuoteWidget";
import { ClaimCard } from "../../../../corporate-portal/src/components/ClaimCard";
import {BlueFormFooter} from '@consumer-portal/components/BlueFormFooter'
import "./index.scss";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {RootState} from '@dpm/shared-module';
import { commonKeywords } from "constant";

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
  const location = useLocation()
  const navigate=useNavigate();
  const { productIDs = null } = location.state?.data ?? {};
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  //specific to other case
  const [isOtherCase, setIsOtherCase] = useState<boolean>(false);

  // others claim journey information
    const [othersClaimInfo, setOthersClaimInfo] = useState<{
      lossType: string;
      isSequenceNo: boolean;
      SequenceNo?: string | null | undefined;
      ClaimType?: string | null | undefined;
    }>({
      lossType: "",
      isSequenceNo: true,
      SequenceNo: undefined,
      ClaimType: undefined
    });
  
  //Back button Click handler fn
  const backbtnClickHandler = () => {
    setShowCardFooter(true);
    setIsOtherCase(false);
    setIsFirstPage(true)
  };
  const goBack=async()=>{
    navigate(-1);
    backbtnClickHandler();
   
  }

  const displayTitle = (selectedProduct: string | null, productIDs: string | null) => {
    return isFirstPage ? register_claim : isOtherCase ? (othersClaimInfo?.isSequenceNo ? languageData?.register_a_claim_motor : (
      othersClaimInfo?.ClaimType === commonKeywords?.claimComprehensive ?
      languageData?.register_a_claim_non_accid : languageData?.register_a_claim_non_vehicle_damage
    ))
     : ( 
      (selectedProduct === 'Home' || (productIDs && productIDs === 'home')) ?
      homeLanguageData?.claim_title : languageData?.register_a_claim_motor
    )
  }

  return (
    <div className="claim-wrapper register-claim-wrapper">
      <HighlighterBanner
        showInput={true}
        title={displayTitle(productSelectedTabName, productIDs)}
        breadcrumbsData={breadcrumbData}
        classApply={"policy-title"}
        navigateTo={handleNavigate}
      />
      <div className={isFirstPage ? "claim-content" : "claim-content claim-second-page"}>
        <Container fluid id="custom-container-fluid">
          {isFirstPage && (
            <div className="content-header d-flex walaa-medium-500">
              <div className="claim-title"></div>
              <div className="claim-navigation d-flex" role="button" tabIndex={0}
                onClick={() => handleNavigate(track_your_claim_link)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNavigate(track_your_claim_link)
                  }
              }}
              >
                <span>{track_your_claim}</span>
                <EastIcon className="arrow-svg" />
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
            // specific to others case state
            setOtherCase={setIsOtherCase}
            othersClaimInfo={othersClaimInfo}
            setOthersClaimInfo={setOthersClaimInfo}
            // backbtn click handler
            backBtnClickHandler={goBack}
            navigateTo={handleNavigate}
          />
          {isFirstPage && isAuthenticated && <BlueFormFooter backBtnClickHandler={goBack} isVisibleSubmitButton={false}/>}
        </Container>
        {showCardFooter && !isAuthenticated && (
          <ClaimCard
            cardContent={data}
          />
        )}
      </div>
    </div>
  );
};
