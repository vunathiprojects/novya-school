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
  Spinner,
  Alert,
} from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getParentRegistrations,
} from "../../../api";

const ParentRegistration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Core data
  const [parents, setParents] = useState([]);
  const [upcomingParents, setUpcomingParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ newParents: 0, totalParents: 0, upcomingParents: 0 });

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const adminEmail = localStorage.getItem("profileEmail");
        if (!adminEmail) {
          setError("Admin email not found. Please login again.");
          setLoading(false);
          return;
        }
        
        const result = await getParentRegistrations(adminEmail);
        
        if (result.error) {
          setError(result.error);
          setParents([]);
          setUpcomingParents([]);
        } else {
          // Transform backend data to match frontend format
          const transformedParents = (result.parents || []).map((p) => ({
            parent_id: p.parent_id,
            regId: p.regId,
            firstName: p.firstName,
            lastName: p.lastName,
            name: `${p.firstName} ${p.lastName}`,
            email: p.email,
            phone: p.phone,
            username: p.username,
            children: p.children,
            status: p.status,
            locked: p.locked,
            registrationDate: p.registrationDate,
            createdAt: p.createdAt,
          }));
          
          setParents(transformedParents);
          setUpcomingParents(result.upcomingParents || []);
          setSummary(result.summary || { newParents: 0, totalParents: 0, upcomingParents: 0 });
        }
      } catch (err) {
        console.error("Error loading parent registrations:", err);
        setError("Failed to load parent registrations");
        setParents([]);
        setUpcomingParents([]);
      } finally {
        setLoading(false);
        setTimeout(() => setFadeIn(true), 100);
      }
    };

    loadData();
  }, []);

  // Filters and derived lists
  const filteredParents = parents.filter((parent) =>
    Object.values(parent).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const newParents = filteredParents.filter((p) => {
    if (!p.createdAt) return false;
    const created = new Date(p.createdAt);
    const diff = (new Date() - created) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  const pendingParents = filteredParents.filter((p) => p.status === "Pending");

  // Note: School admin only approves teachers, not parents
  // This page is view-only for parent registrations

  const handleView = (parent) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  // Export helpers
  const exportExcel = (data, fileName) => {
    const exportData = data.map((p) => ({
      "REG ID": p.regId,
      "Name": p.name,
      "Email": p.email,
      "Phone": p.phone,
      "Children": p.children,
      "Status": p.status,
      "Registration Date": p.registrationDate,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parents");
    saveAs(
      new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]),
      `${fileName}.xlsx`
    );
  };

  const exportPDF = (data, title, fileName) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["REG ID", "Name", "Email", "Phone", "Children", "Status"]],
      body: data.map((p) => [
        p.regId,
        p.name,
        p.email,
        p.phone,
        p.children,
        p.status,
      ]),
    });
    doc.save(`${fileName}.pdf`);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading parent registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s" }}>
      {/* Summary Cards */}
      <Row className="m-3">
        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">New Parents</h6>
              <h2 className="text-primary">{summary.newParents || pendingParents.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Parents</h6>
              <h2 className="text-success">{summary.totalParents || parents.filter((p) => p.status === "Approved").length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted mb-2">Upcoming Parents</h6>
              <h2 className="text-info">{summary.upcomingParents || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Parents Table */}
      <Card className="m-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>📅 Upcoming Parents</h5>
            <div>
              <Button size="sm" variant="success" className="me-2" onClick={() => exportExcel(upcomingParents, "Upcoming_Parents")}>
                Export Excel
              </Button>
              <Button size="sm" variant="danger" onClick={() => exportPDF(upcomingParents, "Upcoming Parents", "Upcoming_Parents")}>
                Export PDF
              </Button>
            </div>
          </div>

          <Form.Control
            className="mb-3"
            placeholder="Search parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {upcomingParents.length > 0 ? (
            <Table bordered hover responsive>
              <thead className="table-dark text-center">
                <tr>
                  <th>REG ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>CHILDREN</th>
                  <th>REGISTRATION DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {upcomingParents.map((p) => (
                  <tr key={p.parent_id}>
                    <td><strong>{p.regId}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.children}</td>
                    <td>{p.registrationDate}</td>
                    <td>
                      <Badge bg="warning">{p.status}</Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-1 flex-wrap">
                        <Button variant="outline-primary" size="sm" onClick={() => handleView(p)}>
                          View
                        </Button>
                        <Button variant="outline-secondary" size="sm" disabled>
                          No Actions
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">No upcoming parents found</p>
          )}
        </Card.Body>
      </Card>

      {/* New Parents (Last 30 Days) */}
      <Card className="m-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>🆕 New Parents (Last 30 Days)</h5>
            <div>
              <Button size="sm" variant="success" className="me-2" onClick={() => exportExcel(newParents, "New_Parents")}>
                Export Excel
              </Button>
              <Button size="sm" variant="danger" onClick={() => exportPDF(newParents, "New Parents", "New_Parents")}>
                Export PDF
              </Button>
            </div>
          </div>

          <Form.Control
            className="mb-3"
            placeholder="Search parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {newParents.length > 0 ? (
            <Table bordered hover responsive>
              <thead className="table-dark text-center">
                <tr>
                  <th>REG ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>CHILDREN</th>
                  <th>REGISTRATION DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {newParents.map((p) => (
                  <tr key={p.parent_id}>
                    <td><strong>{p.regId}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.children}</td>
                    <td>{p.registrationDate}</td>
                    <td>
                      <Badge bg={p.status === "Approved" ? "success" : p.status === "Rejected" ? "danger" : "warning"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-1 flex-wrap">
                        <Button variant="outline-primary" size="sm" onClick={() => handleView(p)}>
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">No new parents found</p>
          )}
        </Card.Body>
      </Card>

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Parent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParent && (
            <>
              <p><strong>REG ID:</strong> {selectedParent.regId}</p>
              <p><strong>Name:</strong> {selectedParent.name}</p>
              <p><strong>Email:</strong> {selectedParent.email}</p>
              <p><strong>Phone:</strong> {selectedParent.phone}</p>
              <p><strong>Username:</strong> {selectedParent.username}</p>
              <p><strong>Children:</strong> {selectedParent.children}</p>
              <p><strong>Status:</strong> {selectedParent.status}</p>
              <p><strong>Registration Date:</strong> {selectedParent.registrationDate}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ParentRegistration;
