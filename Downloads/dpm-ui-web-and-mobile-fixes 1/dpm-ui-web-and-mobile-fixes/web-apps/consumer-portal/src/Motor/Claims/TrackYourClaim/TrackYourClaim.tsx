import React from 'react';
import style from './TrackYourClaim.module.scss'
import MainContainer from './MainContainer/MainContainer';
import RightContainer from './RightContainer/RightContainer';
 import { ClaimProvider } from '../../../context/TrackClaimContext'
 import { useLocation } from 'react-router-dom';


interface TrackYourClaimsProps {
  trackClaimInfo: { [key: string]: string };
  headerData: { [key: string]: string };
}




const TrackYourClaims: React.FC<TrackYourClaimsProps> = ({ trackClaimInfo, headerData }) => {

const location = useLocation();
const {trackClaimData} = location.state; // data from previous page
const getProductType = (productType: string):string => {
  if (!productType) {
    return "";
  }
  const spaceIndex = productType.indexOf(' ');
  if (spaceIndex !== -1) {
    return productType.slice(0, spaceIndex);
  }
  return productType
};
const productName = getProductType(trackClaimData?.productName);// get the product name to handle the home and motor case





  return (
    <div className={style.tycMainContainer}>
      <ClaimProvider initialTrackClaimInfo={trackClaimInfo} initialContactData={headerData} 
      trackClaimData={trackClaimData} productType = {productName}>
        <div className={style.tycLeftPanel}>
          <MainContainer />
        </div>
        <div className={style.tycRightPanel}>
          <RightContainer />
        </div>
      </ClaimProvider>
    </div>
  );
};

export default TrackYourClaims