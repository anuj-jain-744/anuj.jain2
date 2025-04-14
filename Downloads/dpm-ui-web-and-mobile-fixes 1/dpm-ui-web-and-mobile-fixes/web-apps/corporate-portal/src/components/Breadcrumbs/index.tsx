import React from "react";
import { Container } from "react-bootstrap";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "./index.scss";

export interface Item {
  label: string;
  route: string;
}

interface BreadcrumbsProps {
  items: Item[];
  navigateTo?: (url: string) => void;
  isMotor?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigateTo, isMotor }) => {
  const handleNavigate = (route: string, index: number) => {
    if (index < items.length - 1) {
      navigateTo?.(route);
    }
  };

  return (
    <Container fluid>
      <div className={`breadcrumb-wrapper ${isMotor ? 'is-motor' : ''}`}>
        <ul className="list-unstyled breadcrumb">
          {items.map(({ label, route }, idx) => (
            <li
              className={`breadcrumb-item ${idx === items.length - 1 ? 'last-item' : ''}`}
              key={idx}
              onClick={() => handleNavigate(route, idx)}
            >
              <span className="breadcrumb-text">{label}</span>
              {idx < items.length - 1 && (
                <ChevronRightIcon className="breadcrumb-icon" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};