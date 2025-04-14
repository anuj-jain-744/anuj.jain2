import { useCallback } from "react";
import { toast } from "react-toastify";

const useUploadAll = ({
  newFileItems,
  taskConstants,
  trackClaimInfo,
  makeApiCall,
  resetState,
  setIsSuccess,
}) => {
  const handleUploadAll = useCallback(async () => {
    const groupedByTaskId = newFileItems.reduce((acc, item) => {
      if (!item.base64 || item.error) {
        return acc; // Skip if no base64 or error
      }
      const taskGroup = acc[item.taskId] || { taskId: item.taskId, fileList: [] };
      taskGroup.fileList.push({
        documentId: item.id,
        fileName: item.name || "",
        file: item.base64,
      });
      acc[item.taskId] = taskGroup; // Add to taskGroup object
      return acc; // Return accumulator object
    }, {} as Record<
      number,
      { taskId: number; fileList: { documentId: string; fileName: string; file: string }[] }
    >);

    const payloadRequest = Object.values(groupedByTaskId); // Create array from groupedByTaskId values
    let allSuccess = true;

    await Promise.all(
      payloadRequest.map(async (payload) => {
        const result = await makeApiCall(payload);
        const documentNames = payload.fileList.map((file) => file.fileName).join(", ");
        if (result?.message === taskConstants.SUCCESS) {
          toast.success(
            `${trackClaimInfo?.documents_are_submitted_successfully} for ${documentNames}`,
            { autoClose: 2000 }
          );
          setIsSuccess(false);
        } else {
          allSuccess = false;
          toast.error(
            `${trackClaimInfo?.error_in_uploading_documents} for ${documentNames}`,
            { autoClose: 2000 }
          );
        }
      })
    );

    if (allSuccess) {
      resetState();
      return {
        status: taskConstants.SUCCESS,
        message: `${trackClaimInfo?.all_documents_submitted_successfully}`,
      };
    } else {
      return {
        status: taskConstants.ERROR,
        message: `${trackClaimInfo?.error_in_uploading_documents}`,
      };
    }
  }, [newFileItems, taskConstants, trackClaimInfo, makeApiCall, resetState, setIsSuccess]);

  return { handleUploadAll };
};

export default useUploadAll;