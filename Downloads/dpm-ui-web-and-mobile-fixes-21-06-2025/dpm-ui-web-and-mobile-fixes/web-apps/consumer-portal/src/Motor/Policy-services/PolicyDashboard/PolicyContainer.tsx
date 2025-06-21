import React from "react";
import style from "./PolicyContainer.module.scss";
import PolicyDashboard from "./PolicyDashboard";
import { useLocation } from "react-router-dom";
interface Props {
  navigateTo?: (url: string) => void;
}

const PolicyContainer: React.FC<Props> = ({ navigateTo }) => {

  const location = useLocation();
  const policyInfo = location?.state?.data ?? {};

  return (
    <div className={style.container}>
      {policyInfo && (
        <PolicyDashboard
          navigateTo={navigateTo}
          policyInfo={policyInfo}
        />
      )}
    </div>
  );
};

export default PolicyContainer;
