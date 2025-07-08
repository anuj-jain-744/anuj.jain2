
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCommonContext, useApiCall } from "@dpm/shared-module";
import { LoaderOverlay } from "@components/Loader";
import { Header } from "@corporate-portal/components";
import { fetchData, navigateTo } from "@utils";
import { cmsAPIRoute } from "@src/constants";
import { Modal } from "react-bootstrap";
import { MenuItemProps } from "@corporate-portal/components/Header/types/index.types";

export default function ValidatePayment() {
  const navigate = useNavigate();
  const { currentLanguage } = useCommonContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const quoteId = query.get('quoteId');
  const token = query.get('token');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [state, setState] = useState<{
    headerData: MenuItemProps[] | null;
    languageData: {
      paymentLinkValid?: string | null;
    } | null;
  }>({
    headerData: null,
    languageData: null
  });

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const {makeApiCall, data, errors} = useApiCall(5, "Payment/api/payment/validate", "get")
  const fetchAllData = async () => {
    const [headerData, languageData] = await Promise.all([
      fetchData(cmsAPIRoute["header"], currentLanguage),
      fetchData(cmsAPIRoute["consumerConfig"], currentLanguage),
    ]);
    setState({ headerData, languageData});
  };

  useEffect(() => {
    fetchAllData();
    makeApiCall({
      quoteId,
      token,
    });
  }, [currentLanguage]);

  useEffect(() => {
    if(data) {
      setLoading(false);
      navigate(`/product/insurance-payment/${quoteId}`);
    }
  }, [data]);

  useEffect(() => {
    if(errors) {
      console.log(errors);
      setLoading(false);
      setOpen(true);
      setErrorMessage(errors?.message_en ?? errors?.message_ar ?? undefined);
    }
  }, [errors]);

  return (
    <div>
      {loading && <LoaderOverlay />}
      <Modal
        show={open}
        onHide={() => setOpen(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>{state?.languageData?.paymentLinkValid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage ?? "Internal Servel Error"}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => {
              setOpen(false);
              navigate(`/dashboard`);
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <Header
        isSearchEnable={false}
        isAuthenticated={false}
        menuItems={state?.headerData as unknown as MenuItemProps[]}
        isMenuTransparent={true}
        navigateTo={handleNavigate}
      />
    </div>
  );
}
