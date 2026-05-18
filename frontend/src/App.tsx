import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import "./App.css";
import BannedGuard from "./layout/BannedGuard.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import ProtectedRoute from "./layout/ProtectedRoute.tsx";
import AskQuestionsPage from "./features/qa/pages/AskQuestionsPage.tsx";
import CreateTagPage from "./features/qa/pages/CreateTagPage.tsx";
import EditQuestionPage from "./features/qa/pages/EditQuestionPage.tsx";
import MyQuestionsPage from "./features/qa/pages/MyQuestionsPage.tsx";
import QuestionDetailsPage from "./features/qa/pages/QuestionDetailsPage.tsx";
import QuestionsPage from "./features/qa/pages/QuestionsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import BannedPage from "./pages/BannedPage.tsx";

function App() {
    function protectedPage(page: ReactNode) {
        return <ProtectedRoute>{page}</ProtectedRoute>;
    }

    return (
        <BrowserRouter>
            <BannedGuard>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/banned" element={<BannedPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={protectedPage(<ProfilePage />)} />
                    <Route path="/ask" element={protectedPage(<AskQuestionsPage />)} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/questions/:id/edit" element={protectedPage(<EditQuestionPage />)} />
                    <Route path="/questions/:id" element={<QuestionDetailsPage />} />
                    <Route path="/my-questions" element={protectedPage(<MyQuestionsPage />)} />
                    <Route path="/myQuestions" element={<Navigate to="/my-questions" replace />} />
                    <Route path="/tags" element={<CreateTagPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MainLayout>
            </BannedGuard>
        </BrowserRouter>
    );
}

export default App;

