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
    setLoginData: (data: string) => void;
    formData: object | null;
    setFormData: (data: string) => void;
    stepValue: object | null;
    setStepValue: (data: number) => void;
    module: string | null;
    setModule: (data: string) => void;
    loginPayload: object | null;
    setLoginPayload: (data: object) => void;
    signUpForm: boolean
    setSignUpForm: (val: boolean) => void;
    forgotPassPayload: object | null;
    setForgotPassPayload: (data: object) => void;
    contextMobNum: string | null;
    setContextMobNum: (data:string) => void;
    referenceNumber: string | null;
    setReferenceNumber:  (data:string) => void;
}

export const LoginAndSingupContext = createContext<LoginAndSingupContextProps | undefined>(
undefined
);

export const LoginAndSingupProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [navigateToErrorFrom,setnavigateToErrorFrom] = useState<string | null>(null);
    const [loginData,setLoginData] = useState<object | null>(null);
    const [formData,setFormData] = useState<object | null>(null);
    const [loginPayload,setLoginPayload] = useState<object | null>(null);
    const [stepValue, setStepValue] = useState<number>(null);
    const [contextMobNum, setContextMobNum] = useState<string>(null);
    const [module, setModule] = useState<string | null>(null);
    const [signUpForm, setSignUpForm] = useState<boolean>(null);
    const [forgotPassPayload, setForgotPassPayload] = useState<object>(null);
    const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

    const LoginAndSingupContextValue = useMemo(()=>({
        errorMessage,
        setErrorMessage,
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
        contextMobNum,
        setContextMobNum,
        signUpForm,
        setSignUpForm,
        forgotPassPayload,
        setForgotPassPayload,
        referenceNumber,
        setReferenceNumber
    }),[errorMessage, successMessage, navigateToErrorFrom, loginData, stepValue, formData, module, loginPayload, contextMobNum, signUpForm, forgotPassPayload, referenceNumber]);
    return (
        <LoginAndSingupContext.Provider value={LoginAndSingupContextValue}>
          { children}
        </LoginAndSingupContext.Provider>
      );
};