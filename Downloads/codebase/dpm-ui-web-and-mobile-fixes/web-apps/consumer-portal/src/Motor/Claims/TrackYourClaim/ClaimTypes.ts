export interface ClaimWholeInfo {
    track_your_claim: string;
    motor_claim_no: string;
    current_status: string;
    upload_the_supporting_docs: string;
    supported_file_type_doc: string;
    upload: string;
    submit_documents?: string;
    claim_status_journey?: string;
    track_another_claim: string;
    case_reference_no: string;
    owner_id_label: string;
    download_claim_documents: string;
    contact_walaa?: string;
    linkName: string;
    menuUrl: string;
    link_content: string;
}

export interface ClaimCardInfo {
    track_your_claim: string;
    motor_claim_no: string;
    current_status: string;
    upload_the_supporting_docs: string;
    supported_file_type_doc: string;
    upload: string;
    submit_documents?: string;
    track_another_claim: string;
}

export interface ClaimJourneyInfo {
    claim_status_journey?: string;
}

export interface ClaimVehicleInfo {
    case_reference_no: string;
    owner_id_label: string;
}

export interface DocDownloadInfo {
    download_claim_documents: string;
}

export interface ContactCardInfo {
    contact_walaa?: string;
    linkName: string;
    menuUrl: string;
    link_content: string;

}

export interface ClaimWholeInfoType {
    case_reference_no: string;
    owner_id_label: string;
    download_claim_documents: string;
    motor_claim_no: string;
    current_status: string;
    upload_the_supporting_docs: string;
    supported_file_type_doc: string;
    upload: string;
    track_another_claim: string;
}