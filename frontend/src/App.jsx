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

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* DELIVERY INVESTIGATION */}
          <Route
            path="/investigation"
            element={<DeliveryCapture />}
          />

          {/* EVIDENCE */}
          <Route
            path="/evidence"
            element={<Evidence />}
          />

          {/* RETURN VERIFICATION */}
          <Route
            path="/return-verification"
            element={<ReturnVerification />}
          />

          {/* AI ANALYSIS */}
          <Route
            path="/ai-analysis"
            element={<AIAnalysis />}
          />

          {/* REVIEW */}
          <Route
            path="/review"
            element={<Review />}
          />

          {/* REVIEW COMPLETE */}
          <Route
            path="/review-complete"
            element={<ReviewComplete />}
          />

          {/* FRAUD NETWORK */}
          <Route
            path="/fraud-network"
            element={<FraudNetwork />}
          />

          {/* CASE MANAGEMENT */}
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
    <BrowserRouter basename="/SwapGuard">

      <Routes>

        {/* FIRST SCREEN = LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD + APPLICATION */}
        <Route
          path="/*"
          element={<AppLayout />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;