import React from "react";
import ThemeSelect from "components/FormInput/ThemeSelect";
import ThemeTextbox from "components/FormInput/ThemeTextbox";
import ThemeTextarea from "components/FormInput/ThemeTextarea";
import ThemeButton from "components/ThemeButton";
import ThemeSwitch from "components/FormInput/ThemeSwitch";
import { UploadDoc } from "components/UploadDoc";
import CheckboxWithLabel from "components/CheckBox";

import {
  checkPhoneNumberStarts,
  checkNationalIdFormat,
  iqmaIdNationalIdValidationOnBlur,
  refNoValidationOnBlur,
  claimIdValidationOnBlur,
} from "@dpm/shared-module";
import { isValidFilename } from "components/UploadDoc/DragNDrop";
import { getFileType } from "../../utils/getFileType";
import { fieldValidationProps, formFieldData } from ".";

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

  handleFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    reset?: boolean
  ) => void,
  checkIsbuttonDisabled: () => boolean,
  upLoadLabels?: { [key: string]: string },
  inputError?: { [key: string]: string },
  setInputErrors?: any,
  setValidated?: (val: boolean) => void,
  setDragFiles?: (files: any) => void,
  dragFiles?: any
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (isBlur) {
      switch (val) {
        case "shouldStart5":
          return checkPhoneNumberStarts(inputVal);
        case "ownerID":
          return !iqmaIdNationalIdValidationOnBlur(inputVal);
        case "RefNoClaimID":
          return inputVal.includes("-")
            ? !claimIdValidationOnBlur(inputVal)
            : refNoValidationOnBlur(inputVal);
        case "nameValid":
          return inputVal.match(/^[a-zA-Z\s]+$/);
        case "req10Digits":
          return checkNationalIdFormat(inputVal);
        case "iqamaValidation":
          return checkNationalIdFormat(inputVal, true);
        default:
          return true;
      }
    }

    switch (val) {
      case "ownerID":
        return !iqmaIdNationalIdValidationOnBlur(inputVal);
      case "RefNoClaimID":
        return inputVal.includes("-")
          ? !claimIdValidationOnBlur(inputVal)
          : refNoValidationOnBlur(inputVal);
      case "shouldStart5":
        return checkPhoneNumberStarts(inputVal);
      case "emailValid":
        return inputVal.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      case "nameValid":
        return inputVal.match(/^[a-zA-Z\s]+$/);
      case "file_extensions":
        return Array.from(inputFiles).every((file: any) =>
          validTypes.includes(getFileType(file.base64))
        );
      case "max_filesize":
        return Array.from(inputFiles).every((file: any) => {
          const maxMB = fieldValidation["max_filesize"]?.max ?? 0;
          return file.size <= maxMB * 1024 * 1024;
        });
      case "isValidFileName":
        return Array.from(inputFiles).every((file: any) =>
          isValidFilename(file.name)
        );
      case "req10Digits":
        return checkNationalIdFormat(inputVal);
      case "dependable_are_you_an_existing_customer":
        return formInput["are_you_an_existing_customer"];
      case "iqamaValidation":
        return checkNationalIdFormat(inputVal, true);
      default:
        return false;
    }
  };

  const errorValidation = (e: any) => {
    if (e.target.type !== "file") handleFieldChange(e);
    const inputValue = e.target.value;
    const inputFiles = e.target.files;
    let validations: string[] = [];
    if (inputProps?.field_validation)
      validations = Object.keys(inputProps.field_validation).filter(
        (val) => val !== "required"
      );

    const getMessage = (val: string) =>
      inputProps?.field_validation?.[val]?.message ?? "";
    if (inputValue === "") {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: inputProps?.field_validation?.required?.message ?? "",
      }));
      return;
    }

    validations.some((val) => {
      const flag = callFunction(
        val,
        inputValue,
        inputProps.field_validation!,
        inputProps.field_description,
        inputFiles
      );
      if (!flag && setValidated) {
        setInputErrors((error: { [key: string]: string }) => ({
          ...error,
          [inputProps.field_name]: getMessage(val),
        }));
        handleFieldChange(e, true);
        setValidated(false);
        return true;
      } else if (setValidated) {
        setInputErrors((error: { [key: string]: string }) => ({
          ...error,
          [inputProps.field_name]: "",
        }));
        setValidated(true);
        if (e.target.type === "file") handleFieldChange(e);
      }
    });
  };

  const errorBlurValidation = (e: any) => {
    if (e.target.type !== "file") handleFieldChange(e);
    const inputValue = e.target.value;
    const inputFiles = e.target.files;
    let validations: string[] = [];
    if (inputProps?.field_validation)
      validations = Object.keys(inputProps.field_validation).filter(
        (val) => val !== "required"
      );

    const getMessage = (val: string) =>
      inputProps?.field_validation?.[val]?.message ?? "";
    if (inputValue === "") {
      setInputErrors((error: { [key: string]: string }) => ({
        ...error,
        [inputProps?.field_name]: inputProps?.field_validation?.required?.message ?? "",
      }));
      return;
    }

    validations.some((val) => {
      const flag = callFunction(
        val,
        inputValue,
        inputProps.field_validation!,
        inputFiles,
        true
      );

      if (!flag && setValidated) {
        setInputErrors((error: { [key: string]: string }) => ({
          ...error,
          [inputProps.field_name]: getMessage(val),
        }));
        handleFieldChange(e, true);
        setValidated(false);
        return true;
      } else if (setValidated) {
        setInputErrors((error: { [key: string]: string }) => ({
          ...error,
          [inputProps.field_name]: "",
        }));
        setValidated(true);
        if (e.target.type === "file") handleFieldChange(e);
      }
    });
  };

  const fieldOptions = getFieldOptions(inputProps?.field_options);

  switch (fieldType) {
    case "radios":
      return (
        <div className="radio-input">
          {inputProps?.field_title && (
            <p className="field-label walaa-medium-500">
              {inputProps.field_title}
            </p>
          )}
          <ThemeSwitch
            isChecked={formInput[inputProps?.field_name] ?? false}
            classes={""}
            onChangehandler={handleFieldChange}
            fieldName={inputProps.field_name}
            isRequired={inputProps.field_required}
          />
        </div>
      );
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
          errorMessage={inputError?.[inputProps?.field_name] ?? ""}
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
          onChangehandler={handleFieldChange}
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

    case "checkbox":
      return (
        <CheckboxWithLabel
          id={inputProps?.field_name}
          name={inputProps?.field_name}
          label={inputProps?.field_description}
          checked={formInput[inputProps?.field_name] ?? false}
          onChange={handleFieldChange}
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
