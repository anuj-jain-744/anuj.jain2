import { HeroBanner } from "components/HeroBanner";
import { InsuranceExperience } from "components/InsuranceExperience";
import { OverviewContent } from "components/OverviewContent";
import { LoyaltyCard } from "components/LoyaltyCard";
import { FAQShared } from "components/FaqShared";
import { CoverageWidget } from "components/CoverageWidget";
import { SubNavBar } from "components/SubNavBar";
import { VisibilityWrapper } from "components/VisibilityWrapper";
import ProductTab from "components/ProductCatelog/ProductTab";
import { Container } from "react-bootstrap";
import { KeyFeature } from "../../components/KeyFeature";
import { commonKeywords } from "../../constant";
import {
  GetQuoteWidget,
} from "../../components/GetQuoteWidget";
import {
  Product as productProps } from "../../components/GetQuoteWidget/getQuoteInterface";

import {
  shouldShowAppDownload,
  objectToArray,
  getDefault,
} from "@dpm/shared-module";
import { MotorProducts } from "components/MotorProducts";
import { Services } from "components";
import "./index.scss";

interface breadcrumbDataProps {
  label: string;
  route: string;
}

interface footerDataProps {
  otpinfo: { enter_otp_code: string; otp_verification: string; resend_otp: string; your_otp_will_expire: string; } | undefined;
  blocks: {
    mobile_slider: {
      product_label: string;
      product_subtitle: string;
      download_our_app: string;
      mobile_app_images: string[];
      mobile_slider_banners: string[];
    };
  };
}

interface productDataProps {
  data: {
    overview: {
      overview_description: string;
      overview_image: string;
    };
    comprehensive: {
      title: string;
      subtitle: [
        {
          left: string;
          right: string;
        }
      ];
      comparr: [
        {
          left: string;
          right: string;
        }
      ];
    };
    tabs: [{ value: string }];
    discounts: {
      discounts_title: string;
      discounts_description: string;
      learn_more: string;
      data: {
        title: string;
        content: string;
        image_url: string;
        image_alt: string;
      };
    };
    faq_title_and_description: string;
    banners?: {
      slider_title: string[];
      slider_description: string[];
      slider_image_url?: string[];
      slider_video_url?: string[];
      slider_type: string[];
    };
    quote_form?: {
      disclaimer_text?: string;
      data?: productProps;
    };
    products: {
      title: string;
      description: string;
      header: {
        data: {
          title: string;
          tooltip: string;
        }[];
      };
      legends: {
        title: string;
        data: {
          title: string;
          icons: string;
        }[];
      };
      prodmatrix: {
        benefits: string[];
        comprehensive: string[];
        thirdparty: string[];
      }[];
    };
    flipcardcontents: [{[key:string] : string}];
    key_features_title: string;
    keyfeatures: {
      icon: string;
      title: string;
      description: string;
    }[];
    keyfeatures_description: string | null;
    faqContent: Record<string, { qns: string; ans: string }[]>;
    faqData: Record<string, { qns: string; ans: string }[]>;
    title: string;
    services: { 
      key: {
        
      };
    };
  };
}

interface ProductTemplateProps {
  data: {
    breadcrumbData: breadcrumbDataProps;
    footerData: footerDataProps;
    productData: productDataProps;
    handleNavigate: (url: string) => void;
    handleNavigateWithParams: (url: string, data: never) => void;
    faqContent: Record<string, { qns: string; ans: string }[]>;
    faqData: Record<string, { qns: string; ans: string }[]>;
    servicesData: any;
    languageData: any;
    claimPageData: any;
    services: any;
  };
}

