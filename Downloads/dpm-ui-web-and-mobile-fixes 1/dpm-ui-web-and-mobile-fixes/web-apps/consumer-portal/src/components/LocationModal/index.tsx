import { Modal } from "react-bootstrap";
import { MapComponent } from "./map";

import "./index.scss";
import React from "react";

interface LocationModalProps {
  title: string;
  lat: string;
  long: string;
  showPopup: boolean;
  setShowPopup: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  title,
  lat,
  long,
  showPopup,
  setShowPopup,
}) => {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={showPopup}
      onHide={setShowPopup}
      className="property-map-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h5 className="property-location-title walaa-medium-500">{title}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MapComponent lat={lat} long={long} />
      </Modal.Body>
    </Modal>
  );
};

export default LocationModal;
