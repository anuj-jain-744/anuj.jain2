import { callAPI, constant } from '@dpm/shared-module';
import { LanguageData } from "@consumer-portal/types/languageData";
interface Menu {
  linkName: string;
  menuUrl: string | null;
  link_content: string | null;
  menuicon: string;
  menuimage: any[];
  media_type_val: string;
  video_url: string | null;
  weight: string;
  hasChild: boolean;
  attributes: any | null;
  childrens: Menu[];
}
interface SideBarMenu {
  linkName: string;
  menuUrl: string | null;
  weight: string;
  hasChild: boolean;
  attributes: any | null;
  childrens: Menu[];
}


export interface LanguageDataResponse {
  menus: Menu[];
  code: number;
  'sidebar-menu': SideBarMenu[];
}

export interface ResponseProps  {
  config: LanguageData[]
  code: number;
}

const { VITE_CONTENT_BASE_URI } = constant;

export const fetchHeaderMenuData = async (): Promise<LanguageDataResponse> => {
  
    try {
    const response = await callAPI(
      'get', 
      `${VITE_CONTENT_BASE_URI}/en/api/header-menu-login`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch Header Menu language:', error);
    throw error;
  }
};

export const fetchDashbaordLanguageData = async (): Promise<LanguageDataResponse> => {
  try {
    const response = await callAPI<{config: LanguageDataResponse}>(
      'get', 
      `${VITE_CONTENT_BASE_URI}/en/api/dashboard-config`
    );
    return response.config;
  } catch (error) {
    console.error('Failed to fetch Dashboard language:', error);
    throw error;
  }
};

export const fetchFooterMenuLanguageData = async (): Promise<LanguageDataResponse> => {
  try {
    const response = await callAPI<{config: LanguageDataResponse}>(
      'get', 
      `${VITE_CONTENT_BASE_URI}/en/api/footer-menu`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch Dashboard language:', error);
    throw error;
  }
};

export const fetchConsumerLanguageData = async():Promise<ResponseProps>=>{
  try {
    const response = await callAPI<{config: ResponseProps}>(
      'get', 
      `${VITE_CONTENT_BASE_URI}/en/api/consumerportal-config`
    );
    return response;
  } catch (error:any) {
    console.error(error?.message);
    throw error;
  }
}