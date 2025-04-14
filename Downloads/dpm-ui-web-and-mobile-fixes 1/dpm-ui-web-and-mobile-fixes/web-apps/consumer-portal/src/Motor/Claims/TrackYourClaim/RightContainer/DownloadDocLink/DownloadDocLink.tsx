import React, { useEffect, useState } from "react";
import "./style.scss";
import DownLoad from "assets/TrackYourClaim/DownloadLink.svg";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import useZipFiles from "../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";
import { useApiCall } from "@dpm/shared-module";
import { PDFDataStructure } from "types/policyDocuments";
import { AlertBox } from "components/AlertBox";
import {fileExtension} from "../../../../../../src/constant";

interface DownloadDocLinkProps {
  trackClaimInfo?: { [key: string]: string };
  policyNumber: string;
}
const DownloadDocLink: React.FC<DownloadDocLinkProps> = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const { trackClaimInfo } = useClaimContext();

  const policyNum = "P-R35-24-331-014684"; // When API data is ready, replace dynamic value
  const allDocUrl = `/Dashboard/V1/Download/Policy/AllDoc?policyNo=${policyNum}`;
  const { makeApiCall, isLoading, errors, data: responseData } = useApiCall(11, allDocUrl, "post");

  // function to convert base64 to blob
  const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };
  const useClaimDocDownload = (createZip: Function) => {
    const downloadDocuments = async (claimsData: PDFDataStructure) => {
      const allDocuments = [
        ...(Array.isArray(claimsData) ? claimsData : [claimsData])
      ];
      
      if (allDocuments.length === 0) {
        return;
      }
      try {
        const filesToZip = allDocuments.map((doc) => ({
          name: `${doc.fileName}.${fileExtension.PDF}`,
          data: base64ToBlob(doc.model, "application/pdf")
        }));
        const zipContent = await createZip(filesToZip);
        const url = URL?.createObjectURL(zipContent);
        const a = document.createElement("a");
        a.href = url;
        a.download = `documents.${fileExtension.ZIP}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error: any) {
        console.error("Error creating zip file:", error);
      }
    };
    return { downloadDocuments };
  };
  const { createZip } = useZipFiles();
  const { downloadDocuments } = useClaimDocDownload(createZip);
  

  const handleDownload = async () => {
    try {
      await makeApiCall();
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    }
  };

  useEffect(() => {
    if (responseData) {
      
      // Handle the response data here
      downloadDocuments(responseData).catch((error) => {
        console.error("Failed to download documents:", error);
      });
    }
    if (errors) {
      // Handle the error here
      setApiErrorMessage({
        title: errors?.messages?.details?.additionalInfo,
        description: errors?.messages?.message_en
      });
      setShowAlertModal(true);
    }
  }, [responseData, errors]);
  const handleAlertClose = () => {
    setShowAlertModal(false);
  }
  console.log(trackClaimInfo,responseData,"=================================")
  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleAlertClose}
      />
      <div className="doc-download">
        <div className="doc-down-link">
          <img src={DownLoad} alt="" />
          <span data-testid="downloadlink-testid" className="doc-down-txt" onClick={handleDownload}>
            {isLoading ? trackClaimInfo?.loading : trackClaimInfo?.download_claim_documents}
          </span>
        </div>
      </div>
    </>
  );
};
export default DownloadDocLink;
