
// import React, { useEffect, useState } from 'react';
// import { Container } from 'react-bootstrap';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// import Sidebar from './Sidebar';
// import TopBar from './TopBar';

// // Pages
// import Overview from './pages/Overview';
// import Payments from './pages/Payments';
// import Progress from './pages/Progress';
// import Tickets from './pages/Tickets';
// import Registrations from './pages/Registrations';

// const AdminDashboard = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const pathToTitle = {
//       overview: 'Dashboard Overview',
//       payments: 'Payment & Subscription',
//       progress: 'Student Progress',
//       tickets: 'Tickets & Support',
//       registrations: 'New Registrations',
//     };

//     const pathSegments = location.pathname.split('/').filter(Boolean);
//     const currentPath = pathSegments[1] || 'overview';

//     if (pathToTitle[currentPath]) {
//       document.title = `${pathToTitle[currentPath]} | Prime Minds - Admin Panel`;
//     } else {
//       document.title = 'Admin Dashboard | Prime Minds - Admin Panel';
//     }
//   }, [location.pathname]);

//   return (
//     <div className={`admin-dashboard ${darkMode ? 'dark-mode' : ''}`}>
//       <TopBar
//         darkMode={darkMode}
//         setDarkMode={setDarkMode}
//         showSidebar={showSidebar}
//         toggleSidebar={() => setShowSidebar(!showSidebar)}
//       />

//       <Sidebar showSidebar={showSidebar} darkMode={darkMode} setShowSidebar={setShowSidebar} />

//       <main className="main-content">
//         <Container fluid className="py-4">
//           <Routes>
//             <Route path="/" element={<Navigate to="overview" replace />} />
//             <Route path="overview" element={<Overview />} />
//             <Route path="payments" element={<Payments />} />
//             <Route path="progress" element={<Progress />} />
//             <Route path="tickets" element={<Tickets />} />
//             <Route path="registrations" element={<Registrations />} />

//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="overview" replace />} />
//           </Routes>
//         </Container>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

// Pages
import Overview from './pages/Overview';
import Payments from './pages/Payments';
import Progress from './pages/Progress';
import Tickets from './pages/Tickets';
import Registrations from './pages/Registrations';

// Newly added pages
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const pathToTitle = {
      overview: 'Dashboard Overview',
      payments: 'Payment & Subscription',
      progress: 'Student Progress',
      tickets: 'Tickets & Support',
      registrations: 'New Registrations',
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
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showSidebar={showSidebar}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <Sidebar showSidebar={showSidebar} darkMode={darkMode} setShowSidebar={setShowSidebar} />

      <main className="main-content">
        <Container fluid className="py-4">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />

            <Route path="overview" element={<Overview />} />
            <Route path="payments" element={<Payments />} />
            <Route path="progress" element={<Progress />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="registrations" element={<Registrations />} />

            {/* Added new routes */}
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
