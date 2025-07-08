import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import Frame from "../../assets/Claims/Frame.svg";
import ClaimEstimateDocumentUpload from "./ClaimEstimateDocumentUpload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { convertFileToBase64 } from "utils/FileToBase64";
import { FILE_SIZE_LIMIT } from "constant";
import { getCurrencySymbol } from "@app-shell/utils/common";
import { TOAST_AUTOCLOSE_TIMER, useApiCall } from "@dpm/shared-module";
import { getClaimDocuments } from "utils/getClaimDocuments";
import { CMSDocument, CMSRuleSection } from "types/common";

interface AddClaimEstimateProps {
    languageData?: { [key: string]: string };
    causeOfLossOptions: { id: number | string; description: string; siLimit?: number }[]; // for dropdown only
    addEstimateValues: [];
}

interface ClaimEstimate {
    causeOfLossId: number;
    estimateAmount: string;
    description?: string;
    policeReport?: File | null;
    stolenItemList?: File | null;
    purchaseInvoice?: File | null;
    documents?: {
        docType: string;
        fileName: string;
        docFile: string;
    }[];
    title?: string; // for display in header
    siLimit?: number; // for validation
    estimateReference?: number; // index tracking
    visibleDocs?: CMSDocument[]; // to show appropriate upload fields
}

