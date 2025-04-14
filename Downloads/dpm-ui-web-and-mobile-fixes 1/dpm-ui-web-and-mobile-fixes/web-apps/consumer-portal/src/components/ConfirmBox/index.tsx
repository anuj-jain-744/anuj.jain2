import React from 'react';
import './index.scss';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { LanguageData } from "types/languageData";
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap for modal

interface ConfirmBoxProps {
  title: string;
  showConfirmModal: boolean;
  setConfirmYes: (show: boolean) => void;
  setConfirmNo: (show: boolean) => void;
  languageData?: LanguageData
}

export const ConfirmBox: React.FC<ConfirmBoxProps> = ({ title, showConfirmModal, setConfirmYes, setConfirmNo, languageData }) => {

  return (
    <Modal dialogClassName="alert-box-modal type-info" show={showConfirmModal}>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Body>
        <div className='alert-box-container'>
          <div className='frame'>
            <div className='material-icons-warning'>
              <div className='vector' />
            </div>
            <div className='frame-1'>
              <span className='information'>Your update is not saved. Do you wish to continue?</span>
            </div>
          </div>
          <div className='frameButton'>
            <button onClick={() => setConfirmYes(false)}><CheckCircleOutlineOutlinedIcon /></button>
            <button onClick={() => setConfirmNo(false)}><CancelOutlinedIcon /></button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
