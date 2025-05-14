import React, {
    createContext,
    useState,
    ReactNode,
    useMemo,
} from "react";

export interface LoginAndSingupContextProps{
    errorMessage: string | null;
    setErrorMessage: (errorMessage:string)=>void;
    successMessage: string | null;
    setSuccessMessage: (successMessage:string)=>void;
    navigateToErrorFrom: number | null;
    setnavigateToErrorFrom: (navigateToError:number)=>void;
    loginData: object | null;
    setLoginData: React.Dispatch<React.SetStateAction<object | null>>;
    formData: object | null;
    setFormData: React.Dispatch<React.SetStateAction<object | null>>;
    stepValue: number | null;
    setStepValue: (data: number) => void;
    module: string | null;
    setModule: (data: string) => void;
    loginPayload: object | null;
    setLoginPayload: (data: object) => void;
    signUpForm: boolean
    setSignUpForm: (val: boolean) => void;
    encryptedPassword: string | null;
    setencryptedPassword: (data: string) => void;
    updatedMobNum: string | null;
    setUpdatedMobNum: (data:string) => void;
    referenceNumber: string | null;
    setReferenceNumber:  (data:string) => void;
    warningMessage: string | null;
    setWarningMessage: (warningMessage:string) => void;
}

export const LoginAndSingupContext = createContext<LoginAndSingupContextProps | undefined>(
undefined
);

export const LoginAndSingupProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [navigateToErrorFrom,setnavigateToErrorFrom] = useState<number | null>(null);
    const [loginData,setLoginData] = useState<object | null>(null);
    const [formData,setFormData] = useState<object | null>(null);
    const [loginPayload,setLoginPayload] = useState<object | null>(null);
    const [stepValue, setStepValue] = useState<number>(null);
    const [updatedMobNum, setUpdatedMobNum] = useState<number>(null);
    const [module, setModule] = useState<string | null>(null);
    const [signUpForm, setSignUpForm] = useState<boolean>(null);
    const [encryptedPassword, setencryptedPassword] = useState<object>(null);
    const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

    const LoginAndSingupContextValue = useMemo(()=>({
        errorMessage,
        setErrorMessage,
        warningMessage,
        setWarningMessage,
        successMessage,
        setSuccessMessage,
        navigateToErrorFrom,
        setnavigateToErrorFrom,
        loginData,
        setLoginData,
        stepValue,
        setStepValue,
        formData,
        setFormData,
        module,
        setModule,
        loginPayload,
        setLoginPayload,
        updatedMobNum,
        setUpdatedMobNum,
        signUpForm,
        setSignUpForm,
        encryptedPassword,
        setencryptedPassword,
        referenceNumber,
        setReferenceNumber
    }),[errorMessage, warningMessage, successMessage, navigateToErrorFrom, loginData, stepValue, formData, module, loginPayload, updatedMobNum, signUpForm, encryptedPassword, referenceNumber]);
    return (
        <LoginAndSingupContext.Provider value={LoginAndSingupContextValue}>
          { children}
        </LoginAndSingupContext.Provider>
      );
};