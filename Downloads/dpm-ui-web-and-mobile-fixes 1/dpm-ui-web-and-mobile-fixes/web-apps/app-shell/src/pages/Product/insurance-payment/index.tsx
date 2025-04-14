import { Header } from "@corporate-portal/components";
import React from "react";
import PaymentInsurance from "@consumer-portal/pages/payment-insurance";
import { PolicyFooter } from "@consumer-portal/components";

const InsurancePayment: React.FC = () => {

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
      <PaymentInsurance />
      <PolicyFooter />
    </div>
  );
};

export default InsurancePayment;
