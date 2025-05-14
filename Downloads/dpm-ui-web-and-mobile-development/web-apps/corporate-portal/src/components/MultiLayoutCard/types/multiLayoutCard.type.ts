export interface MultiLayoutCardProps {
    label: string;
    link: string;
    layout: string;
    navigateTo: (url: string) => void;
}