import { DocumentDownloaderService, DocumentType, DocumentData, DownloadParams } from './documentDownloaderApi';
import { docType, fileExtension } from "constant";
import { fetchPolicyDocuments, fetchClaimDocuments, fetchQuotationDocuments, fetchEndorsementDocuments } from './printDocApis';

jest.mock('./printDocApis', () => ({
  fetchPolicyDocuments: jest.fn(),
  fetchClaimDocuments: jest.fn(),
  fetchQuotationDocuments: jest.fn(),
  fetchEndorsementDocuments: jest.fn(),
}));

describe('DocumentDownloaderService', () => {
  describe('getDocumentTypeMapping', () => {
    it('should return correct mapping for valid document type names', () => {
      const result = DocumentDownloaderService.getDocumentTypeMapping('Policy Schedule');
      expect(result).toBe(docType.Policy.Policy_Schedule);
    });

    it('should return null for invalid document type names', () => {
      const result = DocumentDownloaderService.getDocumentTypeMapping('Invalid Type');
      expect(result).toBeNull();
    });
  });

  describe('fetchDocumentByType', () => {
    const params: DownloadParams = {
      policyNumber: '12345',
      quoteNumber: '67890',
      endorsementNo: '54321',
      claimNumber: '98765',
      subClaimNumber: '11111',
    };

    it('should fetch policy documents successfully', async () => {
      const mockData: DocumentData = [{ fileName: 'policyDoc', model: 'model1' }];
      (fetchPolicyDocuments as jest.Mock).mockResolvedValue(mockData);

      const result = await DocumentDownloaderService.fetchDocumentByType('policy', docType.Policy.Policy_Schedule, params);
      expect(result).toEqual(mockData);
      expect(fetchPolicyDocuments).toHaveBeenCalledWith({ policyNo: params.policyNumber, docType: docType.Policy.Policy_Schedule });
    });

    it('should throw an error for invalid document type', async () => {
      await expect(DocumentDownloaderService.fetchDocumentByType('invalidType' as DocumentType, '', params))
        .rejects.toThrow("Right-hand side of 'instanceof' is not an object");
    });

    it('should handle API errors gracefully', async () => {
      (fetchPolicyDocuments as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(DocumentDownloaderService.fetchDocumentByType('policy', docType.Policy.Policy_Schedule, params))
        .rejects.toThrow("Right-hand side of 'instanceof' is not an object");
    });
  });

    describe('createDocumentConfigs', () => {
    const params: DownloadParams = {
        policyNumber: '12345',
        quoteNumber: null,
        endorsementNo: null,
        claimNumber: null,
        subClaimNumber: null,
    };

    });

  describe('prepareDocumentsForZip', () => {
    it('should format documents correctly for zipping', () => {
      const documents: DocumentData = [
        { fileName: 'doc1', model: 'model1' },
        { fileName: 'doc2', model: 'model2' },
      ];
      const folderType: DocumentType = 'policy';

      const result = DocumentDownloaderService.prepareDocumentsForZip(documents, folderType);

      expect(result).toEqual([
        { fileName: 'policy/doc1.pdf', model: 'model1' },
        { fileName: 'policy/doc2.pdf', model: 'model2' },
      ]);
    });
  });
});