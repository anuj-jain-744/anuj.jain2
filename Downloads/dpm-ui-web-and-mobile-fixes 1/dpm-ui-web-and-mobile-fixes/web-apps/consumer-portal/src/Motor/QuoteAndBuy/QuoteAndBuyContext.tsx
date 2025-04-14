import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Value } from "react-multi-date-picker";
// import { mockVehicleDetail } from "./mockData";
import { PromoCodeScheme } from "types/promoCodeType";
import { DriverDetailsFormsData } from "types/DriverDetailsApi";
import { CompensationTypeKeys, SelectPlanTypeKeys } from "types/coverageplan";
import { DriverDetails, DriverDetailsResponseData, OwnerDetailsResponseData, PolicyDetails, TravelModel, VehicleDetails, VehicleDetailsResponseData } from "types/quoteAndBuy";

interface VehicleFormProps {
  vehicleSequenceNo: string;
  customCardNumber: string;
  modelYear: string;
  ownerId: string;
}

export interface QuoteAndBuyContextProps {
  schemeCode: PromoCodeScheme | null;
  availableRepairTypes: string[];
  journeyData: string;
  setJourneyData: React.Dispatch<string>;
  countryData: Country[];
  setCountryData: React.Dispatch<Country[]>;
  redisKey: string;
  setRedisKey: React.Dispatch<string>;
  addDriverFormData: DriverDetailsFormsData[];
  setAddDriverFormData: React.Dispatch<DriverDetailsFormsData[]>;
  setSchemeCode: React.Dispatch<React.SetStateAction<PromoCodeScheme | null>>;
  setAvailableRepairTypes: React.Dispatch<React.SetStateAction<string[]>>;
  premium: number | null;
  setPremium: React.Dispatch<React.SetStateAction<number | null>>;
  comprehensiveCardPrice: number | null;
  setComprehensiveCardPrice: React.Dispatch<React.SetStateAction<number | null>>;
  sliderValueSumInsured: string;
  setSliderValueSumInsured: React.Dispatch<React.SetStateAction<string>>;
  sliderValueDeductibles: string;
  setSliderValueDeductibles: React.Dispatch<React.SetStateAction<string>>;
  makeModelResponse: MakeModelImageResponse[];
  setMakeModelResponse: React.Dispatch<React.SetStateAction<MakeModelImageResponse[]>>;
  sliderDeductibleValue: number;
  setSliderDeductibleValue: React.Dispatch<React.SetStateAction<number>>;
  minDeductibleAmount: number | null;
  setMinDeductibleAmount: React.Dispatch<React.SetStateAction<number | null>>;
  maxDeductibleAmount: number | null;
  setMaxDeductibleAmount: React.Dispatch<React.SetStateAction<number | null>>;
  deductibleAmounts: any;
  setDeductibleAmounts: React.Dispatch<any>;
  repairTypeSelected: any;
  setRepairTypeSelected: React.Dispatch<any>;
  workShopInitialPrice: number | null;
  setWorkShopInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  mathInitialPrice: number | null;
  setMathInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  agencyInitialPrice: number | null;
  setAgencyInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  selectedBenefits: { title: string; price: number; code: string; }[];
  setSelectedBenefits: React.Dispatch<React.SetStateAction<{ title: string; price: number; code: string; }[]>>;
  vehicleDetails: VehicleDetails | null;
  setVehicleDetails: React.Dispatch<
    React.SetStateAction<VehicleDetails | null>
  >;
  driverDetails: DriverDetails[];
  setDriverDetails: React.Dispatch<React.SetStateAction<DriverDetails[]>>;
  compWorkShop: PolicyDetails | null;
  setcompWorkShop: React.Dispatch<React.SetStateAction<PolicyDetails | null>>;
  compMath: PolicyDetails | null;
  setcompMath: React.Dispatch<React.SetStateAction<PolicyDetails | null>>;
  compAgency: PolicyDetails | null;
  setcompAgency: React.Dispatch<React.SetStateAction<PolicyDetails | null>>;
  stepValue: number;
  selectedDriverID: string | null;
  setSelectedDriverID: React.Dispatch<React.SetStateAction<string | null>>;
  showManageDriverModal: boolean;
  setShowManageDriverModal: React.Dispatch<React.SetStateAction<boolean>>;
  setStepValue: React.Dispatch<React.SetStateAction<number>>;
  selectedPackage: string | null;
  setSelectedPackage: React.Dispatch<React.SetStateAction<string | null>>;
  vehicaleFormResponse: VehicleFormProps | null;
  setVehicleDetail: React.Dispatch<
    React.SetStateAction<VehicleFormProps | null>
  >;
  comp3rdParty: PolicyDetails | null;
  setcomp3rdParty: React.Dispatch<React.SetStateAction<PolicyDetails | null>>;
  vehicleDetailsResponseData: VehicleDetailsResponseData | null;
  setVehicleDetailsResponseData: React.Dispatch<React.SetStateAction<VehicleDetailsResponseData | null>>;
  driverDetailsResponseData: DriverDetailsResponseData[];
  setDriverDetailsResponseData: React.Dispatch<React.SetStateAction<DriverDetailsResponseData[]>>;
  ownerDetailsResponseData: OwnerDetailsResponseData | null;
  setOwnerDetailsResponseData: React.Dispatch<
    React.SetStateAction<OwnerDetailsResponseData | null>
  >;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  isTermCondition: boolean;
  setIsTermCondition: React.Dispatch<React.SetStateAction<boolean>>;
  coverageType: CompensationTypeKeys | null;
  setCoverageType: React.Dispatch<React.SetStateAction<CompensationTypeKeys | null>>;
  policyStartDate: Value | null;
  setPolicyStartDate: React.Dispatch<React.SetStateAction<Value | null>>;
  policyStartDateAPI: Value | null;
  setPolicyStartDateAPI: React.Dispatch<React.SetStateAction<Value | null>>;

