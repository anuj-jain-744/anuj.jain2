import { ReactNode } from "react";

export interface ShuffleDropdownProps {
  children: ReactNode;
  navbarTransparent: boolean;
  dropdownStates: { show: boolean };
  handleDropdownMouseOver: (dropdown: ItemEnum, show: boolean) => void;
  showDropdown: { shuffle: boolean };
}

export type ItemEnum =  "language" | "shuffle" | "profileMenu"