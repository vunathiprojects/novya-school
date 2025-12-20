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
} from "react-bootstrap";

// 📤 Export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ParentRegistration = () => {
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔍 Search (SEPARATE for each section)
  const [upcomingSearch, setUpcomingSearch] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [totalSearch, setTotalSearch] = useState("");

  // 🔹 Load Parent Data
  useEffect(() => {
    setParents([
      {
        id: 1,
        parentId: "P001",
        name: "Ramesh Kumar",
        email: "ramesh@gmail.com",
        phone: "9876543210",
        children: 1,
        status: "Pending",
        locked: false,
        createdAt: "2025-12-10",
      },
      {
        id: 2,
        parentId: "P002",
        name: "Anita Sharma",
        email: "anita@gmail.com",
        phone: "9123456780",
        children: 2,
        status: "Approved",
        locked: false,
        createdAt: "2025-12-05",
      },
      {
        id: 3,
        parentId: "P003",
        name: "Suresh Rao",
        email: "suresh@gmail.com",
        phone: "9012345678",
        children: 1,
        status: "Pending",
        locked: false,
        createdAt: "2025-11-28",
      },
    ]);
  }, []);

  // 🔹 Derived + Search Filters
  const upcomingParents = parents
    .filter((p) => p.status === "Pending")
    .filter((p) =>
      Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(upcomingSearch.toLowerCase())
    );

  const newParents = parents
    .filter((p) => {
      const created = new Date(p.createdAt);
      const today = new Date();
      return (today - created) / (1000 * 60 * 60 * 24) <= 30;
    })
    .filter((p) =>
      Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(newSearch.toLowerCase())
    );

  const filteredParents = parents.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(totalSearch.toLowerCase())
  );

  // 🔹 Actions
  const updateStatus = (id, status) =>
    setParents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

  const toggleLock = (id) =>
    setParents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, locked: !p.locked } : p))
    );

  const handleView = (parent) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  // ================= EXPORT HELPERS =================
  const exportExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
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
      head: [["Parent ID", "Name", "Email", "Phone", "Children", "Status"]],
      body: data.map((p) => [
        p.parentId,
        p.name,
        p.email,
        p.phone,
        p.children,
        p.status,
      ]),
    });
    doc.save(`${fileName}.pdf`);
  };
  // =================================================

  return (
    <>
      {/* 🔹 SUMMARY CARDS */}
      <Row className="m-3">
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6>Upcoming Registrations</h6>
              <h4>{upcomingParents.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6>New Registrations (30 Days)</h6>
              <h4>{newParents.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6>Total Parents</h6>
              <h4>{parents.length}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🔹 UPCOMING REGISTRATIONS - MATCHING THE IMAGE */}
      <Card className="m-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>📅 Upcoming Registrations</h5>
            <div>
              <Button size="sm" variant="success" className="me-2"
                onClick={() => exportExcel(upcomingParents, "Upcoming_Parents")}>
                Export Excel
              </Button>
              <Button size="sm" variant="danger"
                onClick={() => exportPDF(upcomingParents, "Upcoming Parents", "Upcoming_Parents")}>
                Export PDF
              </Button>
            </div>
          </div>

          <Form.Control
            className="mb-3"
            placeholder="Search by name, email, or username..."
            value={upcomingSearch}
            onChange={(e) => setUpcomingSearch(e.target.value)}
          />

          <Table bordered hover responsive>
            <thead className="table-dark text-center">
              <tr>
                <th>REG ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>USERNAME</th>
                <th>STATUS</th>
                <th>REGISTRATION DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {upcomingParents.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.parentId}</strong></td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.email.split('@')[0]}</td>
                  <td>
                    <Badge bg="warning" className="px-2 py-1">
                      Upcoming
                    </Badge>
                  </td>
                  <td>{new Date(p.createdAt).toLocaleDateString('en-GB')}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <Button size="sm" variant="outline-primary" onClick={() => handleView(p)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline-secondary" disabled>
                        No Actions
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 🔹 NEW REGISTRATIONS */}
      <Card className="m-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>🆕 New Registrations (Last 30 Days)</h5>
            <div>
              <Button size="sm" variant="success" className="me-2"
                onClick={() => exportExcel(newParents, "New_Parents")}>
                Export Excel
              </Button>
              <Button size="sm" variant="danger"
                onClick={() => exportPDF(newParents, "New Parents", "New_Parents")}>
                Export PDF
              </Button>
            </div>
          </div>

          <Form.Control
            className="mb-2"
            placeholder="Search parent..."
            value={newSearch}
            onChange={(e) => setNewSearch(e.target.value)}
          />

          <Table bordered hover responsive>
            <thead className="table-dark text-center">
              <tr>
                <th>Parent ID</th><th>Name</th><th>Email</th>
                <th>Phone</th><th>Children</th><th>Status</th><th>Account</th><th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {newParents.map((p) => (
                <tr key={p.id}>
                  <td>{p.parentId}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.children}</td>
                  <td>
                    <Badge bg={p.status === "Approved" ? "success" : "warning"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={p.locked ? "dark" : "secondary"}>
                      {p.locked ? "Locked" : "Active"}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" onClick={() => handleView(p)}>View</Button>{" "}
                    <Button size="sm" variant="success" onClick={() => updateStatus(p.id, "Approved")}>Approve</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => updateStatus(p.id, "Rejected")}>Reject</Button>{" "}
                    <Button size="sm" variant={p.locked ? "warning" : "dark"} onClick={() => toggleLock(p.id)}>
                      {p.locked ? "Unlock" : "Lock"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 🔹 TOTAL PARENTS */}
      <Card className="m-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>👨‍👩‍👧 Total Parents</h5>
            <div>
              <Button size="sm" variant="success" className="me-2"
                onClick={() => exportExcel(filteredParents, "All_Parents")}>
                Export Excel
              </Button>
              <Button size="sm" variant="danger"
                onClick={() => exportPDF(filteredParents, "All Parents", "All_Parents")}>
                Export PDF
              </Button>
            </div>
          </div>

          <Form.Control
            className="mb-2"
            placeholder="Search parent..."
            value={totalSearch}
            onChange={(e) => setTotalSearch(e.target.value)}
          />

          <Table bordered hover responsive>
            <thead className="table-dark text-center">
              <tr>
                <th>Parent ID</th><th>Name</th><th>Email</th>
                <th>Phone</th><th>Children</th><th>Status</th>
                <th>Account</th><th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredParents.map((p) => (
                <tr key={p.id}>
                  <td>{p.parentId}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.children}</td>
                  <td>
                    <Badge bg={
                      p.status === "Approved"
                        ? "success"
                        : p.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={p.locked ? "dark" : "secondary"}>
                      {p.locked ? "Locked" : "Active"}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" onClick={() => handleView(p)}>View</Button>{" "}
                    <Button size="sm" variant="success" onClick={() => updateStatus(p.id, "Approved")}>Approve</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => updateStatus(p.id, "Rejected")}>Reject</Button>{" "}
                    <Button size="sm" variant={p.locked ? "warning" : "dark"} onClick={() => toggleLock(p.id)}>
                      {p.locked ? "Unlock" : "Lock"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 🔹 VIEW MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Parent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParent && (
            <>
              <p><strong>ID:</strong> {selectedParent.parentId}</p>
              <p><strong>Name:</strong> {selectedParent.name}</p>
              <p><strong>Email:</strong> {selectedParent.email}</p>
              <p><strong>Phone:</strong> {selectedParent.phone}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ParentRegistration;