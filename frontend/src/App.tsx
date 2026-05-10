//import {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import QuestionsPage from "./features/qa/pages/QuestionsPage.tsx";
import QuestionDetailsPage from "./features/qa/pages/QuestionDetailsPage.tsx";

import MainLayout from "./components/layout/MainLayout.tsx";





function App(){
  return(
      <BrowserRouter>
          <MainLayout>
              <Routes>

              <Route path= "/questions" element={<QuestionsPage />} />
                  <Route path="/questions/:id" element={<QuestionDetailsPage />} />

              </Routes>
          </MainLayout>
      </BrowserRouter>
  )
}
export default App;