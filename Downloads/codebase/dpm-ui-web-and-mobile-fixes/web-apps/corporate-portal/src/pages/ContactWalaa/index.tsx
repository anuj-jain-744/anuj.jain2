import { Col, Form, Row } from "react-bootstrap";
import React, { FC, useEffect, useState, useCallback } from "react";
import { contactUsText  } from "../../constant";
import "./index.scss";
import { getInputField } from "./inputForm";
import { UiTabs } from "components/UiTabs";
import BranchCard from "components/BranchCard";
import Info from "assets/contactWalaa/Info.png";
import { useApiCall, TOAST_AUTOCLOSE_TIMER,RootState } from "@dpm/shared-module";
import { commonKeywords } from "constant";
import SuccessMessage from "./sucessContact";
import { Bounce, toast,ToastContainer } from "react-toastify";
import { getUTCFormattedDate } from "utils/getUTCDates";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { BlueFormFooter } from "@consumer-portal/components/BlueFormFooter";
import { useSelector } from "react-redux";
import { LoaderOverlay } from "@app-shell/components";
import { useNavigate } from "react-router-dom";

export interface CardComponentProps {
  title: string;
  content: string;
  NodeType: React.ElementType;
  contentPropName: string;
  contentCustomClass?: string | null;
  subTitle?: string | null;
  workingHoursData?: string;
}

export interface fieldValidationProps {
  [key: string]: {
    message: string;
    max?: number | null;
  };
}
export interface formFieldData {
  field_name: string;
  field_title: string;
  field_type: string;
  field_required: boolean;
  field_placeholder: string;
  field_options: { [key: string]: string } | null;
  field_validation: fieldValidationProps | null;
  field_additional_info?: string;
  field_description?: string;
}

export interface ContactWalaaProps {
  sitedata: {
    data: {
      banner_title: string;
      page_title: string;
      page_desc: string;
      form_desc: string;
      complaint_form_desc: string;
      complaint_note: string;
      address_label: string;
      address: string;
      workschedule_label: string;
      working_days: string;
      working_hours: string;
      callus_label: string;
      working_hours_data: string;
      phone: string;
      email_label?: string;
      email?: string;
      drag_and_drop: string;
      or_label: string;
      supported_file_type: string;
    };
    form_fields: {
      webform_name: string;
      fields: formFieldData[];
    }[];
  };
}

type WorkingHoursEntry = {
  openDay?: string;
  closeDay?: string;
  openTime?: {
    hours?: number;
  };
  closeTime?: {
    hours?: number;
  };
};

interface dependableArrProps {
  fieldName: string;
  dependableField: string;
}

const CardComponent: FC<CardComponentProps> = ({
  title,
  content,
  NodeType,
  contentPropName,
  contentCustomClass = null,
  subTitle = null,
  workingHoursData = "",
}) => {
  const [presetDayData, setPresetDayData] = useState<WorkingHoursEntry[]>([]);
  const [completeDaydata, setCompleteDaydata] = useState<WorkingHoursEntry[]>([]);
  
 
  useEffect(() => {
    if (NodeType === BranchCard.WorkingHour && workingHoursData) {
      const parsed = JSON.parse(workingHoursData);
      const fullList = Array.isArray(parsed)
        ? parsed.map((entry: WorkingHoursEntry) => {
            const day = entry?.openDay || entry?.closeDay || "";
            const openTime =
              entry?.openTime?.hours !== undefined
                ? `${String(entry.openTime.hours).padStart(2, "0")}:00AM`
                : "Closed";
            const closeTime =
              entry?.closeTime?.hours !== undefined
                ? `${String(entry.closeTime.hours).padStart(2, "0")}:00PM`
                : "";
            return {
              day: day.charAt(0) + day.slice(1).toLowerCase(),
              workingHour:
                openTime === "Closed" ? "Closed" : `${openTime} - ${closeTime}`,
            };
          })
        : [];
      setCompleteDaydata(fullList);
      setPresetDayData(fullList.slice(0, 2));
    }
  }, [NodeType, workingHoursData]);
  return (
<div className="card-element">
<BranchCard.Title title={title} />
      {subTitle && <BranchCard.Subtitle subTitle={subTitle} />}
      {NodeType === BranchCard.WorkingHour ? (
<NodeType presetDayData={presetDayData} completeDaydata={completeDaydata} />
      ) : (
<NodeType
          {...{ [contentPropName]: content }}
          contentCustomClass={contentCustomClass}
          subTitle={subTitle}
        />
      )}
</div>
  );
};


