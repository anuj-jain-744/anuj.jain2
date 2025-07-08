export interface HeaderData{
    linkName: string;
    childrens?: {
    linkName: string; link_content: string; attributes:
       { 
         class: string[]; 
       };
    menuUrl: string; 
    }[];
}