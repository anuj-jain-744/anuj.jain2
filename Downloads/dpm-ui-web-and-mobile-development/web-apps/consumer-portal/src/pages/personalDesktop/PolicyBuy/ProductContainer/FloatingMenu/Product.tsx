import React from 'react';
import style from './Product.module.scss';
import motorIcon from 'assets/DashboardBanner/newMotorIcon.svg';
import travelIcon from 'assets/DashboardBanner/newTravelIcon.svg';
import homeIcon from 'assets/DashboardBanner/newHomeIcon.svg';
import medicalIcon from 'assets/DashboardBanner/newMedicalIcon.svg';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS_NAMES, productIDs } from 'constant';
import { useSelector } from 'react-redux';
import {  RootState } from "@dpm/shared-module";
import { familtyFlowConstants } from 'components/Travel/constantsTravel';
import usePolicyData from 'hook/common/usePolicyData';

interface ProductProps {
    iconName: string;
    navigateTo?: (url: string, data?: object) => void;
    action: string;
}

const Product: React.FC<ProductProps> = ({ iconName, action }: ProductProps) => {
    const navigate = useNavigate();


  const userDetails = useSelector((state: RootState) => state.auth?.userInfo);
  const authDetails = useSelector((state: RootState) => state.auth?.authDetails);
  const addressData = useSelector((state: RootState) => state.addressData);

    const getbuyPropsData = () => {
        const propsData = {
            ownerDetail: {
              message: authDetails?.message,
              isValid: authDetails?.isValid,
              referenceNo: authDetails?.referenceNo,
              sessionSecretId: authDetails?.sessionSecretId,
              ownerFullNameEnglish: userDetails?.name,
              ownerFullNameArabic: userDetails?.ownerFullNameArabic,
              ownerDobG: userDetails?.ownerDobG || userDetails?.dateOfBirth || familtyFlowConstants.dobG,
              ownerDobH: userDetails?.ownerDobH,
              gender: userDetails?.gender,
              nationality: userDetails?.nationality,
              nationalityCode: userDetails?.nationalityCode,
              email: userDetails?.email,
            },
            ownerId: userDetails?.userId,
            mobileNumber: userDetails?.mobileNumber,
            addressData: { addresses: addressData.addressData },
          };

        return propsData;
    }

    const buyPropsData = getbuyPropsData();
    // Raise a claim policy data
    const policiesDeck = useSelector((state: RootState) => state.policy.policies);

    const {motorPolicies, travelPolicies, homePolicies} = usePolicyData(policiesDeck);
    const initiateClaimHomeData = {
        policies: homePolicies,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber,
        productIDs: productIDs.home,
        isPolicyCardSelected: false,
    };

    const initiateClaimTravelData = {
        policies: travelPolicies,
        ownerId: userDetails?.userId,
        mobileNumber: userDetails?.mobileNumber,
        productIDs: productIDs.travel,
    };
    
    const handleNavigate = () => {
        const path = getNavigationPath(iconName);
        const data = getProductData();
        path && navigate(path, {
            state:{ data }
          });
    }

    const getProductData = () => {
        switch (action) {
            case 'buy':
                return getBuyProductData(iconName);
            case 'raiseClaim':
                return getIntiateClaimData(iconName);
            case 'trackClaim':
                return getTrackClaimData();
            default:
                return null;
        }
    }

    const formatIconName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Motor':
                return motorIcon;
            case 'Travel':
                return travelIcon;
            case 'Home':
                return homeIcon;
            case 'Medical':
                return medicalIcon;
            default:
                return motorIcon; 
        }
    }

    
  const getNavigationPath = (productName: string) => {
    const buyJourneyPath = (productName === PRODUCTS_NAMES.HOME && action === 'buy') ?
     `/personal/${productName}/quote-buy` : `/${productName}/QuoteAndBuy`;

     const initiateClaimPath = `/Register-claim`;
     
    switch (action) {
      case 'buy': 
        return `${buyJourneyPath}`;
      case 'raiseClaim': 
        return `${initiateClaimPath}`;
      case 'trackClaim': 
        return `/Track-claim`;
      default:
        return '';
    }
  };

  const getBuyProductData = (productName: string) => {
    switch (productName) {
        case 'Motor':
            return buyPropsData;
        case 'Travel':
            return buyPropsData;
        case 'Home':
            return buyPropsData;
        case 'Medical':
            return null;
        default:
            return buyPropsData;
    }
}

const getIntiateClaimData = (productName: string) => {
    switch (productName) {
        case 'Motor':
            return motorPolicies;
        case 'Travel':
            return initiateClaimTravelData;
        case 'Home':
            return initiateClaimHomeData;
        case 'Medical':
            return null;
        default:
            return null;
    }
};

const getTrackClaimData = () => {
    // productName not required here
    return null;
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };



    const formattedIconName = formatIconName(iconName);

    return (
            <button className={style.container} onClick={handleNavigate} tabIndex={0} onKeyDown={handleNavigate}>
                <div className={style.imgContainer}>
                    <img src={getIcon(formattedIconName)} alt={`${formattedIconName} icon`} />
                </div>
                <div className={style.textContainer}>
                    {`${capitalizeFirstLetter(iconName)} Insurance`}
                </div>
            </button>
    );
}

export default Product;