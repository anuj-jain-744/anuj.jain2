import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { slices } from "@dpm/shared-module";
import { Button, Modal } from "react-bootstrap";
import TravelerFamily from "./TravelerFamily";

export type Traveler = {
  id: number;
  name: string;
  passportNo: string;
  passportExpiry: string;
  dob: string;
  relation: "Daughter" | "Son" | "Spouse";
  type: "Adult" | "Child" | "Senior Citizen";
};

interface TravelAddProps {
  data: { [key: string]: string };
  onClose: () => void;
  show: boolean;
  childCount: number;
  adultCount: number;
  srCitizenCount: number;
}

const generateTraveler = () => ({
  id: `${Date.now()}`,
  name: "",
  passportNo: "",
  passportExpiry: "",
  dob: "",
  relation: "",
  coverageCode: [],
});
const TravelAddForm: React.FC<TravelAddProps> = ({
  data,
  show,
  onClose,
  childCount,
  adultCount,
  srCitizenCount,
}) => {
  const [childData, setChildData] = useState<Traveler[]>([]);
  const [adultData, setAdultData] = useState<Traveler[]>([]);
  const [srCitizenData, setSrCitizenData] = useState<Traveler[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [activeAccordionkey, setAtiveAccordionkey] = useState<string | null>(
    null
  );
  const totalTravelers = childCount + adultCount + srCitizenCount;
  const [formValidy, setFormValidity] = useState<boolean[]>([]);

  useEffect(() => {
    setChildData(Array.from({ length: childCount }, () => generateTraveler()));
  }, [childCount]);

  useEffect(() => {
    setAdultData(Array.from({ length: adultCount }, () => generateTraveler()));
  }, [adultCount]);

  useEffect(() => {
    setSrCitizenData(
      Array.from({ length: srCitizenCount }, () => generateTraveler())
    );
  }, [srCitizenCount]);

  useEffect(() => {
    setFormValidity(Array(totalTravelers).fill(false));
  }, [childCount, adultCount, srCitizenCount]);

  const handleValidityChange = (index: number, isValid: boolean) => {
    setFormValidity((prev) => {
      const updated = [...prev];
      updated[index] = isValid;
      return updated;
    });
  };

  useEffect(() => {
    const isAllValid = formValidy.every((valid) => valid === true);
    setIsDisabled(!isAllValid);
  }, [formValidy]);

  const dispatch = useDispatch();
  const { addEndorsementTraveler } = slices.endorsementTravelers;

  useEffect(() => {
    if (show) {
      if (childCount > 0) {
        setAtiveAccordionkey("child-0");
      } else if (adultCount > 0) {
        setAtiveAccordionkey("adult-0");
      } else if (srCitizenCount > 0) {
        setAtiveAccordionkey("senior-0");
      }
    }
  }, [adultCount, childCount, show, srCitizenCount]);

  const handleSubmit = () => {
    const allTravelers = [...childData, ...adultData, ...srCitizenData];

    allTravelers.forEach((traveler) => {
      dispatch(
        addEndorsementTraveler({
          ...traveler,
          id: traveler.id,
          coverageCode: traveler.coverageCode || [],
        })
      );
    });
    onClose();
  };

  return (
    <div className="traveler-endorsement-add-container">
      <Modal
        show={show}
        centered
        onHide={onClose}
        className="modal-lg delete-travel-modal-main"
      >
        <Modal.Header closeButton className="info-modal-head">
          <Modal.Title>{data?.add_traveller_button}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-modal-body">
          {childCount > 0 &&
            [...Array(childCount)].map((_, i) => (
              <TravelerFamily
                key={`child-${i}`}
                sectionKey={`child-${i}`}
                activeAccordionkey={activeAccordionkey}
                setAtiveAccordionkey={setAtiveAccordionkey}
                setTravelers={setChildData}
                travelers={childData}
                travelerIndex={i}
                globalIndex={i}
                count={1}
                data={data}
                familyType={data?.child_title}
                onValidityChange={handleValidityChange}
              />
            ))}

          {adultCount > 0 &&
            [...Array(adultCount)].map((_, i) => (
              <TravelerFamily
                key={`adult-${i}`}
                sectionKey={`adult-${i}`}
                activeAccordionkey={activeAccordionkey}
                setAtiveAccordionkey={setAtiveAccordionkey}
                setTravelers={setAdultData}
                travelers={adultData}
                travelerIndex={i}
                globalIndex={childCount + i}
                count={1}
                data={data}
                familyType={data?.adult_title}
                onValidityChange={handleValidityChange}
              />
            ))}
          {srCitizenCount > 0 &&
            [...Array(srCitizenCount)].map((_, i) => (
              <TravelerFamily
                key={`senior-${i}`}
                sectionKey={`senior-${i}`}
                activeAccordionkey={activeAccordionkey}
                setAtiveAccordionkey={setAtiveAccordionkey}
                setTravelers={setSrCitizenData}
                travelers={srCitizenData}
                travelerIndex={i}
                globalIndex={childCount + i}
                count={1}
                data={data}
                familyType={data?.sr_citizen_title}
                onValidityChange={handleValidityChange}
              />
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary add-cancel-btn" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TravelAddForm;