export function ContactWalaaScreen({ sitedata }: ContactWalaaProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [formInput, setFormInput] = useState<{ [key: string]: any }>({});
  const [formFields, setFormFields] = useState<formFieldData[]>([]);
  const [inputError, setInputErrors] = useState<{ [key: string]: string }>({});
  const [validated, setValidated] = useState<boolean>(false);
  const [dependableArr, setDependableArr] = useState<dependableArrProps[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('');
	const [transformedCaseType, setTransformedCaseType] = useState('');
 	const [dragFiles, setDragFiles] = useState<any | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [caseNumber, setCaseNumber] = useState<string | null>(null);
	const [ticketNo, setTicketNo] =  useState<string | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );
  const {userInfo} = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (sitedata?.form_fields && sitedata?.form_fields.length > 0) {
      formInput[sitedata?.form_fields[0].fields[1]?.field_name] = userInfo?.mobileNumber || "";
      formInput[sitedata?.form_fields[0].fields[2]?.field_name] = userInfo?.email || "";
    }
  }, [ sitedata,formFields,formInput]);

//  converting case type starts
const caseType = sitedata?.form_fields[currentTab]?.webform_name;

useEffect(() => {
    if (caseType === contactUsText?.MakeanEnquiry) {
      setTransformedCaseType(contactUsText?.Enquiry);
    } else if (caseType === contactUsText?.PostaComplaint) {
      setTransformedCaseType(contactUsText?.Complaint);
    } else {
      setTransformedCaseType(caseType);
    }
  }, [caseType]);
//  converting case type ends

	const {
        makeApiCall: createCaseApiCall,
        isLoading: createCaseIsLoading,
        errors: createCaseError,
        data: createCaseData,
    } = useApiCall(5, "CRM/CreateCaseWebsite", "post");
    const {
      makeApiCall: makUploadApiCall,
      isLoading: uploadIsLoading,
      errors: uploadError,
      data: uploadData,
  } = useApiCall(5, "CRM/UploadFile", "post");

const {
      makeApiCall: makfraudUploadApiCall,
      isLoading: uploadIsLoadingfraud,
      errors: uploadfraudError,
      data: uploadfraudData,
  } = useApiCall(5, "CRM/UploadReportAFraudFileDocument", "post");

const {
      makeApiCall: makfraudContactApiCall,
      isLoading: contactIsLoadingfraud,
      errors: contactfraudError,
      data: contactfraudData,
  } = useApiCall(5, "Comms/ContactUs", "post");


