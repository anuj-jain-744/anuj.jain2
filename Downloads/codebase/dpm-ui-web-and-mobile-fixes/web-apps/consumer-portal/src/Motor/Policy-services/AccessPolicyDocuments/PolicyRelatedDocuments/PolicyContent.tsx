import React, { useEffect, useMemo, useState } from "react";
import style from "./PolicyContent.module.scss";
import { useApiCall, RootState } from "@dpm/shared-module";
import PolicyRelatedDocuments from "./PolicyRelatedDocuments";
import PolicyCard from "../../PoliciesCancellation/sharedComponent/PolicyCard";
import { LanguageData } from "types/languageData";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { LoaderOverlay } from "components/OTPValidation";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import { getPriceFormat } from "utils/getPriceFormat";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { PolicyDetails } from "types/Dashboard";
import { getPlateNumber } from "utils/getPlateNumber";
import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import { getActiveClaimNumberForPolicy, getPlanName } from "utils/policyDetails";
import { displayHouseAddress, truncateName } from "utils/quoteAndBuy";
import { useSelector } from "react-redux";
import { commonKeywords, PRODUCTSAPI, PRODUCTCODE_TRAVEL, TRAVEL, PRODUCTS_CODE } from "constant";
import { useQueryClaim } from "hook/dashboard/myRequests/useQueryClaim";
import { useCommonContext } from "@dpm/shared-module";

interface PolicyContentProps {
  languageData?: LanguageData;
  languageError?: string | null;
  policyInfo?: PolicyDetails;
  allPolicy?: string[];
}

const PolicyContent: React.FC<PolicyContentProps> = ({
  languageData,
  languageError,
  policyInfo,
}) => {

  const { policyNo, productCode, endorsementNo, quoteNo } = policyInfo || {};

  const [policyDoc, setPolicyDoc] = useState({ data: null, error: null, loading: false });

  const { setProductName } = useQuoteAndBuyContext();

  const productsInfo = PRODUCTSAPI[PRODUCTS_CODE[productCode]] || {};

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

  const userId = useSelector((state: RootState) => state.auth?.userInfo?.userId);
    
  const {
    data: queryClaimData,
  } = useQueryClaim({ idNumber: userId, policyNo: policyNo });


const claims = useMemo(() => {
  return queryClaimData?.data?.claimList ?? [];
}, [queryClaimData?.data?.claimList]);

const { claimNo, subClaimNo } = useMemo(() => {
  const activeClaim = getActiveClaimNumberForPolicy(
    claims,
    policyNo ?? '',
    languageData || ({} as LanguageData)
  );
  return activeClaim || { claimNo: '', subClaimNo: '' };
}, [claims, policyNo, languageData]);

  useEffect(() => {
    if (policyNo) {
      setPolicyDoc((prev) => ({ ...prev, loading: true }));
      const requestPolicyData = {
        apiSource: "Portal",
        policyNo: policyNo,
        endorsementNo: "",
        isLatestSnapshot: "Y"
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

  const policyBasicDetails = viewPolicyData?.policyLob?.[0]?.policyRisk?.[0] || {};

  const {plateNo, plateNoText1, plateNoText2, plateNoText3, repairCondition, vehicleMakeTextEn, vehicleModelTextEn} = policyBasicDetails || {}

  const displayPlateNumber = getPlateNumber({
    plateNo: plateNo,
    plateNoText1: plateNoText1,
    plateNoText2: plateNoText2,
    plateNoText3: plateNoText3,
  });

  const policyDetails = policyDoc?.data?.policyDetails ?? undefined;
  const properyAddrDetails = policyDoc?.data?.planDetails?.policyRisk[0] ?? '';

  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const address = displayHouseAddress(properyAddrDetails, currentLanguage, ar);
  const coverageName = getPlanName(policyData);

  if (policyDoc?.error || languageError) {
    return <ErrorComponent />;
  }

  return (
    <>
      {policyDoc?.loading && <LoaderOverlay />}
      <div className={style.wrapper}>
        <div className={style.policyContainer}>
          <div className={style.policyLeftPanel}>
            {languageData && policyDoc?.data && (
              <PolicyRelatedDocuments policyNumber={policyNo}
                quoteNumber={quoteNo} languageData={languageData}
                endorsementNo={endorsementNo} claimNumber={claimNo} subClaimNumber={subClaimNo} />
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
                plateNumber={displayPlateNumber}
                vehicleMakeModel={truncateName(capitalizeNameFirstLetter(`${vehicleMakeTextEn} ${vehicleModelTextEn}`),12)}
                repairType={repairCondition}
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