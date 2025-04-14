import { HeroBanner } from "components/HeroBanner";
import { InsuranceExperience } from "components/InsuranceExperience";
import { OverviewContent } from "components/OverviewContent";
import { LoyaltyCard } from "components/LoyaltyCard";
import { FAQShared } from "components/FaqShared";
import { CoverageWidget } from "components/CoverageWidget";
import { SubNavBar } from "components/SubNavBar";
import { VisibilityWrapper } from "components/VisibilityWrapper";
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
  } = productData?.data ?? {};

  const showAppBanner = shouldShowAppDownload(footerData);
  const enableParallax = true;

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
      <VisibilityWrapper isParallex={enableParallax}>
        <SubNavBar content={tabs} />
      </VisibilityWrapper>
      <VisibilityWrapper isParallex={enableParallax}>
        <OverviewContent
          overviewCont={getDefault(overview?.overview_description)}
          overviewImg={getDefault(overview?.overview_image)}
        />
      </VisibilityWrapper>
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
      {servicesData?.policy_servicing?.data && (
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
          accordianData={faqContent || []}
          labels={servicesLabels}
        />
      </VisibilityWrapper>
    </div>
  );
};
