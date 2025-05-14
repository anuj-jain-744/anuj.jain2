import React, { useState, useEffect } from "react";
import walaaIcon from "assets/DashboardBanner/walaaIcon.svg";
import style from "./Chatbot.module.scss";
import union from "assets/Dashboard/UnionPattern image.png";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";

interface Props {
    navigateTo?: (url: string) => void;
}

const Chatbot: React.FC<Props> = ({ navigateTo }) => {
  const {languageData} = useSelector((state: RootState) => state.dashbaordLanguageData);
    const [isClicked, setIsClicked] = useState(false);
    const [currentLabelIndex, setCurrentLabelIndex] = useState(0);
    const [isChanging, setIsChanging] = useState(false);

    const subLabels = languageData?.chatbot_labels ?? [];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsChanging(true);
            
            setTimeout(() => {
                setCurrentLabelIndex((prevIndex) => 
                    (prevIndex + 1) % subLabels.length
                );
                setIsChanging(false);
            }, 400); // Delay before changing text
        }, 4000); // Change label every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className={`${style.container} ${isClicked ? style.clicked : ''}`}
        >
            <img src={walaaIcon} alt="walaa icon" />
            <div className={style.textContainer}>
                <div className={style.textLabel}>
                    {languageData?.need_assistance_to}
                </div>
            </div>
            <img src={union} alt="union" className={style.unionImage}/>
            <div className={style.taskContainer}>
                <div className={`
                    ${style.taskLabel} 
                    ${style.animatedLabel} 
                    ${isChanging ? style.labelChanging : ''}
                `}>
                    {subLabels[currentLabelIndex]}
                </div>
            </div>
        </div>
    );
}

export default Chatbot;