import { Card } from "react-bootstrap";
import ThemeTextbox from "../../components/ThemeTextbox";
import ThemeTextarea from "../../components/ThemeTextarea";
import { useContext, useState } from "react";
import { DataContext } from "../../../DataContext";
import TypographyAndIcon from "../../components/TypographyAndIcon";

interface IContactDet {
  selectedVal: string | null;
  onChangehandler: (e: React.FormEvent<HTMLDivElement>) => void;
  data: any;
  compensateError: any;
}

function ContactDet({
  selectedVal,
  onChangehandler,
  data,
  compensateError
}: IContactDet) {
  const [mobVal, setMobVal] = useState<string>(data?.mobile);
  //cms content
  const Data = useContext(DataContext);
  
  // change handler
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobVal(e?.target?.value)
  };
  return (
    <div className="register-contact" onChange={onChangehandler}>
      <Card className="register-contact-card register-row-spacing-top register-row-spacing-bottom">
        <Card.Body className="p-0">
          <div className="flex flex-col">
            <div className="register-contact-title walaa-medium-500">
              {Data?.contact_details}
            </div>
            <div className="row register-row-spacing-top register-row-spacing-bottom">
              <div className="col-sm-12 col-md-6">
                <div className="register-contact-estimate">
                  <div className="register-contact-estimate-title walaa-regular-400">
                    <TypographyAndIcon
                      text={Data?.mobile_number}
                      required={true}
                    />
                  </div>
                  <div className="register-contact-estimate-value walaa-medium-500">
                    <ThemeTextbox
                      name="mobilenum"
                      placeholder={Data?.placeholder_enter_mobile}
                      type="tel"
                      maxLengthIs={10}
                      value={mobVal}
                      onChangehandler={changeHandler}
                      errorValue={compensateError.mobilenum}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-6">
                <div className="register-contact-estimate">
                  <div className="register-contact-estimate-title walaa-regular-400">
                    <TypographyAndIcon
                      text={Data?.email}
                      // required={true}
                    />
                  </div>
                  <div className="register-contact-estimate-value walaa-medium-500">
                    <ThemeTextbox
                      name="emailId"
                      placeholder={Data?.placeholder_enter_email_id}
                      type="text"
                      errorValue={compensateError.emailId}
                    />
                  </div>
                </div>
              </div>
            </div>
            {selectedVal === "Damage Repairs" && (
              <div className="row register-row-spacing-top register-row-spacing-bottom">
                <div className="col-sm-12">
                  <div className="register-contact-estimate">
                    <div className="register-contact-estimate-title walaa-regular-400">
                      Additional Remarks
                    </div>
                    <div className="register-contact-estimate-value walaa-medium-500">
                      <ThemeTextarea
                        placeholder="Additional remarks..."
                        classes="themetextarea-cust"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ContactDet;
