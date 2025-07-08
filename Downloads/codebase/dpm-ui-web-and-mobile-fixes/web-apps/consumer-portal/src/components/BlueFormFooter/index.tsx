import React from "react";
import ThemeButton from "claims/components/ThemeButton";
import './index.scss';

interface BlueFormFooterProps {
    isDisabled?: boolean;
    backBtnClickHandler: ()=>void;
    submitClickHandler?: ()=>void;
    isVisibleSubmitButton: boolean;
}
 
export const BlueFormFooter: React.FC<BlueFormFooterProps> = ({isDisabled,backBtnClickHandler,submitClickHandler,isVisibleSubmitButton=true}) => {
    return ( 
        <div className="blue-form-footer-main">
                    <div className="footer">
                      <div className="footer-btns walaa-medium-500">
                        <div>
                          <ThemeButton
                            classes={"back-btn"}
                            isDisabled={false}
                            title="Back"
                            variant="link"
                            icon={true}
                            iconName="ChevronLeftIcon"
                            dataTestId="back-id"
                            onClickhandler={backBtnClickHandler}
                          />
                        </div>
                        {isVisibleSubmitButton && <div>
                          <ThemeButton
                            classes={
                                !isDisabled
                                ? "form-btn-container form-btn-enabled"
                                : "form-btn-container form-btn-disabled"
                            }
                            isDisabled={isDisabled}
                            title="Submit"
                            variant="link"
                            icon={false}
                            iconRight={true}
                            iconName="ChevronRightIcon"
                            dataTestId="Submit-id"
                            onClickhandler={submitClickHandler}
                          />
                        </div>}
                      </div>
                    </div>
                  </div>
     );
}
 