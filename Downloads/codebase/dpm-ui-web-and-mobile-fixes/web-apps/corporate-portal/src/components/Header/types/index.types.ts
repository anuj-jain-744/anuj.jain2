export interface LoginButtonProps {
    navbarTransparent: boolean;
    iconTheme: {
      LoginIcon: string;
    };
    loginLabel:string;
    navigateTo: (status: string) => void;
}
export interface MenuItemProps {
  linkName: string;
  childrens?: Array<{
    linkName: string;
    link_content: string;
    attributes: {
      class: string[];
    };
    menuUrl: string;
  }>;
}

export interface HeaderProps {
    isSearchEnable: boolean;
    isAuthenticated: boolean;
    menuItems: MenuItemProps[];
    menuItemsLogin?: Array<MenuItemProps>;
    commonLabels?: {
      [key: string]: string;
    };
    isMenuTransparent: boolean;
    navigateTo: (url: string) => void;
    currentLanguage? :string
    loginData?: any;
    languageData?: {[ket: string]: string};
    pageName?: string;
    mobile_app_images?: Array<{
      app_image_title: string;
      app_image_url: string;
      app_url: string;
    }>;
  }
  
 export interface DropdownStateProps{
    linkName: string;
    show: boolean;
    selectedIndex: number;
  }
  
  interface MenuItem {
    linkName: string;
    childrens?: Array<{
      linkName: string;
      link_content: string;
      attributes: {
        class: string[];
      };
      menuUrl: string;
    }>;
  }
  
 export interface CategorizedMenuItems {
    menuItem: MenuItem[] | false;
    contactUsMenu: MenuItem[] | false;
  }