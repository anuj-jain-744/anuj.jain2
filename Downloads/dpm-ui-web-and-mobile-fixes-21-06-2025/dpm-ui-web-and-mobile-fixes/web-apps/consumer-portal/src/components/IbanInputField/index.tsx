import React, { useCallback, useEffect, useState } from "react";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { LanguageData } from "types/languageData";
import { FaCheckCircle, FaTimesCircle,FaSpinner } from "react-icons/fa";
import { SA,ibanLength } from "constant";
import { useValidateIban } from "Motor/Policy-services/PoliciesCancellation/hook/useValidateIban";
import { validateIBAN, validateIbanNonSA } from "@dpm/shared-module";
import "./index.scss";

interface IbanInputFieldProps {
  languageData: LanguageData;
  userId: string;
  getBankDetails: ( bank: {
    bankName?:string;
  },iban:string) => void;
  checkDisabled:(value:boolean)=>void;
}
const IbanInputField: React.FC<IbanInputFieldProps> = ({
  languageData,
  userId,
  getBankDetails,
  checkDisabled
}) => {
  const [iban, setIban] = useState("");
  const [reEnterIban, setReEnterIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [ibanMismatch, setIbanMismatch] = useState(false);
  const [isValidIban, setIsValidIban] = useState(false);
  const [isReEnterIbanValid, setIsReEnterIbanValid] = useState(false);
  const  [bankErr,setBankErr]=useState("");

  const { fetchValidateIban, validationData ,isLoading,error:errorValidation} = useValidateIban({
    IbanNo: iban,
    NationalId: userId,
  });
  let isValid = true;
  useEffect(() => {
    const fetchData = async () => {
      if (isValid && iban?.length === ibanLength) {
        await fetchValidateIban();
      } else {
        getBankDetails({
          bankName,
        },iban)
        setIsValidIban(false);
        checkDisabled(true)
      }
    };
    if (iban.startsWith(SA)) fetchData();
  }, [isValid, iban]);

  useEffect(() => {
    if(!isLoading && validationData){
        const tick =  validationData?.data?.result === "MATCH";
         getBankDetails({bankName:validationData?.data?.bank?.englishName},iban)
         setIsValidIban(tick);
         checkDisabled(false)
    }
    
  }, [validationData,isLoading])
  

  const validateInput = (value: string, maxLength: number): boolean => {
    const regex = /^[a-zA-Z0-9]*$/; // Only alphanumeric characters
    return (
      value.length <= maxLength && // Check max length
      value.trim() === value && // No leading or trailing spaces
      regex.test(value) // No special characters
    );
  };

  const handleReEnterIban = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;
    if (validateInput(value, ibanLength)) {
      setReEnterIban(value);
      setIbanMismatch(value !== iban);
      setIsReEnterIbanValid(value === iban);
      getBankDetails({
        bankName,
      },iban)
    }
  };
  useEffect(() => {
    if(validateIbanNonSA(iban)){
        if(iban===reEnterIban && bankName!==""){
          checkDisabled(false)
          getBankDetails({
            bankName,
          },iban)
        }else{
          checkDisabled(true)
        }
    }

 
  }, [reEnterIban,iban,ibanMismatch,bankName])

  const onChangeBankName=(event: React.ChangeEvent<HTMLInputElement>)=>{
    event.preventDefault();
    const value = event.target.value;
    setBankName(value);
    if(value!==""){
      setBankErr("")
    }
  }

  const handleIban = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
      const value = event.target.value;
      if (validateInput(value, 24)) {
        setIban(value);
        // Reset related fields if IBAN is cleared
        if (value === "") {
          setReEnterIban("");
          setIbanMismatch(false);
          setIsReEnterIbanValid(false);
          checkDisabled(true);
          
        } else {
          setIbanMismatch(value !== reEnterIban && reEnterIban !== "");
          getBankDetails({
            bankName,
          },iban)
          if (value.startsWith(SA)) {
            isValid = validateIBAN(value);
            
          } else {
            setIsValidIban(validateIbanNonSA(value));
          }
        }
      }
    },
    [setIban, validateIBAN, validateIbanNonSA, reEnterIban]
  );

  const handleBlur = () => {
    if (bankName === '') {
      setBankErr(languageData?.please_provide_valid_bank);
    } else {
      setBankErr('');
    }
  };
  return (
    <React.Fragment>
      <div className="iban-details">
        <div className="important-text-field">
          <div className="iban-heading">
            {languageData?.iban_no}
            <span className="important-field">*</span>
          </div>
          <div>
            <ThemeTextbox
              value={iban}
              name="iban"
              type="text"
              onChangehandler={handleIban}
            >
               
              {iban?.startsWith(SA) ? isLoading ?<FaSpinner /> :
                (isValidIban  ? (
                  <FaCheckCircle style={{ color: "green" }} />
                ) : (
                  <FaTimesCircle style={{ color: "red" }} />
                )):""}
            </ThemeTextbox>
            {iban.length > 2 &&
              iban?.startsWith(SA) &&
              !isValidIban &&
              iban.length !== 24 && (
                <div className="error-msg">
                  {languageData?.please_provide_valid_iban}
                </div>
              )}
            {iban.length > 2 &&
              !iban?.startsWith(SA) &&
              isValidIban === false && (
                <div className="error-msg">
                  {languageData?.iban_invalid_non_sa}
                </div>
              )}
              {iban.length > 2 &&
              iban?.startsWith(SA) && iban.length === 24 &&
               (
                <div className="error-msg">
                  {errorValidation?.errorDescription}
                </div>
              )}
          </div>
        </div>

        {iban && !iban.startsWith(SA) && (
          <>
            <div className="important-text-field">
              <div className="iban-heading">
                {languageData?.re_enter_iban}
                <span className="important-field">*</span>
              </div>
              <div>
                <ThemeTextbox
                  value={reEnterIban}
                  name={"reEnterIban"}
                  onChangehandler={handleReEnterIban}
                />
                {ibanMismatch && (
                  <div className="error-msg">
                    {languageData?.iban_numbers_do_not_match}
                  </div>
                )}
                <div className="iban-heading">
                  {languageData?.bank_name}
                  <span className="important-field">*</span>
                </div>
                <ThemeTextbox
                  value={bankName}
                  name={"bankName"}
                  onChangehandler={onChangeBankName}
                  handleOnBlur={handleBlur}
                />
                {bankErr!=="" && (
                  <div className="error-msg">
                    {bankErr}
                  </div>
                )}
              </div>
            </div>

          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default IbanInputField;