export const ProductsTemplate = ({
  data: {
    breadcrumbData,
    footerData,
    productData,
    claimPageData,
    handleNavigate,
    handleNavigateWithParams,
    faqContent,
    faqData,
    languageData,
    servicesData,
    services: servicesLabels,
  },
}: ProductTemplateProps) => {
  const {
    banners,
    quote_form,
    overview,
    discounts,
    products,
    faq_title_and_description,
    comprehensive,
    tabs,
    title,
    key_features_title,
    keyfeatures,
  } = productData?.data ?? {};

  const showAppBanner = shouldShowAppDownload(footerData);
  const enableParallax = true;
  const { policy_servicing } = servicesData || {};
  const { data } = policy_servicing || {};
  const personalData = data?.[commonKeywords.personalName] || data?.Personal;

  const bannerItem =
    objectToArray(
      banners?.slider_title,
      banners?.slider_description,
      banners?.slider_image_url || banners?.slider_video_url,
      banners?.slider_type
    ) ?? [];

 
  return (
    <div className="template-wrapper">
      <VisibilityWrapper isParallex={enableParallax}>
        <HeroBanner
          heroBanner={bannerItem}
          breadcrumbs={breadcrumbData}
          navigateTo={handleNavigate}
          isParallex={enableParallax}
        />
      </VisibilityWrapper>
      {quote_form?.disclaimer_text && (
        <VisibilityWrapper isParallex={enableParallax}>
          <GetQuoteWidget
            disclaimerText={getDefault(quote_form?.disclaimer_text)}
            products={quote_form?.data ?? []}
            multiProduct={false}
            otpInfo={footerData?.otpinfo}
            navigateTo={handleNavigateWithParams}
            tooltip={claimPageData?.common_data.tooltip2}
            refNoTooltip={claimPageData?.common_data.tooltip2}
            languageData={(languageData?.config && languageData?.config.length > 0) ? languageData?.config[0]: {}}
          />
        </VisibilityWrapper>
      )}
       
        <SubNavBar content={tabs} />
     
      <VisibilityWrapper isParallex={enableParallax}>
        <OverviewContent
          overviewCont={getDefault(overview?.overview_description)}
          overviewImg={getDefault(overview?.overview_image)}
        />
      </VisibilityWrapper>

      {productData?.data.flipcardcontents &&
        <VisibilityWrapper isParallex={enableParallax}>
          <div className="productCat productCat-career">
              <Container fluid className="midContainer">
                  <ProductTab compData={{ personal: productData?.data.flipcardcontents }} showTab={false}/>
              </Container>
          </div>
        </VisibilityWrapper>
      }
      {keyfeatures.length > 0 && (
        <VisibilityWrapper isParallex={enableParallax}>
          <KeyFeature
           title={key_features_title}
            cards={keyfeatures.map((feature) => ({
              icon: feature.icon,
              alt: feature.description,
              title: feature.title,
              description: feature.description,
            }))}
          />
        </VisibilityWrapper>
      )}

      {products && (
        <VisibilityWrapper isParallex={enableParallax}>
          <MotorProducts data={products} />
        </VisibilityWrapper>
      )}
      <VisibilityWrapper isParallex={enableParallax}>
        <CoverageWidget content={getDefault(comprehensive)} />
      </VisibilityWrapper>

      <VisibilityWrapper isParallex={enableParallax}>
        <LoyaltyCard
          loyaltyTitle={getDefault(discounts?.discounts_title)}
          loyaltyDiscription={getDefault(discounts?.discounts_description)}
          learnMore={getDefault(discounts?.learn_more)}
          cardContent={getDefault(discounts?.data)}
          navigateTo={handleNavigate}
        />
      </VisibilityWrapper>
      {personalData && Object.keys(personalData) && (
        <VisibilityWrapper isParallex={enableParallax}>
          <Services
            title={productData?.services?.title}
            description={productData?.services?.description}
            hideProductTab={true}
            serviceProducts={productData?.services}
            hideSubButtons={true}
            servicesData={servicesLabels}
            labels={servicesLabels}
            navigateTo={handleNavigate}
          />
        </VisibilityWrapper>
      )}
      {showAppBanner && (
        <VisibilityWrapper isParallex={enableParallax}>
          <InsuranceExperience
            title={getDefault(footerData?.blocks?.mobile_slider?.product_label)}
            description={getDefault(
              footerData?.blocks?.mobile_slider?.product_subtitle
            )}
            downLoadApp={getDefault(
              footerData?.blocks?.mobile_slider?.download_our_app
            )}
            mobileDownload={
              footerData?.blocks?.mobile_slider?.mobile_app_images ?? []
            }
            sliderData={
              footerData?.blocks?.mobile_slider?.mobile_slider_banners ?? []
            }
          />
        </VisibilityWrapper>
      )}
      <VisibilityWrapper isParallex={enableParallax}>
        <FAQShared
          faqCont={getDefault(faq_title_and_description)}
          accordianData={faqData?.product_faq?.Medical_Malpractice || []}
          labels={servicesLabels}
        />
      </VisibilityWrapper>
    </div>
  );
};
