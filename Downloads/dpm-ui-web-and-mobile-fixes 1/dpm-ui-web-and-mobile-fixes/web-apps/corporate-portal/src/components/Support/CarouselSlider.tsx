import React from "react";
import { sanitizeHtml } from "@dpm/shared-module";

interface CarouselSliderProps {
  data: {
    icon?: string;
    title: string;
    desc: string;
    tinyicon?: string;
    contact: string;
    link: string;
  };
  index: number;
  navigateTo?: (url: string) => void;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({ data, index, navigateTo }) => {
  return (
    <div className="support_card" data-testid={`support-card-${index}`}>
      {data.icon && (
        <img src={data.icon} data-testid={`support-icon-${index}`} />
      )}
      <h3 className="walaa-medium-500">{data.title}</h3> 
      <p className="walaa-medium-400" dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.desc).replace(
              "\\n",
              "<br/>"
            ),
          }}
        />
      <div className="support_contact walaa-medium-500">
        <a className="link-underline-light" onClick={()=> navigateTo && navigateTo(data.link)}>
          {data.tinyicon && (
            <img
              src={data.tinyicon}
              data-testid={`support-tinyicon-${index}`}
            />
          )}
          {data.contact}
        </a>
      </div>
    </div>
  );
};

export default CarouselSlider;