import { familtyFlowConstants } from "components/Travel/constantsTravel";
import { HOME, MOTOR, MOTORCOMP, MOTOR_COMP } from "constant";

interface UserDetailsProps {
    name?: string;
    ownerFullNameArabic?: string;
    ownerDobG?: string;
    ownerDobH?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    nationalityCode?: string;
    email?: string;
    userId?: string;
    mobileNumber?: string;
}
interface AuthDetailsProps {
    token?: string;
    userRole?: string;
    isAuthenticated?: boolean;
    message?: string;
    isValid?: boolean;
    referenceNo?: string;
    sessionSecretId?: string;
  }
interface PolicyAuthProps {
    policyNo: string;
    prodCode: string;
    userDetails?: UserDetailsProps;
    authDetails?: AuthDetailsProps;
    addressData?: { addressData: any[] };
}
export const getRenewalData = ({policyNo, prodCode,userDetails,authDetails,addressData}:PolicyAuthProps ) => {
    
    let propsData = {};
    const commonPropsData = {
      ownerFullNameEnglish: userDetails?.name,
      ownerFullNameArabic: userDetails?.ownerFullNameArabic,
      ownerDobG: userDetails?.ownerDobG || userDetails?.dateOfBirth || familtyFlowConstants.dobG,
      ownerDobH: userDetails?.ownerDobH,
      gender: userDetails?.gender,
      nationality: userDetails?.nationality,
    }
    if (prodCode === HOME) { // home use cases
      propsData = {
        ownerDetail: {
          ...commonPropsData,
          message: authDetails?.message,
          isValid: authDetails?.isValid,
          referenceNo: authDetails?.referenceNo,
          sessionSecretId: authDetails?.sessionSecretId,
          nationalityCode: userDetails?.nationalityCode,
          email: userDetails?.email,
        },
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber,
        addressData: { addresses: addressData?.addressData },
        policyNumber: policyNo
      };
    } else
    if (prodCode === MOTOR || prodCode === MOTOR_COMP || prodCode === MOTORCOMP) { // motor use cases
      propsData = {
        ...commonPropsData,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber ?? "",
        policyNumber: policyNo,
        isValidPolicy: true,
        isValidParam: true,
        loggedInRenew: true, 
      }
    }
    else
     {
      propsData = {
        ...commonPropsData,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber ?? "",
        policyNumber: policyNo,
        isValidPolicy: true,
        isValidParam: true,
        loggedInRenew: true,
      }
    }
    return propsData;
  }