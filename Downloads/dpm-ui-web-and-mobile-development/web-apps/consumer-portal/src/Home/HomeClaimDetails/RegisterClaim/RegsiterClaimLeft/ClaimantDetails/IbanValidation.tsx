import React from 'react';
import ThemeTextbox from "claims/components/ThemeTextbox";
import TypographyAndIcon from "claims/components/TypographyAndIcon"
import { InputGroup, Form, Spinner } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { SA } from "../../../../../.../../constant";
import CircleTickLogo from "../../../../../assets/../claims/assets/svg/icons/CircleTick.svg";
interface IbanProps {
    languageData: LanguageData;
    onChangehandler: (event: React.FormEvent<HTMLDivElement>) => void;
    compensateData: { [key: string]: string };
    isValidIban: boolean;
    compensateError: { [key: string]: string };
    reEnteredIban: string;
    handleReEnteredIbanChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    bankName: string;
    handleBankNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    ibanError: string;
}
const IbanValidation: React.FC<IbanProps> = ({ languageData, onChangehandler, compensateData, reEnteredIban, handleReEnteredIbanChange, isValidIban, compensateError, bankName, handleBankNameChange, ibanError }) => {
    return (
        <>
            <hr className="vehicleseq-splitter align-self-stretch my-0" />
            <div className="header">
                <div className="header-content">
                    <div className="content">
                        <div className="walaa-medium-500 policy-number">
                            {languageData?.bank_details}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row align-self-stretch">
                <div>
                    <div className="d-flex flex-row flex-wrap justify-content-between">
                        <div className="iban-textbox">
                            <div className="col walaa-regular-400">
                                <TypographyAndIcon text={languageData?.iban_no} required={true} />
                            </div>
                            <div className="col pt-2">
                                <InputGroup onChange={onChangehandler}>
                                    <Form.Control
                                        placeholder={languageData?.placeholder_enter_iban_num}
                                        aria-label="iban"
                                        aria-describedby="basic-addon1"
                                        className="register-input register-input-hover-border-0 border-end-0 z-0"
                                        name="IBan"
                                        data-testid="iban-testid"
                                        value={compensateData?.isIBan}
                                        maxLength={24}
                                    />

                                    <InputGroup.Text
                                        id="basic-addon1"
                                        className="register-input border-start-0"
                                    >
                                    {!isValidIban && compensateData.isIBan.startsWith('SA') && (
                                        <CancelRoundedIcon className="invalid-iban" />
                                    )}
                                    {isValidIban && compensateData.isIBan && compensateData.isIBan.length === 24 && (
                                        <CheckCircleRoundedIcon className="valid-iban" />
                                    )}
                                    </InputGroup.Text>
                                </InputGroup>

                                {compensateData.isIBan.length > 2 && !isValidIban && (
                                    <Form.Text className="validationErrorText">
                                        {compensateData.isIBan.startsWith("SA") &&
                                            compensateData.isIBan.length !== 24
                                            ? compensateError.iBan
                                            : !compensateData.isIBan.startsWith("SA")
                                                ? compensateError.iBan
                                                : null}
                                    </Form.Text>
                                )}

                            </div>
                        </div>
                        {compensateData.isIBan && !compensateData.isIBan.startsWith(SA) && (
                            <>
                                <div className="iban-textbox" >
                                    <div className="col walaa-regular-400">
                                        <TypographyAndIcon
                                            text={languageData?.re_enter_iban}
                                            required={true}
                                        />
                                    </div>
                                    <div>
                                        <ThemeTextbox
                                            type={"text"}
                                            name="reEnteredIban"
                                            placeholder={languageData?.placeholder_enter_iban_num}
                                            value={reEnteredIban}
                                            onChangehandler={handleReEnteredIbanChange}
                                            dataTestId="reEnteredIban-testid"
                                            maxLengthIs={24}
                                        />
                                        {/* Display the error message */}
                                        {ibanError && <Form.Text className="validationErrorText position-absolute">{ibanError}</Form.Text>}
                                    </div>
                                </div>
                                <div className="iban-textbox">
                                    <div className="col walaa-regular-400">
                                        <TypographyAndIcon
                                            text={languageData?.bank_name}
                                            required={true}
                                        />
                                    </div>
                                    <div>
                                        <ThemeTextbox
                                            type={"text"}
                                            name="bankName"
                                            placeholder={languageData?.placeholder}
                                            value={bankName}
                                            onChangehandler={handleBankNameChange}
                                            dataTestId="bank-testid"
                                            maxLengthIs={30}
                                        />
                                    </div>
                                </div>{" "}
                            </>
                        )}
                    </div>
                    <div className="iban-detail walaa-regular-400">
                        {" "}
                        {" "}
                        {languageData?.iban_no_fetched_from_your}
                    </div>
                </div>
            </div>
        </>
    )
}
export default IbanValidation;

