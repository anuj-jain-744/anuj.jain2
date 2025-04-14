import React from 'react';
import { Row,Col,Card,Container,Button } from "react-bootstrap";
import './index.scss';
import { Accordians } from "../../components/Accordians";
import { EligibilityCheck } from "../../components/EligibilityCheckWidget";
import { KnowMoreWidget } from "../../components/KnowMoreWidget";

interface FAQItem {
    qns: string;
    ans: string;
  }
  
  interface sidebarImage{
    url:string;
    alt:string;
  }
interface sidebarData
{
    title:string;
    description:string;
    check_eligibility:string;
    check_eligibility_link:string;
    image_button:string;
    image_button_link:string;
    image_description:string;
    image_title:string;
    sidebar_image:sidebarImage;
} 

  interface dataItem
  {
    title:string;
    content:string;
    sidebar_data:sidebarData[];
  }
  
  interface AccordiansProps {
    accordianData: FAQItem[];
    common_data:dataItem;
    navigateTo: (url: string) => void;
  }


export const Surplus:React.FC<AccordiansProps>=({accordianData,common_data,navigateTo})=>{
    return(

      <Container fluid>
      <div className='surplus-section'>

        <Row >
          <Col md={8} sm={12}>
            <div className='surplus-col'>
              <div className="surplus-content">
                <div data-testid="surplus-title" dangerouslySetInnerHTML={{ __html: common_data?.content }} />
              </div>

            </div>
          </Col>

          <Col md={4} sm={12}>
              <EligibilityCheck navigateTo={navigateTo} content={common_data} />
          </Col>
          <Col md={8} sm={12}>
            <div className='surplus-col'>

              <div className='surplus-accordian'>
                <Accordians content={accordianData} />
              </div>
            </div>
          </Col>
          <Col md={4} sm={12}>
            <KnowMoreWidget navigateTo={navigateTo} content={common_data} />
          </Col>
        </Row>

      </div>
    </Container>

    )

}