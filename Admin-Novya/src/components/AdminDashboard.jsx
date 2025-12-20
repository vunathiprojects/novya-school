
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ⭐ Correct imports based on your folder structure
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TeacherSidebar from './TeacherSidebar';

// Student Pages
import Overview from './pages/student/Overview';
import Payments from './pages/student/Payments';
import Progress from './pages/student/Progress';
import Tickets from './pages/student/Tickets';
//import Registrations from './pages/student/Registrations';
import Attendance from './pages/student/Attendance';
import Reports from './pages/student/Reports';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();

  // ⭐ Read selected role (Student / Teacher / Parent)
  const userRole = localStorage.getItem("userRole") || "Student";

  useEffect(() => {
    const pathToTitle = {
      overview: 'Dashboard Overview',
      payments: 'Payment & Subscription',
      progress: 'Student Progress',
      tickets: 'Tickets & Support',
      //registrations: 'New Registrations',
      attendance: 'Attendance',
      reports: 'Reports Analytics',
    };

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentPath = pathSegments[1] || 'overview';

    if (pathToTitle[currentPath]) {
      document.title = `${pathToTitle[currentPath]} | Prime Minds - Admin Panel`;
    } else {
      document.title = 'Admin Dashboard | Prime Minds - Admin Panel';
    }
  }, [location.pathname]);

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      
      {/* ⭐ TOP BAR */}
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showSidebar={showSidebar}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      {/* ⭐ ROLE-BASED SIDEBAR */}
      {userRole === "Student" && (
        <Sidebar
          showSidebar={showSidebar}
          darkMode={darkMode}
          setShowSidebar={setShowSidebar}
        />
      )}

      {userRole === "Teacher" && (
        <TeacherSidebar
          showSidebar={showSidebar}
          darkMode={darkMode}
          setShowSidebar={setShowSidebar}
        />
      )}

      {userRole === "Parent" && (
        <div className="p-3">Parent Sidebar Coming Soon</div>
      )}

      {/* ⭐ MAIN CONTENT AREA */}
      <main className="main-content">
        <Container fluid className="py-4">
          <Routes>

            <Route path="/" element={<Navigate to="overview" replace />} />

            {/* Student Feature Routes */}
            <Route path="overview" element={<Overview />} />
            <Route path="payments" element={<Payments />} />
            <Route path="progress" element={<Progress />} />
            <Route path="tickets" element={<Tickets />} />
            {/* <Route path="registrations" element={<Registrations />} /> */}
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="overview" replace />} />

          </Routes>
        </Container>
      </main>
    </div>
  );
};

export default AdminDashboard;
