import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Alert,
  Navbar,
  Nav,
  Collapse,
  Button,
} from "react-bootstrap";

import { Routes, Route } from "react-router-dom";

// ⭐ COMPONENTS
import TopBar from "../../TopBar";
import TeacherSidebar from "../../TeacherSidebar";

// ⭐ PAGES
import TeacherSupport from "./TeacherSupport";
import TeacherRegistration from "./TeacherRegistration";   // ⭐ ADDED

import {
  FaBars,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook
} from "react-icons/fa";

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ⭐ Animations
const fadeInStyle = {
  opacity: 0,
  transform: "translateY(20px)",
  animation: "fadeInUp 0.6s forwards",
};

const fadeInDelay = (delay) => ({
  ...fadeInStyle,
  animationDelay: `${delay}s`,
});

// ⭐ Hover
const hoverStyle = { transition: "transform 0.3s, box-shadow 0.3s" };
const hoverStyleActive = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

// ⭐ StatCard
const StatCard = ({ icon, title, value, bg }) => {
  const [hover, setHover] = useState(false);

  return (
    <Card
      className="stat-card text-center h-100 shadow"
      style={{ ...hoverStyle, ...(hover ? hoverStyleActive : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Body>
        <div className={`stat-icon bg-${bg} mb-2 p-2 text-white rounded`}>
          {icon}
        </div>
        <h4>{value}</h4>
        <p className="text-muted mb-0">{title}</p>
      </Card.Body>
    </Card>
  );
};

// ⭐ ChartCard
const ChartCard = React.forwardRef(({ title, data, maxY }, ref) => {
  const [hover, setHover] = useState(false);

  return (
    <Card
      className="h-100 shadow"
      style={{ ...hoverStyle, ...(hover ? hoverStyleActive : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>
        <div style={{ height: "250px" }}>
          <Bar
            ref={ref}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: maxY
                ? { y: { beginAtZero: true, max: maxY } }
                : { y: { beginAtZero: true } },
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
});

// ⭐ Table
const DataTable = ({ title, data, columns }) => {
  const [hover, setHover] = useState(false);

  return (
    <Card
      className="h-100 shadow"
      style={{ ...hoverStyle, ...(hover ? hoverStyleActive : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>

        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.subject}</td>
                  <td>{item.experience}</td>
                  <td>
                    <Badge bg={item.status === "Active" ? "success" : "warning"}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

// =========================================================================================
// ⭐ MAIN TEACHER DASHBOARD WITH ROUTES
// =========================================================================================
const TeacherDashboard = () => {

  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stats
  const stats = {
    totalTeachers: 42,
    totalClasses: 18,
    studentsHandled: 450,
  };

  const teacherPerformanceData = {
    labels: ["Math", "Science", "English", "History"],
    datasets: [
      {
        label: "Avg Class Score (%)",
        data: [88, 92, 85, 90],
        backgroundColor: "#42A5F5",
      },
    ],
  };

  const teachers = [
    { id: 1, name: "John Miller", subject: "Math", experience: "7 Years", status: "Active" },
    { id: 2, name: "Sarah Lee", subject: "Science", experience: "5 Years", status: "Active" },
    { id: 3, name: "David Wilson", subject: "English", experience: "4 Years", status: "Inactive" },
    { id: 4, name: "Emma Watson", subject: "History", experience: "3 Years", status: "Active" },
  ];

  return (
    <div className={`admin-dashboard ${darkMode ? "dark-mode" : ""}`}>
      
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showSidebar={showSidebar}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <TeacherSidebar
        showSidebar={showSidebar}
        darkMode={darkMode}
        setShowSidebar={setShowSidebar}
      />

      <main className="main-content">
        <Container fluid className="py-4">

          {/* ⭐ ROUTES */}
          <Routes>

            {/* SUPPORT PAGE */}
            <Route path="support" element={<TeacherSupport />} />

            {/* ⭐ TEACHER REGISTRATION PAGE */}
            <Route path="registration" element={<TeacherRegistration />} />

            {/* DEFAULT DASHBOARD HOME */}
            <Route
              path="*"
              element={
                <>
                  <Alert variant="primary" className="mb-3">
                    👨‍🏫 Teacher Dashboard Loaded – No Backend Needed
                  </Alert>

                  <Row className="mb-4" id="stats">
                    <Col xs={6} md={4} className="mb-3">
                      <div style={fadeInDelay(0.1)}>
                        <StatCard icon={<FaChalkboardTeacher />} title="Total Teachers" value={stats.totalTeachers} bg="info" />
                      </div>
                    </Col>

                    <Col xs={6} md={4} className="mb-3">
                      <div style={fadeInDelay(0.2)}>
                        <StatCard icon={<FaBook />} title="Total Classes" value={stats.totalClasses} bg="primary" />
                      </div>
                    </Col>

                    <Col xs={6} md={4} className="mb-3">
                      <div style={fadeInDelay(0.3)}>
                        <StatCard icon={<FaUserGraduate />} title="Students Handled" value={stats.studentsHandled} bg="success" />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-4" id="charts">
                    <Col md={12}>
                      <div style={fadeInDelay(0.4)}>
                        <ChartCard title="Subject Performance" data={teacherPerformanceData} maxY={100} ref={chartRef} />
                      </div>
                    </Col>
                  </Row>

                  <Row id="teachers">
                    <Col md={12}>
                      <div style={fadeInDelay(0.5)}>
                        <DataTable
                          title="Teacher List"
                          data={teachers}
                          columns={["Name", "Subject", "Experience", "Status"]}
                        />
                      </div>
                    </Col>
                  </Row>
                </>
              }
            />
          </Routes>
        </Container>
      </main>
    </div>
  );
};

export default TeacherDashboard;