const AddClaimEstimate: React.FC<AddClaimEstimateProps> = ({
    languageData,
    causeOfLossOptions,
    addEstimateValues,
}) => {
    const [estimates, setEstimates] = useState<ClaimEstimate[]>([]);

    const [fileErrors, setFileErrors] = useState<string[]>([""]);
    const [amountErrors, setAmountErrors] = useState<string[]>([""]);
    const [causeOfLossErrors, setCauseOfLossErrors] = useState<string | null>(null);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const {
        makeApiCall: getDynamicUploadConfig,
        data: dynamicUploadConfig,
    } = useApiCall<CMSRuleSection, unknown>(1, "dynamic_upload_documents", "get")

    useEffect(() => {
        const dynamic_document_list = dynamicUploadConfig?.register_claim_dynamic_upload_section1?.home;
        if (!Array.isArray(dynamic_document_list)) {
          console.log("[AddClaimEstimate]  No document rules found in config");
          return;
        }
       
        const lastEstimate = estimates[estimates.length - 1];
        if (!lastEstimate) return;
       
        const lossType = String(lastEstimate.causeOfLossId);
        const estimateAmount = String(lastEstimate.estimateAmount || "0");
       
        const input: Record<string, string | number> = { lossType, estimateAmount };
        const matchedDocs = getClaimDocuments(dynamic_document_list, input);

        if (JSON.stringify(lastEstimate.visibleDocs) !== JSON.stringify(matchedDocs)) {
          const updated = [...estimates];
          updated[updated.length - 1].visibleDocs = matchedDocs;
          setEstimates(updated);
        }
      }, [estimates, dynamicUploadConfig, ]);

      useEffect(() => {
        getDynamicUploadConfig();
      }, []);
      
      const handleAddEstimate = () => {
        setEstimates([
            ...estimates,
            { causeOfLossId: 0, estimateAmount: "", description: "", policeReport: null, stolenItemList: null, purchaseInvoice: null },
        ]);

        setFileErrors([...fileErrors, ""]);
        setAmountErrors([...amountErrors, ""]);
        setActiveKey(estimates.length.toString());

    };

    const handleRemoveFile = (index: number, fileType: keyof ClaimEstimate) => {
        const updatedEstimates = [...estimates];
        updatedEstimates[index][fileType] = null;
        // Mapping only file-related types
        const docTypeMap: Record<"policeReport" | "stolenItemList" | "purchaseInvoice", string | undefined> = {
            policeReport: languageData?.police_report,
            stolenItemList: languageData?.stolen_item_list,
            purchaseInvoice: languageData?.purchase_invoice,
        };

        const docType = docTypeMap[fileType as "policeReport" | "stolenItemList" | "purchaseInvoice"];

        updatedEstimates[index].documents = updatedEstimates[index].documents?.filter(
            (doc) => doc.docType !== docType
        );
        setEstimates(updatedEstimates);
    };

    const handleDeleteEstimate = (index: number) => {
        const updatedEstimates = [...estimates];
        updatedEstimates.splice(index, 1); // remove the estimate from the list
        setEstimates(updatedEstimates);
       
        const updatedFileErrors = [...fileErrors];
        updatedFileErrors.splice(index, 1);
        setFileErrors(updatedFileErrors);
       
        const updatedAmountErrors = [...amountErrors];
        updatedAmountErrors.splice(index, 1);
        setAmountErrors(updatedAmountErrors);
       
        setActiveKey(null);
        addEstimateValues(updatedEstimates); // ensure parent receives updated list
      };

    const handleFieldChange = (index: number, field: keyof ClaimEstimate, value: any) => {
        const updatedEstimates = [...estimates];
        if (field === "causeOfLossId") {
            const isSelected = updatedEstimates.findIndex(item => Number(item.causeOfLossId) === Number(value));
            if (isSelected !== -1) {
                const data = updatedEstimates[isSelected];
                setCauseOfLossErrors(languageData?.estimated_cause_of_loss.replace('<<dynamic>>', data.title));
                return;
            }
        }
        const updatedAmountErrors = [...amountErrors];
        if (field === "causeOfLossId") {
            const selectedCoverage = causeOfLossOptions.find(item => Number(item.id) === Number(value));
            const siLimit = selectedCoverage?.siLimit || 0;
           
            const currentAmount = updatedEstimates[index].estimateAmount || "0";
            const input: Record<string, string | number> = { lossType: value, estimateAmount: currentAmount };
            const dynamic_document_list = dynamicUploadConfig?.register_claim_dynamic_upload_section1?.home;
        
            const dynamicDocs = getClaimDocuments(dynamic_document_list, input);
           
            updatedEstimates[index].causeOfLossId = Number(value);
            updatedEstimates[index]['title'] = selectedCoverage?.description;
            updatedEstimates[index]['siLimit'] = Number(selectedCoverage?.siLimit);
            updatedEstimates[index]['estimateReference'] = Number(index);
            updatedEstimates[index][field] = value;
            updatedEstimates[index].visibleDocs = dynamicDocs;


            // validate existing estimateAmount
            const amount = Number(updatedEstimates[index].estimateAmount);
            if (amount > siLimit) {
                updatedAmountErrors[index] = `${languageData?.estimated_loss_amount_should_not_exceed} ${siLimit}`;
                updatedEstimates[index].estimateAmount = ""; // reset input
            } else {
                updatedAmountErrors[index] = "";
            }
        }

        if (field === "estimateAmount") {
            const cleaned = value?.toString().trim().replace(/,/g, "");
            const numericValue = parseFloat(cleaned);

            if (!cleaned) {
                updatedAmountErrors[index] = languageData?.required_error || "This field is required";
                updatedEstimates[index][field] = "";
            } else {
                updatedEstimates[index][field] = cleaned;
                const selectedCoverage = causeOfLossOptions.find(item => Number(item.id) === Number(updatedEstimates[index].causeOfLossId));
                const siLimit = selectedCoverage?.siLimit || 0;

                if (isNaN(numericValue)) {
                    updatedAmountErrors[index] = languageData?.required_error || "This field is required";
                } else if (numericValue > siLimit) {
                    updatedAmountErrors[index] = `${languageData?.estimated_loss_amount_should_not_exceed} ${siLimit}`;
                } else {
                    updatedAmountErrors[index] = "";
                }
            }
        }

        if (field === "description") {
            updatedEstimates[index][field] = value;
        }

        setEstimates(updatedEstimates);
        addEstimateValues(updatedEstimates);
        setAmountErrors(updatedAmountErrors);
        setCauseOfLossErrors(null);
    };

    const handleFileChange = async (index: number, fileType: keyof ClaimEstimate, file: File | null) => {
        if (file) {
            const allowedTypes = [
                "image/jpeg", "image/jpg", "image/png", "application/pdf",
                "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];

            const fileSizeMB = file.size / 1024 / 1024;
            if (!allowedTypes.includes(file.type) || fileSizeMB > FILE_SIZE_LIMIT) {
                const errors = [...fileErrors];
                errors[index] = languageData?.invalid_file_type;
                setFileErrors(errors);
                return;
            }

            const base64Content = await convertFileToBase64(file);
            const updatedEstimates = [...estimates];
            updatedEstimates[index][fileType] = file;

            // Simplified docType logic
            const docTypeMap: Record<"policeReport" | "stolenItemList" | "purchaseInvoice", string | undefined> = {
                policeReport: languageData?.police_report,
                stolenItemList: languageData?.stolen_item_list,
                purchaseInvoice: languageData?.purchase_invoice,
            };

            const docType = docTypeMap[fileType as "policeReport" | "stolenItemList" | "purchaseInvoice"];
            const existingDocs = updatedEstimates[index].documents || [];
            const updatedDocs = existingDocs.filter(doc => doc.docType !== docType);

            updatedDocs.push({
                fileName: file.name,
                docFile: base64Content,
            });

            updatedEstimates[index].documents = updatedDocs;
            setEstimates(updatedEstimates);
            const errors = [...fileErrors];
            errors[index] = "";
            setFileErrors(errors);
        }

    };

    // check the estimated amount added or not which selecting cause of loss for enable another estimate
    const checkCauseOfLossSelected = () => {
        const data = estimates.length === 0 || estimates.every((estimate) => Number(estimate.estimateAmount) > 0);
        return !data;
    }

    return (
        <>
      
        <div className="add-claim-estimate">
            <ToastContainer position="top-center" autoClose={TOAST_AUTOCLOSE_TIMER || false} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Accordion activeKey={activeKey ?? undefined} onSelect={(key) => setActiveKey(key)}>
                {estimates.map((estimate, index) => {
                    const estimatedValues = estimates.filter(item => item.estimateReference === index);
                    return <Accordion.Item eventKey={index.toString()} key={"estimate_"+index} className="estimate-accordion-item">
                        <Accordion.Header>
                            <div className="accordion-header-content">
                                <div className="accordion-title-text">{`Estimate ${index + 1}`}</div>
                                <img src={Frame} alt="Delete" className="delete-icon" onClick={(e) => { e.stopPropagation(); handleDeleteEstimate(index); }} role="button" />
                                {(activeKey !== index.toString() && estimatedValues?.length && Number(estimatedValues[0]?.estimateAmount) > 0) ? <div className="accordion-header-info">
                                    <span>{languageData?.cause_of_loss}:</span>
                                    <span className="estimate-value">{estimatedValues[0]?.title}</span>
                                    <span>|</span>
                                    <span>{getCurrencySymbol(languageData?.estimated_loss_amount)}:</span>
                                    <span className="estimate-value">{estimatedValues[0]?.estimateAmount}</span>
                                </div> : ''}
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="estimate-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">{languageData?.cause_of_loss} <span className="text-danger">*</span></label>
                                        <select
                                            className="form-select"
                                            value={estimate.causeOfLossId}
                                            onChange={(e) => handleFieldChange(index, "causeOfLossId", String(e.target.value))}
                                        >
                                            <option disabled={estimate.causeOfLossId} value="">-- {languageData?.select_label} --</option>
                                            {causeOfLossOptions.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.description}
                                                </option>
                                            ))}
                                        </select>
                                        {causeOfLossErrors && (
                                            <div className="file-error-message">{causeOfLossErrors}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">{getCurrencySymbol(languageData?.estimated_loss_amount)} <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            min={1}
                                            className="form-input"
                                            disabled={!estimate.causeOfLossId}
                                            value={estimate.estimateAmount}
                                            onBlur={(e) => {
                                                const raw = e.target.value;
                                                const val = parseFloat(raw);
                                                if (raw.trim() === "") {
                                                    // Explicitly trigger required error
                                                    handleFieldChange(index, "estimateAmount", "");
                                                } else if (!isNaN(val)) {
                                                    handleFieldChange(index, "estimateAmount", val.toFixed(2));
                                                }
                                            }}
                                            onChange={(e) => handleFieldChange(index, "estimateAmount", e.target.value)}
                                            placeholder={languageData?.enter_estimate_amount}
                                        />
                                        {amountErrors[index] && (
                                            <div className="file-error-message" data-testid={`amount-error-${index}`}>
                                               {getCurrencySymbol(amountErrors[index])}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="form-label">{languageData?.description_of_loss}</label>
                                        <textarea
                                            className="form-textarea"
                                            rows={3}
                                            disabled={!estimate.causeOfLossId}
                                            value={estimate.description}
                                            onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="upload-documents-section">
                                <div className="upload-inner-container">
                                    <div className="upload-header">{languageData?.upload_supporting_documents}</div>
                                    <div className="upload-subtitle">
                                        {languageData?.supported_file_type}
                                    </div>

                                    <ClaimEstimateDocumentUpload
                                        index={index}
                                        estimate={estimate}
                                        handleFileChange={handleFileChange}
                                        fileError={fileErrors[index]}
                                        handleRemoveFile={handleRemoveFile}
                                        languageData={languageData}
                                    />
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>

                })}
            </Accordion>
           
        </div>
        <div className="add-est-btn">
                <ThemeButton
                    title={estimates.length ? languageData?.add_another_estimate : languageData?.add_estimate}
                    variant="outline"
                    classes="add-estimate-button-content"
                    isDisabled={checkCauseOfLossSelected()}
                    icon={true}
                    iconName="AddIcon"
                    iconRight={false}
                    iconLeft={true} 
                    onClickhandler={handleAddEstimate} />
            </div>
        </>

    );

};

export default AddClaimEstimate;
