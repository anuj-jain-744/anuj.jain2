import React from 'react';
import './index.scss';
import { Modal } from 'react-bootstrap';

interface AlertBoxProps {
  title: string | undefined;
  description: string | undefined;
  showAlertModal: boolean;
  setShowAlertModal: (show: boolean) => void;
  classes?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = (data) => {

  return (
    <>
      {/* Modal */}
      {/* show={data.showAlertModal} onHide={() => data.setShowAlertModal(false)} */}
      <Modal dialogClassName={
        data?.classes
          ? `alert-box-modal ${data?.classes}`
          : 'alert-box-modal type-warning'
      } centered show={data.showAlertModal}>
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Body>
          <div className='alert-box-container'>
            <div className='alert-frame'>
              <div className='material-icons-warning'>
                <div className='vector' />
              </div>
              <div className='frame-1'>
                <span className='information'>{data?.title}</span>
                <span className='simple-alert'>
                  {data?.description}
                </span>
              </div>
            </div>
            <div className='icons-material-icons-close' role='button' tabIndex={0} onClick={() => data.setShowAlertModal(false)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                data.setShowAlertModal(false);
              }
            }}>
              <div className='vector-2' />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
