import { Card } from "react-bootstrap";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { IconsSet } from "@dpm/corporate-portal/src/utils/icons";

interface ContactData {
  [key: string]: {
    imageURL: string;
    label: string;
    linkURL: string;
  };
}
interface SupportSectionProps {
  contactData: ContactData;
  handleNavigate: (linkURL: string) => void;
}
interface ContactSectionProps {
  contactData: ContactData;
  handleNavigate: (linkURL: string) => void;
}
interface ContactItemProps {
  data: {
    imageURL: string;
    label: string;
    linkURL: string;
  };
  handleNavigate: (linkURL: string) => void;
}

export const SupportSection = ({
  contactData,
  handleNavigate,
}: Readonly<SupportSectionProps>) => {
  const mobileDetails = useMemo(() => {
    const details = contactData.mobile.label?.split(" ");
    return {
      label: details.slice(0, -1)?.join(" ") ?? "",
      num: details[details.length - 1] ?? "",
    };
  }, [contactData]);

  return (
    <div className="policy-support">
      <div className="top">
        <div className="support-text">{mobileDetails.label}</div>
        <div
          className="support-number walaa-medium-500"
          onClick={() => handleNavigate(contactData.mobile.linkURL)}
        >
          {mobileDetails.num}
        </div>
      </div>
      <div className="bottom">
        <div className="whatsapp-logo">
          <img src={IconsSet[contactData.whatsapp.imageURL]} alt="WhatsApp" />
        </div>
        <div
          className="whatsapp-text walaa-regular-400"
          onClick={() => handleNavigate(contactData.whatsapp.linkURL)}
        >
          {contactData.whatsapp.label}
        </div>
      </div>
    </div>
  );
};

export const ContactSection = ({
  contactData,
  handleNavigate,
}: Readonly<ContactSectionProps>) => (
  <div className="contact">
    <ContactItem data={contactData.email} handleNavigate={handleNavigate} />
    <ContactItem data={contactData.branch} handleNavigate={handleNavigate} />
    <ContactItem data={contactData.feedback} handleNavigate={handleNavigate} />
  </div>
);

const ContactItem = ({
  data: { imageURL, label, linkURL },
  handleNavigate,
}: Readonly<ContactItemProps>) => (
  <div className="logo-text" onClick={() => handleNavigate(linkURL)}>
    <div className="whatsapp-logo">
      <img src={IconsSet[imageURL]} alt={label} />
    </div>
    <div className="whatsapp-text walaa-regular-400">{label}</div>
  </div>
);

const ContactList = () => {
  const navigate = useNavigate();
  const headerMenuCmsDataDetails = useSelector(
    (state: RootState) => state.headerMenuLanguage
  );

  const contactData: ContactData = useMemo(() => {
    const contactArray =
      headerMenuCmsDataDetails?.languageData?.[4]?.childrens ?? [];
    const result = {
      mobile: {
        imageURL: contactArray?.[0]?.attributes?.class?.[0] ?? "",
        label: contactArray?.[0]?.linkName ?? "",
        linkURL: contactArray?.[0]?.menuUrl ?? "",
      },
      whatsapp: {
        imageURL: contactArray?.[1]?.attributes?.class?.[0] ?? "",
        label: contactArray?.[1]?.linkName ?? "",
        linkURL: contactArray?.[1]?.menuUrl ?? "",
      },
      email: {
        imageURL: contactArray?.[2]?.attributes?.class?.[0] ?? "",
        label: contactArray?.[2]?.linkName ?? "",
        linkURL: contactArray?.[2]?.menuUrl ?? "",
      },
      branch: {
        imageURL: contactArray?.[3]?.attributes?.class?.[0] ?? "",
        label: contactArray?.[3]?.linkName ?? "",
        linkURL: contactArray?.[3]?.menuUrl ?? "",
      },
      feedback: {
        imageURL: contactArray?.[4]?.attributes?.class?.[0] ?? "",
        label: contactArray?.[4]?.linkName ?? "",
        linkURL: contactArray?.[4]?.menuUrl ?? "",
      },
    };
    return result;
  }, [headerMenuCmsDataDetails]);

  const handleNavigate = (url: string) => {
    if (url) {
      const isExternalUrl =
        url.includes("mailto") || url.includes("wa.me") || url.includes("tel:");
      if (isExternalUrl) window.open(url, "_blank");
      else navigate(url);
    }
  };

  return (
    <div className="policy-list">
      <SupportSection
        contactData={contactData}
        handleNavigate={handleNavigate}
      />
      <ContactSection
        contactData={contactData}
        handleNavigate={handleNavigate}
      />
    </div>
  );
};

const ContactCard = () => {
  const dashboardLangData = useSelector(
    (state: RootState) => state.dashbaordLanguageData.languageData
  );
  return (
    <Card className="select-policy-left-card">
      <div className="select-policy">
        <div className="select-policy-header walaa-medium-500">
          {dashboardLangData?.please_get_in_touch_with_us ?? ""}
        </div>
        <hr className="horizontal-line" />
        <ContactList />
      </div>
    </Card>
  );
};

export default ContactCard;
