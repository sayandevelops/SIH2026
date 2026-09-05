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
            background: "#0d1f3c",
            color: "#e8f4ff",
            border: "1px solid rgba(0,212,255,0.25)",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      <Navbar />
      <main style={{ paddingTop: "72px", minHeight: "100vh" }}>
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
