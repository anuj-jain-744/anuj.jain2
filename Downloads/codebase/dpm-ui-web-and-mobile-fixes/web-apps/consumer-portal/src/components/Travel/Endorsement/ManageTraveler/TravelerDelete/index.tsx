import React, { useState } from 'react';
import { Button, Modal} from 'react-bootstrap'; 

import Delete from "assets/QuoteAndBuy/delete.svg";
import "./index.scss";

export type Traveler = {
    id: number;
    name: string;
    passportNo: string;
    passportExpiry: string;
    dob: string;
    relation: "Daughter" | "Son" | "Spouse";
    type: "Adult" | "Child" | "Senior Citizen";
  };
  
interface TravelDeleteProps {
    data: {[key: string]: string};
    handleAlert(): void
    travelerDelete:(travelerId:string) => void
    travelerData: Traveler;
}

const TravelerDelete: React.FC<TravelDeleteProps> = ({handleAlert, data, travelerDelete, travelerData}) => {
      const [showModal, setShowModal] = useState(false);
      const handleClose = () => setShowModal(false);
      const handleShow = () => setShowModal(true); 
      const handleSubmit = () =>{
        travelerDelete(travelerData?.id)
        setShowModal(false);
        handleAlert(travelerData?.name)
      }

    return (
        <div className='traveler-delete-container'>
            <button><img src={Delete} alt="Delete Icon" onClick={handleShow}/></button>

            <Modal show={showModal} centered onHide={handleClose} className="modal-lg delete-travel-modal-main custom-modal-width">
                <Modal.Header closeButton className="info-modal-head">
                    <Modal.Title>{data?.remove_traveler}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='add-modal-body'>
                    <div className='add-modal-info'>
                        {data?.travel_endorsement_delete_content}                    
                    </div>                  
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary add-cancel-btn btn-width" onClick={handleClose}>
                 {data?.no}
                    </Button>
                    <Button variant="primary" className='delete-btn btn-width' onClick={handleSubmit}>
                    {`${data?.yes}, ${data?.remove_button}`}
                    </Button>
                </Modal.Footer>
            </Modal> 
              
        </div>
    );
};

export default TravelerDelete;