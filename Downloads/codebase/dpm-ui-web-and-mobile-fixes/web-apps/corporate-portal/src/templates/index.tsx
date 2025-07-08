import { ProductsTemplate } from "./product";
import { NewsArticleTemplate } from "./NewsArticle";
import { SMEProductTemplate } from "./SMEProduct";
import { CorporateProductTemplate } from "./CorporateProduct";

const templateMap = {
  default: ProductsTemplate,
  product: ProductsTemplate,
  newsArticle: NewsArticleTemplate,
  smeProduct: SMEProductTemplate,
  corporateProduct: CorporateProductTemplate,
};

interface TemplateProps {
  templateType?: keyof typeof templateMap;
  data: any; // Will update structure once all keys added to api
  isProducts?: boolean;
}

export const Template: React.FC<TemplateProps> = ({
  templateType = "default",
  data,
  isProducts,
}) => {
  const SelectedTemplate = templateMap[templateType];
  return <SelectedTemplate data={data} isProducts={isProducts}/>;
};
