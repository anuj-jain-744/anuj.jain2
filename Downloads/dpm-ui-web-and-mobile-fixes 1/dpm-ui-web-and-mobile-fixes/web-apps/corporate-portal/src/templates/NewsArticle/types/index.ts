interface ContactItem {
    label: string;
    class: string;
    url: string;
    name: string;
    email: string;
  }
  
  interface ArticleData {
    image_url: string;
    title: string;
    news_category: string;
    created_date: string;
    news_inner_title: string;
    short_description: string;
    newscontact: ContactItem[];
    attachments: { title: string; url: string }[];
    content: string;
    handleNavigate: (url: string) => void;
    related_news: any;
    relatedLinks: string;
    allPost_label: string;
    attachments_label: string;
    event_title: string;
    time_label?: string;
    event_time?: string;
    date_label?: string;
    event_date?: string;
    location_label?: string;
    event_location?: string;
  }
  
  export interface NewsArticleTemplateProps {
    data: ArticleData;
  }
  
  export interface ContactWidgetProps {
    contactItem: ContactItem[];
  }
  