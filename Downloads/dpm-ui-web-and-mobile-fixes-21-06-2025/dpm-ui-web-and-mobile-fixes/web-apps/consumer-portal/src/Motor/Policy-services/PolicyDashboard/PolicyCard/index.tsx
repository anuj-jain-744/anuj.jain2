import React from "react";
import userImg2 from "assets/PolicyDetails/userImg2.svg";
import "./index.scss";
import { LanguageData } from "types/languageData";
import { PolicyCard } from "types/policyDetails";
import { formatAddress } from "utils/policyDetails";
import { useCommonContext } from "@dpm/shared-module";
import { commonKeywords } from "constant";
import { formatDate } from "utils/formatDate";

interface PolicyCardProps {
  policyCardValue: PolicyCard | undefined | null;
  languageData: LanguageData | undefined;
}

const PolicyCardPage: React.FC<PolicyCardProps> = ({
  policyCardValue,
  languageData,
}) => {

  const {
    customerNameArabic,
    customerNameEnglish,
    nationalId,
    nationality,
    dateOfBirth,
    mobileNo,
    address,
  } = policyCardValue ?? {
    customerNameArabic: null,
    customerNameEnglish: null,
    nationalId: null,
    nationality: null,
    dateOfBirth: null,
    mobileNo: null,
    address: null,
  };
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const formatedAddress = formatAddress(address, currentLanguage, ar);
  return (
    <div className="policy-card-container walaa-regular-400">
      <div className="policy-card-frame">
        <div className="policy-card-row">
          <div className="policy-card-row-title">
            <div className="policy-card-row-user">
              <img src={userImg2} alt="User" className="policy-card-row-svg" />
              <div className="policy-card-row-name">
                <div className="policy-card-row-name-content walaa-medium-500">
                  {customerNameEnglish}
                </div>
                <div className="policy-card-row-name-content walaa-medium-500">
                  {customerNameArabic ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="policy-card-line" />
        <div className="policy-card-row-info">
          <InfoField label={languageData?.national_id} value={nationalId} />
          <InfoField label={languageData?.dob} value={formatDate(dateOfBirth ?? "")} />
        </div>
        <div className="policy-card-row-info">
          <InfoField label={languageData?.nationality} value={nationality} />
          <InfoField label={languageData?.mobile_number} value={mobileNo} />
        </div>
        <div className="policy-card-row-info">
          <InfoField
            label={languageData?.addresses}
            value={formatedAddress}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

interface InfoFieldProps {
  label: string | undefined | null;
  value: string | undefined | null;
  fullWidth?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  fullWidth = false,
}) => (
  <div className={`policy-card-row-field ${fullWidth ? "w-full" : ""}`}>
    <div className="policy-card-row-field-label">{label}</div>
    <div className="policy-card-row-field-value walaa-medium-500">{value}</div>
  </div>
);

export default PolicyCardPage;
