import React, { useState } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import "./index.scss";
import DownhillSkiingOutlinedIcon from "@mui/icons-material/DownhillSkiingOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import Info from "../../TravelerAddDetails/info";
import { FullCalender } from "components/Calendar/fullcalender";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import Delete from '../../../assets/Travel/Delete.svg';
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface TravelerAdultProps {
    noOfAdults: number;
    data: {[key: string]: string};
}
interface Traveler{
    adultName: string;
    adultPassport: string;
    adultPassportExp: string;
    adultDob: string;
    adultRelation: string;
    policyCoverage: Array<{coverageCode: string}>;
}

const TravelerAdult: React.FC<TravelerAdultProps> = ({
  noOfAdults,
    data,
}) => {
  const [travelers, setTravelers] = useState<
  Array<{
    adultName: string;
    adultPassport: string;
    adultPassportExp: string;
    adultDob: string;
    adultRelation: string;
    policyCoverage: Array<{coverageCode: string}>;
  }>
>([]);
const [winterBenfit, setWinterBenfit] = useState<boolean>(false);
const [covidBenfit, setCovidBenfit] = useState<boolean>(false);
const [passportExpiryDate, setPassportExpiryDate] = useState<string>("");
const [adultDOB, setAdultDOB] = useState<string>("");
const [validation, setValidation] = useState<number>(0);
const [isOn, setIsOn] = useState<boolean>(false);
const { adultCount, setAdultCount, adultTravelerObj, } = useQuoteAndBuyContext();
const handleAddBenefit = (benefit: string, status: boolean) => {
  if (benefit === "winter") {
    setWinterBenfit(!status);
  } else if (benefit === "covid") {
    setCovidBenfit(!status);
  }
};
const [test, setTest]=useState([]);

const mapUpdateTravellers=(prevTravelers:Traveler[],index:number, field: string | {coverageCode: string})=>{
  const updatedTravelers = [...prevTravelers];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: test.filter((item, index, current) =>
           index === current.findIndex(t => t.coverageCode === item.coverageCode)),
      };
      return updatedTravelers;
}

const handleInputChange = (
  index: number,
  field: string | {coverageCode: string},
  value: string | number | {coverageCode: string}
) => {
  let formattedDate = "";
  if (field === "adultPassportExp" || field === "adultDob") {
    formattedDate = value.toLocaleString();
  }
  if (field === "policyCoverage") {
    setTest([...test, value]);
    setTravelers((prevTravelers) => {
      const updatedTravelers = mapUpdateTravellers(prevTravelers,index,field)
      return updatedTravelers;
    });
  } 
  else {
    setTravelers((prevTravelers) => {
      const updatedTravelers = [...prevTravelers];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: formattedDate ? formattedDate : value,
      };
      return updatedTravelers;
    });
  }
};

const handleRemoveCoverage = (i:number, benfit: string) => {
  setTravelers((prevTravelers) => {
    const updatedTravelers = [...prevTravelers];
    updatedTravelers[i] = {
      ...updatedTravelers[i],
      policyCoverage: updatedTravelers[i].policyCoverage.filter((item) => item.coverageCode !== benfit),
    };
    return updatedTravelers;
  });
};


const dateChange = (value: Date | null, type: string) => {
  const formattedDate = value.toLocaleString();
  if (type === "passport") setPassportExpiryDate(formattedDate);
  else if (type === "dob") setAdultDOB(formattedDate);
};

/*const  SelectRelation = (i:number) => {
  const realtion = Array.isArray(data?.relations) ? data.relations : [];
  return (
    <Form.Select aria-label="Default select realtion-select" size="lg">
      <option>Select</option>
      {realtion.map((relation: string) => (
        <option onSelect={()=>handleInputChange(i, "adultRelation", relation)} value={relation}>{relation}</option>
      ))}
    </Form.Select>
  );
}*/

// const renderTravelerInputs = () => {
//   const inputs = [];
//   for (let i = 1; i < adultCount; i++) {
//     inputs.push(
//       <>
//       <Row className="mb-3 form-block-1" controlId="formName" style={{display:'flex'}} key={i}>
//         <Col>
//           <div className="form-element">
//             <div className="form-element-label">
//               {data?.traveller_name}
//               <span className="text-danger">*</span>
//             </div>

