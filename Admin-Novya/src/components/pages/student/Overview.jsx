import React, { useRef, useState, useEffect } from "react";
import {
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

import {
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaUserFriends,
  FaChalkboardTeacher
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

const fadeInStyle = {
  opacity: 0,
  transform: "translateY(20px)",
  animation: "fadeInUp 0.6s forwards",
};

const fadeInDelay = (delay) => ({
  ...fadeInStyle,
  animationDelay: `${delay}s`,
});

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.head.querySelector("style[data-fadeinup]")) {
    styleEl.setAttribute("data-fadeinup", "true");
    document.head.appendChild(styleEl);
  }
}

const hoverStyle = {
  transition: "transform 0.3s, box-shadow 0.3s",
};
const hoverStyleActive = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

// 🔹 Stat Card
const StatCard = ({ icon, title, value, bg, isMobile }) => {
  const [hover, setHover] = useState(false);
  return (
    <Card
      className={`stat-card text-center h-100 shadow ${
        isMobile ? "p-2" : ""
      }`}
      style={{ ...hoverStyle, ...(hover && !isMobile ? hoverStyleActive : {}) }}
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
    >
      <Card.Body className={isMobile ? "p-2" : ""}>
        <div
          className={`stat-icon bg-${bg} mb-2 p-2 text-white rounded ${
            isMobile ? "p-1" : ""
          }`}
        >
          {icon}
        </div>
        <h5 className={isMobile ? "h6" : "h4"}>{value}</h5>
        <p className={`text-muted ${isMobile ? "small" : ""} mb-0`}>{title}</p>
      </Card.Body>
    </Card>
  );
};

// 🔹 Chart Card
const ChartCard = React.forwardRef(({ title, data, maxY, isMobile }, ref) => {
  const [hover, setHover] = useState(false);
  return (
    <Card
      className="h-100 shadow"
      style={{ ...hoverStyle, ...(hover && !isMobile ? hoverStyleActive : {}) }}
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
    >
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>
        <div style={{ height: isMobile ? "200px" : "250px" }}>
          <Bar
            ref={ref}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: maxY
                ? { y: { beginAtZero: true, max: maxY } }
                : { y: { beginAtZero: true } },
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
});

// 🔹 Data Table
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
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <Badge
                      bg={
                        item.status === "Approved"
                          ? "success"
                          : item.status === "Pending"
                          ? "warning"
                          : "danger"
                      }
                    >
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

const Overview = () => {
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedRegistration, setExpandedRegistration] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Updated stats
  const stats = {
    totalStudents: 450,
    totalParents: 180,
    totalTeachers: 42,
  };

  const registrations = [
    { id: 1, name: "Sarah Lee", type: "Class 10", date: "2025-07-15", status: "Approved" },
    { id: 2, name: "David Miller", type: "Class 11", date: "2025-07-12", status: "Pending" },
    { id: 3, name: "Emma Watson", type: "Class 12", date: "2025-07-10", status: "Rejected" },
    { id: 4, name: "John Smith", type: "Class 9", date: "2025-07-08", status: "Approved" },
    { id: 5, name: "Lisa Johnson", type: "Class 8", date: "2025-07-05", status: "Pending" },
  ];

  // ✅ UPDATED: Classes 7, 8, 9, 10 only (No 11 & 12)
  const classPerformanceData = {
    labels: ["Class 7", "Class 8", "Class 9", "Class 10"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [79, 83, 87, 84],
        backgroundColor: "#2196F3",
      },
    ],
  };

  return (
    <div className="overview-page p-2 p-md-3">
      {isMobile && (
        <Navbar bg="light" expand={false} className="mb-3">
          <Navbar.Brand>📊 Overview</Navbar.Brand>
          <Button
            variant="outline-secondary"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <FaBars />
          </Button>
          <Collapse in={showMobileMenu}>
            <Nav className="flex-column mt-2">
              <div className="p-2">
                <small className="text-muted">Quick Actions</small>
              </div>
              <Nav.Link href="#stats">View Stats</Nav.Link>
              <Nav.Link href="#charts">View Charts</Nav.Link>
              <Nav.Link href="#registrations">View Registrations</Nav.Link>
            </Nav>
          </Collapse>
        </Navbar>
      )}

      <Alert variant="info" className="mb-3">
        📡 Static Data Loaded - Backend/API Not Required
      </Alert>

      {/* ⭐ Updated Stat Cards with NEW ICONS */}
      <Row className="mb-4" id="stats">
        
        <Col xs={6} md={4} className="mb-3">
          <div style={fadeInDelay(0.1)}>
            <StatCard
              icon={<FaUserGraduate />}
              title="Total Students"
              value={stats.totalStudents}
              bg="primary"
              isMobile={isMobile}
            />
          </div>
        </Col>

        <Col xs={6} md={4} className="mb-3">
          <div style={fadeInDelay(0.2)}>
            <StatCard
              icon={<FaUserFriends />}
              title="Total Parents"
              value={stats.totalParents}
              bg="success"
              isMobile={isMobile}
            />
          </div>
        </Col>

        <Col xs={6} md={4} className="mb-3">
          <div style={fadeInDelay(0.3)}>
            <StatCard
              icon={<FaChalkboardTeacher />}
              title="Total Teachers"
              value={stats.totalTeachers}
              bg="info"
              isMobile={isMobile}
            />
          </div>
        </Col>

      </Row>

      {/* Charts */}
      <Row className="mb-4" id="charts">
        <Col md={12}>
          <div style={fadeInDelay(0.4)}>
            <ChartCard
              title="Class Performance"
              data={classPerformanceData}
              ref={chartRef}
              maxY={100}
              isMobile={isMobile}
            />
          </div>
        </Col>
      </Row>

      {/* Table */}
      <Row id="registrations">
        <Col md={12}>
          <div style={fadeInDelay(0.5)}>
            <DataTable
              title="Registrations"
              data={registrations}
              columns={["Name", "Type", "Date", "Status"]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
