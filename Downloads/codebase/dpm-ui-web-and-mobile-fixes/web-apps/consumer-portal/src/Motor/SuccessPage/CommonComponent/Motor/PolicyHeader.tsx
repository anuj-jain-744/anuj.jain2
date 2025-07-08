import PolicyItem from "../PolicyItem";
import style from './style.module.scss'

interface PolicyHeaderProps {
  imgSrc?: string;
 label: string;
 value: string;
 coverageName?: string;
 repairCondition?: string;
}

  export const PolicyHeader: React.FC<PolicyHeaderProps> = ({
    imgSrc = "",
    label,
    value,
    coverageName = "",
    repairCondition = "",
    
  }) => {
    return (
      <div className={style.policyDetailsContainer}>
        <div className={style.policySection}>
          <PolicyItem label={label} value={value} />
          {coverageName && (
          <div className={style.policyHeaderPlanname}>
            {coverageName}<span className={style.bullet}/>{repairCondition}
          </div>
        )}
        </div>
        <div className={style.policyLogo}>
            <img src={imgSrc} />
          </div>
      </div>
    );
  };
  