import React from 'react';
import { openPdfInNewTab } from 'utils/policyDocuments';
import style from './PolicyRelatedDocuments.module.scss';
import pdf from 'assets/PolicyDocuments/pdf.svg';

interface DocumentSectionProps {
  title: string;
  documents: DocumentSection[];
}

interface DocumentSection {
  id: string;
  name: string;
  document: string;
}

const handleDownload = async (pdfdDoc: any, fileName: string) => {
  try {
    openPdfInNewTab(pdfdDoc, fileName);
  } catch (error) {
    console.error('Error opening PDF:', error);
  }
};

const DocumentSection: React.FC<DocumentSectionProps> = ({ title, documents: pdfDocuments }) => (
  <div className={style.policyFrameContentsInnerCol}>
    <div className={style.policyFrameContentsInnerColTitleText}>{title}</div>
    <div className={style.policyFrameContentsInnerColValue}>
      {pdfDocuments.map(doc => (
        <div key={doc.id} className={style.policyFrameContentsInnerColValueText1}>
          <img src={pdf} alt="pdf icon" />
          <div 
            className={style.policyFrameContentsInnerColValueText1Val} 
            onClick={() => handleDownload(doc.document, doc.name)}
          >
            {doc.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentSection;