import React, { useEffect, useState } from "react";
import style from "./PolicyContent.module.scss";
import { useApiCall } from "@dpm/shared-module";
import PolicyRelatedDocuments from "./PolicyRelatedDocuments";
import PolicyCard from "./../../PolicyCancellation/sharedComponent/PolicyCard";
import { LanguageData } from "types/languageData";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { LoaderOverlay } from "components/OTPValidation";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import { getPriceFormat } from "utils/getPriceFormat";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { PolicyDetails } from "types/Dashboard";
import { getPlanName } from "utils/policyDetails";
import { PRODUCTSAPI, PRODUCTCODE_TRAVEL, TRAVEL, PRODUCTS_CODE } from "constant";

interface PolicyContentProps {
  languageData?: LanguageData;
  languageError?: string | null;
  policyInfo?: PolicyDetails;
  navigateTo?: (url: string) => void;
  toBack?: boolean;
  allPolicy?: string[];
}

const PolicyContent: React.FC<PolicyContentProps> = ({
  languageData,
  languageError,
  policyInfo,
  navigateTo,
  toBack
}) => {
  const { policyNo, productCode } = policyInfo;

  const [policyDoc, setPolicyDoc] = useState({ data: null, error: null, loading: false });

  const { productName, setProductName } = useQuoteAndBuyContext();

  const productsInfo = PRODUCTSAPI[PRODUCTS_CODE[productCode]] || {}; // get product APIs based on product code

  // veiwpolicy api call
  const {
    makeApiCall,
    data,
    error,
  } = useApiCall(productsInfo?.viewPolicyNo, productsInfo?.viewPolicyAPI, "post");

  let viewPolicyData = null;

  if (productCode === TRAVEL && data && !viewPolicyData) {
    viewPolicyData = data?.model;
  } else {
    viewPolicyData = data;
  }

  useEffect(() => {
    if (policyNo) {
      setPolicyDoc((prev) => ({ ...prev, loading: true }));
      const requestPolicyData = {
        apiSource: "Portal",
        policyNo: policyNo,
        endorsementNo: "",
        isLatestSnapshot: "N"
      }
      makeApiCall(requestPolicyData);
    }
  }, []);

  const policyData = usePolicyData(
    viewPolicyData,
    productCode === TRAVEL ? PRODUCTCODE_TRAVEL : null
  );
  useEffect(() => {
    if (viewPolicyData && !policyDoc?.data) {
      setPolicyDoc((prev) => ({ ...prev, data: policyData, loading: false }));
    }
  }, [viewPolicyData, policyDoc?.data]);

  useEffect(() => {
    if (error && !policyDoc?.error) {
      setPolicyDoc((prev) => ({ ...prev, error, loading: false }));
    }
  }, [error, policyDoc?.error]);

  const policyDetails = policyDoc?.data?.policyDetails ?? undefined;
  const properyAddrDetails = policyDoc?.data?.policyCard?.address ?? '';
  const address = [
    properyAddrDetails?.streetName,
    properyAddrDetails?.city,
    properyAddrDetails?.postCode,
    properyAddrDetails?.country?.trim()
  ].filter(Boolean).join(', ');
 

  if (policyDoc?.error || languageError) {
    return <ErrorComponent />;
  }

  const coverageName = getPlanName(policyData);

  return (
    <>
      {policyDoc?.loading && <LoaderOverlay />}
      <div className={style.wrapper}>
        <div className={style.policyContainer}>
          <div className={style.policyLeftPanel}>
            {languageData && policyDoc?.data && (
              <PolicyRelatedDocuments policyNumber={policyNo} quoteNumber={policyDetails?.quoteNumber} languageData={languageData} />
            )}
          </div>
          <div className={style.policyRightPanel}>
            {policyDoc?.data ? (
              <PolicyCard
                policyNumber={policyNo}
                coverageName={coverageName}
                startDate={policyDetails?.startDate}
                expiryDate={policyDetails?.expiryDate}
                idvValue={policyDetails?.idv ? `${languageData?.sar} ${getPriceFormat(parseInt(policyDetails?.idv!))}` : languageData?.not_available}
                startDateTitle={languageData?.start_date}
                expiryDateTitle={languageData?.expiry_date}
                policyNo={languageData?.policy_no}
                idvTitle={languageData?.sum_insured}
                prodCode={policyDetails?.prodCode}
                setProductName={setProductName}
                addressTitle = {languageData?.property}
                address = {address}
              />

            ) : (
            <DidYouKnowCard  did_you_know_content={languageData?.did_you_know_content} 
                did_you_know_text={languageData?.did_you_know_text} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyContent;
