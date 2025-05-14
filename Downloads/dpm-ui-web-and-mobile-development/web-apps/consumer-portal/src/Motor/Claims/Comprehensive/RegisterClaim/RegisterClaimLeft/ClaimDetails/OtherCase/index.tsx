import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import { Card } from "react-bootstrap";
import ThemeDatePicker from "../../../../../../../claims/components/ThemeDatePicker";
import React, { useContext, useEffect, useState } from "react";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import ThemeSelect from "components/ThemeSelect";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DataContext } from "DataContext";
import {
  comprehensiveOD,
  estAmountOthers,
  lossDate,
  lossType,
} from "../../../../../../../constant";
import UploadDocss from "../UploadDocss";

//other case
//date picker
type OwnerDOB = {
  name: string;
  value: string;
};

interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}

interface IOtherCase {
  onChangehandler: (event: React.FormEvent<HTMLDivElement>) => void;
  errorValue: string;
  estimateErrorValue: string;
  onLossDateChangehandler: (name: string, value: string) => void;
  type: string;
  setFileData: React.Dispatch<
    React.SetStateAction<
      (null | {
        docType: string;
        fileName: string;
        fileExtension: string;
        docFile: string;
      })[]
    >
  >;
}

const OtherCase: React.FC<IOtherCase> = ({
  onChangehandler,
  errorValue,
  estimateErrorValue,
  onLossDateChangehandler,
  type,
  setFileData
}) => {
  // cms content
  const data = useContext(DataContext);

  //other case
  //date picker
  const [ownerDOB, setOwnerDOB] = useState<OwnerDOB>({
    name: "DOB",
    value: "",
  });
  //od/tpl loss type data
  const [lossTypeData, setLossType] = useState<{ id: number; name: string }[]>(
    []
  );
  const [ownerDOBError, setOwnerDOBError] = useState("");
  const [calendarType, setCalendarType] = useState<string>("Gregorian"); //Hijri or Gregorian

  //upload fileData state
    const [fileData, setFileDataOthers] = useState<(FileData | null)[]>([null]);

  //other case
  //onchange date handler for date picker
  const dateHandler = (dateDOB: Date) => {
    if (dateDOB) {
      const day = dateDOB.day.toString().padStart(2, "0");
      const month = dateDOB.month.toString().padStart(2, "0");
      const year = dateDOB.year;

      const dateString = `${day}/${month}/${year}`;
      const datePattern =
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
      if (datePattern.test(dateString)) {
        setOwnerDOB({
          name: "DOB",
          value: dateString,
        });
        setOwnerDOBError("");
        onLossDateChangehandler(lossDate, dateString);
      }
    } else {
      setOwnerDOBError(data?.date_is_not_in_correct_for);
      onLossDateChangehandler(lossDate, "");
    }
  };

  //change handler(select loss type) return accept fn
  const changeSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, options } = event.target;
    onChangehandler({target:{name: lossType, value: value}} as unknown as React.FormEvent<HTMLDivElement>)
  };

  //get loss type data from api
  useEffect(() => {
    if (type === comprehensiveOD) {
      setLossType([]);
      data?.vehicle_claim_types?.map(
        (item: { key: number; value: string }, index: number) => {
          setLossType((prevLossTypeData) => [
            ...prevLossTypeData,
            {
              id: index + 1,
              name: item.value,
            },
          ]);
        }
      );
    } else {
      setLossType([]);
      data?.accident_claim_types?.map(
        (item: { key: number; value: string }, index: number) => {
          setLossType((prevLossTypeData) => [
            ...prevLossTypeData,
            {
              id: index + 1,
              name: item.value,
            },
          ]);
        }
      );
    }
  }, [data]);

  //file upload update parent component
  useEffect(() => {
      setFileData(fileData);
  }, [fileData]);
  return (
    <React.Fragment>
      <div className="px-4 mx-2">
        <Card className="right-card">
          <div className="header">
            <div className="header-content">
              <div className="content">
                <div className="walaa-medium-500 policy-number">
                  {data?.registration_details}
                </div>
              </div>
            </div>
          </div>

          <div className="date w-100">
            <div className="row d-flex w-100">
              <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400">
                <div className="row d-flex flex-column">
                  <div className="col">
                    <TypographyAndIcon
                      text={data?.date_of_loss}
                      required={true}
                    />
                  </div>
                  <div className="col">
                    <ThemeDatePicker
                      name={lossDate}
                      placeholder={data?.select_date}
                      onChangehandler={dateHandler}
                      value={ownerDOB?.value as unknown as Date}
                      format="DD/MM/YYYY"
                      calendarType={calendarType}
                      errorValue={ownerDOBError}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 walaa-regular-400"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* estimate details */}
      <div className="px-4 mx-2 other-case-estimate-det">
        {/* estimate details */}
        <Card className="right-card h-auto">
          <div className="header">
            <div className="header-content">
              <div className="content">
                <div className="walaa-medium-500 policy-number">
                  <TypographyAndIcon
                    text={data?.estimate_details}
                    required={false}
                    isIcon={false}
                    tooltip={false}
                  />
                  <InfoOutlinedIcon className="outlined-icn" />
                </div>
              </div>
            </div>
          </div>

          <div className="row w-100">
            <div className="col-sm-12 col-md-6">
              <div className="d-flex flex-column">
                <div className="col walaa-regular-400">
                  <TypographyAndIcon text={data?.loss_type} required={true} />
                </div>
                <div className="col walaa-regular-400 pt-2">
                  <ThemeSelect
                    name={data?.accident_type}
                    data={lossTypeData || []}
                    isLoading={false}
                    onChangehandler={changeSelectHandler}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="d-flex flex-column">
                <div className="col walaa-regular-400">
                  <TypographyAndIcon
                    text={data?.estimated_amount_in_sar}
                    required={true}
                  />
                </div>
                <div className="col walaa-medium-500">
                  <ThemeTextbox
                    name={estAmountOthers}
                    placeholder={data?.enter_estimated_amount}
                    type="number"
                    onChangehandler={onChangehandler}
                    errorValue={estimateErrorValue}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row w-100">
            <div className="col-sm-12 col-md-6">
              <div className="d-flex flex-column">
                <div className="col walaa-regular-400">
                  <TypographyAndIcon
                    text={data?.taqdeer_no_optional}
                    required={false}
                  />
                </div>
                <div className="col radio-button-group-container">
                  <ThemeTextbox
                    name="taqdeerNo"
                    placeholder={data?.enter + data?.taqdeer_no_optional}
                    type="number"
                    onChangehandler={onChangehandler}
                    errorValue={errorValue}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6"></div>
          </div>
        </Card>
        {/* upload */}
        <div className="container uploadAccordion px-4 py-0">
          <UploadDocss
            fileData={fileData}
            setFileData={setFileDataOthers}
            languageData={data || {}}
            isOthersCase={true}
          />
        </div>
        {/* upload end */}
      </div>
      {/* estimate details end */}

      <div className="px-4 mx-2">
        <div className="row">
          <div className="col pt-4">
            <div className="d-flex flex-column">
              <div>{data?.description_of_loss}</div>
              <div className="register-contact-estimate-value walaa-medium-500">
                <ThemeTextarea
                  placeholder={data?.description_of_loss + "..."}
                  classes="themetextarea-cust"
                  name={data?.description_of_loss}
                  onChangehandler={onChangehandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default OtherCase;
