export interface Category {
  name: string;
  class: string;
}

export interface FAQScreenProps {
  categories: Category[];
  accordianData: Record<string, { qns: string; ans: string }[]>;
  navigateTo: (path: string) => void;
}

export interface ActiveTab {
  index: number;
  item: Category;
}

export interface Breadcrumb {
  label: string;
  route: string;
}

export interface SearchbarProps {
  navigateTo: (path: string) => void;
  setLabel: (labels: { title: string; faq: string }) => void;
}

export interface SearchInfoData {
  common?: {
    search: string;
  };
  data?: {
    popular: string[];
    others: string[];
  };
}
