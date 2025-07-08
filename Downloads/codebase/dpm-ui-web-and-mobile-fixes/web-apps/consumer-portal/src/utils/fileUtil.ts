import { PRODUCTS_CODE } from "constant";
import { LanguageData } from "types/languageData";
import { UploadFileEntry } from "../types/UploadFileEnrty";
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(new Error(JSON.stringify(error)));
  });
};

export const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };
  
  export const downloadFile = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  export const createAndDownloadZip = async (files: { name: string; data: Blob }[], createZip: Function) => {
    try {
      const zipContent = await createZip(files);
      const url = URL.createObjectURL(zipContent);
      downloadFile(url, "documents.zip");
    } catch (error: any) {
      console.error("Error creating zip file:", error);
    }
  };

  export const getProductCode = (productCode: string | undefined): string | null => {
    return productCode ?  PRODUCTS_CODE[productCode] : null;
  };

  export const getlineOfBusiness = (productName: string): string => {
    const lowerCaseProductName = productName.toLowerCase();

    if (lowerCaseProductName.includes('motor')) {
        return 'Motor';
      }
      
    return 'NonMotor';
  }
  export const checkForDuplicateFileName = (file: File, uploadedFiles: UploadFileEntry[], index: number, languageData: LanguageData) => {
    const fileName = file?.name?.split(".").slice(0, -1)?.join(".");
    const fileExtension = file?.name?.split(".").pop()?.toLowerCase();
  
    // Check if the filename with the same extension is already in use
    const isDuplicateFileName = uploadedFiles.some(
      (item, idx) =>
        idx !== index && // Exclude the current index
        item?.file &&
        item?.file.name.split(".").slice(0, -1).join(".") === fileName &&
        item?.file.name.split(".").pop()?.toLowerCase() === fileExtension
    );
  
    if (isDuplicateFileName) {
      return languageData?.file_with_the_same_name_already_exists;
    }
    return null;
  }