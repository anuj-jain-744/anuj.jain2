import DOMPurify from "dompurify";
import { getFullUrl, callAPI } from "../index";
import { commonTexts, NOT_APPLICABLE } from "../constant";

const DIGITS = "0123456789";
const ALPHANUMERIC_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DEFAULT_STRING_LENGTH = 16;

interface ResponseData{
  data?: unknown;
}

interface Breadcrumb {
  label: string;
  route: string;
}

interface FooterDataProps {
  blocks?: {
    mobile_slider?: {
      mobile_slider_component_display: string;
    }
  }
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {SAFE_FOR_TEMPLATES: true, ADD_TAGS: ['{%']});
}

export const scrollToElement = (id: string, offset: number = 0): void => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = offset;
    const yPosition =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: yPosition, behavior: "smooth" });
  }
};

export const shouldShowAppDownload = (footerData: FooterDataProps) => {
  return (
    footerData?.blocks?.mobile_slider?.mobile_slider_component_display === "1"
  );
};

export const getDefault = (
  value: string | undefined,
  defaultValue: string = ""
) => value ?? defaultValue;

export const objectToArray = (
  title: string,
  desc: string,
  url: string,
  type: string = "Image"
): {
  slider_title: string;
  slider_description: string;
  slider_type: string;
  slider_image_url?: string;
  slider_video_url?: string;
}[] => {
  const obj = {
    slider_title: title,
    slider_description: desc,
    slider_type: type,
    [type === "Image" ? "slider_image_url" : "slider_video_url"]: url,
  };
  return [obj];
};

export const splitAndCapitalize = (str: string, specialChar: string): string =>
  str
    .split(specialChar)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

export const getRandomString = (length: number = DEFAULT_STRING_LENGTH, isNumberOnly: boolean = false) => {
  const charset = isNumberOnly ? DIGITS : ALPHANUMERIC_CHARSET;
  return [...Array(length)].reduce(randomString => randomString + charset[~~(Math.random() * charset.length)], '');
};

export const useFetchData = async (
  baseUrl: string,
  endpoint: string,
  language: string
) => {
  try {
    const fullUrl = getFullUrl(baseUrl, language, endpoint);
    const responseData:ResponseData = await callAPI("get", fullUrl);
    return endpoint === "corporate-homepage"
      ? responseData?.data
      : responseData ?? {};
  } catch (ex) {
    console.error(ex);
    return {};
  }
};

//Trigger chat widget by envoking this function.
export const triggerClickOnChatwidget = async (): Promise<void> => {
  const waitForElement = (): Promise<Element> => {
    return new Promise((resolve, reject) => {
      const interval = 500;
      let elapsedTime = 0;

      const checkForElement = () => {
        //Capture chatwidget container by class
        const element = document.querySelector(".LPMcontainer");
        if (element) {
          resolve(element);
        } else if (elapsedTime >= 8000) {
          reject(
            new Error(
              `Element with selector .LPMcontainer not found within 8000ms`
            )
          );
        } else {
          elapsedTime += interval;
          setTimeout(checkForElement, interval);
        }
      };
      checkForElement();
    });
  };

  try {
    const element = await waitForElement();
    //Trigger click event on chatwidget container
    (element as HTMLElement).click();
  } catch (error) {
    console.error(error);
  }
};

export const generateBreadcrumbs = (elements: string | Breadcrumb[], language: string, type: 'public' | 'auth' = 'public'): Breadcrumb[] => {
  const homeBreadcrumb = type === 'public' ? { label: commonTexts[language  as keyof typeof commonTexts].home, route: '/' } : { label: commonTexts[language  as keyof typeof commonTexts].user, route: '/user' };

  //Single level breadcrumb, pass as string e.g., generateBreadcrumbs("Home","en",auth)
  if (typeof elements === "string") {
    return [
      homeBreadcrumb,
      {
        label: elements,
        route: `/`,
      },
    ];
  }

  //Multi level breadcrumb, pass as objects e.g., generateBreadcrumbs([{label: "Home", route: "/"},{label: "Section", route: "/section"}],"en",auth)
  const breadcrumbs = elements.map(({ label, route }) => ({
    label: label,
    route: route,
  }));

  return [homeBreadcrumb, ...breadcrumbs];
};

export const stringToBoolean = (str: string): boolean => {
  return str.toLowerCase() === 'true';
};

export const capitalizeNameFirstLetter = (name: string): string => {
  if (!name || typeof name !== "string") return NOT_APPLICABLE; // Return empty string for null or invalid input
  return name
    .toLowerCase() // Convert the entire string to lowercase first
    .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
  localStorage.clear();
}
