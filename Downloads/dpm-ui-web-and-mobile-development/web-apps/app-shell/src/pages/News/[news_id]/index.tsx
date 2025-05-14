import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import HighlighterBanner from "@corporate-portal/components/HighlighterBanner";
import { LoaderOverlay } from "@components/Loader";
import { fetchData } from "@src/utils";
import { PublicLayout } from "@src/layout";
import { useCommonContext } from "@dpm/shared-module";
import { cmsAPIRoute } from "@src/constants";
import { Template } from "@corporate-portal/templates";
import { useNavigationHandler } from "@src/hooks";
import { generateBreadcrumbs } from "@dpm/shared-module";
import { getDefault } from "@utils";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

interface ArticleData {
  title: string;
  content: string;
  image: string;
  breadcrumb?: string;
  [key: string]: any;
}

const NewsArticlePage: React.FC = () => {
  const { news_id } = useParams<{ news_id: string }>();
  const { currentLanguage } = useCommonContext();

  const [state, setState] = useState({
    articleData: null as ArticleData | null,
    loading: true,
  });

  const fetchArticleData = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await fetchData(
        `${cmsAPIRoute.news}/${news_id}`,
        currentLanguage
      );
      setState((prevState) => ({
        ...prevState,
        articleData: response?.data?.news[0] || null,
      }));
    } catch {
      setState((prevState) => ({ ...prevState, articleData: null }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [currentLanguage, news_id]);

  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);

  const handleNavigate = useNavigationHandler();

  const { articleData, loading } = state;

  const breadcrumbsData = generateBreadcrumbs(
    getDefault(articleData?.breadcrumb),
    currentLanguage
  );

  const combinedData = { ...articleData, handleNavigate };

  return (
    <PublicLayout>
      {loading && <LoaderOverlay />}
      <React.Fragment>
        <HighlighterBanner
          showInput={true}
          title={articleData?.title ?? "Article Title"}
          breadcrumbsData={breadcrumbsData}
          classApply="policy-title"
          navigateTo={handleNavigate}
        />
        {articleData && (
          <Template templateType="newsArticle" data={combinedData} />
        )}
      </React.Fragment>
    </PublicLayout>
  );
};

export default NewsArticlePage;
