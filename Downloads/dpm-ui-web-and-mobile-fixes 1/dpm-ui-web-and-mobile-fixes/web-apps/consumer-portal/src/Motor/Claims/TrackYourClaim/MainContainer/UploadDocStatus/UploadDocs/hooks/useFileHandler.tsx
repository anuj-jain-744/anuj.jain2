import { useCallback } from "react";
import { toast } from "react-toastify";

const useFileHandler = ({
  fileItems,
  validFileTypes,
  taskConstants,
  trackClaimInfo,
  updateItemsError,
  updateItemsFile,
  resetFileInput,
  convertToBase64,
}) => {
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const fileInput = event.target;
      const file = fileInput.files?.[0];
      const targetItem = fileItems.find((item) => item.id === id);

      if (!file || !targetItem) {
        toast.error(`${trackClaimInfo?.no_files_selected}`, { autoClose: 2000 });
        resetFileInput(fileInput);
        return;
      }

      // Extract filename and extension
      const fileName = file.name.split(".").slice(0, -1).join(".");
      const fileExtension = file.name.split(".").pop();

      // Check if the filename with the same extension is already in use
      const isDuplicateFileName = fileItems.some(
        (item) =>
          item.file &&
          item.file.name.split(".").slice(0, -1).join(".") === fileName &&
          item.file.name.split(".").pop() === fileExtension &&
          item.id !== id
      );

      if (isDuplicateFileName) {
        const errorMessage = `${file.name} - ${trackClaimInfo?.file_with_the_same_name_already_exists} `;
        toast.error(errorMessage, { autoClose: 2000 });
        updateItemsError(id, errorMessage);
        resetFileInput(fileInput);
        return;
      }

      if (!validFileTypes.includes(file.type)) {
        const errorMessage = `${trackClaimInfo?.invalid_file_type} for ${targetItem?.name}: ${file.type}`;
        toast.error(errorMessage, { autoClose: 2000 });
        updateItemsError(id, errorMessage);
        resetFileInput(fileInput);
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024); // convert size to MB
      if (fileSizeMB > taskConstants.MAX_FILE_SIZE_MB) {
        const errorMessage = `${targetItem?.name} exceeds ${taskConstants.MAX_FILE_SIZE_MB} MB. Current size: ${fileSizeMB.toFixed(
          2
        )} MB`;
        toast.error(errorMessage, { autoClose: 2000 });
        updateItemsError(id, errorMessage);
        resetFileInput(fileInput); // reset input value
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        const base64Data = base64.split(",")[1]; // removed data:format/extension;base64, from base64 string
        updateItemsFile(id, file, base64Data);
        toast.success(`${trackClaimInfo?.file_uploaded_successfully} for ${targetItem?.name}`, {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`${trackClaimInfo?.error_converting_file_to_base_64}`, { autoClose: 2000 });
      } finally {
        resetFileInput(fileInput);
      }
    },
    [
      fileItems,
      validFileTypes,
      taskConstants,
      trackClaimInfo,
      updateItemsError,
      updateItemsFile,
      resetFileInput,
      convertToBase64,
    ]
  );

  return { handleFileChange };
};

export default useFileHandler;