import React from "react";

import style from './WalaaOfferings.module.scss';
import Title from "./Title/Title";
import Card from "./Card/Card";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";

const WalaaOfferings:React.FC = () => {
    const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

    return (
        <div className={style.container}>
            <Title title={languageData?.walaa_offerings} description={languageData?.insurance_made_easy_just_for_you} />
            <Card cardDetails={undefined} />
        </div>
    )
}

export default WalaaOfferings;