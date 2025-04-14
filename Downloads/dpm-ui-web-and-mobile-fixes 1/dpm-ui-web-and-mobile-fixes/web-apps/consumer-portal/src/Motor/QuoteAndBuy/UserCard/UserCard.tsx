import React, { } from "react";
import style from "./UserCard.module.scss";
import userIcon from "assets/QuoteAndBuy/userIcon.svg";
import { LanguageData } from "types/languageData";
import { capitalizeNameFirstLetter, getLabelOfIqmaIdNationalId } from "@dpm/shared-module";
import { useLocation } from "react-router-dom";
import { reverseArabic } from "utils/reverseArabic";

interface UserCardProps {
    languageData: LanguageData | undefined | null;
}

const UserCard: React.FC<UserCardProps> = ({ languageData }) => {
    const location = useLocation();
    const propsData = location?.state?.data;
    const ownerFullNameEnglishCapitalized = capitalizeNameFirstLetter(propsData?.ownerDetail?.ownerFullNameEnglish);

    return (
        <div className={style.container}>
            <div className={style.frame}>
                <div className={style.cardContainer}>
                    <div className={style.cardFrame}>
                        <div className={style.titleContainer}>
                            <div className={style.titleFrame}>
                                <img src={userIcon} alt="user icon" />
                                <div className={style.titleTextContainer}>
                                    <div className={style.titleLabel}>{ownerFullNameEnglishCapitalized}</div>
                                    <div className={style.titleValue}>{reverseArabic(propsData?.ownerDetail?.ownerFullNameArabic ?? "")}</div>
                                </div>
                            </div>
                        </div>
                        <hr className={style.horizontalLine} />
                        <div className={style.valueContainer}>
                            <div className={style.formContainer}>
                                <div className={style.formLabel}>{languageData ? getLabelOfIqmaIdNationalId(propsData?.ownerId, languageData) : ""}</div>
                                <div className={style.formValue}>{propsData?.ownerId}</div>
                            </div>
                            <div className={style.formContainer}>
                                <div className={style.formLabel}>{languageData?.mobile_number}</div>
                                <div className={style.formValue}>{propsData?.mobileNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCard;