import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { getSchoolParents } from "../../../api";

// ⭐ COMPONENTS
import TopBar from "../../TopBar";
import ParentSidebar from "../../ParentSidebar";

// ⭐ PAGES
import ParentSupport from "./ParentSupport";
import ParentPayments from "./ParentPayments";
import ParentRegistration from "./ParentRegistration";

// ⭐ Icons
import {
  FaUsers,
  FaUserCheck,
  FaChild,
} from "react-icons/fa";

// ⭐ Charts
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

// ⭐ Hover Styles
const hoverStyle = { transition: "transform 0.3s, box-shadow 0.3s" };
const hoverStyleActive = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

// ⭐ Stat Card (Updated to match TeacherDashboard style)
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

// =========================================================================================
// ⭐ ADMIN → PARENTS DASHBOARD
// =========================================================================================
const ParentDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const chartRef = useRef(null);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ Load real parent data
  useEffect(() => {
    const loadParents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const adminEmail = localStorage.getItem("profileEmail");
        if (!adminEmail) {
          setError("Admin email not found. Please login again.");
          setLoading(false);
          return;
        }
        
        const result = await getSchoolParents(adminEmail);
        
        if (result.error) {
          setError(result.error);
          setParents([]);
        } else {
          setParents(result.parents || []);
        }
      } catch (err) {
        console.error("Error loading parents:", err);
        setError("Failed to load parents");
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    loadParents();
  }, []);

  // ⭐ DERIVED STATS (NO STATIC VALUES)
  const totalParents = parents.length;
  const activeParents = parents.filter(p => p.status === "approved" || p.status === "Approved").length;
  const totalChildren = parents.reduce((sum, p) => sum + (p.children_count || 0), 0);

  // ⭐ Chart Data (linked to table)
  const parentsChart = {
    labels: ["Parents", "Children"],
    datasets: [
      {
        label: "Count",
        data: [totalParents, totalChildren],
        backgroundColor: ["#0d6efd", "#198754"],
      },
    ],
  };

  return (
    <div className={`admin-dashboard ${darkMode ? "dark-mode" : ""}`}>
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showSidebar={showSidebar}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <ParentSidebar
        showSidebar={showSidebar}
        darkMode={darkMode}
        setShowSidebar={setShowSidebar}
      />

      <main className="main-content">
        <Container fluid className="py-4">

          <Routes>
            {/* ROUTES - Specific routes first */}
            <Route path="payments" element={<ParentPayments />} />
            <Route path="support" element={<ParentSupport />} />
            <Route path="registration" element={<ParentRegistration />} />

            {/* ⭐ OVERVIEW - Default route for parent dashboard (index route) */}
            <Route
              index
              element={
                <>
                  <Alert variant="primary" className="mb-3">
                    👨‍💼 Admin Panel – Parents Overview
                  </Alert>

                  {loading ? (
                    <div className="text-center p-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-3">Loading parents data...</p>
                    </div>
                  ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                  ) : (
                    <>
                      {/* STAT CARDS - Matching TeacherDashboard style */}
                      <Row className="mb-4" id="stats">
                        <Col xs={6} md={4} className="mb-3">
                          <div style={fadeInDelay(0.1)}>
                            <StatCard
                              icon={<FaUsers />}
                              title="Total Parents"
                              value={totalParents}
                              bg="primary"
                            />
                          </div>
                        </Col>

                        <Col xs={6} md={4} className="mb-3">
                          <div style={fadeInDelay(0.2)}>
                            <StatCard
                              icon={<FaUserCheck />}
                              title="Active Parents"
                              value={activeParents}
                              bg="success"
                            />
                          </div>
                        </Col>

                        <Col xs={6} md={4} className="mb-3">
                          <div style={fadeInDelay(0.3)}>
                            <StatCard
                              icon={<FaChild />}
                              title="Total Children"
                              value={totalChildren}
                              bg="info"
                            />
                          </div>
                        </Col>
                      </Row>

                      {/* CHART */}
                      <Row className="mb-4">
                        <Col md={12}>
                          <Card className="shadow">
                            <Card.Body>
                              <h5 className="text-center mb-3">
                                Parents vs Children
                              </h5>
                              <div style={{ height: "260px" }}>
                                <Bar ref={chartRef} data={parentsChart} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* PARENTS TABLE */}
                      <Row>
                        <Col md={12}>
                          <Card className="shadow">
                            <Card.Body>
                              <h5 className="text-center mb-3">
                                Parents List
                              </h5>
                              {parents.length > 0 ? (
                                <Table bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Phone</th>
                                      <th>Children</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parents.map((p) => (
                                      <tr key={p.parent_id}>
                                        <td>{p.name}</td>
                                        <td>{p.email}</td>
                                        <td>{p.phone}</td>
                                        <td>{p.children_count || 0}</td>
                                        <td>
                                          <Badge
                                            bg={
                                              p.status === "approved" || p.status === "Approved"
                                                ? "success"
                                                : "secondary"
                                            }
                                          >
                                            {p.status || "N/A"}
                                          </Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <p className="text-center text-muted">No parents found</p>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              }
            />
          </Routes>

        </Container>
      </main>
    </div>
  );
};

export default ParentDashboard;