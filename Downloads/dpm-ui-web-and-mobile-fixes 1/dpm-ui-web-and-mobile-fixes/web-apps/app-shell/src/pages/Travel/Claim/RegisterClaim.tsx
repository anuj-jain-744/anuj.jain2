import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components"; 
import { navigateTo, fetchData } from "@src/utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute } from "@src/constants";
import Comprehensive from "./Comprehensive";

interface TravelConfig {
  config: {
    title: string;
    worldwide: boolean;
    register_claim_title: string;
  };
}

interface State {
  headerData: object;
  travelConfig: TravelConfig;
}



const RegisterClaim: React.FC = () => { 
  
  const [state, setState] = useState<State>({
    headerData: {},
    travelConfig: { config: { title: "", worldwide: false } }
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [onContinue, setContinue] = useState<boolean>(false);
  const [claimCheckData, setClaimCheckData] = useState<any>();
  const [validationData, setValidationData] = useState<any>();
  const [claimsInfo, setClaimsInfo] = useState<{
    refNo: string;
    ownerId: string;
    SourceType: number;
    type: string;
    mailPhone: string;
  }>({
    refNo: "",
    ownerId: "",
    SourceType: 0,
    type: "",
    mailPhone: ""
  });
  const backbtnClickHandler = () => setContinue(false);

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Claim", route: "/" },
    { label: "Register a claim", route: "/Travel/Claim/" },
  ]

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };

  const fetchAllData = async () => {
    const [headerData, travelConfig] = await Promise.all([
      fetchData(cmsAPIRoute['header'], "en"),
      fetchData(cmsAPIRoute.travelConfig, "en"),
    ]);
    setState({headerData, travelConfig})
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);
 
 
  
  useEffect(() => {
    if(state?.travelConfig) {
      setPageTitle(state?.travelConfig?.config?.register_claim_title)
    }
  }, [state?.travelConfig]); 
 
  
  return (
    <React.Fragment>
     {loading && <LoaderOverlay />}
     <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={state?.headerData}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
     <HighlighterBanner
        showInput={false}
        title={pageTitle ?? ""}
        breadcrumbsData={breadcrumbData}
        classApply={"policy-title"}
        isMotor={true}
      /> 
      <Comprehensive 
        claimCheckData={claimCheckData}
        validationData={validationData?.data}
        claimsInfo={claimsInfo} 
        backBtnClickHandler={backbtnClickHandler}
      /> 
    </React.Fragment>
  );
};

export default RegisterClaim;