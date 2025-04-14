import { ProductsTemplate } from "./product";
import { NewsArticleTemplate } from "./NewsArticle";

const templateMap = {
  default: ProductsTemplate,
  product: ProductsTemplate,
  newsArticle: NewsArticleTemplate,
};

interface TemplateProps {
  templateType?: keyof typeof templateMap;
  data: any; // Will update structure once all keys added to api
}

export const Template: React.FC<TemplateProps> = ({
  templateType = "default",
  data,
}) => {
  const SelectedTemplate = templateMap[templateType];
  return <SelectedTemplate data={data} />;
};
