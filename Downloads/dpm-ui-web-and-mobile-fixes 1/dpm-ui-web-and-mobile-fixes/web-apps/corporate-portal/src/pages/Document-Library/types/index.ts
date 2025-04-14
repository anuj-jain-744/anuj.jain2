interface Document {
    file_name: string;
    file_url: string;
  }
  
export interface DocumentLibraryLayoutProps {
    description: string;
    documents: Document[];
    navigateTo: (url: string) => void;
}
  