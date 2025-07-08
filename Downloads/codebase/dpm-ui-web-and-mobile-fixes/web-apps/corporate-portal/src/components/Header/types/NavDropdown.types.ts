export interface Child {
  linkName?: string;
  menuUrl?: string;
  attributes?: {
    class: string[];
  };
  childrens?: Child[];
}

export interface Parent {
  linkName?: string;
  attributes?: {
    class: string[];
  };
  childrens?: Child[];
}

interface DropdownStates {
  linkName?: string;
}

type HandleDropdownEvent = (
  label: string,
  isOpen: boolean,
  index: number
) => void;
export type HandleProductToggleClick = (index: number) => void;

export interface CustomRenderNavDropdownProps {
  parent: Parent;
  pIdx: number;
  dropdownStates: DropdownStates;
  handleDropdownEvent: HandleDropdownEvent;
  navbarTransparent: boolean;
  activeProduct: number;
  setActiveProduct:HandleProductToggleClick;
  navigateTo?: (menuUrl: string) => void;
}
