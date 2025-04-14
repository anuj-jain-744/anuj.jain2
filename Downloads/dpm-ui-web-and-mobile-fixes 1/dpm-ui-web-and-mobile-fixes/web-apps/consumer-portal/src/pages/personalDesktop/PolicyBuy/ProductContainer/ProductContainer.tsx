import React, { useEffect, useState } from 'react';
import style from './ProductContainer.module.scss';
import ProductElement from './ProductElement/ProductElement';
import { LanguageData } from 'types/languageData';
import { useNavigate } from 'react-router-dom';
import { slices, RootState } from "@dpm/shared-module";
import { useAddress } from 'hook/home/useAddress';
import { useDispatch, useSelector } from "react-redux";
import { processPolicies } from "utils/processPolicies";



interface Props {
    navigateTo?: (url: string) => void;
    languageData?: LanguageData;
}

const ProductContainer: React.FC<Props> = ({ navigateTo, languageData }) => {
    const products = [
        { iconName: 'buy', text: languageData?.buy_policy, isDisabled: false },
        { iconName: 'raiseClaim', text: languageData?.raise_a_claim, isDisabled: false },
        { iconName: 'trackClaim', text: languageData?.track_claim, isDisabled: true }
    ];

    const userId = useSelector((state: RootState) => state.auth?.userInfo?.userId);
    const dispatch = useDispatch();

    const {data, isLoading, error} = useAddress(userId);
    const { setAddressData, setAddressDataLoading, setAddressDataError } = slices.addressSlice;

    useEffect(() => {
        dispatch(setAddressDataLoading(isLoading));
        if(data) {
            dispatch(setAddressData(data?.data?.addresses ?? []));
        }
        if(error) {
            dispatch(setAddressDataError(error));
        }
    }, [data, isLoading, error]);

    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const navigate = useNavigate();

    const handleMenuToggle = (index: number) => {
        if(index === 2) {
            navigate('/track-claim');
            return;
        }
        
        setActiveMenu(prevActiveMenu => (prevActiveMenu === index ? null : index));
    };

    const policiesDeck = useSelector((state: RootState) => state.policy.policies);
  const listOfPolicies =processPolicies(policiesDeck);

    return (
        <div className={style.container}>
            {products.map((product, index) => (
                <ProductElement
                    key={index}
                    languageData={languageData}
                    iconName={product.iconName}
                    text={product.text}
                    navigateTo={navigateTo}
                    isDisabled={product.isDisabled}
                    showMenu={activeMenu === index}
                    onMenuToggle={() => handleMenuToggle(index)}
                    isZeroUser={listOfPolicies?.length === 0}
                />
            ))}
        </div>
    );
}

export default ProductContainer;
