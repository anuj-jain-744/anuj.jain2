import React from "react";
import style from "./index.module.scss";
import UserDp from "assets/Dashboard/userDP.svg";
import { LanguageData } from "types/languageData";

interface UserResponseProps {
  languageData: LanguageData;
  conversation:{
    user:string;
    name: string;
    message: string;
    dateTime: string;
  }
}

const UserResponse: React.FC<UserResponseProps> = ({languageData,conversation}) => {
  return (
    <div className={style.userResponse}>
      <div className={style.profileSection}>
        <div className={style.dpWrapper}>
            <img src={UserDp} alt="user dp"/>
        </div>
      
      </div>
      <div className={style.contentSection}>
        <div className={style.titleRow}>
            <h4>{conversation.name}</h4><p>{conversation.dateTime}</p>
        </div>
        <div className={style.conversationWrapper}>
            <p>
            {conversation.message}
            </p>

        </div>
      </div>
    </div>
  );
};

export default UserResponse;
