import React, { useEffect, useState } from "react";
import "./DownloadDocLink.module.scss";
import useZipFiles from "../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";
import { useApiCall } from "@dpm/shared-module";
import { PDFDataStructure } from "types/policyDocuments";
import { AlertBox } from "components/AlertBox";
import pdfIcon from "assets/TrackYourClaim/pdfIcon.svg";
import downloadIcon from "assets/TrackYourClaim/DownloadLink.svg";

import style from "./DownloadDocLink.module.scss";
import { Accordion } from "react-bootstrap";
import { useDownloadPDF } from "hook/common/useDownloadPdf";

interface DownloadDocLinkProps {
  trackClaimInfo?: { [key: string]: string };
  policyNumber?: string;
  languageData?: { [key: string]: string };
}

interface PdfFile {
  name: string;
  blob: Blob;
}

const DownloadDocLink: React.FC<DownloadDocLinkProps> = ({ languageData }) => {
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [downloadedFiles, setDownloadedFiles] = useState<PdfFile[]>([]);

  const claimNumber = ""; // When API data is ready, replace dynamic value
  const allDocUrl = `/Dashboard/V1/Download/Policy/AllDoc?policyNo=${claimNumber}`; // Replace with claim document API
  const {
    makeApiCall: claimApiCall,
    isLoading: isClaimLoading,
    data: responseData,
    errors,
  } = useApiCall<PDFDataStructure[], undefined>(11, allDocUrl, "post");
  const { createZip } = useZipFiles();
  const { processPDFs, isProcessing, downloadSingleFile } = useDownloadPDF(createZip);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        if (responseData) {
          const pdfFiles = await processPDFs(responseData, {
            format: 'pdf',
            autoDownload: false
          });
          if (Array.isArray(pdfFiles)) {
            setDownloadedFiles([...pdfFiles]);
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching the data", error);
      }
    };

    fetchPdf();

    if (errors) {
      setApiErrorMessage({
        title: errors?.messages?.details?.additionalInfo,
        description: errors?.messages?.message_en,
      });
      setShowAlertModal(true);
    }
  }, [responseData, errors]);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        // await claimApiCall();
      } catch (error) {
        console.error("Error policy", error);
      }
    };
    fetchClaim();
  }, []);

  const handleAlertClose = () => {
    setShowAlertModal(false);
  };

  const handleDownload = (pdfFile: PdfFile) => {
    downloadSingleFile(pdfFile.blob, pdfFile.name);
  };

  const handleDownloadAllDocs = () => {
    const fetchPdf = async () => {
      try {
        if (responseData) {
          await processPDFs(responseData, {
            format: "zip",
            zipFileName: "policyDocuments.zip",
            autoDownload: true,
          });
        }
      } catch (error) {
        console.error("An error occurred while fetching the data", error);
      }
    };

    fetchPdf();
  };

  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleAlertClose}
      />
      <div className={style.docContainerAll}>
        <Accordion className={` ${style.docContainer}`}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className={style.docTitleContainer}>
                <div className={style.docTitle}>{languageData?.claim_documents}</div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className={style.docPdfContainerBox}>
                {downloadedFiles.map((pdfFile, index) => (
                  <div key={index} className={style.docPdfContainer} onClick={() => handleDownload(pdfFile)}>
                    <img src={pdfIcon} alt="pdfIcon" />
                    <div className={style.docPdfTitle}>{pdfFile.name}</div>
                  </div>
                ))}
              </div>
              <div className={style.docAllDocContainer} onClick={handleDownloadAllDocs}>
                <div className={style.docAllBox}>
                  <img src={downloadIcon} alt="download" />
                  <div className={style.docAllDocTitle}>
                    {isClaimLoading ? languageData?.loading : languageData?.download_all_documents}
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
};

export default DownloadDocLink;