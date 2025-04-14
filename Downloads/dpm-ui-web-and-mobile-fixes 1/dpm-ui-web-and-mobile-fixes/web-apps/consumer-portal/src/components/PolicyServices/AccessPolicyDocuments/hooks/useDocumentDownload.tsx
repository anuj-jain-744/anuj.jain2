import { PDFDataStructure } from "types/policyDocuments";

export const useDocumentDownload = (createZip: Function) => {
  const downloadDocuments = async (pdfData: PDFDataStructure) => {
    const allDocuments = [
      ...pdfData.endorsementData,
      ...pdfData.policyData,
      ...pdfData.quotationData,
      //...pdfData.claimsData
    ];

    if (allDocuments.length === 0) {
      console.warn("No PDF data available to download.");
      return;
    }

    try {
      const filesToZip = allDocuments.map((doc) => ({
        name: doc.name,
        data: doc.document,
      }));

      const zipContent = await createZip(filesToZip);
      const url = URL.createObjectURL(zipContent);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documents.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip file:", error);
      throw new Error("Failed to download documents");
    }
  };

  return { downloadDocuments };
};
