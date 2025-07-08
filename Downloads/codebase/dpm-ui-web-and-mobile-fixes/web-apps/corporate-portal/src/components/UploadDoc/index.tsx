import React, {
  useRef,
  useState,
} from "react";
import { Card } from "react-bootstrap";
import "./index.scss";
import DragNdrop from "./DragNDrop";
import { formFieldData } from "pages/ContactWalaa";
import InfoImg from "assets/contactWalaa/Info_grey.svg"

interface FieldValidation {
  required?: {
    message: string;
  };
  max_filesize?: {
    max: number;
    message: string;
  },
  file_extensions?: {
    message: string;
  }
}
interface attachmentProps {
  field_name: string,
  field_title: string,
  field_type: string,
  field_required: boolean,
  field_placeholder: string,
  field_additional_info: string,
  field_validation: FieldValidation
}

interface Props {
  onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  attachedFiles: any;
  upLoadLabels: any;
  attachmentData: formFieldData;
  errorMessage?: string;
  setDragFiles: (files: any) => void;
}

export const UploadDoc: React.FC<Props> = ({ upLoadLabels, attachedFiles, attachmentData, name, onChangehandler, errorMessage , setDragFiles }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const language = attachmentData;
  return (
    <div className="corporate-register-contact">
      <Card className="corporate-register-contact-card register-row-spacing-top register-row-spacing-bottom">
        <Card.Body className="p-0">
          <div className="flex flex-col">
            {/* HTML Start */}
            <div className="attechment">
              <div className="flex flex-col">
                <div className="register-contact-title walaa-medium-500">
                  {language?.field_title}{language?.field_required && <span> *</span>}
                </div>
                <DragNdrop 
                attachedFiles={attachedFiles} 
                name={name} 
                upLoadLabels={upLoadLabels} 
                attachmentData={attachmentData} 
                onChangehandler={onChangehandler}
                setDragFiles={setDragFiles}
                 />
                <span className="info_row">
                  <img src={InfoImg}/> 
                 <p className="walaa-regular-400 upldmsg">
                  {language?.field_additional_info}
                </p>
                </span>
              
                {errorMessage && <p className="attach_error">{errorMessage}</p>}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
