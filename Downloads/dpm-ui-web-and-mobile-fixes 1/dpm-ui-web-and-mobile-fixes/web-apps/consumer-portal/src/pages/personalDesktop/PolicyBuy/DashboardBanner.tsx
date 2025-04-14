import DashboardBanner from "assets/DashboardBanner/heroBannerDashboard.svg";
import ProductContainer from "./ProductContainer/ProductContainer";
import style from "./DashbboardBanner.module.scss";
import WelcomeContainer from "./WelcomeContainer/WelcomeContainer";
import { useSelector } from 'react-redux';
import { RootState, } from "@dpm/shared-module";

interface Props {
  navigateTo?: (url: string, data?: object) => void;
}

const DashbboardBanner: React.FC<Props> = ({ navigateTo }) => {
  const {languageData} = useSelector((state: RootState) => state.motorLanguage);
  const userName = useSelector((state: RootState) => state.auth?.userInfo?.name);

  return (
    <div className={style.container}>
      <img
        src={DashboardBanner}
        data-testid={`bannerVeriation`}
        className={style.backgroundImage}
      />
      <div className={style.overlayText}>
        <ProductContainer navigateTo={navigateTo} languageData={languageData} />
      </div>
      <div className={style.welcomeText}>
        <WelcomeContainer name={userName}/>
      </div>
    </div>
  );
};

export default DashbboardBanner;