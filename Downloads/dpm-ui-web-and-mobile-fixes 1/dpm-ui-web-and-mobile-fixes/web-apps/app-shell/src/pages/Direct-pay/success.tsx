import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { LoaderOverlay } from "@components/Loader";
import SuccessPage from "@consumer-portal/Motor/SuccessPage";
import { Header } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { navigateTo, fetchData } from "@src/utils";
import { cmsAPIRoute } from "@src/constants";

export default function Success() {
  const [state, setState] = useState({
    headerData: {},
    consumerportalConfig: {},
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Product", route: "/" },
    { label: "Motor Insurance", route: "/Motor/QuoteAndBuy" },
  ];

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const fetchAllData = async () => {
    const [headerData, consumerportalConfig] = await Promise.all([
      fetchData(cmsAPIRoute["header"], "en"),
      fetchData(cmsAPIRoute.consumerConfig, "en"),
    ]);
    setState({ headerData, consumerportalConfig });
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (
      state?.consumerportalConfig?.config &&
      state?.consumerportalConfig?.config.length > 0
    ) {
      setPageTitle(state?.consumerportalConfig?.config[0].motor_insurance);
    }
  }, [state?.consumerportalConfig]);

  return (
    <div>
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
      <SuccessPage status="success" data={null} flag={true} />
    </div>
  );
}
