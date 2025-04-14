import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import { LanguageData } from "types/languageData";

interface DomesticLabourCardProps {
  data?: LanguageData | undefined | null;
}
const DomesticLabourCard: React.FC<DomesticLabourCardProps> = ({
  data
}) => {

  return (

    <div className="row-class">
      <div className="col-booster">
        <img src={data?.boost_your_domestic_image_url} className="boost-img" data-testid="domestic-img" />
        <div className="card-class">
          <h5 className="boost-header">{data?.boost_your_domestic_labour}</h5>
          <p className="boost-desc">{data?.add_domestic_labour_insura}</p>
          <ThemeButton
            title={data?.check_on_domestic_insuranc || ""}
            classes={"btn-class"}
          />
        </div>
      </div>
    </div>
  );
}

export default DomesticLabourCard;