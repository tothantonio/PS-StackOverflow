//import {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import QuestionsPage from "./features/qa/pages/QuestionsPage.tsx";

import MainLayout from "./components/layout/MainLayout.tsx";





function App(){
  return(
      <BrowserRouter>
          <MainLayout>
              <Routes>

              <Route path= "/questions" element={<QuestionsPage />} />

              </Routes>
          </MainLayout>
      </BrowserRouter>
  )
}
export default App;