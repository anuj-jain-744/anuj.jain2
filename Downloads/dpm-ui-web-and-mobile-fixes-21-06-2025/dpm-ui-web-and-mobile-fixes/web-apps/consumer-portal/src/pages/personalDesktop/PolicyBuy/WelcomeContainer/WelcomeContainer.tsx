import React from "react";
import style from "./WelcomeContainer.module.scss";
import Chatbot from "../Chatbot/Chatbot";
import {capitalizeNameFirstLetter, RootState}  from "@dpm/shared-module";
import { useSelector } from "react-redux";

interface Props {
  name?: string ;
}

const WelcomeContainer: React.FC<Props> = ({ name = '' }) => {

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  return (
    <div className={`${style.container} container-fluid`}>
      <div className={style.welcomeTextContainer}>
        <div className={style.welcomeText} title={`${capitalizeNameFirstLetter(name)}`}>
          {`${languageData?.welcome} `}
          <span className={style.nameText}>{`${capitalizeNameFirstLetter(name)}`}</span>
        </div>
        <div className={style.subText}>
          {languageData?.your_personalised_ashboard}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default WelcomeContainer;
