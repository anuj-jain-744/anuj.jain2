import React, { useState, useEffect } from "react";
import "./StatusTree.scss";
import JourneyUser from "../../../../../assets/TrackYourClaim/JourneyUser.svg";
import pdfIcon from "../../../../../assets/TrackYourClaim/pdfIcon.svg";
import { Accordion } from "react-bootstrap";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { useApiCall } from "@dpm/shared-module";

interface ClaimTrackingDetail {
  date?: string;
  taskId?: number;
  taskStatus?: string;
  claimStatus?: string;
  documentId?: string;
  documentName?: string;
  uploadDocumnets?: { documentId: string; documentName: string }[];
  documents?: { documentId: string; documentName: string }[];
}

export default function StatusTree() {
  const [isfileDownload, setfileDownload] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>("bydefault");
  const [isOpen, setOpen] = useState<boolean>(false);

  const taskStatus = {
    PENDING: "Pending",
    COMPLETED: "Completed",
  }

  const { trackClaimInfo } = useClaimContext();
  const { trackNewData } = useClaimContext();

  //accordion on body open handler fn
  const clickEnterHandler = () => {
    setOpen(true);
  };
  //accordion on body close handler fn
  const clickExitHandler = () => {
    setOpen(false);
  };

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

// function to handle document name explicitly
 const handleDocName = (docName: string) => {
  setDocName(docName);
 };

 // function to handle download of pdf
  const handleDownload = (file: string, fileName: string) => {
    const base64String = file;
    const blob = base64ToBlob(base64String, 'application/pdf');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // function to make API call for  download pdf
  const downloadPDF = async (documentId: string, documentName: string) => {
    try {

      const downloadData = await handleApiCall(documentId);

      if (downloadData) {
        handleDownload(downloadData.file, documentName);
      } else {
        console.error("Failed to download PDF: No data available");
      }
    } catch (error) {
      console.error("Failed to download PDF: No data available");
    }
  };
  const { makeApiCall, isLoading, errors, data } = useApiCall(8, "/Motor/Claim/Document/V1/Download/Missing/Doc", "post");


  const handleApiCall = async (documentId: string) => {

    try {
      const payloadWorkShop = { documentID: documentId }
      const response = await makeApiCall(payloadWorkShop);

      return response;
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
      return null;
    }
  };

  const getStatusClass = (status): string => {
    if (status.taskStatus === taskStatus.COMPLETED) {
      return "green";
    } else if (status.taskStatus === taskStatus.PENDING) {
      return "red";
    } else {
      return "grey";
    }
  };



  useEffect(() => {

    if (data && !isfileDownload) {
      if (data.file) {
        handleDownload(data.file, docName );
      } else {
        console.error("File or fileName is missing in the response data");
      }
    }
  }, [data, isfileDownload,docName]);
  return (
    <div className="treeContainer">
      <div className="treeFrame">
        <div className="pageTitle">{trackClaimInfo?.know_your_claim_status}</div>
        <ul className="mainTree">
          {trackNewData.claimTrackingDetails
            .sort((a: ClaimTrackingDetail, b: ClaimTrackingDetail) => {
              const dateA = new Date(a.date || "").getTime();
              const dateB = new Date(b.date || "").getTime();
              return dateA - dateB;
            })
            .map((status: ClaimTrackingDetail, index: number) => (
              <>
                {index === 0 ? (
                  <li key={index} className="journey-user">
                    <span className="user-icon">
                      <img src={JourneyUser} alt="Journey User" />
                    </span>
                    <span className="status-date">{status.date}</span>
                    <span className="status-text">{status.claimStatus}</span>
                  </li>
                ) : (
                  <>
                    <li
                      key={index}
                      className={getStatusClass(status)}
                    >
                      <span className="status-date">{status.date}</span>
                      {status?.taskStatus === taskStatus.COMPLETED &&
                        status.uploadDocumnets &&
                        status.uploadDocumnets.length > 0 ? (
                        <div className="document-details">
                          <Accordion
                            className={`${isOpen ? "accor-open" : "accor-close"
                              } accor-claim-journy`}
                          >
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                <span className="status-text">
                                  {status.claimStatus}
                                </span>
                              </Accordion.Header>
                              <Accordion.Body
                                onEntered={clickEnterHandler}
                                onExiting={clickExitHandler}
                                className="p-2"
                              >
                                {status.uploadDocumnets.map(
                                  (doc: { documentId: string; documentName: string; }, docIndex: number) => (
                                    <div
                                      key={docIndex}
                                      className="doc-link-container"

                                    >
                                      <img src={pdfIcon} />
                                      <button data-testid="docLink" className="document-link" onClick={
                                        () => {
                                          handleDocName(doc.documentName);
                                          downloadPDF("125909332", doc.documentName); // ;  Make dynamic as API data is available
                                        }}>
                                        {doc.documentName}
                                      </button>
                                    </div>
                                  )
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      ) : (
                        <>
                          <span className="status-text">
                            {status.claimStatus}
                          </span>
                        </>
                      )}
                    </li>
                  </>
                )}
              </>
            ))}
        </ul>
      </div>
    </div>
  );
}