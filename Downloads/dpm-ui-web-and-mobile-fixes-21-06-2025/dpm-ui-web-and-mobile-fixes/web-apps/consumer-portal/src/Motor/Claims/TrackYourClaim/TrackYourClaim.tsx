import React, { useEffect } from 'react';
import style from './TrackYourClaim.module.scss'
import MainContainer from './MainContainer/MainContainer';
import RightContainer from './RightContainer/RightContainer';
 import { ClaimProvider } from '../../../context/TrackClaimContext'
 import { useLocation } from 'react-router-dom';
import { useApiCall } from '@dpm/shared-module';
import PanelRight from 'components/PanelRight';


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

const {
  makeApiCall,
  isLoading,
  errors,
  data: cmsData,
} = useApiCall(1, "consumerportal-config", "get");

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  await makeApiCall();
};

const languageData = cmsData?.config[0];



  return (
    <div className={style.tycMainContainer}>
      <ClaimProvider initialTrackClaimInfo={trackClaimInfo} initialContactData={headerData} 
      trackClaimData={trackClaimData} productType = {productName}>
        <div className={style.tycLeftPanel}>
          <MainContainer />
        </div>
        <PanelRight>
        <div className={style.tycRightPanel}>
          <RightContainer languageData={languageData}/>
        </div>
        </PanelRight>
      </ClaimProvider>
    </div>
  );
};

export default TrackYourClaims