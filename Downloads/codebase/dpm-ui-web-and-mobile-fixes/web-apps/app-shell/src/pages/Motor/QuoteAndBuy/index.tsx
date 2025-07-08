import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header
} from "@corporate-portal/components";
import {PolicyFooter} from '@consumer-portal/components'
import { LoaderOverlay } from "../../../components";
import {MotorInsurance} from "@consumer-portal/pages/motor/QuoteAndBuy";
import { navigateTo, fetchData } from "@src/utils";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { cmsAPIRoute } from "@src/constants";
import { PHQuoteBuyProvider } from "@consumer-portal/context/PHQuoteBuyContext";
import { productIDs } from "@corporate-portal/constant";

const QuoteAndBuy: React.FC = () => {
  const [state, setState] = useState({
    headerData: {},
    consumerportalConfig: {}
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [policyFooter, setPolicyFooter] = useState(false);
  const navigate = useNavigate();

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Product", route: "/" },
    { label: "Motor Insurance", route: "/Motor/QuoteAndBuy" },
  ]

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const handleNavigateWithParams = (url: string, data?: object) => {
    navigateTo(url, navigate, data);
  };

  const fetchAllData = async () => {
    const [headerData, consumerportalConfig] = await Promise.all([
      fetchData(cmsAPIRoute['header'], "en"),
      fetchData(cmsAPIRoute.consumerConfig, "en"),
    ]);
    setState({headerData, consumerportalConfig})
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    
    if(state?.consumerportalConfig?.config && state?.consumerportalConfig?.config.length > 0) {
     
      setPageTitle(state?.consumerportalConfig?.config[0].motor_insurance)
    }
  }, [state?.consumerportalConfig]);

  const getStepValue = (step: number) => {
    if(step === 0){
      setPolicyFooter(true);
    }
    else {
      setPolicyFooter(false);
    }
  }


  return (
    <React.Fragment>
    <PHQuoteBuyProvider>
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
        navigateTo={handleNavigate}
      />
      <MotorInsurance navigateTo={handleNavigateWithParams} productName={productIDs.motor} getStepValue={getStepValue}/>
      {policyFooter && <PolicyFooter />}
      </PHQuoteBuyProvider>
    </React.Fragment>
  );
};

export default QuoteAndBuy;