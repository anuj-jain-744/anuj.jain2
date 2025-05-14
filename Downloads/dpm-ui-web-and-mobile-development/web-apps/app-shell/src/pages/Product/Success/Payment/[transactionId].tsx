import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { LoaderOverlay } from "@components/Loader";
import SuccessPage from "@consumer-portal/Motor/SuccessPage";
import { Header } from "@corporate-portal/components";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { navigateTo, fetchData } from "@src/utils";
import { processTransactionId } from "@consumer-portal/utils/paymentUtils";
import { cmsAPIRoute } from "@src/constants";
import "./index.scss";

export default function Success() {
  const transactionId = useParams();
  const { productCode } = processTransactionId(transactionId?.transactionid);

  const [state, setState] = useState({
    headerData: {},
    paymentConfig: {},
  });

  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const breadcrumbData = [
    { label: "Home", route: "/" },
    { label: "Product", route: "/" },
    { label: state?.paymentConfig?.config && state?.paymentConfig?.config?.productCodeTitle[productCode], route: "/" },
  ];

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const fetchAllData = async () => {
    const [headerData, paymentConfig] = await Promise.all([
      fetchData(cmsAPIRoute["header"], "en"),
      fetchData(cmsAPIRoute.paymentConfig, "en"),
    ]);
    setState({ headerData, paymentConfig });
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (state?.paymentConfig?.config) {
      setPageTitle(state?.paymentConfig?.config?.productCodeTitle[productCode]);
    }
  }, [state?.paymentConfig?.config]);

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
      <SuccessPage handleNavigate={handleNavigate} status={true} data={null} flag={true} />
    </div>
  );
}
