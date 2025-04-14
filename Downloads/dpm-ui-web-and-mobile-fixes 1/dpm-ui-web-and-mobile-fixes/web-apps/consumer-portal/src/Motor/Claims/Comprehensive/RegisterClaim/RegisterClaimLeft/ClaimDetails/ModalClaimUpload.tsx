import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import UploadFiles from "components/UploadFiles/UploadFiles";

interface IModalClaimUpload {
  changeHandlerFiles: (data: any) => void;
  checkHandler: (name: string, valid: boolean) => void;
}
const ModalClaimUpload = ({
  changeHandlerFiles,
  checkHandler,
}: IModalClaimUpload) => {
  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; size: number; base64: string }[]
  >([]);

  //files upload final data files
  const onChangeFileDatahandler = (Filesdata: any) => {
    setFileData(Filesdata);
  };

  //sending back complete uploaded file list
  useEffect(() => {
    changeHandlerFiles(fileData);
  }, [fileData]);

  return (
    <React.Fragment>
      {/* <Alert variant="info" className="register-new-claim-comprehensive-alert">
        <div className="row">
          <div className="col-1">
            <ReportGmailerrorredIcon fontSize="large" />
          </div>
          <div className="col walaa-regular-400 ps-0">
            Since you do not agree to the Walaa Liability, please upload the
            supporting document for same.
          </div>
        </div>
      </Alert> */}
      <div className="row">
        <div className="col">
          <UploadFiles
            changeHandler={onChangeFileDatahandler}
            checkHandler={checkHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalClaimUpload;
