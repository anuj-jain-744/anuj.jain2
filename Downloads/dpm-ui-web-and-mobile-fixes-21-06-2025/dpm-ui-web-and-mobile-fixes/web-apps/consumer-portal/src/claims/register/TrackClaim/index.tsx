import React, { useEffect, useState } from "react";
import Download from 'assets/Claims/Download.svg'
import Car from 'assets/Claims/car.svg';
import { Button } from "react-bootstrap";
import "./TrackClaim.scss";
import UploadDoc from "./components/uploadoc/UploadDoc";
import StatusTree from "./components/statustree/StatusTree"
import { LanguageData } from "types/languageData";
import { callAPI } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "../../../constant";

interface LanguageDataResponse {
    config: LanguageData[];
}

export default function TrackClaim() {
    const [languageData, setLanguageData] = useState<LanguageData>();
    const [isSuccess, setIsSuccess] =  useState(false);
    const [uploadText, setUploadText] = useState('Accident report awaited')


    const fetchData = async () => {
        const response: LanguageDataResponse= await callAPI("get", VITE_CONTENT_BASE_URI + "en/api/consumerportal-config");
        setLanguageData(response.config[0] as LanguageData);
      };
    
      useEffect(() => {
        fetchData();
      }, []);

    const handleSuccess = (value: boolean) => {
        if (value) {
            setIsSuccess(true)
            setUploadText('Accident report submitted')
        } 
    }

    // TODO: update when api is ready
    const motorClaim : {claimNo: string; id: string} = {
        claimNo: 'C-E00-23-310-004679-001',
        id: '8754562340'
    }

    return (
        <>
        {languageData ? 
            <div className='outContainer'>
            <div className='innerContainerMain'>
                <div className='titleLayout'>
                    <label data-testid="current-status" className="titleClaims">{languageData?.track_your_claim}</label>
                </div>

            <div className='col-md-12 col-sm-12 col-xs-12 cardSectionContainer1'>
                <div className='cardSectionContainerBlue'>
                    <div className="cardCircalOuter">
                        <div className="cardCircle">
                            <div className="layout3Inner2">
                                <div className="innerCircle"><img src={Car} alt="img" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="cardContent">
                        <div className="cardLabel">{languageData?.motor_claim_no}</div>
                        <div className="cardLabelContent">{motorClaim.claimNo}</div>
                    </div>
                    <div className="cardContent">
                        <div className="cardLabel">{languageData?.insurance_type}</div>
                        <div className="cardLabelContent">{languageData?.comprehensive}</div>
                    </div>
                    <div className="cardContent">
                        <div className="cardLabel">{languageData?.claim_id}</div>
                        <div className="cardLabelContent">{motorClaim.id}</div>
                    </div>
                </div>
            </div>

            

            <div className='col-md-12 col-sm-12 col-xs-12 cardSectionContainer1'>
                <div className='cardSectionContainer'>
                
                    <div className='col-md-12 col-sm-12 col-xs-12'>
                        <div className='cardText'>
                            <label className='cardTextLbl' color="darkestGrey">{languageData?.current_status}</label>
                            <label className='cardTextValue'>{uploadText}</label>
                        </div>
                    
                        {!isSuccess &&  (<div className='cardText'>
                                <UploadDoc handleSuccess={handleSuccess} languageData={languageData}/>
                        </div> )}
                    </div>
                </div>
                </div>
                <div className='col-md-12 col-sm-12 col-xs-12 cardSectionContainer1'>
                    {/* status tree */}
                    <StatusTree />
                </div>
                
                <div className='footerLayout'>
                    <div className='btnContainer d-flex'>
                        <div className='btnContainerIn btnContainerInWidth'>
                            <Button className="footerBtn">
                                <img src={Download} alt="Download Claim Documents"/>{languageData?.download_claim_documents}
                            </Button>    
                        </div>
                        <div className='btnContainerIn'>
                            <Button className="footerRightBtn">
                                {languageData?.track_another_claim}
                            </Button>    
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
        : 'Loading...'}
        </>
    )
}
