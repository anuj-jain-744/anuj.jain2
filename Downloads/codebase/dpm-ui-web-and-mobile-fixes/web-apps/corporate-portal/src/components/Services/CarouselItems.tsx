import React from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";

import "react-multi-carousel/lib/styles.css";


export interface CurrentTabItemProps {
    image_url: string;
    image_alt: string;
    title: string;
    content?: string; 
    body?: string;
    url: string;
}

interface CarouselItemsProps {
    item: CurrentTabItemProps;
    page?: boolean;
    navigateTo?: (url: string) => void;
}

export default function CarouselItems({ item, page, navigateTo }: CarouselItemsProps) {
    return (
        <Col className="product-item card">
            <Card.Img
                className="card-img"
                variant="top"
                src={item?.image_url}
                alt={item?.image_alt}
            />
            <div className="card-body"> 
                <a className="card-title walaa-medium-500" onClick={()=> navigateTo && navigateTo(item?.url)}>
                    <span className="card-description">{item?.title}</span>{!page && (<span className="arrow-right"></span>)}
                </a>
                <div className="card-text walaa-regular-400">
                    {item?.content || item?.body}
                </div>
            </div>
        </Col>
    )
}