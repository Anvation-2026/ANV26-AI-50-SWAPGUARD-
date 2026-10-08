import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import DeliveryCapture from "./pages/DeliveryCapture";
import Evidence from "./pages/Evidence";
import ReturnVerification from "./pages/ReturnVerification";
import AIAnalysis from "./pages/AIAnalysis";
import Review from "./pages/Review";
import ReviewComplete from "./pages/ReviewComplete";
import FraudNetwork from "./pages/FraudNetwork";
import CaseManagement from "./pages/CaseManagement";
import Login from "./pages/Login";


function AppLayout() {
  return (
    <div className="app">

      <Sidebar />

      <div className="main-area">

        <Topbar />

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/investigation"
            element={<DeliveryCapture />}
          />

          <Route
            path="/evidence"
            element={<Evidence />}
          />

          <Route
            path="/return-verification"
            element={<ReturnVerification />}
          />

          <Route
            path="/ai-analysis"
            element={<AIAnalysis />}
          />

          <Route
            path="/review"
            element={<Review />}
          />

          <Route
            path="/review-complete"
            element={<ReviewComplete />}
          />

          <Route
            path="/fraud-network"
            element={<FraudNetwork />}
          />

          <Route
            path="/case-management"
            element={<CaseManagement />}
          />

        </Routes>

      </div>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN HAS NO SIDEBAR / TOPBAR */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* APPLICATION */}
        <Route
          path="*"
          element={<AppLayout />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;