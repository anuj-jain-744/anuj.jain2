import { PRODUCTS_CODE } from "constant";

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

  export const getProductCode = (productCode: string): string | null => {
  return PRODUCTS_CODE[productCode] || null;
};