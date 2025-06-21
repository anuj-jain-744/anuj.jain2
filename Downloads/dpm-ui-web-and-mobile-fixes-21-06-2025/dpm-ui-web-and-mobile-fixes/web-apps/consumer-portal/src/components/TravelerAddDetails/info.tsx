import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./index.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface popUpData {
  popUpData: string;
}
const Info: React.FC<popUpData> = (popUpData) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<string>("");
  const handleCloseModal = () => {
    setShowModal(false);
  };

 const extractText = (htmlStr:string):{h1:string; p:string} =>{
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlStr, "text/html");
  const h1Txt = doc.querySelector("h1")?.textContent || "";
  const pTxt =  doc.querySelector("p")?.textContent || "";
  return{h1:h1Txt, p:pTxt}
 }
  const {h1, p} = extractText(popUpData.popUpData)
  
  const showInfo = (data: string) => {
    setShowModal(true);
    setData(data);
  };

  return (
    <div>
      <InfoOutlinedIcon
        onClick={() => showInfo(popUpData.popUpData)}
        className="form-info"
        data-testid="info-icon"
      />
      <div className="tooltip-info">
      <Modal fade-scale show={showModal} onHide={handleCloseModal} centered className="info-modal-main add-travel-info">
        <Modal.Header data-testid="info-head" closeButton className="info-modal-head">{h1}</Modal.Header>
        <Modal.Body data-testid="info-body" className="info-modal-body">{p}</Modal.Body>
      </Modal>
      </div>
    </div>
  );
};

export default Info;
