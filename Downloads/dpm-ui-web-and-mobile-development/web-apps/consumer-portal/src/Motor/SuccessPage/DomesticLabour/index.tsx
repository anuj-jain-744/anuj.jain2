import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import { LanguageData } from "types/languageData";
import { DomesticCardProps } from "components/PaymentOptions/types/cmsPayment";

interface DomesticLabourCardProps {
  data?: LanguageData | undefined | null;
  domesticCardData?: DomesticCardProps;
}

const DomesticLabourCard: React.FC<DomesticLabourCardProps> = ({
  data,
  domesticCardData
}) => {

  return (

    <div className="row-class">
      <div className="col-booster">
        <img src={domesticCardData?.sidebar_image ?? data?.boost_your_domestic_image_url} className="boost-img" data-testid="domestic-img" />
        <div className="card-class">
          <h5 className="boost-header">{domesticCardData?.sidebar_image_title ?? data?.boost_your_domestic_labour}</h5>
          <p className="boost-desc">{domesticCardData?.sidebar_image_desc ?? data?.add_domestic_labour_insura}</p>
          <ThemeButton
            title={domesticCardData?.sidebar_image_buttontext ?? data?.check_on_domestic_insuranc ?? ""}
            classes={"btn-class"}
          />
        </div>
      </div>
    </div>
  );
}

export default DomesticLabourCard;