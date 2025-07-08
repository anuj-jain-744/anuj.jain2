import React from 'react';
import { Button } from "react-bootstrap";
import UploadBlue from 'assets/Claims/UploadBlue.svg';
import { LanguageData } from 'types/languageData';

interface UploadButtonProps {
  language: LanguageData;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ language, fileInputRef, handleFileChange }) => {
    
  return (
    <div className="walaa-medium-500 position-relative content-right">
      <Button className='upload-white btn-outline-primary' title="Upload Document">
        <img src={UploadBlue} alt="Upload icon" /> {language?.upload_docs}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
          onChange={handleFileChange}
          className="position-absolute input-hidden"
          data-testid="file-input"
        />
      </Button>
    </div>
  );
};

export default UploadButton;