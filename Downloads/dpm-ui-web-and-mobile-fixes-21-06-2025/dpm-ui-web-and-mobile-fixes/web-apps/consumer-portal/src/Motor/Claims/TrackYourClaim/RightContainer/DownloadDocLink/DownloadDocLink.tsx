import React, { useMemo } from "react";
import "./DownloadDocLink.module.scss";
import pdfIcon from "assets/TrackYourClaim/pdfIcon.svg";
import downloadIcon from "assets/TrackYourClaim/DownloadLink.svg";
import style from "./DownloadDocLink.module.scss";
import { Accordion } from "react-bootstrap";
import { accessPolicyDocumentTable } from "constant";
import { useDocumentDownload } from "hook/common/useDocumentDownload";
import { DownloadParams } from "api/common/documentDownloaderApi";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

interface DownloadDocLinkProps {
  languageData?: { [key: string]: string };
}

const DownloadDocLink: React.FC<DownloadDocLinkProps> = ({ 
  languageData
}) => {
  const { trackNewData } = useClaimContext();
  const { claimNo: claimNumber, subClaimNo: subClaimNumber } = trackNewData || {};
  // Prepare download parameters - only claim-specific parameters
  const downloadParams: DownloadParams = useMemo(() => ({
    claimNumber,
    subClaimNumber
  }), [claimNumber, subClaimNumber]);

 
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
    documentTypes: ['claim'] // Only claim documents
  });

  const handleDownload = (docName: string) => {
    // For claims documents, we use 'claim' as the document type
    handleDocumentClick('claim', docName);
  };

  // Check if a specific document is downloading
  const isDocumentDownloading = (docName: string) => {
    const downloadKey = `claim_${docName}`;
    return downloadingDocs.has(downloadKey) || isProcessing;
  };

  return (
    <div className={style.docContainerAll}>
      <Accordion className={` ${style.docContainer}`}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className={style.docTitleContainer}>
              <div className={style.docTitle}>
                {languageData?.claim_documents || 'Claim Documents'}
              </div>
            </div>
          </Accordion.Header>
          
          <Accordion.Body>
            {/* Show message if no claim documents are available */}
            {!hasDocuments && (
              <div className={style.noDocumentsMessage}>
                <p>{languageData?.no_claim_documents || 'No claim documents available at this time.'}</p>
              </div>
            )}
            
            {/* Show documents if available */}
            {hasDocuments && (
              <>
                <div className={style.docPdfContainerBox}>
                  {accessPolicyDocumentTable.Claims.map((docName, index) => {
                    const isDownloading = isDocumentDownloading(docName);
                    
                    return (
                      <div 
                        key={index} 
                        className={`${style.docPdfContainer}`}
                        onClick={() => !isDownloading && handleDownload(docName)}
                        style={{
                          cursor: isDownloading ? 'not-allowed' : 'pointer',
                          opacity: isDownloading ? 0.6 : 1,
                          pointerEvents: isDownloading ? 'none' : 'auto'
                        }}
                      >
                        <img src={pdfIcon} alt="pdfIcon" />
                        <div className={style.docPdfTitle}>
                          {docName}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div 
                  className={`${style.docAllDocContainer} ${isDownloadDisabled ? style.docAllDocContainerDisabled : style.docAllDocContainerEnabled}`}
                  onClick={!isDownloadDisabled ? handleDownloadAll : undefined}
                >
                  <div className={style.docAllBox}>
                    <img src={downloadIcon} alt="download" />
                    <div className={style.docAllDocTitle}>
                      {isDownloadDisabled
                        ? languageData?.loading || 'Loading...'
                        : languageData?.download_all_documents || 'Download All Documents'
                      }
                    </div>
                  </div>
                </div>
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default DownloadDocLink;