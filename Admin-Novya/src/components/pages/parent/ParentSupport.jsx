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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ParentSupport = () => {
  const [parentTickets, setParentTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    // -------------------------------
    // FETCH PARENT CONTACT REQUESTS (FASTAPI)
    // -------------------------------
    fetch("http://localhost:8000/api/core/parent/contact/list/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            id: item.id,
            parentName: item.parent_name,
            studentName: item.student_name,
            studentId: item.student_id,
            email: item.email,
            phone: item.phone_number,
            message: item.message,
            status: "pending",
            createdAt: item.created_at,
          }));

          setParentTickets(mapped);
          localStorage.setItem("parentTickets", JSON.stringify(mapped));
        }
      })
      .catch((err) => console.error("Error loading parent inquiries:", err));

    // -------------------------------
    // LOCAL STORAGE LOAD
    // -------------------------------
    const localData = localStorage.getItem("parentTickets");
    if (localData) setParentTickets(JSON.parse(localData));
  }, []);

  // -------------------------------
  // STATUS BADGES
  // -------------------------------
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "pending":
        return <Badge bg="secondary">Pending</Badge>;
      case "resolved":
        return <Badge bg="success">Resolved</Badge>;
      case "open":
        return <Badge bg="primary">Open</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // -------------------------------
  // SEARCH FILTER
  // -------------------------------
  const filteredParentTickets = parentTickets.filter((ticket) =>
    String(ticket.parentName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.studentName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.email || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    String(ticket.id || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: "bold", color: "#2D5D7B" }}>📞 Parent Support</h2>
        <p className="text-muted">All parent inquiries appear here</p>
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
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Form.Control
            type="text"
            placeholder="🔍 Search by Name, Student, Email or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <strong>Parent Inquiries</strong>
            </Card.Header>

            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Parent Name</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParentTickets.length > 0 ? (
                    filteredParentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.parentName}</td>
                        <td>{ticket.studentName}</td>
                        <td>{ticket.email}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No matches found
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

export default ParentSupport;
