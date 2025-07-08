interface EstimatedValues {
    coverageCode: string;
    coverageName: string;
    deductible: number;
    initialReserve: number;
    isSelect: number;
    siLimit: number;
}

interface FileData {
    name?: string;
    fileName?: string;
    fileExtension?: string;
    size?: number;
    base64?: string;
    docFile: string;
}

function homePayload (
    nonMotorFNOL: { claimInfo: any; subClaimInfo: any; },
    contactInfo: {mobilenumData?: string; emailData?: string; },
    fileData: FileData[] = [],
    isIbanNumValue: string = "",
    isIbanBankName: string = "",
    estimatedValues: EstimatedValues[] = [],
    claimDocuments: FileData[][] = []
) {
    const { claimInfo, subClaimInfo } = nonMotorFNOL;
    const {mobilenumData = "", emailData= "" } = contactInfo;

    const documents = fileData?.map(file => ({
        docFile: file?.docFile,
        fileName: file?.fileName
    }))

    for (const item in claimDocuments) {
        const files = claimDocuments[item];
        for (const subItem in files) {
            const subFile = files[subItem];
            documents.push({
                docFile: subFile?.docFile,
                fileName: subFile?.fileName
            });
        }
    }

    const payload = {
        "claimInfo": {
            "claimBranch": claimInfo?.claimBranch ?? '',
            "claimNo": claimInfo?.claimNo ?? '',
            "currency": claimInfo?.currency ?? '',
            "dateOfLoss": claimInfo?.dateOfLoss ?? '',
            "dateOfNotification": claimInfo?.dateOfNotification ?? '',
            "dateOfRegistration": claimInfo?.dateOfRegistration ?? '',
            "policyHolderId": claimInfo?.policyHolderId ?? '',
            "policyHolderName": claimInfo?.policyHolderName ?? '',
            "policyNumber": claimInfo?.policyNumber ?? '',
            "productName": claimInfo?.productName ?? '',
            "referenceNumber": claimInfo?.referenceNumber ?? '',
            "accidentDistrict": claimInfo?.accidentDistrict ?? '',
            "causeOfLoss": claimInfo?.causeOfLoss ?? '',
            "contactTelephone": mobilenumData ?? '',
            "lossDescription": claimInfo?.lossDescription ?? '',
            "insuredLiability": claimInfo?.insuredLiability ?? 0,
            "accidentAddress": claimInfo?.accidentAddress ?? '',
        },
        "subClaimInfo": {
            "damageObject": subClaimInfo?.damageObject ?? '',
            "nationalId": subClaimInfo?.nationalId ?? '',
            "damageType": subClaimInfo?.damageType ?? '',
            "subClaimType": subClaimInfo?.subClaimType ?? '',
            "claimant": subClaimInfo?.claimant ?? '',
            "claimOwner": subClaimInfo?.claimOwner ?? '',
            "claimantType": subClaimInfo?.claimantType ?? '',
            "smsLanguage": subClaimInfo?.smsLanguage ?? '',
            "iBAN": isIbanNumValue ?? '',
            "mobile": mobilenumData ?? '',
            "emailId": emailData ?? '',
            "damageSeverity": String(subClaimInfo?.damageSeverity),
            "coverageInfoList": estimatedValues,
            "isDocumentComplete": subClaimInfo?.isDocumentComplete ?? '',
            "possibleSalvage": subClaimInfo?.possibleSalvage ?? '',
            "possibleSubrogation": subClaimInfo?.possibleSubrogation ?? '',
            "seqNo": subClaimInfo?.seqNo ?? '',
            "subClaimCreationDate": subClaimInfo?.subClaimCreationDate ?? '',
            "documents": documents ?? [],
        }

    }
    return payload;
}

export default homePayload;