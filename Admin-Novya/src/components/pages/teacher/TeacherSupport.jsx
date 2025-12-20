import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const TeacherSupport = () => {

  // ---------------------------
  // STATE
  // ---------------------------
  const [teacherTickets, setTeacherTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // ---------------------------
  // FETCH TEACHER SUPPORT REQUESTS
  // (You can update this API URL based on your backend)
  // ---------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/core/teacher/support/list/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            id: item.id,
            teacherName: item.teacher_name,
            email: item.email,
            subject: item.subject,
            message: item.message,
            status: item.status || "Pending",
            createdAt: item.created_at,
          }));

          setTeacherTickets(mapped);
        }
      })
      .catch((err) => console.error("Error fetching teacher tickets:", err));
  }, []);

  // ---------------------------
  // STATUS BADGES
  // ---------------------------
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "open":
        return <Badge bg="primary">Open</Badge>;
      case "in progress":
        return <Badge bg="warning">In Progress</Badge>;
      case "resolved":
        return <Badge bg="success">Resolved</Badge>;
      case "pending":
        return <Badge bg="secondary">Pending</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // ---------------------------
  // FILTER SEARCH
  // ---------------------------
  const filteredTeachers = teacherTickets.filter((ticket) =>
    String(ticket.teacherName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.email || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.subject || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.status || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.id || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* TITLE */}
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "bold", color: "#244f6f" }}>👨‍🏫 Teacher Support</h2>
      </div>

      {/* ALERT */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          className="mb-3"
          onClose={() => setAlert({ show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      {/* SEARCH */}
      <Card className="mb-3">
        <Card.Body className="p-2">
          <Form.Control
            type="text"
            placeholder="🔍 Search by ID, name, email, subject, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <strong>Teacher Support Requests</strong>
            </Card.Header>

            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Teacher Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.teacherName}</td>
                        <td>{ticket.email}</td>
                        <td>{ticket.subject}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No support requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherSupport;
