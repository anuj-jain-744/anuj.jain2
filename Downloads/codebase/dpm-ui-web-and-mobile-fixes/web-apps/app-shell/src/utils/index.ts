import { getFullUrl as getFullURL, callAPI } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";

export function getFullUrl(
  baseUrl: string,
  lang: string,
  route: string
): string {
  return `${baseUrl}/${lang}/api/${route}`;
}

export const getDefault = (
  value: string | undefined,
  defaultValue: string = ""
) => value ?? defaultValue;

export const navigateTo = (
  url: string,
  navigate: (url: string, options?: { state: object }) => void,
  data?: object
): void => {
  if (/^(https|mailto|tel):/.test(url)) {
    if (url.startsWith("https")) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  } else {
    navigate(url, {
      state: data || {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export const objectToArray = (
  title: string,
  desc: string,
  image_url: string
): {
  slider_title: string;
  slider_description: string;
  slider_type: string;
  slider_image_url: string;
}[] => {
  const obj = {
    slider_title: title,
    slider_description: desc,
    slider_type: "Image",
    slider_image_url: image_url,
  };
  return [obj];
};

const { VITE_CONTENT_BASE_URI } = import.meta.env;

export const fetchData = async (endpoint: string, language: string) => {
  try {
    const fullUrl = getFullURL(VITE_CONTENT_BASE_URI, language, endpoint);
    const responseData = await callAPI("get", fullUrl);
    return endpoint === cmsAPIRoute["corporateHomepage"]
      ? responseData?.data
      : responseData ?? {};
  } catch (ex) {
    console.error(ex);
    return {};
  }
};

//This function should be replaced with above function so naming it generic
export const newFetchData = async (endpoint: string, language: string) => {
  try {
    const fullUrl = getFullURL(VITE_CONTENT_BASE_URI, language, endpoint);
    const responseData = await callAPI("get", fullUrl);
    const data = endpoint === cmsAPIRoute["corporateHomepage"]
          ? responseData?.data
          : responseData ?? {};
    const metadata = responseData?.metadata ?? {};
    return { data, metadata };
  } catch (ex) {
    console.error("Error fetching data:", ex);
    return { data: {}, metadata: {} };
  }
};

export const getResponseBasedOnEndpoints=(responseData,endpoint?:string)=>{
  let result={};

  switch(endpoint){
    case "consumer-portal":
      result=responseData?.data;
      break;
    case "corporate-homepage":
      result=responseData?.data;
      break;
    case "header-menu":
      result=responseData?.menus;
      break;
    case "consumerportal-config":
      result= responseData?.config[0];
      break;
    default:
      result=responseData??{};
      break;
  }
  return result;
}