//             <Form.Control
//               placeholder="Enter Name"
//               className="form-element-field"
//               type="text"
//               value={travelers[i]?.adultName || ""}
//               onChange={(e) =>
//                 handleInputChange(i, "adultName", e.target.value)
//               }
//             />
//           </div>
//         </Col>

//         <Col>
//           <div className="form-element">
//             <div className="form-element-label">
//               {data?.traveller_passport_no}
//               <span className="text-danger">*</span>
//             </div>
//             <Form.Control
//               placeholder={data?.traveller_passport_no_placeholder}
//               className="form-element-field"
//               type={travelers[i]?.adultPassport || ""}
//               onChange={(e) =>
//                 handleInputChange(
//                   i,
//                   "adultPassport",
//                   parseInt(e.target.value)
//                 )
//               }
//             />
//           </div>
//         </Col>

//         <Col>
//           <div className="form-element">
//             <div className="form-element-label">
//               {data?.traveller_passport_exp_date}
//               <span className="text-danger">*</span>
//               <Info popUpData={data?.passport_info} />
//             </div>
//           </div>

//           <FullCalender
//             value={passportExpiryDate}
//             setValue={() => dateChange(passportExpiryDate, "passport")}
//             format={"DD/MM/YYYY"}
//             isOn={isOn}
//             showSwitch={false}
//             setIsOn={setIsOn}
//             placeholder={data?.traveller_passport_exp_date_placeholder}
//           />
//         </Col>
//       </Row>
//       <Row className="mb-3 form-block-2">
//         <Col xs={6} md={4}>
//           <div className="form-element">
//             <div className="form-element-label">
//               {data?.traveller_dob}
//               <span className="text-danger">*</span>
//             </div>
//           </div>

//           <FullCalender
//             value={adultDOB}
//             setValue={() => dateChange(adultDOB, "dob")}
//             format={"DD/MM/YYYY"}
//             isOn={isOn}
//             showSwitch={false}
//             setIsOn={setIsOn}
//             placeholder={data?.traveller_dob_placeholder}
//             minDate={false}
//           />
//         </Col>
//         <Col xs={6} md={4}>
//           <div className="form-element">
//             <div className="form-element-label">
//               {data?.traveller_relation}
//               <span className="text-danger">*</span>
//             </div>

//             {SelectRelation()}
//           </div>
//         </Col>
//       </Row>
//       </>
//     );
//   }
//   return inputs;
// };
//accordion opened/not state
const [isOpen, setOpen] = useState<boolean>(false);
//accordion on body open handler fn
const clickEnterHandler = () => {
  setValidation(1);
  setOpen(true);
};
//accordion on body close handler fn
const clickExitHandler = () => {
  setOpen(false);
};

const checkStringAvailability = (str: string, arr: Array<{ [key: string]: string }>): boolean => {
  return arr.some(obj => Object.values(obj).includes(str));
};


