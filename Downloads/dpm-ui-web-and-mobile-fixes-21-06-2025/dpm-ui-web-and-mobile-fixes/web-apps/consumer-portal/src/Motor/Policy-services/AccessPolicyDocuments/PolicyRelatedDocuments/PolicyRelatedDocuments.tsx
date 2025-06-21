import React, { useMemo, useCallback } from "react";
import style from "./PolicyRelatedDocuments.module.scss";
import download from "assets/PolicyDocuments/download.svg";
import { LanguageData } from "types/languageData";
import DocumentSection from "./DocumentSection";
import { accessPolicyDocumentTable } from "constant";
import { useDocumentDownload } from "hook/common/useDocumentDownload";
import { 
  DocumentType, 
  DownloadParams 
} from "api/common/documentDownloaderApi";

interface Props {
  languageData: LanguageData;
  policyNumber: string | undefined | null;
  quoteNumber: string;
  endorsementNo: string | undefined | null;
  claimNumber: string;
  subClaimNumber: string;
}

const PolicyRelatedDocuments: React.FC<Props> = ({ 
  languageData, 
  policyNumber,
  quoteNumber, 
  endorsementNo, 
  claimNumber, 
  subClaimNumber 
}) => {

  // Memoized values
  const rows = useMemo(() => {
    const entries = Object.entries(accessPolicyDocumentTable);
    const result = [];
    for (let i = 0; i < entries.length; i += 3) {
      result.push(entries.slice(i, i + 3));
    }
    return result;
  }, []);

  const downloadParams: DownloadParams = useMemo(() => ({
    policyNumber,
    quoteNumber,
    endorsementNo,
    claimNumber,
    subClaimNumber
  }), [policyNumber, quoteNumber, endorsementNo, claimNumber, subClaimNumber]);

  // Document type mapping for section titles
  const sectionTypeMapping: Record<string, DocumentType> = useMemo(() => ({
    'policy': 'policy',
    'quotation': 'quotation',
    'claims': 'claim'
  }), []);

  // Use the custom hook for all download functionality
  const {
    downloadingDocs,
    isDownloadDisabled,
    handleDocumentClick,
    handleDownloadAll,
    isProcessing,
    hasDocuments,
  } = useDocumentDownload({ 
    languageData: languageData || {}, 
    downloadParams,
    documentTypes: ['policy', 'quotation', 'claim']
  });

  // Render helpers
  const renderDocumentSection = useCallback((row: [string, string[]][], rowIndex: number) => {
  return row.map(([sectionTitle, documents], sectionIndex) => {
    if (documents.length === 0) return null;

    const documentType = sectionTitle.toLowerCase() as DocumentType;
    const mappedType = sectionTypeMapping[documentType] || documentType;

    return (
      <DocumentSection
        key={`section-${rowIndex}-${sectionIndex}`}
        title={sectionTitle}
        documents={documents}
        onDocumentClick={(docName) => handleDocumentClick(mappedType, docName)}
        downloadingDocs={downloadingDocs}
        isProcessing={isProcessing}
      />
    );
  });
  }, [sectionTypeMapping, handleDocumentClick, downloadingDocs, isProcessing]);

  return (
    <div className={style.policyContainer}>
      <div className={style.policyTitle}>
        <div className={style.policyTitleFrame}>
          <div className={style.policyTitleFrameText}>
            {languageData?.policy_related_documents}
          </div>
        </div>
        <hr className={style.horizontalLine}/>
      </div>
      <div className={style.policyFrame}>
        <div className={style.policyFramecontents}>
          <div className={style.policyFrameContentsInner}>
            {rows.map((row: [string, string[]][], rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={style.policyFrameContentsInnerRow}
              >
                {renderDocumentSection(row, rowIndex)}
              </div>
            ))}
          </div>
        </div>
        <hr className={style.horizontalLine}/>
        <div className={style.policyBottom}>
          <div className={style.policyBottomContent}>
            <img src={download} alt="download" />
            <div
              className={style.policyBottomContentText}
              onClick={isDownloadDisabled ? undefined : handleDownloadAll}
              style={{ 
                cursor: isDownloadDisabled ? 'not-allowed' : 'pointer',
                opacity: isDownloadDisabled ? 0.6 : 1 
              }}
            >
              {isDownloadDisabled
                ? languageData?.loading 
                : languageData?.download_all_documents}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyRelatedDocuments;