import { useRef } from "react";
import Upload from "assets/IbanValidation/Upload.svg";
import Cancel from "assets/IbanValidation/Cancel.svg";
import "./index.scss";

interface ClaimEstimateDocumentUploadProps {
    index: number;
    estimate: { [key: string]: string };
    handleFileChange: (index: number, field: string, file: File | null) => void;
    fileError: string;
    languageData?: { [key: string]: string };
}

const DocumentRow = ({
    title,
    required,
    uploadedFile,
    onFileChange,
    onRemoveFile,
    languageData
}: {

    title: string;
    required?: boolean;
    uploadedFile: File | null;
    onFileChange: (file: File) => void;
    onRemoveFile: () => void;
    languageData?: { [key: string]: string };
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
                            <div className="upload-icon-wrapper" onClick={() => fileInputRef.current?.click()}>
                                <img src={Upload} alt="Upload" />
                                <span>Upload</span>
                            </div>
                            <input
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
                            <span className="remove-file-icon" onClick={onRemoveFile}>
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
    fileError,
    languageData,

}) => {

    return (
        <div className="claim-estimate-upload-container">
            <DocumentRow
                title={languageData?.police_report}
                uploadedFile={estimate.policeReport}
                onFileChange={(file) => handleFileChange(index, "policeReport", file)}
                onRemoveFile={() => handleFileChange(index, "policeReport", null)}
                languageData = {languageData}
            />
            <DocumentRow
                title={languageData?.stolen_item_list}
                uploadedFile={estimate.stolenItemList}
                onFileChange={(file) => handleFileChange(index, "stolenItemList", file)}
                onRemoveFile={() => handleFileChange(index, "stolenItemList", null)}
                languageData = {languageData}
            />
            <DocumentRow
                title={languageData?.purchase_invoice}
                uploadedFile={estimate.purchaseInvoice}
                onFileChange={(file) => handleFileChange(index, "purchaseInvoice", file)}
                onRemoveFile={() => handleFileChange(index, "purchaseInvoice", null)}
                languageData = {languageData}
            />

            {fileError && <div className="file-error-message">{fileError}</div>}
        </div>

    );

};

export default ClaimEstimateDocumentUpload;

