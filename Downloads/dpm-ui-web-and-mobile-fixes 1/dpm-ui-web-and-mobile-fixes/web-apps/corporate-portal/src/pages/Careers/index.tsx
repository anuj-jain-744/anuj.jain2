import { Container } from "react-bootstrap";

import { getDefault } from "@dpm/shared-module";
import { Support } from "components";
import ProductTab from "components/ProductCatelog/ProductTab";
import { SupportDataProps } from "components/Support";
import "./index.scss";

interface CareersProps {
    support: {
        supportData: SupportDataProps[];
        title: string;
        desc: string;
    },
    compData:  [{[key:string] : string}];
}

export function CareerScreen({ support, compData }: CareersProps) {
    return (
        <>
            <Support
                supportData={support?.supportData || []}
                title={getDefault(support?.title)}
                description={getDefault(support?.desc)}
                className="support-career"
            />
             <div className="productCat productCat-career">
                <Container fluid className="midContainer">
                    <ProductTab compData={{ personal: compData }} showTab={false}/>
                </Container>
            </div>
        </>
    )
}
