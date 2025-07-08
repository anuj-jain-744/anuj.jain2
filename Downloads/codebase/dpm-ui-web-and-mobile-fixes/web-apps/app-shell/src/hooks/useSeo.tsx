import React from "react";
import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const { VITE_APP_TITLE, VITE_APP_DESCRIPTION, VITE_APP_KEYWORDS } = import.meta
  .env;

export const useSeo: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
} = {}) => {
  const effectiveTitle = title ?? VITE_APP_TITLE;
  const effectiveDescription = description ?? VITE_APP_DESCRIPTION;
  const effectiveKeywords = keywords ?? VITE_APP_KEYWORDS;

  return (
    <Helmet>
      <title>{effectiveTitle}</title>
      <meta name="description" content={effectiveDescription} />
      <meta name="keywords" content={effectiveKeywords} />
    </Helmet>
  );
};
