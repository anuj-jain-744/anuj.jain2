import React from "react";
import style from "./SelectYourPolicy.module.scss";
import product from "assets/PolicySelection/productOfferings.svg";
import Flight from "assets/Travel/FlightIcon.svg"
import verticalLine from "assets/PolicySelection/verticleline.svg";
import radioActive from "assets/PolicySelection/radioActive.svg";  
import radioDeactive from "assets/PolicySelection/radioDeactive.svg"; 
import PolicyNotification from "./PolicyNotification";
import { LanguageData } from "types/languageData";

interface Props {
    policyNumber: string;
    isSelected: boolean;
    isNotificationEnable?: boolean;
    onSelect: (policyNumber: string, endorsementNo: string, productCode?: string) => void;
    languageData: LanguageData | undefined | null;
    endorsementNumber: string;
    productCode: string;
}

const SelectYourPolicy: React.FC<Props> = ({ 
    policyNumber,
    isSelected,
    isNotificationEnable,
    onSelect,
    languageData,
    endorsementNumber,
    productCode
}) => {
    const handleClick = () => {
        onSelect(policyNumber, endorsementNumber, productCode);
    };

    // TODO: Sample data - replace when api available/details are available
    const carModal = '7403 - RUA';
    const sumInsure = 'SAR 40,000.00';
    const premiumVal = 'SAR 1,500';

    return (
        <div 
            className={isSelected ? `${style.container} ${style.policyActive}` : `${style.container} ${style.policyDeactive}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className={style.titleContainer}>
                <div className={style.formVeiw}>
                    <div className={style.formViewContainer}>
                        <div className={style.iconContainer}>
                            {productCode === 'TRVL' ? (
                                <img src={Flight} alt="" />
                            ) : (
                            <img src={product} alt="" />
                            )}
                        </div>
                        <div className={style.inputContainer}>
                            <div className={style.inputContainerValue}>
                                <div className={style.titleLabel}>{`${languageData?.policy_placeholder?.replace(/#/g, '')} NO.`}</div>
                                <div className={style.titleLabelInput}>{policyNumber}</div>
                            </div>
                        </div>
                    </div>
                    <img src={isSelected ? radioActive : radioDeactive} alt="active radio" />
                </div>
                <div className={style.activeTagContainer}>
                    <div className={style.activeTagText}>{languageData?.active}</div>
                </div>
            </div>
            <div className={style.frameContainer}>
                <div className={style.row}>
                    <div className={style.formViewContainer}>
                        <div className={style.formVeiwLabel}>{languageData?.nissan_magnite_xe}</div>
                        <div className={style.formViewValue}>{carModal}</div>
                    </div>
                    <img src={verticalLine} alt="verticalLine" />
                    <div className={style.formViewContainer}>
                        <div className={style.formVeiwLabel}>{languageData?.sum_insured}</div>
                        <div className={style.formViewValue}>{sumInsure}</div>
                    </div>
                </div>
                <div className={style.row}>
                    <div className={style.formViewContainer}>
                        <div className={style.formVeiwLabel}>{languageData?.coverage_plan}</div>
                        <div className={style.formViewValue}>{languageData?.comprehensive}</div>
                    </div>
                    <img src={verticalLine} alt="verticalLine" />
                    <div className={style.formViewContainer}>
                        <div className={style.formVeiwLabel}>{languageData?.premium_amount}</div>
                        <div className={style.formViewValue}>{premiumVal}</div>
                    </div>
                </div>
                {isNotificationEnable && <PolicyNotification languageData={languageData} />}
            </div>
        </div>
    );
};

export default SelectYourPolicy;