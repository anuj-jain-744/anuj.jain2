import React from "react";
import { Alert } from "react-bootstrap";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { sanitizeHtml } from "@dpm/shared-module";

interface ISeniorCitizenAlert {
   message: string;
  }

const SeniorCitizenAlert: React.FC<ISeniorCitizenAlert> = React.memo(({message}) => {
   return (
    <Alert className="d-flex alert-message">
      <GppMaybeOutlinedIcon className="me-2 align-self-start svg-stroke" />
      {/* <div>{message}</div> */}
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(message) }}></div>
      </Alert>
  );
});

export default SeniorCitizenAlert;
