import React, { useState } from "react";
import "./index.scss";
import { Container, Row, Col, Modal } from 'react-bootstrap';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import Pin from '../../assets/HeadOfficeWidget/Home Pin.svg';
import { ProductTooltip } from "../../components/ProductTooltip";

interface OfficeProps {
    data?: any;
}
export const HeadOfficeWidget: React.FC<OfficeProps> = ({ data }) => {
    const toolTipData = {
        title: data?.working_hours_label,
        tooltip: data?.working_hours
    }
    return (
        <Container className="office-outer">
            <div className="inner-frame">
                <div className="icon-position">
                    <ApartmentRoundedIcon className="left-icon" />
                </div>
                <div className="office-content">
                    <div data-testid="head-label" className="widget-title walaa-medium-500">
                        {data?.head_office_label}
                    </div>
                    <Row className="inner-content">
                        <Col xs={12} md={6} lg={4}>
                            <div className="first-block">
                                <div className="block-title walaa-regular-400">{data?.callus_label}</div>
                                <div data-testid="phone" className="block-content walaa-medium-500">
                                    <CallOutlinedIcon className="icon-setup" />{data?.phone}
                                </div>
                                <div className="block-title walaa-regular-400">{data?.email_label}</div>
                                <div data-testid="email" className="block-content walaa-medium-500">
                                    <MailOutlinedIcon className="icon-setup" />{data?.email}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                            <div className="secont-block">
                                <div className="block-title walaa-regular-400">{data?.working_hours_label}</div>
                                <div data-testid="working" className="block-content walaa-medium-500">
                                    <AccessTimeOutlinedIcon className="icon-setup lavel" />{data?.working_hours_single}
                                    <ProductTooltip headerItem={toolTipData} />
                                </div>
                                <div className="block-title walaa-regular-400">{data?.workschedule_label}</div>
                                <div data-testid="working-days" className="block-content walaa-medium-500">
                                    <EventAvailableOutlinedIcon className="icon-setup" />{data?.working_days}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                            <div className="third-block">
                                <div className="block-title walaa-regular-400">{data?.address_label}</div>
                                <div className="block-content walaa-medium-500">
                                    <div data-testid="address" className="block-align">
                                        <img src={Pin} className="icon-setup" />
                                        {data?.address}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    )
}