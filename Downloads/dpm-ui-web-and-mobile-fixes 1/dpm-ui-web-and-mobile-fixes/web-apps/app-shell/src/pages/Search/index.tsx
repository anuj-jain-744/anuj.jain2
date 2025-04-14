import { FC, useState } from "react";
import { SearchInfoByKeyword } from "@corporate-portal/components";
import { useLocation } from "react-router-dom";
import { PublicLayout } from "@src/layout";
import { useNavigationHandler } from "@src/hooks";
import React from "react";
import { LoaderOverlay } from "@components/Loader";

const SearchInfo: FC = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramField = query.get("search");

  const [loading, setLoading] = useState(true);

  const handleNavigate = useNavigationHandler();

  return (
    <PublicLayout>
      <React.Fragment>
        <SearchInfoByKeyword
          setLoading={setLoading}
          paramField={paramField}
          navigateTo={handleNavigate}
        />
        {loading && <LoaderOverlay />}
      </React.Fragment>
    </PublicLayout>
  );
};

export default SearchInfo;
