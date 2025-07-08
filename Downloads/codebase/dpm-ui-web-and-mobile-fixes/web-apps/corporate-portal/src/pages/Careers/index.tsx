import { Container } from "react-bootstrap";

import { getDefault } from "@dpm/shared-module";
import { Support, VisibilityWrapper } from "components";
import ProductTab from "components/ProductCatelog/ProductTab";
import { SupportDataProps } from "components/Support";
import { FeaturedJobs } from "pages/Careers/FeaturedJobs"
import "./index.scss";


interface CareersProps {
    support: {
        supportData: SupportDataProps[];
        title: string;
        desc: string;
    },
    compData:  [{[key:string] : string}];

}

export function CareerScreen({ support, compData , jobsdata ,commonlables }: CareersProps) {
    const isParallexEnable = true;
    return (
        <>
            {support &&
                <VisibilityWrapper isParallex={isParallexEnable}>
                    <Support
                        supportData={support?.supportData || []}
                        title={getDefault(support?.title)}
                        description={getDefault(support?.desc)}
                        className="support-career"
                    />
                </VisibilityWrapper>
            }
            
            {compData &&
                <div className="productCat-1 productCat-career">
                    <Container fluid className="midContainer">
                        <VisibilityWrapper isParallex={isParallexEnable}>
                            <ProductTab compData={{ personal: compData }} showTab={false} isVisible={isParallexEnable} />
                        </VisibilityWrapper>
                    </Container>
                </div>
            }

            {jobsdata && commonlables &&
                <div className="featured-jobs">
                    <VisibilityWrapper isParallex={isParallexEnable}>
                        <FeaturedJobs
                            jobsdata={jobsdata}
                            commonlables={commonlables}
                            isVisible={isParallexEnable}
                        />
                    </VisibilityWrapper>
                </div>
            }   
        </>
    )
}
