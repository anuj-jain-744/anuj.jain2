import React from "react";
import "./index.scss";
import { IconsSet } from "../../utils/icons";
import Download from '@mui/icons-material/FileDownloadOutlined';


interface DownloadPdfProps {
  label: string;
  url: string;
  handleNavigate: (url: string) => void;
  
}

export const DownloadPdfWidget: React.FC<DownloadPdfProps> = ({ label, url, handleNavigate }) => {
  const extension = url.split('.').pop()?.toLowerCase() || 'pdf'; 
  return (
    <div className="attachment-wrapper" onClick={() => handleNavigate(url)} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNavigate(url);
      }
    }}>
      <img 
        src={IconsSet[extension] || IconsSet.pdf} 
        alt={ label } 
        className="pdf-icon" 
      />
      <div className="text-lable">{label}</div>
      <Download className="download-icon" />
    </div>
  );
};