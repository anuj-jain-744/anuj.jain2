import "./style.scss";
import { Modal } from "react-bootstrap";
import Cancel from "assets/QuoteAndBuy/Cancel.svg";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import data from "./CompareBenefits.json"

function CompareBenefits({ showCompareBenefits, onClose }) {
  return (
    <Modal
      size="xl"
      show={showCompareBenefits}
      onHide={onClose}
      className="compare-benefit-container"
    >
      <Modal.Header closeButton className="header">
        <div className="header-content walaa-medium-500">
          {data.compare}
        </div>
      </Modal.Header>
      <div className="modal-scroll">
      <div className="footer">
        <div className="footer-content-top">
          <div className="benefit-container">
            <div className="benefit"></div>
            <div className="benefit font walaa-medium-500 blue">{data.benefit}</div>
          </div>
          <div className="comprehensive-container">
            <div className="comprehensive big-font walaa-medium-500">
              {data.comprehensive}
            </div>
            <div className="repair">
              <div className="agency-repair font walaa-medium-500 dark-blue">
                {data.agency}
              </div>
              <div className="agency-repair mawthoq-repair font walaa-medium-500 dark-blue">
                {data.mawthoq}
              </div>
              <div className="agency-repair workshop-repair font walaa-medium-500 dark-blue">
                {data.workshop}
              </div>
            </div>
          </div>
          <div className="third-party font walaa-medium-500">{data.thirdParty}</div>
        </div>
        <div className="footer-content-bottom">
          <div className="footer-content-bottom-header">
            <div className="footer-head">
              {data.benefits[0].name}
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[1].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[2].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[3].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[4].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Cancel} alt="Cancel icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[5].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[6].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[7].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content border-right">
              -
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[8].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">-</div>
            <div className="footer-content-bottom-header-content border-right">
              -
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[9].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">-</div>
            <div className="footer-content-bottom-header-content border-right">
              -
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
          <div className="footer-content-bottom-header">
            <div className="footer-head">{data.benefits[10].name}</div>
            <div className="footer-content-bottom-header-content">
              <img src={Approve} alt="Approve icon" />
            </div>
            <div className="footer-content-bottom-header-content">-</div>
            <div className="footer-content-bottom-header-content border-right">
              -
            </div>
            <div className="footer-content-bottom-header-content-tp border-right">
              -
            </div>
          </div>
        </div>
        </div>
      </div>
    </Modal>
  );
}

export default CompareBenefits;
