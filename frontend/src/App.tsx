import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout.tsx";
import AskQuestionsPage from "./features/qa/pages/AskQuestionsPage.tsx";
import CreateTagPage from "./features/qa/pages/CreateTagPage.tsx";
import EditQuestionPage from "./features/qa/pages/EditQuestionPage.tsx";
import MyQuestionsPage from "./features/qa/pages/MyQuestionsPage.tsx";
import QuestionDetailsPage from "./features/qa/pages/QuestionDetailsPage.tsx";
import QuestionsPage from "./features/qa/pages/QuestionsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

function App() {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/ask" element={<AskQuestionsPage />} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
                    <Route path="/questions/:id" element={<QuestionDetailsPage />} />
                    <Route path="/my-questions" element={<MyQuestionsPage />} />
                    <Route path="/myQuestions" element={<Navigate to="/my-questions" replace />} />
                    <Route path="/tags" element={<CreateTagPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
}

export default App;

