import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
} from "react";

import { commonKeywords } from "../constant";


// Context for Quote and Buy flow - Personal-Home
type TypeSwicthTabsType = {
  activeIndex: number;
  activeLabel: string;
};

export type TypePropertyType = {
  show: boolean;
  latitude: string;
  longitude: string;
};

export type TyperFormAddressSelection = {
  propertyNo: string;
  propertyFloor: string;
  propertyBuildYear: string;
  propertyType: TypeSwicthTabsType;
  propertyNearCoastline: TypeSwicthTabsType;
};

export type apiErrorMessageType = { title: string; description: string };

export type policyRenewal = {
  policyNumber: string;
  expiryDate: string;
  existingPremium: number;
  contentBenefits: dynmaicObject[];
  coverageType: string;
  coveragePlan: string;
  primaryAddress: []
};

export type dynmaicObject = {
  [key:string]:string;
  itemDescription: string;
  sarValue: string;
  category: string;
  value: string;
}

interface PHQuoteBuyContextType {
  stepValue: number;
  leftStep: number;
  setLeftStep: (value: number) => void;
  setStepValue: (value: number) => void;
  homeConfig: Record<string, any>;
  setHomeConfig: (config: Record<string, any>) => void;
  selectedBuilding: string;
  setselectedBuilding: (building: string) => void;
  showCanvas: boolean;
  setShowCanvas: (value: boolean) => void;
  formAddressSelection: TyperFormAddressSelection;
  setFormAddressSelection: (value: TyperFormAddressSelection) => void;
  resetFormAddressSelection: TyperFormAddressSelection;
  showPropertyMap: TypePropertyType;
  setShowPropertyMap: (value: TypePropertyType) => void;
  resetPropertyCoodinates: TypePropertyType;
  disableLink: boolean;
  setDisableLink: (value: boolean) => void;
  buildYearError: string | null;
  setBuildYearError: (value: string | null) => void;
  userDetails: Record<string, any>;
  setUserDetails: (value: Record<string, any>) => void;
  handleBackClick: () => void;
  handleLinkClick: () => void;
  resetApiErrorMessage: apiErrorMessageType;
  apiErrorMessage: apiErrorMessageType;
  setApiErrorMessage: (value: apiErrorMessageType) => void;
  showAlertModal: boolean;
  setShowAlertModal: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  selectedContetBenefits: dynmaicObject[];
  setSelectedContetBenefits: React.Dispatch<React.SetStateAction<dynmaicObject[]>>;
  quotation: Record<string, any>;
  setQuotation: (request: Record<string, any>) => void;
  propertyPhotos: dynmaicObject[];
  setPropertyPhotos: () => React.Dispatch<React.SetStateAction<dynmaicObject[]>>;
  declaration: dynmaicObject;
  setDeclaration: (value:unknown) => React.Dispatch<React.SetStateAction<dynmaicObject>>;
  homePolicyRenewal: policyRenewal;
  setHomePolicyRenewal: React.Dispatch<React.SetStateAction<policyRenewal>>;
}

export const PHQuoteBuyContext = createContext<
  PHQuoteBuyContextType | undefined
>(undefined);

interface PHQuoteBuyProviderProps {
  children: ReactNode;
}

export const PHQuoteBuyProvider: React.FC<PHQuoteBuyProviderProps> = ({
  children,
}) => {
  const resetFormAddressSelection = {
    propertyNo: "0",
    propertyFloor: "0",
    propertyBuildYear: "",
    propertyType: { activeIndex: 0, activeLabel: "" },
    propertyNearCoastline: { activeIndex: 1, activeLabel: commonKeywords.No },
  };
  const resetPropertyCoodinates = { show: false, latitude: "", longitude: "" };
  const [stepValue, setStepValue] = useState(0);
  const [homeConfig, setHomeConfig] = useState({});
  const [leftStep, setLeftStep] = useState(1);
  const [showCanvas, setShowCanvas] = useState(false);
  const [formAddressSelection, setFormAddressSelection] = useState(
    resetFormAddressSelection
  );
  const [showPropertyMap, setShowPropertyMap] = useState(
    resetPropertyCoodinates
  );
  const [disableLink, setDisableLink] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [buildYearError, setBuildYearError] = useState(null);
  const resetApiErrorMessage = { title: "", description: "" };
  const [apiErrorMessage, setApiErrorMessage] = useState(resetApiErrorMessage);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedContetBenefits, setSelectedContetBenefits] = useState([]);
  const [quotation, setQuotation] = useState({});
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [declaration, setDeclaration] = useState([]);
  const [homePolicyRenewal, setHomePolicyRenewal] = useState(null);

  const PHQuoteBuyContextValue = useMemo(
    () => ({
      setStepValue,
      stepValue,
      setHomeConfig,
      homeConfig,
      setLeftStep,
      leftStep,
      showCanvas,
      setShowCanvas,
      formAddressSelection,
      setFormAddressSelection,
      resetFormAddressSelection,
      showPropertyMap,
      setShowPropertyMap,
      resetPropertyCoodinates,
      disableLink,
      setDisableLink,
      buildYearError,
      setBuildYearError,
      userDetails,
      setUserDetails,
      apiErrorMessage,
      setApiErrorMessage,
      showAlertModal,
      setShowAlertModal,
      resetApiErrorMessage,
      loading,
      setLoading,
      selectedContetBenefits,
      setSelectedContetBenefits,
      quotation,
      setQuotation,
      propertyPhotos,
      setPropertyPhotos,
      declaration,
      setDeclaration,
      homePolicyRenewal,
      setHomePolicyRenewal
    }),
    [
      stepValue,
      setStepValue,
      leftStep,
      setStepValue,
      homeConfig,
      showCanvas,
      setShowCanvas,
      formAddressSelection,
      setFormAddressSelection,
      showPropertyMap,
      setShowPropertyMap,
      disableLink,
      setDisableLink,
      buildYearError,
      setBuildYearError,
      userDetails,
      setUserDetails,
      apiErrorMessage,
      setApiErrorMessage,
      showAlertModal,
      setShowAlertModal,
      loading,
      setLoading,
      selectedContetBenefits,
      setSelectedContetBenefits,
      quotation,
      setQuotation,
      propertyPhotos,
      setPropertyPhotos,
      declaration,
      setDeclaration,
      homePolicyRenewal,
      setHomePolicyRenewal
    ]
  );

  return (
    <PHQuoteBuyContext.Provider value={PHQuoteBuyContextValue}>
      {children}
    </PHQuoteBuyContext.Provider>
  );
};

export const usePHQuoteBuyContext = (): PHQuoteBuyContextType => {
  const context = useContext(PHQuoteBuyContext);
  if (!context) {
    throw new Error(
      "usePHQuoteBuyContext must be used within a PHQuoteBuyProvider"
    );
  }
  return context;
};
