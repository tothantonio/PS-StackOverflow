import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isBannedUser, isLoggedIn } from "../services/authService.ts";

type BannedGuardProps = {
    children: ReactNode;
};

const PUBLIC_PATHS = ["/login", "/register", "/banned"];

function BannedGuard({ children }: BannedGuardProps) {
    const location = useLocation();

    if (isLoggedIn() && isBannedUser() && !PUBLIC_PATHS.includes(location.pathname)) {
        return <Navigate to="/banned" replace />;
    }

    return children;
}

export default BannedGuard;
