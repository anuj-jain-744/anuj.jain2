import React, { useState, useCallback, useEffect } from "react";
import { Bounce, toast,ToastContainer } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useApiCall, TOAST_AUTOCLOSE_TIMER} from "@dpm/shared-module";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { getUTCFormattedDate } from "utils/getUTCDates";
import { getInputField } from "./inputForm";
import { Col, Form, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { commonKeywords } from "../../constant";
import "./index.scss";


export interface CardComponentProps {
    title: string;
    content: string;
    NodeType: React.ElementType;
    contentPropName: string;
    contentCustomClass?: string | null;
    subTitle?: string | null;
}

export interface fieldValidationProps {
    [key: string]: {
        message: string;
        max?: number | null;
    };
}

export interface formFieldData {
    [key:string]: string | boolean | fieldValidationProps | null | { [key: string]: string } | undefined;
}

export interface ContactWalaaProps {
    sitedata: {
        data: {
            [key: string]: string;
        };
        metaData: {
            [key: string]: string;
        };
        overviewdata: {
            [key: string]: string;
        };
        common_lables: {
            [key: string]: string;
        };
        form_fields: {
            webform_name: string;
            fields: formFieldData[];
        }[];
    };
}

interface dependableArrProps {
    fieldName: string;
    dependableField: string;
}

export function WalaaCareerMarketing({ jobsDetailData }: formFieldData) {
    const [formInput, setFormInput] = useState<{ [key: string]: any }>({});
    const [formFields, setFormFields] = useState<formFieldData[]>([]);
    const [inputError, setInputErrors] = useState<{ [key: string]: string }>({});
    const [validated, setValidated] = useState<boolean>(false);    
 	const [dragFiles, setDragFiles] = useState<any | null>(null);
    const [dependableArr, setDependableArr] = useState<dependableArrProps[]>([]);
    const navigate = useNavigate();
    const {
        makeApiCall, 
        data, 
        error, 
        isLoading 
    } = useApiCall(5, 'Comms/CareerPage', 'post');

    useEffect(() => {
        if (jobsDetailData?.form_fields?.length > 0) {
            setFormFields(jobsDetailData.form_fields[0].fields);
        }
    }, [jobsDetailData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const filesFradPayload = dragFiles?.map((file: { name: string;   base64: string  }) => ({
            documentName: file.name,
            documentBase64: file.base64.split(",")[1],
        })) ?? [];
        const payload = {
            "firstName": formInput[jobsDetailData?.form_fields[0]?.fields[0].field_name],
            "lastName": formInput[jobsDetailData?.form_fields[0]?.fields[1].field_name],
            "email": formInput[jobsDetailData?.form_fields[0]?.fields[3].field_name],
            "phoneNumber": formInput[jobsDetailData?.form_fields[0]?.fields[2].field_name],
            "location": formInput[jobsDetailData?.form_fields[0]?.fields[4].field_name],
            "employeeStatus": formInput[jobsDetailData?.form_fields[0]?.fields[5].field_name] ?? false,
            "jobId": jobsDetailData?.data[0]?.job_id,
            "position":jobsDetailData?.data[0]?.job_title,
            "attachments": filesFradPayload,
        }        
        makeApiCall(payload);
    };

    useEffect(() => {
        if(data){
            navigate('/Walaa-Careers/Success', { state: jobsDetailData });
        }else if(error ) {
            const errorMessage = error?.messages ;
            toast.error(errorMessage?.message_en, {
                icon: <WarningAmberOutlinedIcon />,
                className: "error-cust",
                position: "top-center",
                autoClose: TOAST_AUTOCLOSE_TIMER || false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
        }
    },[data, error]);

    const isInputVisibleFullScreen = (fieldType: string) => {
        return ["managed_file", "webform_actions", "checkbox"].includes(
            fieldType.toLowerCase()
        );
    };

    const getInputColClass = (fieldType: string) => {
        const applyClass = commonKeywords.field_col;
        return fieldType === commonKeywords.webform_actions
            ? `${applyClass} d-flex justify-content-end`
            : applyClass;
    };

    const handleFieldChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        resetFiles?: boolean
    ) => {
        const { name, value, type, files, checked } = e.target as HTMLInputElement;
        if (type === "checkbox" || type === "radio") {
            setFormInput((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else if (type === "file") {
            const fileList = files ? Array.from(files) : [];
            setFormInput((prevData) => ({
                ...prevData,
                [name]: resetFiles ? [] : fileList,
            }));

        } else if (type === "textarea" && value.trim() === "") {
            setFormInput((prevData) => ({
                ...prevData,
                [name]: "",
            }));
        } else {
            setFormInput((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const upLoadLabels = {
        drag_and_drop: jobsDetailData?.common_lables?.drag_and_drop,
        or_label: jobsDetailData?.common_lables?.or_label,
        supported_file_type: jobsDetailData?.form_fields[0]?.fields[6]?.field_validation?.file_extensions?.message,
    };


    const checkIsbuttonDisabled = useCallback(() => {
        const mandatoryFields = formFields.filter((val: formFieldData) => {
            const dependentRule = dependableArr.find(dep => dep.fieldName === val.field_name);
            if (dependentRule) {
                return formInput[dependentRule.dependableField] && val.field_required;
            }
            return val.field_required;
        });

        const mandatoryFieldValues = mandatoryFields.map((val: formFieldData) => {
            if (val?.field_type === "radios" && formInput[val?.field_name] === undefined) {
                return false;
            }
            return formInput[val?.field_name];
        });
        let valueCheck = mandatoryFieldValues.every(
            (val) => val !== null && val !== undefined && val !== ""
        );

        for (const key in inputError) {
            if (inputError[key] !== "") {
                valueCheck = false;
                break;
            }
        }

        const consentCheckbox = formFields.find(
            (field) => field.field_type === "checkbox" && field.field_title?.toLowerCase().includes("click")
        );
        if (consentCheckbox && !formInput[consentCheckbox.field_name]) {
            return true;
        }
        return !valueCheck;
    }, [formFields, formInput, dependableArr, inputError]);

    return (        
        <div className="viewContainer">
            {isLoading && <LoaderOverlay />}
            <ToastContainer />
            {jobsDetailData?.data?.map((items, index) => (
                <div className="titleView" key={index}>
                    <div className="titleViewText">{items.job_title}</div>
                    <div className="roleSumarry">
                        {jobsDetailData?.common_lables?.brief_role_summary}
                    </div>
                    <div className="marketingDetail">{items?.role_summary}</div>
                    <div className="location">
                        {jobsDetailData?.common_lables?.location}: {items?.job_location}
                    </div>
                    <div className="datePosted">
                        {jobsDetailData?.common_lables?.job_posted_on} ({items?.posted_on})
                        &nbsp;&nbsp;
                        {jobsDetailData?.common_lables?.job_closing_on} (
                        {items?.closing_on})
                    </div>
                </div>
            ))}

            <div className="formView">
                {jobsDetailData?.form_fields?.map((formName, index) => (
                    <div key={index}>
                        <div className="formJoinTalent">{formName?.webform_name}</div>
                        <div className="contact-body">
                            <div className="contact-form">
                                <div className="form-input">
                                    <Form role="career-form" onSubmit={handleSubmit} noValidate validated={validated}>
                                        <Row>
                                            {formName.fields.length > 0 &&
                                                formName.fields.map((val, index) => (
                                                    <React.Fragment key={index}>
                                                        <Col
                                                                xl={
                                                                    isInputVisibleFullScreen(val?.field_type ?? "")
                                                                        ? 12
                                                                        : 6
                                                                }
                                                                className={getInputColClass(val?.field_type)}
                                                            >
                                                                {getInputField(
                                                                    val?.field_type,
                                                                    val,
                                                                    formInput,
                                                                    handleFieldChange,
                                                                    checkIsbuttonDisabled,
                                                                    upLoadLabels,
                                                                    inputError,
                                                                    setInputErrors,
                                                                    setValidated,
                                                                    setDragFiles,
                                                                    dragFiles
                                                                )}
                                                            </Col>
                                                    </React.Fragment>
                                                ))}
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}