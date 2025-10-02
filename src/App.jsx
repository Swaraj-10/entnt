import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import JobsBoardNew from "./pages/JobsBoardNew/JobsBoardNew";
import CandidatesNew from "./pages/CandidatesNew/CandidatesNew";
import AssessmentsNew from "./pages/AssessmentsNew/AssessmentsNew";
import LoginPage from "./pages/LoginPage/LoginPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto p-6">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Jobs Board */}
          <Route path="/jobs" element={<JobsBoardNew />} />

          {/* Candidates */}
          <Route path="/candidates" element={<CandidatesNew />} />

          {/* Assessments */}
          <Route path="/assessments" element={<AssessmentsNew />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}
