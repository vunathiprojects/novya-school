import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TeacherRegistrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Core data
  const [teachers, setTeachers] = useState([]);
  const [upcomingTeachers, setUpcomingTeachers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ------------------------------------------------
  // Initial sample data (replace with API calls later)
  // ------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    setTimeout(() => setFadeIn(true), 100);

    const sampleTeachers = [
      {
        regId: "T001",
        firstName: "Sophia",
        lastName: "Ray",
        phone: "9876543210",
        email: "sophia@example.com",
        username: "sophiateacher",
        subject: "Mathematics",
        status: "Pending",
        locked: false,
        createdAt: new Date().toISOString(),
        registrationDate: "10/12/2025"
      },
      {
        regId: "T002",
        firstName: "Amit",
        lastName: "Verma",
        phone: "9123456780",
        email: "amit@example.com",
        username: "amitv",
        subject: "Science",
        status: "Approved",
        locked: false,
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 15)
        ).toISOString(),
        registrationDate: "05/12/2025"
      },
      {
        regId: "T003",
        firstName: "Reena",
        lastName: "Ghosh",
        phone: "9871234567",
        email: "reena@example.com",
        username: "reenag",
        subject: "English",
        status: "Rejected",
        locked: false,
        createdAt: new Date(
          new Date().setDate(new Date().getDate() - 5)
        ).toISOString(),
        registrationDate: "28/11/2025"
      },
    ];

    const sampleUpcoming = [
      {
        regId: "UT001",
        firstName: "Karthik",
        lastName: "Reddy",
        phone: "9988776655",
        email: "karthik@example.com",
        username: "karthikr",
        subject: "Social Studies",
        registrationDate: "18/12/2025",
        status: "Upcoming",
        locked: false,
      },
      {
        regId: "UT002",
        firstName: "Neha",
        lastName: "Kulkarni",
        phone: "7766554433",
        email: "neha@example.com",
        username: "nehak",
        subject: "Hindi",
        registrationDate: "22/12/2025",
        status: "Upcoming",
        locked: false,
      },
    ];

    setTeachers(sampleTeachers);
    setUpcomingTeachers(sampleUpcoming);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------
  // Filters and derived lists
  // -------------------------
  const filteredTeachers = teachers.filter((teacher) =>
    Object.values(teacher).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredUpcoming = upcomingTeachers.filter((teacher) =>
    Object.values(teacher).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const newTeachers = filteredTeachers.filter((t) => {
    const created = new Date(t.createdAt);
    const diff = (new Date() - created) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  // -------------------------
  // Status & Lock utilities
  // -------------------------
  const getStatusBadge = (status, locked) => {
    if (locked) return <Badge bg="dark">Locked</Badge>;
    switch ((status || "").toLowerCase()) {
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "upcoming":
        return <Badge bg="info">Upcoming</Badge>;
      default:
        return <Badge bg="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const handleStatusChange = (regId, newStatus) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.regId === regId ? { ...t, status: newStatus, locked: newStatus === "Rejected" ? false : t.locked } : t
      )
    );
  };

  const handleToggleLock = (regId) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.regId === regId ? { ...t, locked: !t.locked } : t
      )
    );
  };

  // View modal
  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  // -------------------------
  // Export helpers
  // -------------------------
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((t) => ({
        RegID: t.regId,
        Name: `${t.firstName} ${t.lastName}`,
        Email: t.email,
        Subject: t.subject,
        RegistrationDate: t.registrationDate,
        Status: t.status,
        Locked: t.locked ? "Locked" : "Active",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, fileName);
  };

  const exportToPDF = (data, fileName, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 10);
    doc.autoTable({
      head: [["Reg ID", "Name", "Email", "Subject", "Registration Date", "Status", "Locked"]],
      body: data.map((t) => [
        t.regId,
        `${t.firstName} ${t.lastName}`,
        t.email,
        t.subject,
        t.registrationDate,
        t.status,
        t.locked ? "Locked" : "Active",
      ]),
    });
    doc.save(fileName);
  };

  // -------------------------
  // Mobile card with actions
  // -------------------------
  const TeacherCard = ({ teacher, isUpcoming = false }) => (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">{teacher.firstName} {teacher.lastName}</h6>
            <small className="text-muted">ID: {teacher.regId}</small>
          </div>

          <div style={{ textAlign: "right" }}>
            {getStatusBadge(teacher.status, teacher.locked)}
            <br />
            <small className="text-muted">{teacher.subject}</small>
          </div>
        </div>

        <small><strong>Email:</strong> {teacher.email}</small><br />
        <small><strong>Registration Date:</strong> {teacher.registrationDate}</small><br />

        <div className="d-flex gap-2 mt-3 flex-wrap">
          <Button variant="outline-primary" size="sm" onClick={() => handleView(teacher)}>View</Button>

          {!isUpcoming ? (
            <>
              <Button variant="success" size="sm" onClick={() => handleStatusChange(teacher.regId, "Approved")}>Approve</Button>
              <Button variant="danger" size="sm" onClick={() => handleStatusChange(teacher.regId, "Rejected")}>Reject</Button>

              <Button
                variant={teacher.locked ? "warning" : "dark"}
                size="sm"
                onClick={() => handleToggleLock(teacher.regId)}
              >
                {teacher.locked ? "Unlock" : "Lock"}
              </Button>
            </>
          ) : (
            <Button variant="outline-secondary" size="sm" disabled>
              No Actions
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  // -------------------------
  // Table renderer
  // -------------------------
  const renderTeacherTable = (title, data, exportName, isUpcoming = false) => (
    <Card
      className="m-3 shadow-sm"
      style={{
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease-in",
      }}
    >
      <Card.Body>
        <h4 className="text-center mb-3">{title}</h4>

        <div className="d-flex flex-column flex-md-row justify-content-between mb-3 gap-2">
          <Form.Control
            type="text"
            placeholder="Search teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-success" size="sm">
                Export Excel
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportToExcel(data, `${exportName}.xlsx`)}>
                  {title}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="outline-danger" size="sm">
                Export PDF
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportToPDF(data, `${exportName}.pdf`, title)}>
                  {title}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {isMobile ? (
          <>
            {data.length > 0 ? (
              data.map((t) => (
                <TeacherCard key={t.regId} teacher={t} isUpcoming={isUpcoming} />
              ))
            ) : (
              <div className="text-center py-3 text-muted">No data found</div>
            )}
          </>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr style={{ textAlign: "center", background: "#007bff", color: "#fff" }}>
                <th>Reg ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Locked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((t) => (
                  <tr key={t.regId} style={{ textAlign: "center" }}>
                    <td>{t.regId}</td>
                    <td>{t.firstName} {t.lastName}</td>
                    <td>{t.email}</td>
                    <td>{t.subject}</td>
                    <td>{t.registrationDate}</td>
                    <td>{getStatusBadge(t.status, t.locked)}</td>
                    <td>
                      <Badge bg={t.locked ? "dark" : "secondary"}>
                        {t.locked ? "Locked" : "Active"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        <Button variant="outline-primary" size="sm" onClick={() => handleView(t)}>View</Button>
                        {!isUpcoming ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => handleStatusChange(t.regId, "Approved")}>Approve</Button>
                            <Button variant="danger" size="sm" onClick={() => handleStatusChange(t.regId, "Rejected")}>Reject</Button>
                            <Button variant={t.locked ? "warning" : "dark"} size="sm" onClick={() => handleToggleLock(t.regId)}>
                              {t.locked ? "Unlock" : "Lock"}
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline-secondary" size="sm" disabled>
                            No Actions
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No teachers found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // -------------------------
  // Render
  // -------------------------
  return (
    <>
      {/* Top stat cards */}
      <Row className="m-3">
        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center p-3">
            <h5>🆕 New Teachers</h5>
            <h3>{newTeachers.length}</h3>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center p-3">
            <h5>👨‍🏫 Total Teachers</h5>
            <h3>{teachers.length}</h3>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center p-3">
            <h5>📅 Upcoming Teachers</h5>
            <h3>{upcomingTeachers.length}</h3>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      {renderTeacherTable("📅 Upcoming Teachers", filteredUpcoming, "upcoming_teachers", true)}
      {renderTeacherTable("🆕 New Teachers (Last 30 Days)", newTeachers, "new_teachers", false)}
      {renderTeacherTable("👨‍🏫 All Teachers", filteredTeachers, "all_teachers", false)}

      {/* Detail modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Teacher Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTeacher ? (
            <>
              <p><strong>ID:</strong> {selectedTeacher.regId}</p>
              <p><strong>Name:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
              <p><strong>Email:</strong> {selectedTeacher.email}</p>
              <p><strong>Phone:</strong> {selectedTeacher.phone}</p>
              <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
              <p><strong>Registration Date:</strong> {selectedTeacher.registrationDate}</p>
              <p><strong>Status:</strong> {selectedTeacher.status}</p>
              <p><strong>Account:</strong> {selectedTeacher.locked ? "Locked" : "Active"}</p>
              {selectedTeacher.username && (
                <p><strong>Username:</strong> {selectedTeacher.username}</p>
              )}
            </>
          ) : (
            <div className="text-center text-muted">No details</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TeacherRegistrations;