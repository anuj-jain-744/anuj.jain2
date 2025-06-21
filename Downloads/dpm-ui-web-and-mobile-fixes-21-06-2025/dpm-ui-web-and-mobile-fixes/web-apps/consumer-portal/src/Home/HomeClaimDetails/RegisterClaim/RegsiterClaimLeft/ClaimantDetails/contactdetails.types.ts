export interface ContactDetailsProps extends IContactDetails {
    languageData: LanguageData;
    mobilenumData: string;
}
export interface ICompensationObjFactory {
    isIBan: string;
    isMobilenum: string;
    isEmailId: string;
    [key: string]: string;
}
export interface FileData {
    docType: string;
    fileName: string;
    fileExtension: string;
    docFile: string;
}
export interface IContactDetails {
    changeHandler: (
      name: string,
      isIBAN: boolean,
      value?: string,
      bankName?: string,
      iBANFiles?: (FileData | null)[]
    ) => void;
    type?: string;
    isOthersCase?: number;
  }