interface Child {
  productType: string;
  image: string;
  label: string;
  banner: {
    image: string;
    title: string;
    description: string;
  };
}

interface ActiveNavItem {
  linkName: string;
  selectedIndex: number;
}

export interface ActiveMenuDropdownItem {
  attributes: {
    class: string[];
  };
  childrens: {
    linkName: string;
    attributes: {
      class: string[];
    };
    menuUrl: string;
    childrens?: {
      linkName: string;
      attributes: {
        class: string[];
      };
      menuUrl: string;
    }[];
    menuimage?: {
      image_urls: {
        url: string;
      }[];
    };
    link_content?: string;
  }[];
  link_content: string;
  menuimage: {
    image_urls: {
      url: string;
    }[];
  } | null;
  media_type_val: string | null;
  video_url: string | null;
}

export interface MenuDropdownTemplateProps {
  activeNavItem: ActiveNavItem;
  activeMenuDropdown: ActiveMenuDropdownItem;
  handleOnMouse: (linkName: string, isActive: boolean, index: number) => void;
  navigateTo: (url: string) => void;
}

export interface ActiveProduct {
  index: number;
  label: string;
}

export interface RenderContentNavigateToProps {
  cIdx: number;
  menuUrl: string;
  linkName: string;
  navigateTo: (url: string) => void;
  attributes: {
    class: string[];
  };
}
