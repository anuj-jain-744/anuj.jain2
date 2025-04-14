import { callAPI, constant } from '@dpm/shared-module';

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


export interface LanguageDataResponse {
  menus: Menu[];
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