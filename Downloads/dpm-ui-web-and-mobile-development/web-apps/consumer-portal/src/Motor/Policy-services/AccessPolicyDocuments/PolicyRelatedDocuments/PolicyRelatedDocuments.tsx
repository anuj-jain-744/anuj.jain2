import React, { useEffect, useMemo, useState } from "react";
import style from "./PolicyRelatedDocuments.module.scss";
import vector from "assets/PolicyDocuments/vector46.svg";
import download from "assets/PolicyDocuments/download.svg";
import { LanguageData } from "types/languageData";
import useZipFiles from "../hooks/useZipFiles";
import { usePDFData } from "../hooks/usePdfData";
import { useDocumentDownload } from "../hooks/useDocumentDownload";
import DocumentSection from "./DocumentSection";
import Error from 'components/ErrorComponent/Error'

interface Props {
  languageData: LanguageData;
  policyNumber: string;
  quoteNumber: string;
}

const PolicyRelatedDocuments: React.FC<Props> = ({ languageData, policyNumber, quoteNumber }) => {
  const { VITE_BACKEND_MOTOR_URL } = import.meta.env;
  

  // TODO: need to update when we get the login session policyNO  assign to user, currently we have data in this policyNo and endorsementNo so hardcoded.
  const payloads = {
    endorsement: {
      endorsementNo: "E-0001",
      policyNo: policyNumber,
    },
    policy: {
      policyNo: policyNumber,
    },
    quotation:{
      quoteReferenceNo: quoteNumber,
      policyNo: policyNumber,
 }
  };
  
  const urls = useMemo(() => ({
    endorsement: `${VITE_BACKEND_MOTOR_URL}/Dashboard/V1/Download/Endorsement/AllDoc?policyNo=${payloads.endorsement.policyNo}&endorsementNo=${payloads.endorsement.endorsementNo}`,
    policy: `${VITE_BACKEND_MOTOR_URL}/Dashboard/V1/Download/Policy/AllDoc?policyNo=${payloads.policy.policyNo}`,
    quotation: `${VITE_BACKEND_MOTOR_URL}/Dashboard/V1/Download/Quotation/AllDoc?quoteReferenceNo=${payloads.quotation.quoteReferenceNo}`,
  }), [policyNumber, VITE_BACKEND_MOTOR_URL]);

  const { pdfData, isLoading, error } = usePDFData(
    urls.endorsement,
    urls.policy,
    payloads,
    urls.quotation,
  );

  

  const { createZip } = useZipFiles();
  const { downloadDocuments } = useDocumentDownload(createZip);

  const tableData = useMemo(() => ({
    Policy: pdfData.policyData.map((doc) => ({
      id: doc.id,
      name: doc.name,
      document: doc.document,
    })),
    Endorsement: pdfData.endorsementData.map((doc) => ({
      id: doc.id,
      name: doc.name,
      document: doc.document,
    })),
    Quotation: pdfData.quotationData.map((doc) => ({
      id: doc.id,
      name: doc.name,
      document: doc.document,
    })),
  }), [pdfData]);

  const rows = useMemo(() => {
    const entries = Object.entries(tableData);
    const result = [];
    for (let i = 0; i < entries.length; i += 3) {
      result.push(entries.slice(i, i + 3));
    }
    return result;
  }, [tableData]);

  const handleDownloadAll = () => {
    downloadDocuments(pdfData).catch((error) => {
      console.error("Failed to download documents:", error);
    });
  };

  if (error) {
    return <Error />
  }

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
            {rows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={style.policyFrameContentsInnerRow}
              >
                {row.map(([sectionTitle, documents]) => (
                  <DocumentSection
                    key={sectionTitle}
                    title={sectionTitle}
                    documents={documents}
                  />
                ))}
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
              onClick={handleDownloadAll}
            >
              {isLoading ? "Loading..." : languageData?.download_all_documents}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyRelatedDocuments;