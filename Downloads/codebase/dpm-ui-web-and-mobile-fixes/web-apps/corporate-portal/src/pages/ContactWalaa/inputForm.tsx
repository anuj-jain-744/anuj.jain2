import ThemeSelect from "components/FormInput/ThemeSelect";
import { fieldValidationProps, formFieldData } from ".";
import ThemeTextbox from "components/FormInput/ThemeTextbox";
import ThemeTextarea from "components/FormInput/ThemeTextarea";
import ThemeButton from "components/ThemeButton";
import { UploadDoc } from "components/UploadDoc";
import {
  checkPhoneNumberStarts,
  checkNationalIdFormat,
  iqmaIdNationalIdValidation,
  iqmaIdNationalIdValidationOnBlur,
  refNoValidationOnBlur,
  claimIdValidationOnBlur,
  isValidEmail,
} from "@dpm/shared-module";
import { isValidFilename } from "components/UploadDoc/DragNDrop";
import { getFileType } from "../../utils/getFileType";

const getFieldOptions = (options: { [key: string]: string } | null) => {
  return options
    ? Object.keys(options).map((val: string) => ({
        key: val,
        value: options[val],
      }))
    : [];
};

export const getInputField = (
  fieldType: string,
  inputProps: formFieldData,
  formInput: { [key: string]: any },
  handleFieldChange: {
    (e: any, reset?: boolean): void;
    (event: React.ChangeEvent<HTMLSelectElement>, reset?: boolean): void;
  },
  checkIsbuttonDisabled: () => boolean,
  upLoadLabels?: { [key: string]: string },
  inputError?: { [key: string]: string },
  setInputErrors?: any,
  setValidated?: (val: boolean) => void,
  setDragFiles?: (files: any) => void,
  sitedata?: any,
) => {
  const callFunction = (
    val: string,
    inputVal: string,
    fieldValidation: fieldValidationProps,
    inputFiles?: any,
    isBlur?: boolean
  ) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //To enable docx upload
    ];
    if (isBlur) {
      switch (val) {
        case "shouldStart5":
          return checkPhoneNumberStarts(inputVal);
        case "ownerID":
          return iqmaIdNationalIdValidation(inputVal);
        case "RefNoClaimID":
          if (inputVal.includes("-")) {
            return !claimIdValidationOnBlur(inputVal);
          } else {
            return refNoValidationOnBlur(inputVal);
          }
        case "emailValid":
          return isValidEmail(inputVal);
        case "nameValid":
          return inputVal.match(/^[a-zA-Z\s]+$/);
        case "file_extensions":
            const newFiles = Array.from(inputFiles);
            let flag = true;
            newFiles.forEach((file: any) => {
              if (!validTypes.includes(file.type)) {
                flag = false;
                return false;
              }
            });
            return flag;
        case "max_filesize":
            let maxFlag = true;
            const maxFiles = Array.from(inputFiles);
            maxFiles.forEach((file: any) => {
              const filesize = fieldValidation["max_filesize"]?.max ?? 0;
              maxFlag = file.size <= filesize * 1024 * 1024;
              return maxFlag;
            });
            return maxFlag;
        case "isValidFileName":
            const validFileNAmes = Array.from(inputFiles);
            let fileNameFlag = true;
            validFileNAmes.forEach((file: any) => {
              fileNameFlag = isValidFilename(file.name);
              return fileNameFlag;
            });
            return fileNameFlag;

        case "req10Digits":
          return checkNationalIdFormat(inputVal);
        case "iqamaValidation":
          return checkNationalIdFormat(inputVal);
          
      case "nationalIDValidation":
          return iqmaIdNationalIdValidationOnBlur(inputVal);
      case "passportnumberValid":
      return inputVal.match(/^\d{10}$/);
      default:
        return true;
      }
    }
    switch (val) {
      case "ownerID":
      case "iqamaValidation":
        return !iqmaIdNationalIdValidationOnBlur(inputVal);
      case "RefNoClaimID":
        if (inputVal.includes("-")) {
          return !claimIdValidationOnBlur(inputVal);
        } else {
          return refNoValidationOnBlur(inputVal);
        }
      case "shouldStart5":
        return checkPhoneNumberStarts(inputVal);
      case "emailValid":
        return isValidEmail(inputVal);
      case "nameValid":
        return inputVal.match(/^[a-zA-Z\s]+$/);
      case "file_extensions":
        const newFiles = Array.from(inputFiles);
        let flag = true;

        newFiles.forEach((file: any) => {
          if (!validTypes.includes(getFileType(file.base64))) {
            flag = false;
            return false;
          }
        });

        return flag;
      case "max_filesize":
        let maxFlag = true;
        const maxFiles = Array.from(inputFiles);
        maxFiles.forEach((file: any) => {
          const filesize = fieldValidation["max_filesize"]?.max ?? 0;
          maxFlag = file.size <= filesize * 1024 * 1024;
          return maxFlag;
        });
        return maxFlag;
      case "isValidFileName":
        const validFileNAmes = Array.from(inputFiles);
        let fileNameFlag = true;
        validFileNAmes.forEach((file: any) => {
          fileNameFlag = isValidFilename(file.name);
          return fileNameFlag;
        });
        return fileNameFlag;
      case "req10Digits":
        return checkNationalIdFormat(inputVal);
      case "dependable_are_you_an_existing_customer":
        return formInput["are_you_an_existing_customer"];
      default:
        return false;
    }
  };

  const getMessage = (val: string) => {
    if (
      inputProps?.field_validation &&
      inputProps?.field_validation[val] &&
      inputProps?.field_validation[val]?.message
    ) {
      return inputProps?.field_validation[val]?.message ?? "";
    }
    return "";
  };

  const errorValidation = (e: any) => {
    if (e.target.type !== "file") {
      handleFieldChange(e);
    }

    const inputValue = e.target.value;
    const inputFiles = e.target.files;
    let validations: any[] = [];
    if (inputProps?.field_validation)
      validations = Object.keys(inputProps?.field_validation).filter(
        (val) => val !== "required"
      );
      
    if (inputValue === "") {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: inputProps?.field_validation?.required?.message ?? "",
      }));
      return;
    }
    if (inputFiles?.length === 0) {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: inputProps?.field_validation?.required?.message ?? "",
      }));
      return;
    }
    if (validations.length === 0) {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: "",
      }));
      return;
    }
    validations.some((val) => {
      if (inputProps?.field_validation) {
        const flag = callFunction(
          val,
          inputValue,
          inputProps?.field_validation,
          inputFiles
        );
        if (!flag && setValidated) {
          setInputErrors((error: { [key: string]: string }) => ({
            ...error,
            [inputProps?.field_name]: getMessage(val),
          }));
          handleFieldChange(e, true);
          setValidated(false);
          return true;
        } else if (setValidated) {
          setInputErrors((error: { [key: string]: string }) => ({
            ...error,
            [inputProps?.field_name]: "",
          }));
          setValidated(true);
          if (e.target.type === "file") {
            handleFieldChange(e);
          }
        }
      }
    });
  };

  const errorBlurValidation = (e: any) => {
    if (e.target.type !== "file") {
      handleFieldChange(e);
    }
    
    const inputValue = e.target.value;
    const inputFiles = e.target.files;
    let validations: any[] = [];
    if (inputProps?.field_validation)
      validations = Object.keys(inputProps?.field_validation).filter(
        (val) => val !== "required"
      );


    if (inputValue === "" ) {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: "",
      }));
    }
  };

  const fieldOptions = getFieldOptions(inputProps?.field_options);

  switch (fieldType) {
    case "select":
      return (
        <ThemeSelect
          options={fieldOptions}
          placeholder={inputProps?.field_title}
          value={formInput[inputProps?.field_name] ?? ""}
          onChangehandler={handleFieldChange}
          isRequired={inputProps?.field_required}
          fieldName={inputProps?.field_name}
          classes="select-input"
          label={inputProps?.field_title}
        />
      );
    case "textfield":
    case "tel":
    case "email":
    case "number":
      return (
        <ThemeTextbox
          type={fieldType === "textfield" ? "text" : fieldType}
          title={inputProps?.field_title}
          name={inputProps?.field_name}
          isRequired={inputProps?.field_required}
          placeholder={inputProps?.field_placeholder}
          value={formInput[inputProps?.field_name] ?? ""}
          onChangehandler={errorValidation}
          onBlurhandler={errorBlurValidation}
          errorMessage={
            inputError ? inputError[inputProps?.field_name] ?? "" : ""
          }
        />
      );
    case "textarea":
      return (
        <ThemeTextarea
          title={inputProps?.field_title}
          name={inputProps?.field_name}
          isRequired={inputProps?.field_required}
          placeholder={inputProps?.field_placeholder}
          value={formInput[inputProps?.field_name] ?? ""}
          onChangehandler={errorValidation}
          onBlurhandler={errorBlurValidation}
          errorMessage={
            inputError ? inputError[inputProps?.field_name] ?? "" : ""
          }
        />
      );
    case "webform_actions":
      return (
        <ThemeButton
          name={inputProps?.field_title}
          className=""
          disabled={checkIsbuttonDisabled()}
          type="submit"
        />
      );
    case "managed_file":
      return (
        <UploadDoc
          name={inputProps?.field_name}
          attachedFiles={formInput[inputProps?.field_name] ?? []}
          onChangehandler={errorValidation}
          upLoadLabels={upLoadLabels}
          attachmentData={inputProps}
          errorMessage={
            inputError ? inputError[inputProps?.field_name] ?? "" : ""
          }
          setDragFiles={setDragFiles}
        />
      );
    default:
      return <></>;
  }
};