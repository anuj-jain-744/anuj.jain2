import "./index.scss";
import "react-multi-carousel/lib/styles.css";

import { ListOfReports } from "./listOfReports";
import { Esg } from "components/Esg";
import { Esgworld } from "components/Esgworld";
import { EsgScreen } from "components/EsgWalaa";
import { CustomCarousel } from "components/CustomCarousel";

interface ResponsiveObjectProps {
  [key: string]: {
    breakpoint: {
      max: number;
      min: number;
    };
    items: number;
    slidesToSlide: number;
    partialVisibilityGutter?: number;
  };
}

interface SustainabilityPageProps {
  content: {
    commonKeywords: string[];
    data: {
      news_label: string;
      news_description: string;
      our_commitment_title: string;
      our_commitment_image_url: string;
      our_commitment_description: string;
      esg_world_title: string;
      esg_world_description: string;
      esg_world_images: {
        url: string;
        alt: string;
      };
      leading_insurance_title: string;
      leading_insurance_description: string;
      leading_insurance_image: {
        url: string;
        alt: string;
      };
      walaa_goals_title: string;
      walaa_goals: any[];
      esg_data_title: string;
      esg_data_description: string;
    };
    financialYears: string[];
    reportData: any[];
    reportTypes: string[];
  };
  esgContent: { [key: string]: string }[];
  newsData: {
    data: {
      news_list: any[];
    };
  };
  navigateTo: (url: string) => void;
}

export const responsive: ResponsiveObjectProps = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1300 },
    items: 3,
    slidesToSlide: 3,
  },
  desktop: {
    breakpoint: { max: 1300, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 820 },
    items: 2,
    slidesToSlide: 1,
  },
  Portrait: {
    breakpoint: { max: 820, min: 500 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 60,
  },
};

export const SustaibabilityPage: React.FC<SustainabilityPageProps> = ({
  content: { commonKeywords, data, financialYears, reportData, reportTypes },
  newsData: {
    data: { news_list },
  },
  esgContent,
  navigateTo,
}) => {
  return (
    <div className="sustainability-wrapper">
      <Esg content={data} />
      <CustomCarousel
        title={data.walaa_goals_title}
        carouselItems={data.walaa_goals}
      />
      <Esgworld content={data?.sustainabilitySection} />
      <EsgScreen
        esgCont={esgContent}
        esgDataTit={data?.esg_data_title}
        esgDataDisc={data?.esg_data_description}
      />
      <ListOfReports
        commonKeywords={commonKeywords}
        financialYears={financialYears}
        reportData={reportData}
        navigateTo={navigateTo}
      />
    </div>
  );
};
