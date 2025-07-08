import { Card } from "react-bootstrap";
import "./style.scss";
import Nissan from "assets/SuccessPage/Nissan.svg";
import Download from "assets/SuccessPage/Download.svg";
import driverIcon from "assets/QuoteAndBuy/driver.svg";
import { LanguageData } from "types/languageData";
interface VehicleAndDriverDetailsProps {
    langData: LanguageData;
    data:Data;
  }

  const VehicleAndDriverDetails: React.FC<VehicleAndDriverDetailsProps> = ({ langData,data }) => {
  return (
    <Card className="vehical-card">
        <Card.Header>
            <div className="vehical-details">
                <div className="vehicallogo"><img src={Nissan} alt="nissan" /></div>
                <div className="vehicalinnerdetails">
                    <h1>Nissan Magnite XE</h1>
                    <p>7403 - RUA</p>
                </div>
                
            </div>
            <div className="sponsername">
                    <h1>{langData.sponsor_name}</h1>
                    <p>{data?.policyDataDetail?.policyCard?.customerNameEnglish ?? ""}</p>
                </div>
           
        </Card.Header>
        <Card.Body>
            {
                data?.benefits?.drivers?.map((item:any,index:number)=>(
                    <div className="driver-details" key={index}>
                    <div className="driverbox">
                        <div className="d-flex">
                            <div className="drviericonimg">
                            <img src={driverIcon} alt="driver" />
                            </div>
                        <div>
                        <div className="diverhead">{langData.driver_name}</div>
                        <div className="driverinnerdetails">{item.driverName}</div>
                        </div>
                        </div>
                        
                    </div>
                    <div className="verticle-driver-line"></div>
                    <div className="driverbox">
                        <div className="diverhead">{langData.iqama_no}</div>
                        <div className="driverinnerdetails">{item.driverID}</div>
                    </div>
                    <div className="verticle-driver-line"></div>
                    <div className="driverbox">
                        <div className="diverhead">{langData.relationship}</div>
                        <div className="driverinnerdetails">{langData.not_applicable}</div>
                    </div>
                </div>
                )
        )}
           
            <div className="card-bottom-download">
                <div><img src={Download} alt="download" /><p>{langData.endorsement_schedule}</p></div>
                <div><img src={Download} alt="download" /><p>{langData.payment_receipt}</p></div>
            </div>
        </Card.Body>
        
    </Card>
  );
};

export default VehicleAndDriverDetails;
