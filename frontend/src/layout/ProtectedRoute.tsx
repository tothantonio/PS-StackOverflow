import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService.ts";

type ProtectedRouteProps = {
    children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
