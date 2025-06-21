import { Card } from "react-bootstrap";
import React, { useContext, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import PictureAsPdfSharpIcon from "@mui/icons-material/PictureAsPdfSharp";
import { DataContext } from "../../../DataContext";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";

function UploadDoc() {
  const [selectedFile, setSelectedFile] = useState<{
    file: File | null;
    base64: string | null;
  }>({ file: null, base64: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setSelected] = useState<Object | null>(null);

  // Upload file and convert to base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const Objectfile = event.target.files as Object;
    setSelected(Objectfile);

    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "image/jpeg",
        "image/png",
      ];
      if (validTypes.includes(file.type) && file.size <= 3 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setSelectedFile({
            file: file,
            base64: base64,
          });
          console.log("selectedFile", selectedFile);
        };
        reader.onerror = () => {
          console.error("Error occurred while reading file.");
          toast.error("Error occurred while reading file.", {
            icon: <WarningAmberOutlinedIcon />,
            className: "error-cust",
            position: "top-right",
            autoClose: TOAST_AUTOCLOSE_TIMER || false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast.warning("Invalid file type or exceeds size limit (3MB)", {
          icon: <GppMaybeOutlinedIcon />,
          className: "warning-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        alert("Invalid file type or exceeds size limit (3MB)");
        setSelected(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // file list data
  function fileList(key, data) {
    const cancelClickhandler = (nameIs) => {
      const fileListArr = Array.from(files);
      fileListArr.splice(nameIs, 1);
      {fileListArr?.length > 1 ? setSelected(fileListArr) : setSelected(null)}
    };
    return (
      <React.Fragment key={key}>
        <div className="px-4">
          <div className="row register-row-spacing-top register-row-spacing-bottom upload-ribbon-strip">
            <div className="col-sm-12 col-md d-flex align-items-center">
              <PictureAsPdfSharpIcon
                sx={{ color: "red", fontSize: 16 }}
                className="mx-1"
              />
              {files[data]?.name}&nbsp; {files[data]?.size} KB
            </div>
            <div className="col-sm-12 col-md d-flex align-items-center justify-content-end">
              <CancelIcon
                sx={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => cancelClickhandler(key)}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  
   //cms content
   const Data = useContext(DataContext);
  return (
    <div className="register-contact">
      <Card className="register-contact-card register-row-spacing-top register-row-spacing-bottom">
        <Card.Body className="p-0">
          <div className="flex flex-col">
            <div className="register-contact-title walaa-medium-500">
              {Data?.upload_the_supporting_docs}
            </div>
            <div className="row register-row-spacing-top register-row-spacing-bottom">
              <div className="col">
                <div className="register-contact-estimate uploadfncontainer">
                  <div className="register-row-large-spacing-top register-row-large-spacing-bottom">
                    <div className="row register-row-spacing-bottom">
                      <div className="col d-flex justify-content-around">
                        <div className="position-relative">
                          {Data?.drag_and_drop}
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                            onChange={handleFileChange}
                            className="position-absolute input-hidden"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col d-flex justify-content-around">
                       {Data?.supported_formats}
                      </div>
                    </div>
                    <div className="row register-row-spacing-top register-row-spacing-bottom">
                      <div className="col d-flex justify-content-around">
                        {Data?.or}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col d-flex justify-content-around">
                        <div className="walaa-medium-500 btn-outline-primary position-relative">
                          {Data?.browse_files}
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
                            onChange={handleFileChange}
                            className="position-absolute input-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {files && (
                      <React.Fragment>
                        <div className="px-3">
                          <hr className="register-compensate-splitter" />
                        </div>
                        <div className="row">
                          <div className="col d-flex justify-content-around">
                            File upload is completed.
                          </div>
                        </div>
                        {Object.keys(files).map((key, i) => fileList(i, key))}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UploadDoc;
