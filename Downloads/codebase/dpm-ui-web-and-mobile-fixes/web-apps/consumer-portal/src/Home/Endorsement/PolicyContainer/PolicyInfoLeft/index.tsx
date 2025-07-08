import { FC, useState } from "react";
import { LanguageData } from "types/languageData";
import AddBenefits from './AddBenefits';
import TermsAndCon from "claims/register/compensation/TermsAndCon";
import "./index.scss"
import { HOME } from "constant";

interface PolicyCardProps {
  languageData: LanguageData;
  policyDetails: any;
  handleSelectAddBenefits: (value: string) => void;
  setIsTermCondition: (value: boolean) => void;
}

const PolicyInfoLeft: FC<PolicyCardProps> = ({ policyDetails, languageData, handleSelectAddBenefits, setIsTermCondition }) => {
  const { viewPolicy, benefitsClaimed, isBenefitLoaded, isTermCondition } = policyDetails;
  const [selectedEndorsement, setSelectedEndorsement] = useState<string>();

  const handleOnChange = (label: string) => () => {
    setSelectedEndorsement(label);
  }

  const endorsements = ['Add Benefits'];
  const ADD_BENEFITS = 'Add Benefits';

  return (
    <div className="policy-claim-left-card">
      {viewPolicy ? <div className="policy-claim-container">
        <div className="select-policy-header walaa-medium-500">
          {languageData?.select_endorsement}
        </div>
        <hr className="horizontal-line" />
        <div className="endorsement-box-container">
          {endorsements.map((item, index) => {
            // set the classname to load the background image by using endorsements array value
            const name = item?.replace(/\s+/g, '-').toLowerCase();
            return (<button key={"endorsement_button_"+index} className={`endorsement-box-wrapper ${selectedEndorsement === item ? 'selected' : ''}`} onClick={handleOnChange(item)}>
              <div className={`${name}-background`}>
                <div className="radio-box-content">
                  <div className="d-flex align-items-center">
                    <div className="policy-radio-box">
                      <div className="policy-radio-box-circle"></div>
                    </div>
                    <div className="label-name">{item}</div>
                  </div>
                </div>
              </div>
            </button>
            )
          })}
        </div>
      </div> : ''}
      {(viewPolicy && selectedEndorsement === ADD_BENEFITS) &&
        <>
          <AddBenefits languageData={languageData} viewPolicy={viewPolicy} isBenefitLoaded={isBenefitLoaded} benefitsClaimed={benefitsClaimed} handleSelectAddBenefits={handleSelectAddBenefits} />
          {policyDetails?.endorsementNo && <TermsAndCon
            languageData={languageData}
            isChecked={isTermCondition}
            productcode={HOME}
            setIsChecked={setIsTermCondition} />}
        </>
      }
    </div>
  );
};

export default PolicyInfoLeft;