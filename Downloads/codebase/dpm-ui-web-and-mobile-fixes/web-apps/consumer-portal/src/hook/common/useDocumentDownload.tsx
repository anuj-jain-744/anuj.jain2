import { useState, useRef, useCallback, useMemo } from 'react';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useDownloadPDF } from 'hook/common/useDownloadPdf';
import { DocumentDownloaderService, DocumentType, DocumentData, DownloadParams } from 'api/common/documentDownloaderApi';
import { LanguageData } from 'types/languageData';
import { showNotification } from 'components/ThemeAlertNotification/ThemeAlertNotification';
import checkCircleIcon from 'assets/CommonSVG/checkCircle.svg';

type CustomDocumentTypes = ['custom', string[]];
type DocumentTypesInput = DocumentType[] | CustomDocumentTypes;

interface UseDocumentDownloadOptions {
  languageData: LanguageData;
  downloadParams: DownloadParams;
  documentTypes?: DocumentTypesInput;
}

export const useDocumentDownload = ({
  languageData,
  downloadParams,
  documentTypes,
}: UseDocumentDownloadOptions) => {
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingDocs, setDownloadingDocs] = useState<Set<string>>(new Set());

  const pendingOperations = useRef<Set<string>>(new Set());
  const downloadAllRef = useRef<boolean>(false);
  const { processPDFs } = useDownloadPDF();

  // Updated documentConfigs logic
  const documentConfigs = useMemo(() => {
    // Custom docNames logic
    if (
      Array.isArray(documentTypes) && documentTypes.length > 0 &&
      documentTypes[0] === 'custom' &&
      Array.isArray(documentTypes[1])
    ) {
      const customDocNames: string[] = documentTypes[1];
      return DocumentDownloaderService.createDocumentConfigs(downloadParams, customDocNames);
    }

    // Default: filter by type if documentTypes is provided and not custom
    if (Array.isArray(documentTypes) && documentTypes.length > 0) {
      return DocumentDownloaderService.createDocumentConfigs(downloadParams)
        .filter(config => (documentTypes as DocumentType[]).includes(config.type));
    }

    return DocumentDownloaderService.createDocumentConfigs(downloadParams);
  }, [downloadParams, documentTypes]);

  const showSuccessNotification = useCallback((message: string) => {
    showNotification({
      title: languageData?.success || 'Success',
      description: message,
      type: 'success',
      position: 'top-center',
      duration: 3000,
      icon: checkCircleIcon,
    });
  }, [languageData]);

  const showErrorNotification = useCallback((message: string) => {
    showNotification({
      title: languageData?.error || 'Error',
      description: message,
      type: 'error',
      position: 'top-center',
      duration: 5000,
      icon: checkCircleIcon,
    });
  }, [languageData]);

  const showWarningNotification = useCallback((message: string) => {
    showNotification({
      title: languageData?.warning || 'Warning',
      description: message,
      type: 'warning',
      position: 'top-center',
      duration: 5000,
      icon: checkCircleIcon,
    });
  }, [languageData]);

  const documentMutation = useMutation({
    mutationFn: async ({
      type,
      docType,
      transType,
    }: {
      type: DocumentType;
      docType: string;
      transType: string;
    }) => {
      return DocumentDownloaderService.fetchDocumentByType(type, docType, downloadParams, transType);
    },
    onSuccess: async (data, variables) => {
      const operationKey = `${variables.type}_${variables.docType}`;
      try {
        if (data?.length > 0) {
          await processPDFs(data, { format: 'pdf', autoDownload: true });
          if (!pendingOperations.current.has(`success_${operationKey}`)) {
            pendingOperations.current.add(`success_${operationKey}`);
            showSuccessNotification(
              languageData?.document_downloaded || 'Document downloaded successfully.'
            );
            setTimeout(() => {
              pendingOperations.current.delete(`success_${operationKey}`);
            }, 100);
          }
        } else {
          showWarningNotification(
            languageData?.no_documents_found || 'No documents found for the selected type.'
          );
        }
      } catch (error) {
        console.error('Error processing PDF:', error);
        showErrorNotification(
          languageData?.pdf_processing_error || 'Failed to process PDF documents. Please try again.'
        );
      } finally {
        setDownloadingDocs(prev => {
          const newSet = new Set(prev);
          newSet.delete(operationKey);
          return newSet;
        });
      }
    },
    onError: (error, variables) => {
      console.error('Error fetching document:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : languageData?.document_fetch_error || 'Failed to fetch document. Please try again.';
      showErrorNotification(errorMessage);
      const operationKey = `${variables.type}_${variables.docType}`;
      setDownloadingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationKey);
        return newSet;
      });
    }
  });

  const allDocumentQueries = useQueries({
    queries: documentConfigs.map((config) => ({
      queryKey: ['downloadAll', config.type, config.docType, downloadParams],
      queryFn: config.fetchFn,
      enabled: downloadingAll && config.enabled,
      retry: 1,
      staleTime: 0,
    }))
  });

  const handleDocumentClick = useCallback(async (documentType: DocumentType, docTypeName: string) => {
    const mappedDocType = DocumentDownloaderService.getDocumentTypeMapping(docTypeName);
    const mappedTransType = DocumentDownloaderService.getTransTypeMapping(docTypeName);

    if (!mappedDocType) {
      console.warn(`No mapping found for document type: ${docTypeName}`);
      const message = languageData?.document_type_not_found
        ? languageData.document_type_not_found.replace('${docTypeName}', docTypeName)
        : `Document type "${docTypeName}" is not supported.`;
      showWarningNotification(message);
      return;
    }

    const downloadKey = `${documentType}_${mappedDocType}`;
    if (pendingOperations.current.has(downloadKey)) return;
    pendingOperations.current.add(downloadKey);
    setDownloadingDocs(prev => new Set(prev).add(downloadKey));

    try {
      await documentMutation.mutateAsync({
        type: documentType,
        docType: mappedDocType,
        transType: mappedTransType,
      });
    } catch (error) {
      console.error('Document download failed:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : languageData?.document_download_error || 'Document download failed. Please try again.';
      showErrorNotification(errorMessage);
      setDownloadingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadKey);
        return newSet;
      });
    } finally {
      setTimeout(() => {
        pendingOperations.current.delete(downloadKey);
      }, 1000);
    }
  }, [documentMutation, languageData, showWarningNotification, showErrorNotification]);

  const handleDownloadAll = useCallback(async () => {
    if (downloadAllRef.current || downloadingAll) return;
    downloadAllRef.current = true;
    setDownloadingAll(true);

    try {
      const results = await Promise.allSettled(
        allDocumentQueries.map(query => query.refetch())
      );

      const allDocuments: Array<{ fileName: string; model: string }> = [];
      let errorCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          const docs = result.value.data as DocumentData;
          const config = documentConfigs[index];
          const docsWithFolder = DocumentDownloaderService.prepareDocumentsForZip(docs, config.type);
          allDocuments.push(...docsWithFolder);
        } else if (result.status === 'rejected') {
          errorCount++;
          console.error(`Failed to fetch documents for ${documentConfigs[index].type}:`, result.reason);
        }
      });

      if (allDocuments.length > 0) {
        await processPDFs(allDocuments, {
          format: "zip",
          zipFileName: "all_documents.zip",
          autoDownload: true,
        });

        showSuccessNotification(
          languageData?.all_documents_downloaded || 'All documents downloaded successfully.'
        );

        if (errorCount > 0) {
          setTimeout(() => {
            const warningMessage = languageData?.partial_download_warning
              ? languageData.partial_download_warning.replace('${errorCount}', errorCount.toString())
              : `Some documents (${errorCount}) could not be downloaded. Downloaded available documents successfully.`;
            showWarningNotification(warningMessage);
          }, 500);
        }
      } else {
        console.warn('No documents available for download');
        showWarningNotification(
          languageData?.no_documents_available || 'No documents are available for download at this time.'
        );
      }
    } catch (error) {
      console.error("Error downloading all documents:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : languageData?.download_all_error || 'Failed to download documents. Please try again.';
      showErrorNotification(errorMessage);
    } finally {
      setDownloadingAll(false);
      downloadAllRef.current = false;
    }
  }, [allDocumentQueries, documentConfigs, processPDFs, languageData, showSuccessNotification, showErrorNotification, showWarningNotification]);

  const isAnyQueryLoading = allDocumentQueries.some(query => query.isFetching);
  const isDownloadDisabled = downloadingAll || isAnyQueryLoading || downloadAllRef.current;

  return {
    downloadingDocs,
    downloadingAll,
    isDownloadDisabled,
    handleDocumentClick,
    handleDownloadAll,
    isProcessing: documentMutation.isPending,
    hasDocuments: documentConfigs.length > 0,
  };
};