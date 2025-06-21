import React, { useState } from "react";
import motor from 'assets/DashboardBanner/offeringMotor.png';
import home from 'assets/DashboardBanner/offeringHome.svg';
import travel from 'assets/DashboardBanner/offeringTravel.svg';
import medical from 'assets/DashboardBanner/offeringMedical.png';
import personal from 'assets/DashboardBanner/offeringPersonal.png';
import domestic from 'assets/DashboardBanner/offeringDomestic.svg';
import visitor from 'assets/DashboardBanner/offeringVisitor.svg';
import protection from 'assets/DashboardBanner/offeringProtection.svg';

import style from './Card.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";
import ExpandSection from "components/ExpandSection/ExpandSection";
import { useNavigate } from "react-router-dom";

interface Props {
    cardDetails?: object;
}

interface Offering<T = string | null> {
    icon_class: string;
    title: string;
    description: string;
    flag: T;
    url: string;
}

const iconMap: { [key: string]: string } = {
    motor: motor,
    home: home,
    travel: travel,
    medical: medical,
    personal: personal,
    domestic: domestic,
    visitor: visitor,
    protection: protection,
};

const getIcon = (iconClass: string) => {
    return iconMap[iconClass] || motor;
};

const Card: React.FC<Props> = ({ cardDetails }) => {
    const navigate = useNavigate();
    const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
    const [showMore, setShowMore] = useState(false);
    const offerings: Offering[] = languageData?.walaa_offering;

    const handleNavigate = (path: string) => {
        path && navigate(path, {
            state: { isProducts: true }
        });
    }

    const handleShowMore = () => {
        setShowMore(true);
    };

    const cardsToDisplayOne = offerings?.length > 3 ? offerings?.slice(0, 4) : offerings;
    const cardsToDisplayTwo = showMore ? offerings?.slice(5) : cardsToDisplayOne

    return (
        <div className={style.container}>
            <div className={style.cardContainer}>
                {cardsToDisplayOne?.map((offering, index) => (
                    <div key={index} className={style.productCardContainer} onClick={() => handleNavigate(`/personal/product/${offering.icon_class}`)}>
                        <img src={getIcon(offering.icon_class)} alt={offering.title} />
                        <div className={style.cardFrameContainer}>
                            <div className={style.textLabel}>{offering.title}</div>
                            <div className={style.descriptionLabel}>{offering.description}</div>
                        </div>
                        {offering.flag && (
                            <div className={style.tagContainer}>
                                <div className={style.tagText}>{offering.flag}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showMore && offerings?.length > 4 && 
            (<div className={style.cardContainer}>
                {cardsToDisplayTwo?.map((offering, index) => (
                    <div key={index} className={`${style.productCardContainer} ${index === 0 ? style.firstCard : style.secondCard}`} onClick={() => handleNavigate(`/personal/product/${offering.icon_class}`)}>
                        <img src={getIcon(offering.icon_class)} alt={offering.title} />
                        <div className={style.cardFrameContainer}>
                            <div className={style.textLabel}>{offering.title}</div>
                            <div className={style.descriptionLabel}>{offering.description}</div>
                        </div>
                        {offering.flag && (
                            <div className={style.tagContainer}>
                                <div className={style.tagText}>{offering.flag}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>)}
            {!showMore && offerings?.length > 4 && (
                <div className={style.discoverMoreContainer}>
                    <ExpandSection text={languageData?.discover_more} onClick={handleShowMore} showDownArrow={true} />
                </div>
            )}
        </div>
    );
};

export default Card;