  travelData: Value | null;
  setTravelData: React.Dispatch<React.SetStateAction<Value | null>>;
  setTravelStartDate: React.Dispatch<React.SetStateAction<Value | null>>;
  setSelectedPeriod: Value | null;
  travelStartDate: Value | null;
  selectedPeriod: Value | null;
  setIsToggleOn: React.Dispatch<React.SetStateAction<boolean>>;
  isToggleOn: boolean;
  totalCount: number | null;
  setTotalCount: React.Dispatch<React.SetStateAction<number | null>>;
  travellerType: React.Dispatch<React.SetStateAction<string | null>>;
  setTravellerType: React.Dispatch<React.SetStateAction<string | null>>;
  adultCount: number | null;
  setAdultCount: React.Dispatch<React.SetStateAction<number | null>>;
  adultTravelerObj: any;
  setAdultTravelerObj: React.Dispatch<any>;
  childCount: number | null;
  setChildCount: React.Dispatch<React.SetStateAction<number | null>>;
  childTravelerObj: any;
  setChildTravelerObj: React.Dispatch<any>;
  srCitizenCount: number | null;
  setSrCitizenCount: React.Dispatch<React.SetStateAction<number | null>>;
  srCitizenTravelerObj: any;
  setSrCitizenTravelerObj: React.Dispatch<any>;
  travelersList: any;
  setTravelersList: React.Dispatch<any>;
  travelcoverageType: string | null;
  setTravelCoverageType: React.Dispatch<React.SetStateAction<string | null>>;
  travelcoveragePlan: SelectPlanTypeKeys | null;
  setTravelCoveragePlan: React.Dispatch<React.SetStateAction<SelectPlanTypeKeys | null>>;
  travelcoverage: string | null;
  setTravelCoverage: React.Dispatch<React.SetStateAction<string | null>>;
  travelcoverageTypeCode: string | null;
  setTravelCoverageTypeCode: React.Dispatch<React.SetStateAction<string | null>>;
  dataWorldwidepearl: TravelModel | null;
  setWorldwidepearl: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataWorldwidetraveller: TravelModel | null;
  setWorldwidetraveller: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  worldwideCardPrice: number | null;
  setworldwideCardPrice: React.Dispatch<React.SetStateAction<number | null>>;
  worldwidepearlInitialPrice: number | null;
  setworldwidepearlInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  worldwidetravellerInitialPrice: number | null;
  setworldwidetravellerInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidepearlVAT: number | null;
  setdataworldwidepearlVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidepearladminfee: number | null;
  setdataworldwidepearladminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidepearlnetpremium: number | null;
  setdataworldwidepearlnetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidetravellerVAT: number | null;
  setdataworldwidetravellerVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidetravelleradminfee: number | null;
  setdataworldwidetravelleradminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwidetravellernetpremium: number | null;
  setdataworldwidetravellernetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  dataWorldwideexceptpearl: TravelModel | null;
  setWorldwideexceptpearl: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataWorldwideexcepttraveller: TravelModel | null;
  setWorldwideexcepttraveller: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  worldwideexceptCardPrice: number | null;
  setworldwideexceptCardPrice: React.Dispatch<React.SetStateAction<number | null>>;
  worldwideexceptpearlInitialPrice: number | null;
  setworldwideexceptpearlInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  worldwideexcepttravellerInitialPrice: number | null;
  setworldwideexcepttravellerInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexceptpearlVAT: number | null;
  setdataworldwideexceptpearlVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexceptpearladminfee: number | null;
  setdataworldwideexceptpearladminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexceptpearlnetpremium: number | null;
  setdataworldwideexceptpearlnetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexcepttravellerVAT: number | null;
  setdataworldwideexcepttravellerVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexcepttravelleradminfee: number | null;
  setdataworldwideexcepttravelleradminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataworldwideexcepttravellernetpremium: number | null;
  setdataworldwideexcepttravellernetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeeurope: TravelModel | null;
  setEuropeeurope: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataEuropeschengen: TravelModel | null;
  setEuropeschengen: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  EuropeCardPrice: number | null;
  setEuropeCardPrice: React.Dispatch<React.SetStateAction<number | null>>;
  EuropeeuropeInitialPrice: number | null;
  setEuropeeuropeInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  EuropeschengenInitialPrice: number | null;
  setEuropeschengenInitialPrice: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeeuropeVAT: number | null;
  setEuropeeuropeVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeeuropeadminfee: number | null;
  setdataEuropeeuropeadminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeeuropenetpremium: number | null;
  setdataEuropeeuropenetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeschengenVAT: number | null;
  setdataEuropeschengenVAT: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeschengenadminfee: number | null;
  setdataEuropeschengenadminfee: React.Dispatch<React.SetStateAction<number | null>>;
  dataEuropeschengennetpremium: number | null;
  setdataEuropeschengennetpremium: React.Dispatch<React.SetStateAction<number | null>>;
  travelCovidcoverage: boolean;
  settravelCovidcoverage: React.Dispatch<React.SetStateAction<boolean>>;
  travelWintersportscoverage: boolean;
  settravelWintersportscoverage: React.Dispatch<React.SetStateAction<boolean>>;
  isAddTravelerValidation: boolean;
  setIsAddTravelerValidation: React.Dispatch<React.SetStateAction<boolean>>;
  productName: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  tpPremiumBreakdown: PremiumBreakdown[],
  setTpPremiumBreakdown: React.Dispatch<React.SetStateAction<PremiumBreakdown[]>>;
  wsPremiumBreakdown: PremiumBreakdown[],
  setWsPremiumBreakdown: React.Dispatch<React.SetStateAction<PremiumBreakdown[]>>;
  agencyPremiumBreakdown: PremiumBreakdown[],
  setAgencyPremiumBreakdown: React.Dispatch<React.SetStateAction<PremiumBreakdown[]>>;
  mathPremiumBreakdown: PremiumBreakdown[],
  setMathPremiumBreakdown: React.Dispatch<React.SetStateAction<PremiumBreakdown[]>>;
  homePremiumResponse: Record<string, any>;
  setHomePremiumResponse: (value: Record<string, any>) => void;
  requestPayload: Record<string, any>;
  updateRequestPayload: (value: Record<string, any>) => void;
  pTravelername: string;
  setpTravelername: React.Dispatch<string>;
  pTravelerPassportno: string;
  setpTravelerPassportno: React.Dispatch<string>;
  pTravelerPassportexpiry: string;
  setpTravelerPassportexpiry: React.Dispatch<string>;
  quoteDataResponse: string;
  setQuoteDataResponse: React.Dispatch<string>;
  travelTourneyData: string;
  setTravelJourneyData: React.Dispatch<string>;
  primaryTravelers: travelersInfo[];
  setPrimaryTravelers: React.Dispatch<React.SetStateAction<travelersInfo[]>>;
  travelers: travelersInfo[];
  setTravelers: React.Dispatch<React.SetStateAction<travelersInfo[]>>;
  travelersChild: travelersInfo[];
  setTravelersChild: React.Dispatch<React.SetStateAction<travelersInfo[]>>;
  travelersSrcitizen: travelersInfo[];
  setTravelersSrcitizen: React.Dispatch<React.SetStateAction<travelersInfo[]>>;
  dataCoverageplanselfworldwide: TravelModel | null;
  setCoverageplanselfworldwide: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataCoverageplanselfworldwideusa: TravelModel | null;
  setCoverageplanselfworldwideusa: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataCoverageplanselfeurope: TravelModel | null;
  setCoverageplanselfworldwideeurope: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataCoverageplanfamilyworldwide: TravelModel | null;
  setCoverageplanfamilyworldwide: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataCoverageplanfamilyworldwideusa: TravelModel | null;
  setCoverageplanfamilyworldwideusa: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  dataCoverageplanfamilyeurope: TravelModel | null;
  setCoverageplanfamilyeurope: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  worldwideCoveragePrice: Record<string, any>;
  setworldwideCoveragePrice: (value: Record<string, any>) => void;
  worldwideFamilyCoveragePrice: Record<string, any>;
  setworldwideFamilyCoveragePrice: (value: Record<string, any>) => void;
  worldwideexceptCoveragePrice: Record<string, any>;
  setworldwideexceptCoveragePrice: (value: Record<string, any>) => void;
  europeCoveragePrice: Record<string, any>;
  seteuropeCoveragePrice: (value: Record<string, any>) => void;
  dataworldwideCoverageFamily: TravelModel | null;
  setdataworldwideFamily: React.Dispatch<React.SetStateAction<TravelModel | null>>;
  worldwideFamilyCPPrice: Record<string, any>;
  setworldwideFamilyCPPrice: (value: Record<string, any>) => void;
  worldwideSelfCPPrice: Record<string, any>;
  setworldwideSelfCPPrice: (value: Record<string, any>) => void;
  worldwideexceptSelfCPPrice: Record<string, any>;
  setworldwideexceptSelfCPPrice: (value: Record<string, any>) => void;
  europeSelfCPPrice: Record<string, any>;
  seteuropeSelfCPPrice: (value: Record<string, any>) => void;
  deleteStatus: any;
  setDeleteStatus: React.Dispatch<React.SetStateAction<{} | null>>;
}
export interface MakeModelImageResponse {
  id: string;
  model: string;
  image: string;
}

export interface Country {
  codeId: string;
  codeDesc: string;
}
export interface travelersInfo {
  travellerNameEnglish: string;
  travellerNameArabic: string;
  passportNumber: string;
  passportExpiryDate: string;
  dateOfBirth?: string;
  relation?: string;
  personAge: number;
  nationalIqamaId: string;
  nationality: string;
  gender?: string;
  policyCoverage: Array<{coverageCode: string}>;
  uiId: string;
}
export const QuoteAndBuyContext = createContext<QuoteAndBuyContextProps | undefined>(
  undefined
);

export const QuoteAndBuyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // TO DO remove hard coding
  const [schemeCode, setSchemeCode] = useState<PromoCodeScheme | null>(null);
  const [availableRepairTypes, setAvailableRepairTypes] = useState<string[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(
    null
  );
  const [journeyData, setJourneyData] = useState<string>("");
  const [countryData, setCountryData] = useState<Country[]>([]);
  const [redisKey, setRedisKey] = useState<string>("");
  const [addDriverFormData, setAddDriverFormData] = useState<DriverDetailsFormsData[]>([]);
  const [email, setEmail] = React.useState<string | null>(null);
  const [isTermCondition, setIsTermCondition] = React.useState<boolean>(false);
  const [showManageDriverModal, setShowManageDriverModal] = React.useState(false);
  const [selectedDriverID, setSelectedDriverID] = useState<string | null>(null);
  const [sliderValueSumInsured, setSliderValueSumInsured] = useState<string>("0");
  const [sliderValueDeductibles, setSliderValueDeductibles] = useState<string>("500");
  const [premium, setPremium] = useState<number | null>(null);
  const [makeModelResponse, setMakeModelResponse] = useState<MakeModelImageResponse[]>([]);
  const [comprehensiveCardPrice, setComprehensiveCardPrice] = useState<number | null>(null);
  const [deductibleAmounts, setDeductibleAmounts] = useState<any>(null);
  const [sliderDeductibleValue, setSliderDeductibleValue] = useState(0);
  const [minDeductibleAmount, setMinDeductibleAmount] = useState<number | null>(null);
  const [maxDeductibleAmount, setMaxDeductibleAmount] = useState<number | null>(null);
  const [repairTypeSelected, setRepairTypeSelected] = useState(null)
  const [workShopInitialPrice, setWorkShopInitialPrice] = useState<number | null>(null);
  const [mathInitialPrice, setMathInitialPrice] = useState<number | null>(null);
  const [agencyInitialPrice, setAgencyInitialPrice] = useState<number | null>(null);
  const [wsPremiumBreakdown, setWsPremiumBreakdown] = useState<PremiumBreakdown[]>([]);
  const [tpPremiumBreakdown, setTpPremiumBreakdown] = useState<PremiumBreakdown[]>([]);

  const [mathPremiumBreakdown, setMathPremiumBreakdown] = useState<PremiumBreakdown[]>([]);
  const [agencyPremiumBreakdown, setAgencyPremiumBreakdown] = useState<PremiumBreakdown[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<{ title: string; price: number }[]>([]);
  const [driverDetails, setDriverDetails] = useState<DriverDetails[]>([]);
  const [stepValue, setStepValue] = React.useState(0);
  const [compWorkShop, setcompWorkShop] = useState<PolicyDetails | null>(null);
  const [compMath, setcompMath] = useState<PolicyDetails | null>(null);
  const [compAgency, setcompAgency] = useState<PolicyDetails | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [vehicaleFormResponse, setVehicleDetail] = useState<VehicleFormProps | null>(null);
  const [comp3rdParty, setcomp3rdParty] = useState<PolicyDetails | null>(null);
  const [vehicleDetailsResponseData, setVehicleDetailsResponseData] = useState<VehicleDetailsResponseData | null>(null); // TO DO remove hard coding
  const [driverDetailsResponseData, setDriverDetailsResponseData] = useState<DriverDetailsResponseData[]>([]);
  const [ownerDetailsResponseData, setOwnerDetailsResponseData] = useState<OwnerDetailsResponseData | null>(null);
  const [coverageType, setCoverageType] = useState<CompensationTypeKeys | null>(null);
  const [policyStartDate, setPolicyStartDate] = useState<Value | null>(null);
  const [policyStartDateAPI, setPolicyStartDateAPI] = useState<Value | null>(null);
  const [homePremiumResponse, setHomePremiumResponse] = useState<{} | null>({});
  const [requestPayload, updateRequestPayload] = useState<{} | null>({});

  const [travelStartDate, setTravelStartDate] = useState<Value | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Value | null>(null);
  const [isToggleOn, setIsToggleOn] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [travelData, setTravelData] = useState<Value | null>(null);
  const [travellerType, setTravellerType] = useState<string>("self");
  const [adultCount, setAdultCount] = useState<number>(0)
  const [childCount, setChildCount] = useState<number>(0)
  const [srCitizenCount, setSrCitizenCount] = useState<number>(0)
  const [adultTravelerObj, setAdultTravelerObj] = useState<any>(null);
  const [childTravelerObj, setChildTravelerObj] = useState<any>(null);
  const [srCitizenTravelerObj, setSrCitizenTravelerObj] = useState<any>(null);
  const [travelersList, setTravelersList] = useState<any>(null);
  const [travelcoverageType, setTravelCoverageType] = useState<string | null>(null);
  const [travelcoveragePlan, setTravelCoveragePlan] = useState<SelectPlanTypeKeys | null>(null);
  const [travelcoverage, setTravelCoverage] = useState<string | null>(null);
  const [travelcoverageTypeCode, setTravelCoverageTypeCode] = useState<string | null>(null);
  const [dataWorldwidepearl, setWorldwidepearl] = useState<TravelModel | null>(null);
  const [dataWorldwidetraveller, setWorldwidetraveller] = useState<TravelModel | null>(null);
  const [worldwideCardPrice, setworldwideCardPrice] = useState<number | null>(null);
  const [worldwidepearlInitialPrice, setworldwidepearlInitialPrice] = useState<number | null>(null);
  const [worldwidetravellerInitialPrice, setworldwidetravellerInitialPrice] = useState<number | null>(null);
  const [dataworldwidepearlVAT, setdataworldwidepearlVAT] = useState<number | null>(null);
  const [dataworldwidepearladminfee, setdataworldwidepearladminfee] = useState<number | null>(null);
  const [dataworldwidepearlnetpremium, setdataworldwidepearlnetpremium] = useState<number | null>(null);
  const [dataworldwidetravellerVAT, setdataworldwidetravellerVAT] = useState<number | null>(null);
  const [dataworldwidetravelleradminfee, setdataworldwidetravelleradminfee] = useState<number | null>(null);
  const [dataworldwidetravellernetpremium, setdataworldwidetravellernetpremium] = useState<number | null>(null);
  const [dataWorldwideexceptpearl, setWorldwideexceptpearl] = useState<TravelModel | null>(null);
  const [dataWorldwideexcepttraveller, setWorldwideexcepttraveller] = useState<TravelModel | null>(null);
  const [worldwideexceptCardPrice, setworldwideexceptCardPrice] = useState<number | null>(null);
  const [worldwideexceptpearlInitialPrice, setworldwideexceptpearlInitialPrice] = useState<number | null>(null);
  const [worldwideexcepttravellerInitialPrice, setworldwideexcepttravellerInitialPrice] = useState<number | null>(null);
  const [dataworldwideexceptpearlVAT, setdataworldwideexceptpearlVAT] = useState<number | null>(null);
  const [dataworldwideexceptpearladminfee, setdataworldwideexceptpearladminfee] = useState<number | null>(null);
  const [dataworldwideexceptpearlnetpremium, setdataworldwideexceptpearlnetpremium] = useState<number | null>(null);
  const [dataworldwideexcepttravellerVAT, setdataworldwideexcepttravellerVAT] = useState<number | null>(null);
  const [dataworldwideexcepttravelleradminfee, setdataworldwideexcepttravelleradminfee] = useState<number | null>(null);
  const [dataworldwideexcepttravellernetpremium, setdataworldwideexcepttravellernetpremium] = useState<number | null>(null);
  const [dataEuropeeurope, setEuropeeurope] = useState<TravelModel | null>(null);
  const [dataEuropeschengen, setEuropeschengen] = useState<TravelModel | null>(null);
  const [EuropeCardPrice, setEuropeCardPrice] = useState<number | null>(null);
  const [EuropeeuropeInitialPrice, setEuropeeuropeInitialPrice] = useState<number | null>(null);
  const [EuropeschengenInitialPrice, setEuropeschengenInitialPrice] = useState<number | null>(null);
  const [dataEuropeeuropeVAT, setEuropeeuropeVAT] = useState<number | null>(null);
  const [dataEuropeeuropeadminfee, setdataEuropeeuropeadminfee] = useState<number | null>(null);
  const [dataEuropeeuropenetpremium, setdataEuropeeuropenetpremium] = useState<number | null>(null);
  const [dataEuropeschengenVAT, setdataEuropeschengenVAT] = useState<number | null>(null);
  const [dataEuropeschengenadminfee, setdataEuropeschengenadminfee] = useState<number | null>(null);
  const [dataEuropeschengennetpremium, setdataEuropeschengennetpremium] = useState<number | null>(null);
  const [travelCovidcoverage, settravelCovidcoverage] = useState<boolean>(false);
  const [travelWintersportscoverage, settravelWintersportscoverage] = useState<boolean>(false);
  const [isAddTravelerValidation, setIsAddTravelerValidation] = useState<boolean>(true);
  const [productName, setProductName] = useState<string | null>("null");

  const [pTravelername, setpTravelername] = useState<string>("");
  const [pTravelerPassportno, setpTravelerPassportno] = useState<string>("");
  const [pTravelerPassportexpiry, setpTravelerPassportexpiry] = useState<string>("");
  const [quoteDataResponse, setQuoteDataResponse] = useState<string>("");
  const [travelJourneyData, setTravelJourneyData] = useState<string>("");
  const [primaryTravelers, setPrimaryTravelers] = useState<travelersInfo[]>([]);
  const [travelers, setTravelers] = useState<travelersInfo[]>([]);
  const [travelersChild, setTravelersChild] = useState<travelersInfo[]>([]);
  const [travelersSrcitizen, setTravelersSrcitizen] = useState<travelersInfo[]>([]);
  const [dataCoverageplanselfworldwide, setCoverageplanselfworldwide] = useState<TravelModel | null>(null);
  const [dataCoverageplanselfworldwideusa, setCoverageplanselfworldwideusa] = useState<TravelModel | null>(null);
  const [dataCoverageplanselfeurope, setCoverageplanselfworldwideeurope] = useState<TravelModel | null>(null);
  const [dataCoverageplanfamilyworldwide, setCoverageplanfamilyworldwide] = useState<TravelModel | null>(null);
  const [dataCoverageplanfamilyworldwideusa, setCoverageplanfamilyworldwideusa] = useState<TravelModel | null>(null);
  const [dataCoverageplanfamilyeurope, setCoverageplanfamilyeurope] = useState<TravelModel | null>(null);
  const [worldwideCoveragePrice, setworldwideCoveragePrice] = useState<{} | null>({});
  const [worldwideFamilyCoveragePrice, setworldwideFamilyCoveragePrice] = useState<{} | null>({});
  const [worldwideexceptCoveragePrice, setworldwideexceptCoveragePrice] = useState<{} | null>({});
  const [europeCoveragePrice, seteuropeCoveragePrice] = useState<{} | null>({});
  const [dataworldwideCoverageFamily, setdataworldwideFamily] = useState<TravelModel | null>(null);
  const [worldwideFamilyCPPrice, setworldwideFamilyCPPrice] = useState<{} | null>({});
  const [worldwideSelfCPPrice, setworldwideSelfCPPrice] = useState<{} | null>({});
  const [worldwideexceptSelfCPPrice, setworldwideexceptSelfCPPrice] = useState<{} | null>({});
  const [europeSelfCPPrice, seteuropeSelfCPPrice] = useState<{} | null>({});
  const [deleteStatus, setDeleteStatus] = useState<{} | null>(null);
  const QuoteAndBuyContextValue = useMemo(() => ({
    premium,
    setPremium,
    comprehensiveCardPrice,
    setComprehensiveCardPrice,
    workShopInitialPrice,
    setWorkShopInitialPrice,
    mathInitialPrice,
    setMathInitialPrice,
    agencyInitialPrice,
    setAgencyInitialPrice,
    tpPremiumBreakdown,
    setTpPremiumBreakdown,
    wsPremiumBreakdown,
    setWsPremiumBreakdown,
    agencyPremiumBreakdown,
    setAgencyPremiumBreakdown,
    mathPremiumBreakdown,
    setMathPremiumBreakdown,
    sliderDeductibleValue,
    setSliderDeductibleValue,
    minDeductibleAmount,
    setMinDeductibleAmount,
    maxDeductibleAmount,
    setMaxDeductibleAmount,
    deductibleAmounts,
    setDeductibleAmounts,
    repairTypeSelected,
    setRepairTypeSelected,
    selectedBenefits,
    setSelectedBenefits,
    vehicleDetails,
    setVehicleDetails,
    driverDetails,
    setDriverDetails,
    compWorkShop,
    setcompWorkShop,
    compMath,
    setcompMath,
    compAgency,
    setcompAgency,
    comp3rdParty,
    setcomp3rdParty,
    stepValue,
    setStepValue,
    vehicleDetailsResponseData,
    setVehicleDetailsResponseData,
    driverDetailsResponseData,
    setDriverDetailsResponseData,
    ownerDetailsResponseData,
    setOwnerDetailsResponseData,
    email,
    setEmail,
    isTermCondition,
    setIsTermCondition,
    selectedPackage, setSelectedPackage, vehicaleFormResponse, setVehicleDetail,
    coverageType,
    setCoverageType,
    sliderValueDeductibles, setSliderValueDeductibles,
    sliderValueSumInsured, setSliderValueSumInsured,
    policyStartDate,
    setPolicyStartDate,
    policyStartDateAPI,
    setPolicyStartDateAPI,
    makeModelResponse,
    setMakeModelResponse,
    schemeCode, setSchemeCode,
    availableRepairTypes, setAvailableRepairTypes,
    showManageDriverModal, setShowManageDriverModal,
    journeyData, setJourneyData,
    countryData, setCountryData,
    redisKey, setRedisKey,
    addDriverFormData, setAddDriverFormData,
    selectedDriverID, setSelectedDriverID,

    // Travel Insurance
    travelData,
    setTravelData,
    setTravelStartDate,
    setSelectedPeriod,
    travelStartDate,
    selectedPeriod,
    isToggleOn,
    setIsToggleOn,
    totalCount,
    setTotalCount,
    travellerType,
    setTravellerType,
    adultCount,
    setAdultCount,
    childCount,
    setChildCount,
    srCitizenCount,
    setSrCitizenCount,
    adultTravelerObj, setAdultTravelerObj,
    childTravelerObj, setChildTravelerObj,
    srCitizenTravelerObj, setSrCitizenTravelerObj,
    travelersList, setTravelersList,
    travelcoverageType,
    setTravelCoverageType,
    travelcoveragePlan,
    setTravelCoveragePlan,
    travelcoverage,
    setTravelCoverage,
    travelcoverageTypeCode,
    setTravelCoverageTypeCode,
    dataWorldwidepearl,
    setWorldwidepearl,
    dataWorldwidetraveller,
    setWorldwidetraveller,
    worldwideCardPrice,
    setworldwideCardPrice,
    worldwidepearlInitialPrice,
    setworldwidepearlInitialPrice,
    worldwidetravellerInitialPrice,
    setworldwidetravellerInitialPrice,
    dataworldwidepearlVAT,
    setdataworldwidepearlVAT,
    dataworldwidepearladminfee,
    setdataworldwidepearladminfee,
    dataworldwidepearlnetpremium,
    setdataworldwidepearlnetpremium,
    dataworldwidetravellerVAT,
    setdataworldwidetravellerVAT,
    dataworldwidetravelleradminfee,
    setdataworldwidetravelleradminfee,
    dataworldwidetravellernetpremium,
    setdataworldwidetravellernetpremium,
    dataWorldwideexceptpearl,
    setWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    setWorldwideexcepttraveller,
    worldwideexceptCardPrice,
    setworldwideexceptCardPrice,
    worldwideexceptpearlInitialPrice,
    setworldwideexceptpearlInitialPrice,
    worldwideexcepttravellerInitialPrice,
    setworldwideexcepttravellerInitialPrice,
    dataworldwideexceptpearlVAT,
    setdataworldwideexceptpearlVAT,
    dataworldwideexceptpearladminfee,
    setdataworldwideexceptpearladminfee,
    dataworldwideexceptpearlnetpremium,
    setdataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellerVAT,
    setdataworldwideexcepttravellerVAT,
    dataworldwideexcepttravelleradminfee,
    setdataworldwideexcepttravelleradminfee,
    dataworldwideexcepttravellernetpremium,
    setdataworldwideexcepttravellernetpremium,
    dataEuropeeurope,
    setEuropeeurope,
    dataEuropeschengen,
    setEuropeschengen,
    EuropeCardPrice,
    setEuropeCardPrice,
    EuropeeuropeInitialPrice,
    setEuropeeuropeInitialPrice,
    EuropeschengenInitialPrice,
    setEuropeschengenInitialPrice,
    dataEuropeeuropeVAT,
    setEuropeeuropeVAT,
    dataEuropeeuropeadminfee,
    setdataEuropeeuropeadminfee,
    dataEuropeeuropenetpremium,
    setdataEuropeeuropenetpremium,
    dataEuropeschengenVAT,
    setdataEuropeschengenVAT,
    dataEuropeschengenadminfee,
    setdataEuropeschengenadminfee,
    dataEuropeschengennetpremium,
    setdataEuropeschengennetpremium,
    travelCovidcoverage,
    settravelCovidcoverage,
    travelWintersportscoverage,
    settravelWintersportscoverage,
    isAddTravelerValidation,
    setIsAddTravelerValidation,
    productName,
    setProductName,
    pTravelername,
    setpTravelername,
    pTravelerPassportno,
    setpTravelerPassportno,
    pTravelerPassportexpiry,
    setpTravelerPassportexpiry,
    quoteDataResponse, setQuoteDataResponse,
    homePremiumResponse, setHomePremiumResponse,
    requestPayload,
    updateRequestPayload,
    travelJourneyData,
    setTravelJourneyData,
    primaryTravelers, setPrimaryTravelers,
    travelers, setTravelers,
    travelersChild, setTravelersChild,
    travelersSrcitizen, setTravelersSrcitizen,
    dataCoverageplanselfworldwide,
    setCoverageplanselfworldwide,
    dataCoverageplanselfworldwideusa,
    setCoverageplanselfworldwideusa,
    dataCoverageplanselfeurope,
    setCoverageplanselfworldwideeurope,
    dataCoverageplanfamilyworldwide,
    setCoverageplanfamilyworldwide,
    dataCoverageplanfamilyworldwideusa,
    setCoverageplanfamilyworldwideusa,
    dataCoverageplanfamilyeurope,
    setCoverageplanfamilyeurope,
    worldwideCoveragePrice,
    setworldwideCoveragePrice,
    worldwideFamilyCoveragePrice,
    setworldwideFamilyCoveragePrice,
    worldwideexceptCoveragePrice,
    setworldwideexceptCoveragePrice,
    europeCoveragePrice,
    seteuropeCoveragePrice,
    dataworldwideCoverageFamily,
    setdataworldwideFamily,
    worldwideFamilyCPPrice,
    setworldwideFamilyCPPrice,
    worldwideSelfCPPrice,
    setworldwideSelfCPPrice,
    worldwideexceptSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    europeSelfCPPrice,
    seteuropeSelfCPPrice,
    deleteStatus, setDeleteStatus,
  }), [
    redisKey, addDriverFormData, setAddDriverFormData, setRedisKey, journeyData, setJourneyData, schemeCode, setSchemeCode, showManageDriverModal, premium, comprehensiveCardPrice, workShopInitialPrice, mathInitialPrice, agencyInitialPrice, sliderDeductibleValue, minDeductibleAmount, maxDeductibleAmount, deductibleAmounts, repairTypeSelected, selectedBenefits, vehicleDetails, driverDetails, compWorkShop, compMath, compAgency, comp3rdParty, stepValue, vehicleDetailsResponseData, driverDetailsResponseData, ownerDetailsResponseData, email, isTermCondition, selectedPackage, vehicaleFormResponse, coverageType, sliderValueDeductibles, sliderValueSumInsured, policyStartDate, makeModelResponse, policyStartDateAPI, selectedDriverID, travelStartDate, selectedPeriod, isToggleOn, totalCount, travelData, travellerType, adultCount, childCount, srCitizenCount, travelcoverageType, travelcoveragePlan, travelcoverage, travelcoverageTypeCode, dataWorldwidepearl, dataWorldwidetraveller, worldwideCardPrice, worldwidepearlInitialPrice, worldwidetravellerInitialPrice, dataworldwidepearlVAT, dataworldwidepearladminfee, dataworldwidepearlnetpremium, dataworldwidetravellerVAT, dataworldwidetravelleradminfee, dataworldwidetravellernetpremium, dataWorldwideexceptpearl, dataWorldwideexcepttraveller, worldwideexceptCardPrice, worldwideexceptpearlInitialPrice, worldwideexcepttravellerInitialPrice, dataworldwideexceptpearlVAT, dataworldwideexceptpearladminfee, dataworldwideexceptpearlnetpremium, dataworldwideexcepttravellerVAT, dataworldwideexcepttravelleradminfee, dataworldwideexcepttravellernetpremium, dataEuropeeurope, dataEuropeschengen, EuropeCardPrice, EuropeeuropeInitialPrice, EuropeschengenInitialPrice, dataEuropeeuropeVAT, dataEuropeeuropeadminfee, dataEuropeeuropenetpremium, dataEuropeschengenVAT, dataEuropeschengenadminfee, dataEuropeschengennetpremium, travelCovidcoverage, travelWintersportscoverage, isAddTravelerValidation, productName, homePremiumResponse, requestPayload, wsPremiumBreakdown, tpPremiumBreakdown, agencyPremiumBreakdown, mathPremiumBreakdown, countryData, pTravelername, pTravelerPassportno, pTravelerPassportexpiry, quoteDataResponse, travelJourneyData, adultTravelerObj, childTravelerObj, srCitizenTravelerObj, travelersList, primaryTravelers, travelers, travelersChild, travelersSrcitizen, dataCoverageplanselfworldwide, dataCoverageplanselfworldwideusa, dataCoverageplanselfeurope, dataCoverageplanfamilyworldwide, dataCoverageplanfamilyworldwideusa, dataCoverageplanfamilyeurope, worldwideCoveragePrice, worldwideFamilyCoveragePrice, worldwideexceptCoveragePrice, europeCoveragePrice, dataworldwideCoverageFamily, worldwideFamilyCPPrice, worldwideSelfCPPrice, worldwideexceptSelfCPPrice, europeSelfCPPrice, deleteStatus, availableRepairTypes, setAvailableRepairTypes
  ]);

  return (
    <QuoteAndBuyContext.Provider value={QuoteAndBuyContextValue}>
      {children}
    </QuoteAndBuyContext.Provider>
  );
};