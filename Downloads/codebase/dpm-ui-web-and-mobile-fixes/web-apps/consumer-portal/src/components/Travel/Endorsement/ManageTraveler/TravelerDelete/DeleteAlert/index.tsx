import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CloseIcon from '@mui/icons-material/Close';


interface IDeleteAlert {
   title: string;
   handleAlertClose():void;
  
}

const DeleteAlert: React.FC<IDeleteAlert> = React.memo(({title, handleAlertClose}) => {

  return (
    <div className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
    <div className="d-flex">
    <CheckCircleIcon className="me-2 check-circle" data-testid="CheckCircleIcon"/>
      <div className="toast-body">
     {title}
     </div>
      <button type="button" className="btn-close me-2" data-bs-dismiss="toast" aria-label="Close" onClick={handleAlertClose}></button>
    </div>
  </div>
   
   
  );
});

export default DeleteAlert;
