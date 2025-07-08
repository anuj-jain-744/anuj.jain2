import { HeroBanner } from "components/HeroBanner";
import { VisibilityWrapper } from "components/VisibilityWrapper";
import { KeyFeature } from "../../components/KeyFeature";
// import { ProductCatalog } from "../../components/ProductCatelog";
import { useNavigationHandler } from "../../../../app-shell/src/hooks";
import { commonKeywords } from "../../constant";

import { GetQuote } from "components/GetQuote";
import ArrowRight from "../../assets/GetQuoteForm/Arrow_Right_Red.svg";
import CarLogo from "../../assets/GetQuoteForm/CarLogo.svg";
import VerifiedBlack from "../../assets/GetQuoteForm/Verified_Black.svg";

import {
  objectToArray,
} from "@dpm/shared-module";
import "./index.scss";
import { Overview, SubNavBar } from "components";

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

interface productsDataProps {
  title: string;
  content: string;
  flip_content: string;
  image_url: string;
  image_alt: string;
  button_text: string;
  button_link: string;
  weight: string;
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
      data?: {
        corporate: {
          product_name: string;
          class_name: string;
          button_text: string;
          form_fields: {
            field_title: string;
            field_type: string;
            field_placeholder: string;
          }[];
        }[];
      };
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
    key_features_title: string;
    keyfeatures: {
      icon: string;
      title: string;
      description: string;
    }[];
    keyfeatures_description: string | null;
    corporate_overview: {
      corporate_overview_title: string,
      data: [
        {
          title:  string;
          description: string;
        },
      ]
    },
  };
}

interface ProductTemplateProps {
  data: {
    breadcrumbData: breadcrumbDataProps;
    footerData: footerDataProps;
    productData: productDataProps;
    productsData: productsDataProps;
    handleNavigate: (url: string) => void;
    handleNavigateWithParams: (url: string, data: never) => void;
    faqContent: Record<string, { qns: string; ans: string }[]>;
    servicesData: any;
    languageData: any;
    claimPageData: any;
    services: any;
  };
}

export const CorporateProductTemplate = ({
  data: {
    breadcrumbData,
    productData,
    productsData,
    handleNavigate,
    handleNavigateWithParams,
    services: servicesLabels,
  },
}: ProductTemplateProps) => {
  const {
    banners,
    tabs,
    key_features_title,
    keyfeatures,
    quote_form,
  } = productData?.data ?? {};

  const enableParallax = true;
  const handleNavigation = useNavigationHandler();

  const bannerItem =
    objectToArray(
      banners?.slider_title,
      banners?.slider_description,
      banners?.slider_image_url || banners?.slider_video_url,
      banners?.slider_type
    ) ?? [];

  return (
    <div className="template-wrapper corpo">
     <VisibilityWrapper isParallex={enableParallax}>
        <HeroBanner
          heroBanner={bannerItem}
          breadcrumbs={breadcrumbData}
          navigateTo={handleNavigate}
          isParallex={enableParallax}
          isProductPage={true}
        />
      </VisibilityWrapper>

      {quote_form?.disclaimer_text && quote_form?.data?.corporate?.[0] && (
        <VisibilityWrapper isParallex={enableParallax}>
          <div className="container-middle">
            <GetQuote
              products={quote_form?.data?.corporate?.[0]}
              carIcon={CarLogo}
              arrowIcon={ArrowRight}
              verifiedIcon={VerifiedBlack}
              introText={quote_form?.data?.corporate?.[0]?.product_name ?? ""}
              disclaimerText={quote_form?.disclaimer_text ?? ""}
              buttonLabel={quote_form?.data?.corporate?.[0]?.button_text ?? ""}
              fieldsData = {quote_form?.data?.corporate?.[0]?.form_fields ?? []}
              configdata={quote_form?.data?.corporate?.[0]?.class_name ?? ""}
              successMessage={productData?.services?.quote_form_success_message}
            />
          </div>
        </VisibilityWrapper>
      )}



        <SubNavBar content={tabs} />


      <VisibilityWrapper>
        <Overview
          content={productData?.data?.corporate_overview}
        />
      </VisibilityWrapper>

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
          typeClass={commonKeywords.corpoProd}
        />
      </VisibilityWrapper>
       )}

      {/* <VisibilityWrapper isParallex={enableParallax}>
        <ProductCatalog
          catalogTitle={getDefault(servicesLabels?.product_catalog_title)}
          catalogDescription={getDefault(
            servicesLabels?.product_catalog_description
          )}
          navigateTo={handleNavigation}
          carouselData={productsData.data || {}}
        />
      </VisibilityWrapper> */}
    </div>
  );
};