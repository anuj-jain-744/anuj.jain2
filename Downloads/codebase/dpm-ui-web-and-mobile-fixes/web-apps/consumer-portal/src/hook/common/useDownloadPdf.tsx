import { useState } from 'react';
import { fileExtension } from './../../constant';
import useZipFiles from 'Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles';

export interface PDFDataStructure {
  fileName: string;
  model: string; 
  [key: string]: any;  // for any additional properties
}

interface PDFFile {
  name: string;
  blob: Blob;
}

interface DownloadOptions {
  zipFileName?: string;
  format: 'zip' | 'pdf';
  autoDownload?: boolean;
}

interface UseDownloadPDFReturn {
  processPDFs: (
    data: PDFDataStructure | PDFDataStructure[] | unknown,
    options: DownloadOptions
  ) => Promise<PDFFile[] | Blob>;
  downloadFiles: (files: PDFFile[]) => void;
  downloadSingleFile: (blob: Blob, fileName: string) => void;
  isProcessing: boolean;
  error: Error | null;
}

export const useDownloadPDF = (): UseDownloadPDFReturn => {
  const { createZip } = useZipFiles();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Validate base64 string
  const isValidBase64 = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      // Check if it's a valid base64 string
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  // Validate PDF data structure
  const isValidPDFData = (data: any): data is PDFDataStructure => {
    return (
      data &&
      typeof data === 'object' &&
      'fileName' in data &&
      'model' in data &&
      typeof data.fileName === 'string' &&
      typeof data.model === 'string'
    );
  };

  // Convert base64 to Blob
  const base64ToBlob = (base64: string, contentType: string): Blob | null => {
    if (!isValidBase64(base64)) {
      console.warn('Invalid base64 string provided');
      return null;
    }

    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.warn('Failed to convert base64 to blob:', error);
      return null;
    }
  };

  // Download single file
  const downloadSingleFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download multiple files
  const downloadFiles = (files: PDFFile[]) => {
    files.forEach(file => {
      downloadSingleFile(file.blob, file.name);
    });
  };

  // Main processing function
  const processPDFs = async (
    data: PDFDataStructure | PDFDataStructure[] | unknown,
    options: DownloadOptions
  ): Promise<PDFFile[] | Blob> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate and transform input data
      let documents: PDFDataStructure[] = [];
      
      if (Array.isArray(data)) {
        documents = data.filter(isValidPDFData);
      } else if (isValidPDFData(data)) {
        documents = [data];
      } else {
        console.warn('Invalid or empty data provided');
        throw new Error('Invalid document data provided');
      }

      if (documents.length === 0) {
        throw new Error('No valid documents to process');
      }

      // Convert documents to PDFFiles, filtering out invalid ones
      const pdfFiles: PDFFile[] = documents
        .map(doc => {
          const blob = base64ToBlob(doc.model, 'application/pdf');
          if (!blob) return null;
          return {
            name: `${doc.fileName}.${fileExtension.PDF}`,
            blob
          };
        })
        .filter((file): file is PDFFile => file !== null);

      if (pdfFiles.length === 0) {
        throw new Error('No valid PDF files could be created');
      }

      // Return based on requested format
      if (options.format === 'pdf') {
        if (options.autoDownload) {
          downloadFiles(pdfFiles);
        }
        return pdfFiles;
      } else if (options.format === 'zip') {
        if (!createZip) {
          throw new Error('Zip functionality not provided');
        }

        const filesToZip = pdfFiles.map(file => ({
          name: file.name,
          data: file.blob
        }));

        const zipContent = await createZip(filesToZip);

        if (options.autoDownload) {
          downloadSingleFile(
            zipContent,
            options.zipFileName || `documents.${fileExtension.ZIP}`
          );
        }

        return zipContent;
      }

      throw new Error('Invalid format specified');

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to process PDFs');
      setError(error);
      console.error('Error processing PDFs:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPDFs,
    downloadFiles,
    downloadSingleFile,
    isProcessing,
    error
  };
};