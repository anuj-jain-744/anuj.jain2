import React from "react";
import { Alert } from "react-bootstrap";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { sanitizeHtml } from "@dpm/shared-module";

interface ISeniorCitizenAlert {
   message: string;
   isDismissable?:boolean;
   handleAlertDismissal?: () => void
  }

const SeniorCitizenAlert: React.FC<ISeniorCitizenAlert> = React.memo(({message, isDismissable = false, handleAlertDismissal}) => {
   return (
    <Alert className="d-flex alert-message" dismissible={isDismissable} onClose={handleAlertDismissal}>
      <GppMaybeOutlinedIcon className="me-2 align-self-start svg-stroke" />
      <div className="walaa-regular-400 sr-msg-color" dangerouslySetInnerHTML={{ __html: sanitizeHtml(message) }}></div>
      </Alert>
  );
});

export default SeniorCitizenAlert;
