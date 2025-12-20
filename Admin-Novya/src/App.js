// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import AdminDashboard from './components/AdminDashboard';

// // ⭐ NEW IMPORT
// import TeacherDashboard from './components/pages/teacher/TeacherDashboard';

// const PrivateRoute = ({ children }) => {
//   const isAuth = localStorage.getItem('isAuthenticated');
//   return isAuth ? children : <Navigate to="/" />;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* LOGIN PAGE */}
//         <Route path="/" element={<LoginPage />} />

//         {/* SIGNUP PAGE */}
//         <Route path="/signup" element={<SignupPage />} />

//         {/* STUDENT DASHBOARD ROUTE */}
//         <Route
//           path="/dashboard/*"
//           element={
//             <PrivateRoute>
//               <AdminDashboard />
//             </PrivateRoute>
//           }
//         />

//         {/* ⭐ TEACHER DASHBOARD ROUTE (NEW) */}
//         <Route
//           path="/teacher/*"
//           element={
//             <PrivateRoute>
//               <TeacherDashboard />
//             </PrivateRoute>
//           }
//         />

//         {/* CATCH ALL */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';

// ⭐ TEACHER IMPORT
import TeacherDashboard from './components/pages/teacher/TeacherDashboard';

// ⭐ PARENT IMPORT (NEW)
import ParentDashboard from './components/pages/parent/ParentDashboard';

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

        {/* SIGNUP PAGE */}
        <Route path="/signup" element={<SignupPage />} />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* ⭐ TEACHER DASHBOARD */}
        <Route
          path="/teacher/*"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        {/* ⭐ PARENT DASHBOARD (NEW) */}
        <Route
          path="/parent/*"
          element={
            <PrivateRoute>
              <ParentDashboard />
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
