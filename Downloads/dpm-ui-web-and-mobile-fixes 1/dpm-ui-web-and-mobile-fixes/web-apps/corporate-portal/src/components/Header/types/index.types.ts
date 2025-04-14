export interface LoginButtonProps {
    navbarTransparent: boolean;
    iconTheme: {
      LoginIcon: string;
    };
    loginLabel:string;
    navigateTo: (status: string) => void;
}

export interface HeaderProps {
    isSearchEnable: boolean;
    isAuthenticated: boolean;
    menuItems: Array<{
      linkName: string;
      childrens?: Array<{
        linkName: string;
        link_content: string;
        attributes: {
          class: string[];
        };
        menuUrl: string;
      }>;
    }>;
    menuItemsLogin: Array<{
      linkName: string;
      childrens?: Array<{
        linkName: string;
        link_content: string;
        attributes: {
          class: string[];
        };
        menuUrl: string;
      }>;
    }>;
    commonLabels: any;
    isMenuTransparent: boolean;
    navigateTo: (url: string) => void;
    currentLanguage? :string
    loginData?: any;
    languageData?: object;
    pageName?: string;
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