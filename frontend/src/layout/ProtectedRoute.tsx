import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isBannedUser, isLoggedIn } from "../services/authService.ts";

type ProtectedRouteProps = {
    children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (isBannedUser()) {
        return <Navigate to="/banned" replace />;
    }

    return children;
}

export default ProtectedRoute;