return (
  <>
    {adultCount > 0 &&
      Array.from({ length: adultCount }, (_, i) => (
        <>
          <Accordion
            className={`${
              isOpen ? "accor-open" : "accor-close"
            } w-100 coverage-travelinfo`}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="acc-head">
                  <div className="acc-head-strip"></div>
                  <span
                    className={`${
                      validation === 2
                        ? "acc-head-validation-success"
                        : `${
                            validation === 1
                              ? "acc-head-validation-error"
                              : "acc-head-validation-inactive"
                          }`
                    }
                      }`}
                  ></span>
                  {/* <div className="acc-head-title"> */}
                  <div className="acc-head-titles-align">
                    {data?.adult_title} {i + 1} &nbsp;
                    <div className="acc-head-strip-sub">Traveler {i + 1}</div>
                  </div>
                  {validation === 1 ? (
                    <div className="text-incomplete">
                      <GppMaybeOutlinedIcon className="acc-warning-icon" />
                      {data?.incomplete}
                    </div>
                  ) : null}
                  {/* </div> */}
                  {/* <div className="acc-head-strip-sub">35 Years</div> */}
                </div>
                <div className="acc-delete">
                  <img src={Delete} alt="delete" className="delete-icon" />
                </div>
              </Accordion.Header>
              <Accordion.Body
                onEntered={clickEnterHandler}
                onExiting={clickExitHandler}
                className="p-2 acc-body"
              >
                <div className="container mt-4">
                  <Form>
                    <Row className="mb-3 form-block-1" controlId="formName">
                      {/* {renderTravelerInputs()} */}
                      <Row
                        className="mb-3 form-block-1"
                        controlId="formName"
                        style={{ display: "flex" }}
                        key={i}
                      >
                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_name}
                              <span className="text-danger">*</span>
                            </div>

                            <Form.Control
                              placeholder="Enter Name"
                              className="form-element-field"
                              type="text"
                              value={travelers[i]?.adultName || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  "adultName",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </Col>

                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_passport_no}
                              <span className="text-danger">*</span>
                            </div>
                            <Form.Control
                              placeholder={
                                data?.traveller_passport_no_placeholder
                              }
                              className="form-element-field"
                              type={travelers[i]?.adultPassport || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  "adultPassport",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </Col>

                        <Col>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_passport_exp_date}
                              <span className="text-danger">*</span>
                              <Info popUpData={data?.passport_info} />
                            </div>
                          </div>

                          <FullCalender
                            value={travelers[i]?.adultPassportExp}
                            setValue={(value: Date | null) =>
                              handleInputChange(i, "adultPassportExp", value)
                            }
                            format={"DD/MM/YYYY"}
                            isOn={isOn}
                            showSwitch={false}
                            setIsOn={setIsOn}
                            placeholder={
                              data?.traveller_passport_exp_date_placeholder
                            }
                          />
                          {/* <input
            type="hidden"
            value={passportExpiryDate}
            onChange={(e) =>
              handleInputChange(i, "adultPassportExp", passportExpiryDate)
            }
          /> */}
                        </Col>
                      </Row>
                      <Row className="mb-3 form-block-2">
                        <Col xs={6} md={4}>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_dob}
                              <span className="text-danger">*</span>
                            </div>
                          </div>

                          <FullCalender
                            value={travelers[i]?.adultDob}
                            setValue={(value: Date | null) =>
                              handleInputChange(i, "adultDob", value)
                            }
                            format={"DD/MM/YYYY"}
                            isOn={isOn}
                            showSwitch={false}
                            setIsOn={setIsOn}
                            placeholder={data?.traveller_dob_placeholder}
                            minDate={false}
                          />
                        </Col>
                        <Col xs={6} md={4}>
                          <div className="form-element">
                            <div className="form-element-label">
                              {data?.traveller_relation}
                              <span className="text-danger">*</span>
                            </div>
                            <Form.Select
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  "adultRelation",
                                  e.target.value
                                )
                              }
                              aria-label="Default select realtion-select"
                              size="lg"
                            >
                              <option>Select</option>
                              {data?.relations &&
                                Object.keys(data?.relations).map(
                                  (relation: string) => (
                                    <option
                                      selected={
                                        travelers[i]?.adultRelation === relation
                                          ? true
                                          : false
                                      }
                                      value={relation}
                                    >
                                      {data?.relations[relation]}
                                    </option>
                                  )
                                )}
                              {/* {relationsArray && relationsArray.map((relation: string) => (
                <option 
                selected={travelers[i]?.adultRelation === relation ? true : false} 
                value={relation}>{relation}</option>
              ))} */}
                            </Form.Select>
                            {/* {SelectRelation()} */}
                          </div>
                        </Col>
                      </Row>
                    </Row>
                  </Form>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div
            key={i}
            className={`${
              isOpen ? "sub-accor-open" : "sub-accor-close"
            } sub-accordion`}
          >
            <div className="benfit-block">
              <div className="benfit-block-title">{data?.benfit_title}</div>
              <div className="benfit-content">
                <div
                  className={`${
                    !winterBenfit
                      ? "benfit-one"
                      : "benfit-one benfit-one-select"
                  }`}
                >
                  <div className="left-icon">
                    <DownhillSkiingOutlinedIcon />
                  </div>
                  <div className="benfit-data">
                    <div className="benfit-title">
                      {data?.benfit_sports} &nbsp;
                      <Info popUpData={data?.benfit_sports_info} />
                    </div>
                    <div className="benfit-sub-title">
                      {/* Replace with api data */}
                    </div>
                  </div>
                  <div className="benfit-right">
                    <div
                      className={` ${
                        travelers[i]?.policyCoverage &&
                        checkStringAvailability(
                          "WSC",
                          travelers[i]?.policyCoverage
                        )
                          ? "benfit-remove-btn"
                          : "benfit-button"
                      }`}
                    >
                      {checkStringAvailability(
                        "WSC",
                        travelers[i]?.policyCoverage
                      ) ? (
                        <div
                          onClick={() => handleRemoveCoverage(i, "WSC")}
                          className="benfit-button-text"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleRemoveCoverage(i, "WSC");
                            }
                          }}
                        >
                          {` ${
                            checkStringAvailability(
                              "WSC",
                              travelers[i]?.policyCoverage
                            )
                              ? data?.remove_button
                              : data?.add_button
                          }`}
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            handleInputChange(i, "policyCoverage", {
                              coverageCode: "WSC",
                            })
                          }
                          className="benfit-button-text"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleInputChange(i, "policyCoverage", {
                                coverageCode: "WSC",
                              });
                            }
                          }}
                        >
                          {` ${
                            !checkStringAvailability(
                              "WSC",
                              travelers[i]?.policyCoverage
                            )
                              ? data?.add_button
                              : data?.remove_button
                          }`}
                        </div>
                      )}
                      {/* <div
                         onClick={() =>
                          handleInputChange(i, "policyCoverage", {coverageCode: "WSC"})
                         }
                         className="benfit-button-text"
                       >
                         {` ${travelers[i]?.policyCoverage && checkStringAvailability("WSC", travelers[i]?.policyCoverage) ? data?.remove_button : data?.add_button}`}
                       </div> */}
                    </div>
                  </div>
                </div>

                <div className="benfit-content-space"></div>
                <div
                  className={`${
                    !covidBenfit ? "benfit-one" : "benfit-one benfit-one-select"
                  }`}
                >
                  <div className="left-icon">
                    <CoronavirusOutlinedIcon />
                  </div>
                  <div className="benfit-data">
                    <div className="benfit-title">
                      {data?.benfit_covid} &nbsp;
                      <Info popUpData={data?.benfit_covid_info} />
                    </div>
                    <div className="benfit-sub-title">
                      {/* Replace with api data */}
                    </div>
                  </div>
                  <div className="benfit-right">
                    <div
                      className={` ${
                        travelers[i]?.policyCoverage &&
                        checkStringAvailability(
                          "CV",
                          travelers[i]?.policyCoverage
                        )
                          ? "benfit-remove-btn"
                          : "benfit-button"
                      }`}
                    >
                      {checkStringAvailability(
                        "CV",
                        travelers[i]?.policyCoverage
                      ) ? (
                        <div
                          onClick={() => handleRemoveCoverage(i, "CV")}
                          className="benfit-button-text"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleRemoveCoverage(i, "CV");
                            }
                          }}
                        >
                          {` ${
                            checkStringAvailability(
                              "CV",
                              travelers[i]?.policyCoverage
                            )
                              ? data?.remove_button
                              : data?.add_button
                          }`}
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            handleInputChange(i, "policyCoverage", {
                              coverageCode: "CV",
                            })
                          }
                          className="benfit-button-text"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleInputChange(i, "policyCoverage", {
                                coverageCode: "CV",
                              });
                            }
                          }}
                        >
                          {` ${
                            !checkStringAvailability(
                              "CV",
                              travelers[i]?.policyCoverage
                            )
                              ? data?.add_button
                              : data?.remove_button
                          }`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
  </>
); 
        
};

export default TravelerAdult;