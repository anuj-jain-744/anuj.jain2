import React, { useEffect, useState } from 'react';
import style from './UploadDocStatus.module.scss'
import Status from './Status/Status';
import UploadDocs from './UploadDocs/UploadDocs';
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { taskStatus } from "../../../../../constant";

interface Props {

}

const UploadDocStatus: React.FC<Props> = () => {
  const [isSuccess, setIsSuccess] = useState(true);


  const { trackNewData } = useClaimContext();

  const getPendingDocumentNames = (details: typeof trackNewData.claimTrackingDetails) => {
    return details
      .filter((detail: { taskStatus: string; uploadDocumnets: { documentName: string }[] | null }) => detail.taskStatus === taskStatus.PENDING && Array.isArray(detail?.uploadDocumnets))
      .flatMap((detail: { taskStatus: string; uploadDocumnets: { documentName: string }[] | null }) => detail.uploadDocumnets!.map(doc => doc.documentName))
      .join(', ');
  };

  const pendingDocumentNames = getPendingDocumentNames(trackNewData.claimTrackingDetails);


  useEffect(() => {

    const doclength = trackNewData?.claimTrackingDetails.filter(
      (detail: {
        taskStatus: string;
        uploadDocumnets?: { status?: string }[];
      }) =>
        detail?.taskStatus === taskStatus?.PENDING &&
        detail?.uploadDocumnets?.some(
          (doc: { status?: string }) =>
            !doc.status?.toLowerCase().includes("received")
        )
    );

    const totalDocumentsLength = doclength.reduce(
      (
        total: number,
        detail: {
          uploadDocumnets?: { status?: string }[];
        }
      ) =>
        total +
        (detail.uploadDocumnets?.filter(
          (doc: { status?: string }) =>
            !doc.status?.toLowerCase().includes("received")
        ).length || 0),
      0
    );

    if (totalDocumentsLength === 0) {
      setIsSuccess(false);
    }

  }, [trackNewData]);


  return (
    <div className={style.tycMainContainer}>
      <Status claimNumber={trackNewData.claimNo} currentStatus={pendingDocumentNames} />
      {isSuccess && <UploadDocs setIsSuccess={setIsSuccess} isSuccess={isSuccess} />}
    </div>
  )
}

export default UploadDocStatus;