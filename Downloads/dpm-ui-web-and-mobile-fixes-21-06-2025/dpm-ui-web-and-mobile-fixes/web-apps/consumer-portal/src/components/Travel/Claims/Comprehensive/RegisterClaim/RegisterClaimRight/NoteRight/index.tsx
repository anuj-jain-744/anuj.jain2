import { Card } from "react-bootstrap";
import idea from "assets/Claims/Idea.svg";

interface PropTypes {
  langData: Record<string, string>;
}

const NoteRight = ({ langData }: PropTypes) => (
  <Card className="right-card-background-2">
    <div className="header">
      <div className="header-content">
        <div className="logo">
          <img src={idea} alt="claim_reg_det" />
        </div>
        <div className="content walaa-medium-500 pt-1">
          <div>{langData.please_note}</div>
        </div>
      </div>
    </div>
    {Array.isArray(langData.popup_body_content_two) &&
      langData.popup_body_content_two.map((item, index) => (
        <div key={item?.value} className="header pt-1">
          <div className="header-content ps-4 ms-3">
            <div className="content">
              <div>{index + 1}.</div>
              <div>
                {item?.value}
                {index === 3 && (
                  <a
                    href={langData.https_motorclaims_walaa_co}
                    target="_blank"
                  >
                    {" "}
                    {langData.walaa_com}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
  </Card>
);

export default NoteRight;
