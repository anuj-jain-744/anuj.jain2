import React, { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";

import { Header, Footer } from "@corporate-portal/components";
import { LoaderOverlay } from "../../../components";
import Claims from "@consumer-portal/claims";
import ComprehensiveClaim from "@consumer-portal/Motor/Claims/Comprehensive";
import { getFullUrl, getDefault, navigateTo } from "../../../utils";
const { VITE_CONTENT_BASE_URI } = import.meta.env;

type ClaimsInfo = {
  refNo: String;
  ownerId: String;
  SourceType: Number;
  type: string
};

type ComprehensiveType = {
  claimCheckData: any;
  validationData?: any;
  claimsInfo: ClaimsInfo;
  setIsFirstPage: (show: boolean) => void;
  backBtnClickHandler: () => void;
};

const Comprehensive = ({
  claimCheckData,
  validationData,
  claimsInfo,
  setIsFirstPage,
  backBtnClickHandler
}: ComprehensiveType) => {
  const [siteData, setSiteData] = useState({});
  const [footerData, setFooterData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        endpoint === "header-menu"
          ? responseData?.menus
          : endpoint === "consumer-portal"
          ? responseData?.data
          : responseData ?? {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
      fetchData("footer-menu", setFooterData),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    if (setIsFirstPage != undefined)
      setIsFirstPage(false);
  }, []);

  return (
    <React.Fragment>
      {loading && <LoaderOverlay />}
      <ComprehensiveClaim
        type={claimsInfo?.type}
        module="motor"
        claimCheckData={claimCheckData}
        validationData={validationData}
        claimsInfo={claimsInfo} 
        // backbtn click handler
        backBtnClickHandler={backBtnClickHandler}
      />
    </React.Fragment>
  );
};

export default Comprehensive;
