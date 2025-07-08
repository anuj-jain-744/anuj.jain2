// SMEProductTemplate.tsx

import React from "react";
import { HeroBanner } from "components/HeroBanner";
import { OverviewContent } from "components/OverviewContent";
import { LoyaltyCard } from "components/LoyaltyCard";
import { FAQShared } from "components/FaqShared";
import { SubNavBar } from "components/SubNavBar";
import { VisibilityWrapper } from "components/VisibilityWrapper";
import { Services } from "components";
import { KeyFeature } from "../../../../corporate-portal/src/components/KeyFeature";
import { GetQuote } from "components/GetQuote"; // Updated import
import { commonKeywords } from "../../constant";
import ArrowRight from "../../assets/GetQuoteForm/Arrow_Right_Red.svg";
import CarLogo from "../../assets/GetQuoteForm/CarLogo.svg";
import VerifiedBlack from "../../assets/GetQuoteForm/Verified_Black.svg";

import {
  shouldShowAppDownload,
  objectToArray,
  getDefault,
} from "@dpm/shared-module";

import "./index.scss";
import NoResultFound from "components/SearchInfoByKeyword/NoResult";

interface breadcrumbDataProps {
  label: string;
  route: string;
}

interface footerDataProps {
  otpinfo: {
    enter_otp_code: string;
    otp_verification: string;
    resend_otp: string;
    your_otp_will_expire: string;
  } | undefined;
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
      subtitle: [{ left: string; right: string }];
      comparr: [{ left: string; right: string }];
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
        sme: {
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
      description: string;
    }[];
    keyfeatures_description: string | null;
    title: string | null;
    faqContent: Record<string, { qns: string; ans: string }[]>;
    faqData: Record<string, { qns: string; ans: string }[]>;
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

export const SMEProductTemplate = ({
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
    key_features_title,
    keyfeatures,
    keyfeatures_description,
  } = productData?.data ?? {};

  const showAppBanner = shouldShowAppDownload(footerData);
  const enableParallax = true;
  // const personalData = data?.[commonKeywords.personalName] || data?.Personal;

  const bannerItem =
    objectToArray(
      banners?.slider_title,
      banners?.slider_description,
      banners?.slider_image_url || banners?.slider_video_url,
      banners?.slider_type
    ) ?? [];

    const noResult = {
      noResultTitle:  productData?.services?.no_faq_found,
      noResultSubTitle: productData?.services?.we_could_not_find_any_faqs,
    };



  return (
    <div className="template-wrapper sme-product">
      <VisibilityWrapper isParallex={enableParallax} >
        <HeroBanner
          heroBanner={bannerItem}
          breadcrumbs={breadcrumbData}
          navigateTo={handleNavigate}
          isParallex={enableParallax}
          isProductPage={true}
        />
      </VisibilityWrapper>

      {/* ⬇️ Dynamically Populated GetQuote */}
      {quote_form?.disclaimer_text && quote_form?.data?.sme?.[0] && (
        <VisibilityWrapper isParallex={enableParallax}>
          <GetQuote
            products={quote_form?.data?.sme?.[0]}
            carIcon={CarLogo}
            arrowIcon={ArrowRight}
            verifiedIcon={VerifiedBlack}
            introText={quote_form?.data?.sme?.[0]?.product_name ?? ""}
            disclaimerText={quote_form?.disclaimer_text ?? ""}
            buttonLabel={quote_form?.data?.sme?.[0]?.button_text ?? ""}
            fieldsData = {quote_form?.data?.sme?.[0]?.form_fields ?? []}
            configdata={quote_form?.data?.sme?.[0]?.class_name ?? ""}
            successMessage={productData?.services?.quote_form_success_message}
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

      <VisibilityWrapper isParallex={enableParallax}>
        <KeyFeature
          title={key_features_title}
          cards={keyfeatures.map((feature) => ({
            icon: feature.icon,
            alt: feature.description,
            description: feature.description,
          }))}
          typeClass={commonKeywords.smeProd}
        />
      </VisibilityWrapper>

      {discounts?.discounts_title && (
        <VisibilityWrapper isParallex={enableParallax}>
          <LoyaltyCard
            loyaltyTitle={getDefault(discounts?.discounts_title)}
            loyaltyDiscription={getDefault(discounts?.discounts_description)}
            learnMore={getDefault(discounts?.learn_more)}
            cardContent={getDefault(discounts?.data)}
            navigateTo={handleNavigate}
          />
        </VisibilityWrapper>
      )}

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


      {/* <VisibilityWrapper isParallex={enableParallax}>
        <FAQShared
          faqCont={getDefault(faq_title_and_description)}
          accordianData={faqContent || []}
          labels={servicesLabels}
        /> */}

    {faqContent?.length > 0 ? (
      <VisibilityWrapper isParallex={enableParallax}>
        <FAQShared
          faqCont={getDefault(faq_title_and_description)}
          accordianData={faqContent || []}
          labels={servicesLabels}
        />
      </VisibilityWrapper>
       ): (
        <div className="noResultView-Header">
      <div className="noResultView"
         dangerouslySetInnerHTML={{ __html: faq_title_and_description }} >
          </div>
         <NoResultFound noResultPlacehoder={noResult}/>
        </div>
       )}

      {/* </VisibilityWrapper> */}

    </div>

  );
};

