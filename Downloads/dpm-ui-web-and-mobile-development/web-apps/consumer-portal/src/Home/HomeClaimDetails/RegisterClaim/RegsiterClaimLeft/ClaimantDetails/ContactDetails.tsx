import React, { useEffect, useState } from "react";
import ThemeTextbox from "claims/components/ThemeTextbox";
import TypographyAndIcon from "claims/components/TypographyAndIcon"
import { Card } from "react-bootstrap";
import "./index.scss"
import { RootState, validateIbanNonSA, validateInput } from "@dpm/shared-module";
import IbanValidation from "./IbanValidation";
import { SA, IBAN } from "constant";
// import { useValidateIban } from "./hook/useValidateIban";
import { useSelector, shallowEqual } from "react-redux";
import { callAPI } from "@dpm/shared-module";
import { VITE_BACKEND_BASE_URL } from "constant";
import Iban from "components/Iban/iban";
import { ContactDetailsProps, ICompensationObjFactory, FileData } from "./contactdetails.types";

const ContactDetails: React.FC<ContactDetailsProps> = ({ languageData, mobilenumData, changeHandler }) => {
    // IBAN verification icon state
    const [isValidIban, setIsValidIban] = useState<boolean>(false);
    const [reEnteredIban, setReEnteredIban] = useState<string>("");
    const [bankName, setBankName] = useState<string>("");
    const [ibanError, setIbanError] = useState<string>("");
    const [bic, setBic] = useState<string>("");
    const [isexpand, setIsexapand] = useState<boolean>(true);
    const [fileData, setFileData] = useState<(FileData | null)[]>([null, null, null]);
    const [chequeLeafUploaded, setChequeLeafUploaded] = useState(false);
    //error state handler
    const [compensateError, setCompensateError] = useState({
        iBan: "",
        mobilenum: "",
        emailId: "",
    });
    // CompensateData
    const [compensateData, setCompensateData] = useState<ICompensationObjFactory>(
        {
            isIBan: "",
            isMobilenum: mobilenumData ? mobilenumData : "",
            isEmailId: "",
        },
    );
    let isValid = true;
    useEffect(() => {
        setCompensateData({ ...compensateData, isMobilenum: mobilenumData });
        const sanitizedValue = validateInput(mobilenumData);
        const saudiMobileRegex = /^05\d{8}$/;
        if (saudiMobileRegex.test(sanitizedValue) && sanitizedValue.length === 10) {
            changeHandler("mobilenum", true, sanitizedValue);
        } else {
            changeHandler("mobilenum", false);
        }

    }, [mobilenumData])
    // validateiban Api call function
    const userId = useSelector(
        (state: RootState) => state.auth?.userInfo?.userId
    );
    const { languageData: homeLanguageData } = useSelector((state: RootState) => state?.consumerCmsLanguageData, shallowEqual);
    const homeLangData = homeLanguageData?.config[0];
    useEffect(() => {
        // Do something when compensateData.isIBan changes
        setCompensateData((prevState) => ({
            ...prevState,
            isIBan: compensateData.isIBan,
        }));
        if (compensateData.isIBan && !compensateData.isIBan.startsWith(SA)) {
            setIsexapand(false);
        } else {
            setIsexapand(true);
        }
    }, [compensateData.isIBan]);

    const validateIBAN = async (iBAN: string) => {
        // setLoaderIconhandler(true);
        const requestBody = {
            iban: iBAN,
            idType: "NATIONAL_ID",
            idValue: userId,
            channel: "HomeClaims",
            userId: "1054651",
        }
        try {
            const response = await callAPI(
                "post",
                VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateIban`, requestBody
            );
            if (
                response?.message.toUpperCase() === "SUCCESS" &&
                response?.data.result === "MATCH"
            ) {
                setBic(response?.data?.bank?.swiftCode);
                setIsValidIban(true);
                changeHandler("iBAN", true, iBAN);
            } else if (response?.data?.result === "NO_MATCH") {
                setIsValidIban(true);
                setBic(response?.data?.bank?.swiftCode);
                changeHandler("iBAN", false);
            } else if (
                response?.message.toUpperCase() === "ERROR" ||
                response?.message === "INTERNAL_SERVER_ERROR"
            ) {
                changeHandler("iBAN", false);
                setIsValidIban(false);
            } else {
                changeHandler("iBAN", false);
            }
        } catch (error) {
            changeHandler("iBAN", false);
        } finally { /* empty */ }
    };

    const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
        const { name, value } = event.target as HTMLInputElement;
        if (event.nativeEvent instanceof KeyboardEvent && event.nativeEvent.code === "Space") {
            event.preventDefault();
            return;
        }
        const sanitizedValue = validateInput(value);
        if (name === IBAN && sanitizedValue.length >= 2) {
            if (sanitizedValue.startsWith(SA)) {
                setIsValidIban(false);
            } else { setIsValidIban(true) };
        }
        // } else {setIsValidIban(false)};
        if (name === "mobilenum" || name === "emailId" || name === "IBan") {
            switch (name) {
                case "mobilenum":
                    setCompensateData({ ...compensateData, isMobilenum: sanitizedValue });
                    const saudiMobileRegex = /^05\d{8}$/;
                    if (
                        sanitizedValue === "" ||
                        (saudiMobileRegex.test(sanitizedValue) && sanitizedValue.length === 10)
                    ) {
                        setCompensateError({ ...compensateError, mobilenum: "" });
                        changeHandler("mobilenum", true, sanitizedValue);
                    } else {
                        setCompensateError({
                            ...compensateError,
                            mobilenum: languageData?.invalid_mob_no ?? "",
                        });
                        changeHandler("mobilenum", false);
                    }
                    break;
                case 'emailId':
                    const emailRegex = /^\S+@[a-zA-Z]+\.(com|co.in)$/;
                    setCompensateData({ ...compensateData, isEmailId: value });
                    changeHandler("emailId", false, value);
                    if (emailRegex.test(value) || value === "") {
                        setCompensateError({ ...compensateError, emailId: "" });
                        changeHandler("emailId", true, value);
                    } else {
                        setCompensateError({
                            ...compensateError,
                            emailId: languageData?.invalid_email_id ?? "",
                        });
                        changeHandler("emailId", false, value);
                    }
                    break;
                case 'IBan':
                    setCompensateData({ ...compensateData, isIBan: sanitizedValue });
                    changeHandler("iBAN", false, sanitizedValue);
                    // Reset reEnteredIban and bankName if IBan is cleared
                    if (sanitizedValue === "") {
                        setIsValidIban(false);
                        setReEnteredIban("");
                        setBankName("");
                        setIbanError("");
                    }
                    // Check if IBAN does not start with "SA"
                    if (sanitizedValue.length > 2 && !sanitizedValue.startsWith(SA)) {//
                        if (!validateIbanNonSA(sanitizedValue)) {
                            setCompensateError({
                                ...compensateError,
                                iBan:
                                    languageData?.not_valid_iban_err ||
                                    "IBAN not valid for non-SA accounts",
                            });
                            setIsValidIban(false);
                            changeHandler("iBAN", false, sanitizedValue);
                        } else {
                            setCompensateError({ ...compensateError, iBan: "" });
                            changeHandler("iBAN", true, sanitizedValue);
                        }
                    }

                    // Check if IBAN starts with "SA" and does not have 24 characters
                    else if (
                        sanitizedValue.length > 2 &&
                        sanitizedValue.startsWith(SA) &&
                        sanitizedValue.length !== 24
                    ) {
                        setCompensateError({
                            ...compensateError,
                            iBan: languageData?.enter_valid_iban_no || "Enter Valid IBAN no.",
                        });
                        setIsValidIban(false);
                        changeHandler("iBAN", false, sanitizedValue);
                    } else if (/^[SA0-9]{0,2}\d{0,22}$/.test(sanitizedValue) || sanitizedValue === "") {
                        //setCompensateError({ ...compensateError, iBan: "" });
                        if (sanitizedValue.length === 24 && sanitizedValue.startsWith(SA)) {
                            setCompensateError({ ...compensateError, iBan: "" });
                            validateIBAN(sanitizedValue);
                            changeHandler("iBAN", true, sanitizedValue);
                        }
                    } else {
                        if (sanitizedValue.startsWith(SA) && sanitizedValue.length > 24) {
                            setCompensateError({
                                ...compensateError,
                                iBan: languageData?.not_valid_iban_err,
                            });
                        }
                        changeHandler("iBAN", false, sanitizedValue);
                    }
                    break;

            }
        }
    }
    //change handler return accept fn
    const sanitizeInput = (value: string) => {
        return value.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    };
    // Handlers for reEnteredIban and bankName
    const handleReEnteredIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setReEnteredIban(sanitizedValue);
    };
    const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(/ {2,}/g, " ").trimStart();

        const regex = /^[a-zA-Z ]*$/;

        if (regex.test(value) && value.length <= 30) {
            setBankName(value);
        }
    }
    // if reEnteredIban and bankName and chequeLeafUploaded is true then set iBAN to true
    useEffect(() => {
        if (compensateData.isIBan === reEnteredIban) {
            // Clear error if IBANs match
            setIbanError("");
            {
                compensateError.iBan.length > 0 ? changeHandler("iBAN", false) : changeHandler(
                    "iBAN",
                    true,
                    reEnteredIban,
                    fileData.filter((file) => file !== null)
                )
            }
        } else if (reEnteredIban !== "" && compensateData.isIBan !== reEnteredIban) {
            // Set error if IBANs don't match
            setIbanError(languageData?.iban_numbers_do_not_match || "IBAN numbers do not match.");
            changeHandler("iBAN", false);
        } else {
            // Clear error for other cases
            setIbanError("");
        }

        if (bankName.length > 0 && chequeLeafUploaded && (compensateData.isIBan === reEnteredIban)) {
            changeHandler("iBAN", true, reEnteredIban, bankName, fileData.filter((file) => file !== null));
        } else {
            changeHandler("iBAN", false, reEnteredIban, bankName);
        }

    }, [compensateData.isIBan, reEnteredIban, bankName, fileData]);

    return (
        <div className="parent-card" data-testid="registerclaimcontact-test">
            <Card className= "right-card-register">
                <div className="header">
                    <div className="header-content">
                        <div className="content">
                            <div className="walaa-medium-500 policy-number">
                                {languageData?.contact_details}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row align-self-stretch">
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="row d-flex flex-column">
                            <div className="col walaa-regular-400">
                                <TypographyAndIcon
                                    text={languageData?.mobile_number}
                                    required={true}
                                />
                            </div>
                            <div className="col">
                                <ThemeTextbox
                                    name="mobilenum"
                                    value={compensateData?.isMobilenum}
                                    placeholder={languageData?.placeholder_enter_mobile}
                                    type="tel"
                                    maxLengthIs={10}
                                    onChangehandler={updatedValue}
                                    errorValue={compensateError.mobilenum}
                                    dataTestId="mobilenum-testid"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="row d-flex flex-column">
                            <div className="col walaa-regular-400">
                                <TypographyAndIcon text={languageData?.email_id_label} />
                            </div>
                            <div className="col">
                                <ThemeTextbox
                                    name="emailId"
                                    placeholder={languageData?.placeholder_enter_email_id}
                                    type="text"
                                    value={compensateData?.isEmailId}
                                    onChangehandler={updatedValue}
                                    errorValue={compensateError.emailId}
                                    dataTestId="email-testid"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/** IBAN Logic Start here */}
                <IbanValidation
                    languageData={languageData}
                    onChangehandler={(event: React.FormEvent<HTMLDivElement>) => updatedValue(event)}
                    compensateData={compensateData}
                    isValidIban={isValidIban}
                    compensateError={compensateError}
                    reEnteredIban={reEnteredIban}
                    handleReEnteredIbanChange={handleReEnteredIbanChange}
                    bankName={bankName}
                    handleBankNameChange={handleBankNameChange}
                    ibanError={ibanError}
                />
                {/** IBAN Logic ends here */}
            </Card>
            {!isexpand && (<Iban fileData={fileData} setFileData={setFileData} languageData={homeLangData || {}} onChequeLeafUpload={() => setChequeLeafUploaded(true)}
                onChequeLeafRemove={() => setChequeLeafUploaded(false)} />)}

        </div>
    )
}
export default ContactDetails