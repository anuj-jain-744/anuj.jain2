import { Header } from "@corporate-portal/components";
import React, { useEffect, useState } from "react";
import PaymentInsurance from "@consumer-portal/pages/payment-insurance";
import { PolicyFooter } from "@consumer-portal/components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFullUrl, navigateTo } from "@utils";
import { VITE_CONTENT_BASE_URI } from "@corporate-portal/constant";
import { callAPI } from "@dpm/shared-module";

const InsurancePayment: React.FC = () => {
  const transactionId = useParams();
  const [headerData, setHeaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

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
    navigateTo(url, navigate, state);
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchData("header-menu", setHeaderData),
    ]);
    setLoading(false);
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div>
      <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={headerData}
        hideLogin={true}
        hideLanguage={true}
        commonLabels={undefined}
        isMenuTransparent={false}
        navigateTo={handleNavigate}
        pageName="Payment"
      />
      <PaymentInsurance />
      <PolicyFooter />
    </div>
  );
};

export default InsurancePayment;
