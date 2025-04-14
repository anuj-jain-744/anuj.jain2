import { Header } from "@corporate-portal/components";
import React from "react";
import PaymentInsurance from "@consumer-portal/pages/payment-insurance";
import { PolicyFooter } from "@consumer-portal/components";
import { useParams } from "react-router-dom";

const InsurancePayment: React.FC = () => {
  const transactionId = useParams();

  return (
    <div>
      <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={[]}
        hideLogin={true}
        hideLanguage={true}
        commonLabels={undefined}
        isMenuTransparent={false}
        navigateTo={() => {}}
        pageName="Payment"
      />
      <PaymentInsurance
        transactionId={transactionId?.transactionid}
      />
      <PolicyFooter />
    </div>
  );
};

export default InsurancePayment;
