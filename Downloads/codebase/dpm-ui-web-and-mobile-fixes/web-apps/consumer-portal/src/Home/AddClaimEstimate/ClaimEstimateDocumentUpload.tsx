import { useRef } from "react";
import Upload from "assets/IbanValidation/Upload.svg";
import Cancel from "assets/IbanValidation/Cancel.svg";
import "./index.scss";

interface ClaimEstimateDocumentUploadProps {
    index: number;
    estimate: { [key: string]: {visibleDocs: {
        key: string;
        value: string;
        required: boolean;
      }[]} };
    handleFileChange: (index: number, field: string, file: File | null) => void;
    handleRemoveFile: (index: number, field: string) => void;
    fileError: string;
    languageData?: { [key: string]: string };
}

interface DocumentRowProps {
    title: string;
    required?: boolean;
    uploadedFile: File | null;
    onFileChange: (file: File) => void;
    onRemoveFile: () => void;
    languageData?: { [key: string]: string };
}

const DocumentRow: React.FC<DocumentRowProps> = ({
    title,
    required,
    uploadedFile,
    onFileChange,
    onRemoveFile,
    languageData,

}) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];

            const fileSizeMB = file.size / 1024 / 1024;
            if (!allowedTypes.includes(file.type) || fileSizeMB > 5) {
                alert(languageData?.invalid_file_type);
                return;
            }
            onFileChange(file);
        }
    };

    return (
        <div className="upload-document-row">
            <div className="upload-label-section">
                <div className="document-label">
                    {title} {required && <span className="text-danger">*</span>}
                </div>
                <div className="upload-action">
                    {!uploadedFile ? (
                        <>
                            <div className="upload-icon-wrapper" onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}>
                                <img src={Upload} alt="Upload" />
                                <span>Upload</span>
                            </div>
                            <input
                                data-testid="file-input"
                                type="file"
                                ref={fileInputRef}
                                className="hidden-file-input"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                        </>
                    ) : (
                        <div className="uploaded-file-section">
                            <span className="uploaded-file-name">{uploadedFile.name}</span>
                                <span className="remove-file-icon" onClick={onRemoveFile} role="button" tabIndex={0} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        onRemoveFile();
                                    }
                                }}>
                                <img src={Cancel} alt="Remove" />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ClaimEstimateDocumentUpload: React.FC<ClaimEstimateDocumentUploadProps> = ({
    index,
    estimate,
    handleFileChange,
    handleRemoveFile,
    fileError,
    languageData,
}) => {
    const allDocFields = Array.isArray(estimate.visibleDocs) ? estimate.visibleDocs : [];

    return (
        <div className="claim-estimate-upload-container">
            {allDocFields.map(({ key, value, required }) => (
                <DocumentRow
                    key={key}
                    title={value}
                    required={required}
                    uploadedFile={estimate[key] as unknown as File | null}
                    onFileChange={(file) => handleFileChange(index, key, file)}
                    onRemoveFile={() => handleRemoveFile(index, key)}
                    languageData={languageData}
                />
            ))}
            {fileError && <div className="file-error-message">{fileError}</div>}
        </div>
    );
};

export default ClaimEstimateDocumentUpload;