const onSubmit = (event: React.FormEvent) => {
  event.preventDefault();

  if (transformedCaseType === "Report a Fraud") {
    submitFraud(event);
  } else {

    handleSubmit(event);
  }
};

  const uploadDate = getUTCFormattedDate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();


      try {
        
        if(isAuthenticated){
          const payload = {
            mobileNo: formInput?.phone_number,
            email: formInput?.email,
            productType: formInput?.product_type?.toLowerCase(),
            caseDescription: formInput?.message,
            attachment: formInput?.attachment,
            caseType: transformedCaseType,
            name:userInfo?.name,
            idNo: userInfo?.userId,
            language: commonKeywords.englishLabel,
          };
           await createCaseApiCall(payload);
        }else{
          await createCaseApiCall({
            "name":formInput[sitedata?.form_fields[currentTab]?.fields[2]?.field_name] || "",
            "mobileNo": formInput[sitedata?.form_fields[currentTab]?.fields[4].field_name],
            "email": formInput[sitedata?.form_fields[currentTab]?.fields[5].field_name],
            "idNo":  formInput[sitedata?.form_fields[currentTab]?.fields[3].field_name],
            "prefContMethod":"Both",
            "language": commonKeywords.englishLabel,
            "productType": selectedProductType.toLowerCase(),
            "caseDescription":formInput[sitedata?.form_fields[currentTab]?.fields[7].field_name],
            "caseType": transformedCaseType,
            "proflg":"0"
          });
        }
  }
    catch (error) {
      console.error(contactUsText.ErrorduringAPIcalls, error);
    }
  };

  const submitFraud = async (e: React.FormEvent) => {

    e.preventDefault();

    // Generate the ticket number
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
    const fraudticketNo = `RAF-${day}-${randomSixDigitNumber}`;

    setTicketNo(fraudticketNo);

      try {

        let payload = {};
        if(isAuthenticated){
          payload=dragFiles.map((file: { name: string; base64: string }) => ({
            "generalInfo": {
              "folderType": "fraud",
              "title": file?.name,
              "name": file?.name,
              "customerId": userInfo?.userId || "",
              "customerName": userInfo?.name || "",
              "uploadDate": uploadDate,
              "productInfo": {
                  "module": "IT",
                  "description": "IT",
                  "appUserId": "10292"
                }
              },
              "details": {
                "fraud": {
                  "caseNumber": fraudticketNo,
                  "phoneNumber": userInfo?.mobileNumber || "",
                  "emailId": userInfo?.email || ""
                }
              },
              "fileBase64":file?.base64.split(",")[1],
          }));
        }else{
          payload=dragFiles.map((file: { name: string; base64: string }) => ({
            "generalInfo": {
              "folderType": "fraud",
              "title": file.name,
              "name": file.name,
              "customerId": formInput[sitedata?.form_fields[currentTab]?.fields[1].field_name],
              "customerName": formInput[sitedata?.form_fields[currentTab]?.fields[0].field_name],
              "uploadDate": uploadDate,
              "productInfo": {
                  "module": "IT",
                  "description": "IT",
                  "appUserId": "10292"
                }
              },
              "details": {
                "fraud": {
                  "caseNumber": fraudticketNo,
                  "phoneNumber": formInput[sitedata?.form_fields[currentTab]?.fields[2].field_name],
                  "emailId": formInput[sitedata?.form_fields[currentTab]?.fields[3].field_name]
                }
              },
              "fileBase64":file.base64.split(",")[1],
          }));
        }
        await makfraudUploadApiCall({
          "documentsList": payload
        });

        const filesFradPayload = dragFiles?.map((file: { name: string; }) => ( file.name ));
        const postLoginPayload = {
          "ticketNo": fraudticketNo,
              "customerId": userInfo?.userId || "",
              "name": userInfo?.name || "",
          "email": userInfo?.email,
          "phone": userInfo?.mobileNumber || "",
          "message": formInput?.message,
          "attachmentName":  filesFradPayload,
        }
        const preLoginPayload = {
          "ticketNo": fraudticketNo,
          "name": formInput[sitedata?.form_fields[currentTab]?.fields[0].field_name],
          "email": formInput[sitedata?.form_fields[currentTab]?.fields[3].field_name],
          "phone": formInput[sitedata?.form_fields[currentTab]?.fields[2].field_name],
          "customerId": formInput[sitedata?.form_fields[currentTab]?.fields[1].field_name],
          "message": formInput[sitedata?.form_fields[currentTab]?.fields[4].field_name],
          "attachmentName":  filesFradPayload,
        }
        await makfraudContactApiCall(isAuthenticated ? postLoginPayload : preLoginPayload);
      }
      catch (error) {
          console.error(contactUsText.ErrorduringAPIcalls, error);
      }
  }


  const cardComponents = [
    {
      title: sitedata?.data?.address_label,
      NodeType: BranchCard?.Address,
      content: sitedata?.data?.address,
      contentPropName: contactUsText?.address,
    },
    {
      title: sitedata?.data?.workschedule_label,
      NodeType: BranchCard?.WorkingHour,
      content: sitedata?.data?.working_hours,
      subTitle: sitedata?.data?.working_days,
      contentPropName: contactUsText?.working_hours,
      workingHoursData: sitedata?.data?.working_hours_data,
    },
    {
      title: sitedata?.data?.callus_label,
      NodeType: BranchCard?.ContactNo,
      content: sitedata?.data?.phone,
      contentPropName: contactUsText?.phone,
      contentCustomClass: "branch-card-text-light walaa-regular-400",
    },
    sitedata?.data?.email && {
      title: sitedata?.data?.email_label,
      NodeType: BranchCard?.Email,
      content: sitedata?.data?.email,
      contentPropName: contactUsText?.email,
      contentCustomClass: "branch-card-text-light walaa-regular-400",
    },
  ].filter(Boolean) as CardComponentProps[];

  const isInputVisibleFullScreen = (fieldType: string) => {
    return [
      "radios",
      "select",
      "textarea",
      "managed_file",
      "webform_actions",
    ].includes(fieldType.toLowerCase());
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    resetFiles?: boolean
  ) => {
    /* TODO:: handle EBAO API integration */
    const { name, value, type, files, checked } = e.target as HTMLInputElement;
    // Check if the changed field is the product type, and update selectedProductType state
    
		if (name === contactUsText?.product_type) {
			setSelectedProductType(value);
		}
		if (type === contactUsText?.checkbox) {
      setFormInput((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    }
    
		else if (type === contactUsText?.file) {
      const fileList = files ? Array.from(files) : [];
      setFormInput((prevData) => {
				const existingFiles = prevData[name] || [];
				const updatedFiles = (resetFiles || fileList?.length === 0) // Check if resetFiles is true or fileList is empty
					? fileList // Reset files if resetFiles is true
					: [...existingFiles, ...fileList.filter(file => !existingFiles.includes(file))]; // Avoid duplicates
				return {
					...prevData,
					[name]: updatedFiles,
				};
			});

    } else if (type ===  contactUsText?.textarea && value.trim()==="") {
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

  const goBack=()=>{
    navigate(-1);
  }
  const isColumnVisible = (
    validationField: fieldValidationProps | null,
    formInput: { [x: string]: any }
  ) => {
    let flag = true;
    if (validationField) {
      const dependableArr = Object.keys(validationField).reduce(
        (acc: string[], key: string) => {
          if (key.startsWith("dependable_")) {
            acc.push(key.replace("dependable_", ""));
          }
          return acc;
        },
        []
      );

      if (dependableArr.length > 0) {
        const values = dependableArr.map((val: any) => formInput[val]);
        flag = values.every((val) => val !== null && val !== undefined && val);
      }
    }
    return flag;
  };

  const getInputColClass = (fieldType: string) => {
    const applyClass = "field-col";
    return fieldType === "webform_actions"
      ? `${applyClass} d-flex justify-content-end`
      : applyClass;
  };

  const checkIsbuttonDisabled = useCallback(() => {
    const mandatoryFields = formFields.filter((val: formFieldData) => {
      
      // Ensure only one of the fields is included based on selectedProductType
			if (val.field_name ===  contactUsText.passport_no_visa_no) {
				return selectedProductType === contactUsText.visitVisaInsurance && val?.field_required;
			}
			if (val.field_name === contactUsText.national_id_iqama_id) {
				return selectedProductType !== contactUsText.visitVisaInsurance && val?.field_required;
			}
      if(val?.field_name === "are_you_an_existing_customer") {
        return false;
      }
      const data = dependableArr.find((depend) => {
        return depend?.fieldName === val?.field_name;
      });
      if (data && data?.dependableField) {
        if (formInput[data?.dependableField]) {
          return val?.field_required;
        }
        return false;
      }
      return val?.field_required;
    });
    
    const mandatoryFieldValues = mandatoryFields.map((val: formFieldData) => {
      if (val?.field_type === contactUsText?.radios && formInput[val?.field_name] === undefined)  {
        return false;
      }
      return formInput[val?.field_name];
    });

    const isEitherFieldFilled = isAuthenticated ? true :
			(formInput[contactUsText.passport_no_visa_no] && selectedProductType === contactUsText.visitVisaInsurance) ||
			(formInput[contactUsText.national_id_iqama_id] && selectedProductType !== contactUsText.visitVisaInsurance);

		let valueCheck = mandatoryFieldValues.every(val => val !== null && val !== undefined && val !== "") && isEitherFieldFilled;
    
    for (const key in inputError) {
      if(selectedProductType !== contactUsText.visitVisaInsurance){
        inputError["passport_no_visa_no"] = "";
      }
      if (inputError[key] != "") {
        valueCheck = false;
        break;
      }
    }
    return !valueCheck;
  }, [formFields, formInput, dependableArr, inputError]);

  const upLoadLabels = {
    drag_and_drop: sitedata?.data?.drag_and_drop,
    or_label: sitedata?.data?.or_label,
    supported_file_type: sitedata?.data?.supported_file_type,
  };

  const getDependabArr = (formFields: formFieldData[]) => {
    return formFields.reduce((filtered: any, val: formFieldData) => {
      if (val.field_validation) {
        Object.keys(val.field_validation).some((key) => {
          const searchTerm = "dependable_";
          if (key.startsWith(searchTerm)) {
            filtered.push({
              fieldName: val?.field_name,
              dependableField: key.split(searchTerm).at(1),
            });
          }
        });
      }
      return filtered;
    }, []);
  };
  useEffect(() => {
    if (
      sitedata?.form_fields &&
      sitedata?.form_fields[currentTab] &&
      sitedata?.form_fields[currentTab]?.fields
    ) {
      setFormFields(sitedata?.form_fields[currentTab].fields);
      const dependableArr = getDependabArr(
        sitedata?.form_fields[currentTab].fields
      );
      if (dependableArr && Array.isArray(dependableArr))
        setDependableArr(dependableArr);
    }
  }, [currentTab]);

  useEffect(() => {
    if (createCaseData && Object.keys(createCaseData)?.length > 0) {
      if( createCaseData?.crmResponse?.code === "1") {
        const caseNumber = createCaseData.crmResponse.caseNumber;
        setCaseNumber(caseNumber);
        const filesPayload = dragFiles.map((file: { name: string; base64: string }) => ({
          documentName: file.name,
          document: file.base64.split(",")[1],
        }));
        let payload = {};
        if(isAuthenticated){
          payload=dragFiles.map((file: { name: string; base64: string }) => ({
            "generalInfo": {
              "folderType": "fraud",
              "title": file?.name,
              "name": file?.name,
              "customerId": userInfo?.userId || "",
              "customerName": userInfo?.name || "",
              "uploadDate": uploadDate,
              "productInfo": {
                  "module": "IT",
                  "description": "IT",
                  "appUserId": "10292"
                }
              },
              "details": {
                "fraud": {
                  "caseNumber": caseNumber,
                  "phoneNumber": userInfo?.mobileNumber || "",
                  "emailId": userInfo?.email || ""
                }
              },
              "fileBase64":file?.base64.split(",")[1],
          }));
        }else{
          payload=dragFiles.map((file: { name: string; base64: string }) => ({
            "generalInfo": {
              "folderType": "fraud",
              "title": file.name,
              "name": file.name,
              "customerId": formInput[sitedata?.form_fields[currentTab]?.fields[1].field_name],
              "customerName": formInput[sitedata?.form_fields[currentTab]?.fields[0].field_name],
              "uploadDate": uploadDate,
              "productInfo": {
                  "module": "IT",
                  "description": "IT",
                  "appUserId": "10292"
                }
              },
              "details": {
                "fraud": {
                  "caseNumber": caseNumber,
                  "phoneNumber": formInput[sitedata?.form_fields[currentTab]?.fields[2].field_name],
                  "emailId": formInput[sitedata?.form_fields[currentTab]?.fields[3].field_name]
                }
              },
              "fileBase64":file.base64.split(",")[1],
          }));
        }

        makfraudUploadApiCall({
          "documentsList": payload
        });

      }else {
        toast.error(createCaseData?.crmResponse?.Error, {
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
    }
  },[createCaseData, createCaseIsLoading, createCaseError]);

  useEffect(() => {
    if (uploadData && Object.keys(uploadData).length > 0) {
      setShowSuccessMessage(true);
    }
    else if(uploadError){
      toast.error(uploadError?.crmResponse?.message, {
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
  },[uploadData, uploadError, uploadIsLoading]);

  useEffect(() => {
    if (uploadfraudData && Object.keys(uploadfraudData).length > 0) {
      setShowSuccessMessage(true);
    }
    else if(uploadError){
      toast.error(uploadError?.crmResponse?.message, {
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
  },[uploadfraudError,uploadfraudData]);


  useEffect(() => {
    if (contactfraudData && Object.keys(contactfraudData).length > 0) {
      setShowSuccessMessage(true);
    }
    else if(contactfraudError){
      toast.error(contactfraudError?.crmResponse?.message, {
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
  },[contactfraudData, contactIsLoadingfraud, contactfraudError]);

  return (
    <>
      <ToastContainer />
      {createCaseIsLoading && <LoaderOverlay/>}
      <div
        className={`contact-wrapper-box ${
          currentTab !== 1 ? "wrapper-padding-bottom" : ""
        }`}
      >
        <div className="contact-header">
          <h2 className="walaa-medium-500">{sitedata?.data?.page_title}</h2>
          <p className="walaa-medium-500">{sitedata?.data?.page_desc}</p>
        </div>
        <div className="contact-body">
          <div className="contact-form">
            <div className="tab-container">
              <UiTabs
                tabsData={sitedata?.form_fields}
                activeTab={currentTab}
                setActiveTab={setCurrentTab}
              />
              <div className="faq-info">
                <img src={Info} alt="info" className="faq-title-icon" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: sitedata?.data?.form_desc,
                  }}
                ></p>
              </div>
            </div>
            <div className="form-input">
              <Form onSubmit={onSubmit} noValidate validated={validated}>
                <Row>
                  {formFields.length > 0 &&
                    formFields.map((val, index) => (
                      <React.Fragment key={index}>
                      {(val.field_name !== contactUsText.national_id_iqama_id || selectedProductType !== contactUsText.visitVisaInsurance) &&
		(val.field_name !== contactUsText.passport_no_visa_no || selectedProductType === contactUsText.visitVisaInsurance) ? (
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
                              dragFiles,
													    sitedata,
                            )}
                          </Col>
												) : null}
                      </React.Fragment>
                    ))}
                </Row>
              </Form>
            </div>
          </div>
          <div className="contact-branch">
            <BranchCard theme="custom-card">
              {cardComponents.map(
                (
                  {
                    title,
                    content,
                    NodeType,
                    contentPropName,
                    contentCustomClass = null,
                    subTitle = null,
                  },
                  index
                ) => (
                  <CardComponent
                    key={index}
                    title={title}
                    content={content}
                    NodeType={NodeType}
                    contentPropName={contentPropName}
                    contentCustomClass={contentCustomClass}
                    subTitle={subTitle}
                    workingHoursData={
                      NodeType === BranchCard.WorkingHour ? sitedata?.data?.working_hours_data : ""
                    }
                  />
                )
              )}
            </BranchCard>
            {/* <StaticSideBarCard sidebarImage={sitedata?.data?.sidebar_images} /> */}
          </div>
        </div>
      </div>
      {isAuthenticated && <BlueFormFooter backBtnClickHandler={goBack} isVisibleSubmitButton={true} isDisabled={checkIsbuttonDisabled()} submitClickHandler={handleSubmit}/>}
      {showSuccessMessage && caseNumber && <SuccessMessage caseNumber={caseNumber} />}
			{showSuccessMessage && ticketNo && <SuccessMessage caseNumber={ticketNo} />}


      {currentTab === 1  && (
        <div className="contact-background">
          <div
            className="contact-footer"
            dangerouslySetInnerHTML={{
              __html: sitedata?.data?.complaint_form_desc,
            }}
          />
          <div
            className="contact-footer-note"
            dangerouslySetInnerHTML={{ __html: sitedata?.data?.complaint_note }}
          />
        </div>
      )}
    </>
  );
}
