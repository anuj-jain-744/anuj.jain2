import React from 'react';
import style from './PolicyRelatedDocuments.module.scss';
import pdf from 'assets/PolicyDocuments/pdf.svg';

interface DocumentSectionProps {
  title: string;
  documents: string[];
  onDocumentClick: (documentName: string) => void;
  downloadingDocs: Set<string>;
  isProcessing: boolean;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  title,
  documents,
  onDocumentClick,
  downloadingDocs,
  isProcessing
}) => {
  return (
    <div className={style.policyFrameContentsInnerCol}>
      <div className={style.policyFrameContentsInnerColTitleText}>{title}</div>
      <div className={style.policyFrameContentsInnerColValue}>
        {documents.map((docName, index) => {
          const isDownloading = Array.from(downloadingDocs).some(key =>
            key.includes(docName.toLowerCase().replace(/\s+/g, '_'))
          );

          return (
            <div
              key={docName + index}
              className={style.policyFrameContentsInnerColValueText1}
              onClick={() => !isDownloading && !isProcessing && onDocumentClick(docName)}
              role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  !isDownloading && !isProcessing && onDocumentClick(docName);
                }
              }}
            >
              <img src={pdf} alt="pdf icon" />
              <span className={style.policyFrameContentsInnerColValueText1Val}>
                {docName}
                {isDownloading && <span>...</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentSection;