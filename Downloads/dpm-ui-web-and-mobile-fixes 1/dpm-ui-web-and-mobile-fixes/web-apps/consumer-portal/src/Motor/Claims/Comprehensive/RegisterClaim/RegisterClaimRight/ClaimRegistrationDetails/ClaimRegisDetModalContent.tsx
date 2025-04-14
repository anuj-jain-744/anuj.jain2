import { DataContext } from "../../../../../../DataContext";
import { useContext } from "react";
import { ListGroup } from "react-bootstrap";

interface IClaimRegisDetModalContent {}
const ClaimRegisDetModalContent = ({}: IClaimRegisDetModalContent) => {
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="d-flex flex-column registration-det-body">
      <div className="fw-medium">
        <span dangerouslySetInnerHTML={{ __html: Data?.popup_subtitle_one }} />
      </div>
      <div>
        <ListGroup as="ol" numbered>
          {Data?.popup_body_content_one?.map((item, key) => {
            return (
              <ListGroup.Item
                key={key}
                as="li"
                className="d-flex justify-content-between align-items-start p-0 border-0"
              >
                <div className="ms-2 me-auto popover-row-spacing">
                  {item?.value}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
      <div>
        <div className="walaa-medium-500 registration-det-body-sub-title">
          <span
            dangerouslySetInnerHTML={{ __html: Data?.popup_subtitle_two }}
          />
        </div>
        <div>
          <ListGroup as="ol" numbered>
            {Data?.popup_body_content_two?.map((item, key) => {
              return (
                <ListGroup.Item
                  key={key}
                  as="li"
                  className="d-flex justify-content-between align-items-start p-0 border-0 registration-det-body-sub-body walaa-regular-400"
                >
                  <div className="ms-2 me-auto popover-row-spacing">
                    {item?.value}&nbsp;&nbsp;
                    {Data?.popup_body_content_two?.length - 1 === key && (
                      <a
                        className="theme-link"
                        href="https://motorclaims.walaa.com/"
                        target="_blank"
                      >
                        Walaa.com
                      </a>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default ClaimRegisDetModalContent;
