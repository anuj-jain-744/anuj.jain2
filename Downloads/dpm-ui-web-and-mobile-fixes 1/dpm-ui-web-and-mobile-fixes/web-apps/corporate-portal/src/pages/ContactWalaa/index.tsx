import { Col, Form, Row } from "react-bootstrap";
import React, { FC, FormEvent, useEffect, useState, useCallback } from "react";

import "./index.scss";
import { getInputField } from "./inputForm";
import { UiTabs } from "components/UiTabs";
import BranchCard from "components/BranchCard";
import Info from "../../assets/contactWalaa/Info.png";
import { useApiCall } from "@dpm/shared-module";
import { apiRoutes, commonKeywords } from "constant";

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
	}
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
			phone: string;
			email_label?: string;
			email?: string;
			drag_and_drop: string;
			or_label: string;
			supported_file_type: string;
		}
		form_fields: {
			webform_name: string;
			fields: formFieldData[];
		}[];
	}
}

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
}) => (
	<div className="card-element">
		<BranchCard.Title title={title} />
		{subTitle && <BranchCard.Subtitle subTitle={subTitle} />}
		<NodeType
			{...{ [contentPropName]: content }}
			contentCustomClass={contentCustomClass}
		/>
	</div>
);

export function ContactWalaaScreen({ sitedata }: ContactWalaaProps) {
	const [currentTab, setCurrentTab] = useState(0);
	const [formInput, setFormInput] = useState<{ [key: string]: any }>({});
	const [formFields, setFormFields] = useState<formFieldData[]>([]);
	const [inputError, setInputErrors] = useState<{ [key: string]: string }>({});
	const [validated, setValidated] = useState<boolean>(false);
	const [dependableArr, setDependableArr] = useState<dependableArrProps[]>([])

	const { makeApiCall, isLoading, errors, data } = useApiCall(24,"",commonKeywords.postRequest,'',true);
    useEffect(()=>{
		makeApiCall();
	},[])

	const cardComponents = [
		{
			title: sitedata?.data?.address_label,
			NodeType: BranchCard.Address,
			content: sitedata?.data?.address,
			contentPropName: "address",
		},
		{
			title: sitedata?.data?.workschedule_label,
			NodeType: BranchCard.WorkingHour,
			content: sitedata?.data?.working_hours,
			subTitle: sitedata?.data?.working_days,
			contentPropName: "working_hours",
		},
		{
			title: sitedata?.data?.callus_label,
			NodeType: BranchCard.ContactNo,
			content: sitedata?.data?.phone,
			contentPropName: "phone",
			contentCustomClass: "branch-card-text-light walaa-regular-400",
		},
		sitedata?.data?.email && {
			title: sitedata?.data?.email_label,
			NodeType: BranchCard.Email,
			content: sitedata?.data?.email,
			contentPropName: "email",
			contentCustomClass: "branch-card-text-light walaa-regular-400",
		},
	].filter(Boolean) as CardComponentProps[];

	const isInputVisibleFullScreen = (fieldType: string) => {
		return ['radios', 'select', "textarea", "managed_file", "webform_actions"].includes(fieldType.toLowerCase());
	}

	const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, resetFiles?: boolean) => {

		/* TODO:: handle EBAO API integration */
		const { name, value, type, files, checked } = e.target as HTMLInputElement;
		if (type === 'checkbox') {
			setFormInput((prevData) => ({
				...prevData,
				[name]: checked,
			}));
		} else if (type === 'file') {
			const fileList = files ? Array.from(files) : [];
			setFormInput((prevData) => ({
				...prevData,
				[name]: resetFiles ? [] : fileList,
			}));
		} 
		else if (type === 'textarea' && value.trim()==="") {
			setFormInput((prevData) => ({
				...prevData,
				[name]: '',
			}));
		}
		else {
			setFormInput((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	}

	const isColumnVisible = (validationField: fieldValidationProps | null, formInput: { [x: string]: any; }) => {
		let flag = true;
		if (validationField) {
			const dependableArr = Object.keys(validationField).reduce((acc: string[], key: string) => {
				if (key.startsWith('dependable_')) {
					acc.push(key.replace('dependable_', ''))
				}
				return acc;
			}, []);

			if (dependableArr.length > 0) {
				const values = dependableArr.map((val: any) => formInput[val]);
				flag = values.every(val => val !== null && val !== undefined && val);
			}
		}
		return flag;
	}

	const getInputColClass = (fieldType: string) => {
		const applyClass = "field-col";
		return (fieldType === "webform_actions") ? `${applyClass} d-flex justify-content-end` : applyClass
	}

	const checkIsbuttonDisabled = useCallback(() => {
		const mandatoryFields = formFields.filter((val: formFieldData) => {
			const data = dependableArr.find(depend => {
				return (depend?.fieldName === val?.field_name);
			});
			if (data && data?.dependableField) {
				if (formInput[data?.dependableField]) {
					return true && val?.field_required;
				}
				return false;
			}
			return val?.field_required;
		});
		const mandatoryFieldValues = mandatoryFields.map((val: formFieldData) => {
			if (val?.field_type === "radios" && formInput[val?.field_name] === undefined) {
				return false;
			}
			return formInput[val?.field_name];
		});

		let valueCheck = mandatoryFieldValues.every(val => val !== null && val !== undefined && val !== "");

		for (const key in inputError) {
			if (inputError[key] != "") {
				valueCheck = false;
				break;
			}
		}

		return valueCheck;
	}, [formFields, formInput, dependableArr, inputError]);


	const upLoadLabels = {
		drag_and_drop: sitedata?.data?.drag_and_drop,
		or_label: sitedata?.data?.or_label,
		supported_file_type: sitedata?.data?.supported_file_type
	}

	const getDependabArr = (formFields: formFieldData[]) => {
		return formFields.reduce((filtered: any, val: formFieldData) => {
			if (val.field_validation) {
				Object.keys(val.field_validation).some(key => {
					const searchTerm = "dependable_";
					if (key.startsWith(searchTerm)) {
						filtered.push({ fieldName: val?.field_name, dependableField: key.split(searchTerm).at(1) });
					}
				});
			}
			return filtered;
		}, []);
	}

	useEffect(() => {
		if (sitedata?.form_fields && sitedata?.form_fields[currentTab] && sitedata?.form_fields[currentTab]?.fields) {
			setFormFields(sitedata?.form_fields[currentTab].fields);
			const dependableArr = getDependabArr(sitedata?.form_fields[currentTab].fields);
			if (dependableArr && Array.isArray(dependableArr))
				setDependableArr(dependableArr);
		}
	}, [currentTab]);

	const handleSubmit = () => {
		// Ebao API integration
	}
	return (
		<>
			<div className={`contact-wrapper-box ${currentTab !== 1 ? "wrapper-padding-bottom" : ""}`}>
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
								<p dangerouslySetInnerHTML={{ __html: sitedata?.data?.form_desc }}></p>
							</div>
						</div>
						<div className="form-input">
							<Form onSubmit={handleSubmit} noValidate validated={validated}>
								<Row>
									{formFields.length > 0 && formFields.map((val, index) =>
										<React.Fragment key={index}>
											{isColumnVisible(val?.field_validation, formInput) && <Col
												xl={isInputVisibleFullScreen(val?.field_type ?? "") ? 12 : 6}
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
												)}
											</Col>}
										</React.Fragment>
									)}
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
									/>
								)
							)}
						</BranchCard>
					</div>
				</div>
			</div>
			{currentTab === 1 && (
				<div className="contact-background">
					<div className="contact-footer" dangerouslySetInnerHTML={{ __html: sitedata?.data?.complaint_form_desc }} />
					<div className="contact-footer-note" dangerouslySetInnerHTML={{ __html: sitedata?.data?.complaint_note }} />
				</div>
			)}
		</>
	)
}