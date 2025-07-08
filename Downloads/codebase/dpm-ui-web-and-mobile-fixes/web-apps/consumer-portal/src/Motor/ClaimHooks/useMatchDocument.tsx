import { useEffect, useState } from "react";
import { getClaimDocuments } from "utils/getClaimDocuments";
import { LanguageData } from "types/languageData";

type UploadFileEntry = {
  key: string;
  value: string;
  required: boolean;
  file?: File;
};

type UseMatchDocumentParams = {
  type: string;
  validationData: {
    estimateAmount?: string | number | null | undefined;
    liability?: number | null;
  };
  caseReportedType: string | number | null | undefined;
  Data: LanguageData;
};

export const useMatchDocument = ({
  type,
  validationData,
  caseReportedType,
  Data,
}: UseMatchDocumentParams): UploadFileEntry[] => {
  const [matchDocList, setMatchDocList] = useState<UploadFileEntry[]>([]);

  useEffect(() => {
    const motorDocs = Data?.register_claim_dynamic_upload_section1?.motor;

    if (!Array.isArray(motorDocs)) {
      setMatchDocList([]);
      return;
    }
    const inputData:Record<string, string | number | null | undefined> = {
      claimRequestType: type,
      estimateAmount: validationData?.estimateAmount,
      liabilityPercentage: validationData?.liability,
      caseReportedType: caseReportedType,
    };
    const matchedDocuments = getClaimDocuments(motorDocs, inputData);
    setMatchDocList(matchedDocuments.length > 0 ? matchedDocuments : []);
  }, [type, validationData?.estimateAmount, validationData?.liability, caseReportedType, Data]);

  return matchDocList;
};
