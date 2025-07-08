import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({
    children,
}): ReactNode => {
    const navigate = useNavigate();
    const user = sessionStorage.getItem("userDetails");
    if (!user) {
        navigate("/");
        return null;
    }
    return <>{children}</>;
};
