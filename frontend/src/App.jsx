import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Settings from "./pages/Settings";
import DailySales from "./pages/DailySales";
import SalesHistory from "./pages/SalesHistory";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-emerald-500 text-lg font-semibold animate-pulse">
        Loading…
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser === undefined) return <LoadingScreen />;
  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser === undefined) return <LoadingScreen />;
  return currentUser ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Navbar />
              <div className="pt-20 px-6">
                <Routes>
                  <Route path="/"              element={<Dashboard />} />
                  <Route path="/stocks"        element={<Stocks />} />
                  <Route path="/settings"      element={<Settings />} />
                  <Route path="/sales"         element={<DailySales />} />
                  <Route path="/sales-history" element={<SalesHistory />} />
                  {}
                  <Route path="*"              element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
