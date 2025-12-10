import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';  // ✅ Added
import AdminDashboard from './components/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated');
  return isAuth ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/" element={<LoginPage />} />

        {/* SIGNUP PAGE — NEW ROUTE */}
        <Route path="/signup" element={<SignupPage />} />

        {/* PROTECTED ROUTE */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
