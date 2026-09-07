import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Dashboard/Navbar";
import ScanPage from "./pages/ScanPage";
import ResultsPage from "./pages/ResultsPage";
import AuditPage from "./pages/AuditPage";
import LandingPage from "./pages/LandingPage";
import DeveloperPortal from "./pages/DeveloperPortal";

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 500,
            fontSize: "0.88rem",
          },
        }}
      />
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <Routes>
          <Route path="/"           element={<LandingPage />} />
          <Route path="/scan"       element={<ScanPage />} />
          <Route path="/results"    element={<ResultsPage />} />
          <Route path="/audit"      element={<AuditPage />} />
          <Route path="/developers" element={<DeveloperPortal />} />
        </Routes>
      </main>
    </Router>
  );
}
