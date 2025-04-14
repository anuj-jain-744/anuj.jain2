import { Card } from "react-bootstrap";
import idea from "assets/Claims/Idea.svg";
import { DataContext } from "../../../../../../DataContext";
import { useContext } from "react";

interface INoteRight {}
const NoteRight = ({}: INoteRight) => {
  //cms content
  const Data = useContext(DataContext);

  return (
    <Card className="right-card-background-2">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={idea} alt="claim_reg_det" />
          </div>
          <div className="content walaa-medium-500 pt-1">
            <div>{Data?.popup_subtitle_two}</div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>1.</div>
            <div>
             {Data?.popup_body_content_two[0]?.value}
            </div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>2.</div>
            <div>
            {Data?.popup_body_content_two[1]?.value}
            </div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>3.</div>
            <div>
            {Data?.popup_body_content_two[2]?.value}
            </div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>4.</div>
            <div>
              Also, you can Track your Claims through Walaa website Walaa.com.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NoteRight;
