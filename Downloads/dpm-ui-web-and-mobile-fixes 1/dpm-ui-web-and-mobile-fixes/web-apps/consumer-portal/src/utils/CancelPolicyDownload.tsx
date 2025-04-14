import { isBase64 } from "./policyDocuments";
import { PdfDocument } from "types/policyDocuments";
import useZipFiles from "Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";

const base64ToBlob = (base64: string, contentType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

export const downloadPDF = async (mockDataForPolicy: any) => {
  const base64StringArray = mockDataForPolicy.data;

  if (!Array.isArray(base64StringArray)) {
    throw new Error("Response data is not an array");
  }

  const pdfPromises = base64StringArray.map(
    async (item: any, index: number) => {
      if (item && item.model && isBase64(item.model)) {
        const pdfBytes = item.model;
        if (pdfBytes) {
          const name = item.fileName || `${"Policy"}_Document_${index + 1}.pdf`;
          return { name, data: pdfBytes };
        }
      }
      return null;
    }
  );

  const pdfDocuments = await Promise.all(pdfPromises);
  const validPdfDocuments = pdfDocuments.filter(
    (pdf): pdf is PdfDocument => pdf !== null
  );

  try {
    const filesToZip = validPdfDocuments.map((doc) => ({
      name: `${doc.name}.pdf`,
      data: base64ToBlob(doc.data, "application/pdf"),
    }));
    const { createZip } = useZipFiles();
    const zipContent = await createZip(filesToZip);
    const url = URL.createObjectURL(zipContent);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documents.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Error creating zip file:", error);
  }
};
