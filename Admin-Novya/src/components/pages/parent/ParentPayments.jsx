import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Row,
  Col,
  Button,
  Badge,
  InputGroup,
  Navbar,
  Nav,
  Collapse,
  Modal,
} from "react-bootstrap";
import {
  FaSearch,
  FaDownload,
  FaFilter,
  FaBars,
  FaChevronDown,
  FaChevronUp,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ===========================================
// SAMPLE DATA → ONLY THIS PARENT’S CHILDREN
// ===========================================
const samplePayments = [
  {
    id: 1,
    childName: "Rahul Mehta",
    class: "8th",
    transactionId: "TXN-C10021",
    status: "Success",
    date: "2025-07-22",
    amount: 3600,
  },
  {
    id: 2,
    childName: "Rahul Mehta",
    class: "8th",
    transactionId: "TXN-C10022",
    status: "Pending",
    date: "2025-07-25",
    amount: 3600,
  },
  {
    id: 3,
    childName: "Aarav Mehta",
    class: "5th",
    transactionId: "TXN-C10023",
    status: "Failed",
    date: "2025-06-20",
    amount: 3000,
  },
  {
    id: 4,
    childName: "Aarav Mehta",
    class: "5th",
    transactionId: "TXN-C10024",
    status: "Success",
    date: "2025-05-18",
    amount: 3000,
  },
];

// Animation style
const fadeInStyle = {
  opacity: 0,
  transform: "translateY(15px)",
  animation: "fadeInUp 0.6s forwards",
};
const fadeInDelay = (delay) => ({
  ...fadeInStyle,
  animationDelay: `${delay}s`,
});

// Add fade animation if not present
if (typeof document !== "undefined") {
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (![...styleSheet.cssRules].some((r) => r.name === "fadeInUp")) {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }
}

const ParentPayments = () => {
  const [payments, setPayments] = useState(samplePayments);
  const [filters, setFilters] = useState({
    class: "",
    status: "",
    from: "",
    to: "",
    search: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [exportModal, setExportModal] = useState(false);

  // Handle responsiveness
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...samplePayments];

    if (filters.class)
      filtered = filtered.filter((p) =>
        p.class.toLowerCase().includes(filters.class.toLowerCase())
      );

    if (filters.status)
      filtered = filtered.filter((p) => p.status === filters.status);

    if (filters.from)
      filtered = filtered.filter(
        (p) => new Date(p.date) >= new Date(filters.from)
      );

    if (filters.to)
      filtered = filtered.filter((p) => new Date(p.date) <= new Date(filters.to));

    if (filters.search)
      filtered = filtered.filter(
        (p) =>
          p.childName.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.transactionId.toLowerCase().includes(filters.search.toLowerCase())
      );

    setPayments(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [filters]);

  // Summary stats
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const successCount = payments.filter((p) => p.status === "Success").length;
  const pendingCount = payments.filter((p) => p.status === "Pending").length;
  const failedCount = payments.filter((p) => p.status === "Failed").length;

  const successRate = payments.length
    ? Math.round((successCount / payments.length) * 100)
    : 0;

  // Export → Excel
  const exportToExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(payments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Payments");
    XLSX.writeFile(wb, "parent_payments.xlsx");
  };

  // Export → PDF
  const exportToPDF = () => {
    const table = document.getElementById("paymentTable");
    html2canvas(table).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const img = canvas.toDataURL("image/png");
      pdf.addImage(img, "PNG", 0, 0, 210, 297);
      pdf.save("parent_payments.pdf");
    });
  };

  // Mobile card view
  const PaymentCard = ({ item }) => (
    <Card className="mb-3 payment-card">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h6>{item.childName}</h6>
            <small className="text-muted">TXN: {item.transactionId}</small>
          </div>
          <Badge
            bg={
              item.status === "Success"
                ? "success"
                : item.status === "Pending"
                ? "warning"
                : "danger"
            }
          >
            {item.status}
          </Badge>
        </div>

        <Row className="mt-2">
          <Col xs={6}>
            <small>Class: <strong>{item.class}</strong></small>
          </Col>
          <Col xs={6}>
            <small>Amount: <strong>₹{item.amount}</strong></small>
          </Col>
          <Col xs={12}>
            <small>Date: <strong>{item.date}</strong></small>
          </Col>
        </Row>

        <Button
          variant="outline-primary"
          size="sm"
          className="mt-2"
          onClick={() =>
            setExpandedPayment(expandedPayment === item.id ? null : item.id)
          }
        >
          {expandedPayment === item.id ? <FaChevronUp /> : <FaChevronDown />} Details
        </Button>

        <Collapse in={expandedPayment === item.id}>
          <div className="p-2 mt-2 bg-light rounded">
            <small>
              <strong>Transaction ID:</strong> {item.transactionId}<br />
              <strong>Status:</strong> {item.status}<br />
              <strong>Child:</strong> {item.childName}<br />
              <strong>Class:</strong> {item.class}<br />
              <strong>Amount:</strong> ₹{item.amount}<br />
              <strong>Date:</strong> {item.date}<br />
            </small>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );

  // Summary component
  const SummaryCard = ({ title, value, bg }) => (
    <Card className="text-center shadow-sm mb-3 border-0">
      <Card.Body>
        <div className={`p-3 rounded text-white bg-${bg}`}>
          <h5>{value}</h5>
        </div>
        <p className="text-muted mt-2">{title}</p>
      </Card.Body>
    </Card>
  );

  return (
    <div className="p-2 p-md-3" style={{ background: "#fff", minHeight: "100vh" }}>
      
      {/* Mobile Header */}
      {isMobile && (
        <Navbar bg="light" expand={false} className="mb-3">
          <Navbar.Brand>💳 Payments</Navbar.Brand>

          <Button variant="outline-secondary" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <FaBars />
          </Button>

          <Collapse in={showMobileMenu}>
            <Nav className="flex-column mt-2 p-2">
              <InputGroup className="mb-2">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search child or txn ID..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </InputGroup>

              <Button
                variant="outline-info"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </Button>
            </Nav>
          </Collapse>
        </Navbar>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <h3>📄 Payment History</h3>
            <div>
              <Button variant="outline-success" className="me-2" onClick={exportToExcel}>
                <FaFileExcel /> Excel
              </Button>
              <Button variant="outline-danger" onClick={exportToPDF}>
                <FaFilePdf /> PDF
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Summary */}
      <Row className="mb-4">
        <Col xs={6} md={3}>
          <SummaryCard title="Total Revenue" value={`₹${totalRevenue}`} bg="primary" />
        </Col>
        <Col xs={6} md={3}>
          <SummaryCard title="Success Rate" value={`${successRate}%`} bg="success" />
        </Col>
        <Col xs={6} md={3}>
          <SummaryCard title="Pending Payments" value={pendingCount} bg="warning" />
        </Col>
        <Col xs={6} md={3}>
          <SummaryCard title="Failed Payments" value={failedCount} bg="danger" />
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={3}>
              <Form.Control
                placeholder="Filter by Class"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search child or txn ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table or Cards */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          {!isMobile ? (
            <div id="paymentTable">
              <Table hover bordered responsive className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Child</th>
                    <th>Class</th>
                    <th>Txn ID</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{idx + 1}</td>
                      <td>{p.childName}</td>
                      <td>{p.class}</td>
                      <td>{p.transactionId}</td>
                      <td>
                        <Badge
                          bg={
                            p.status === "Success"
                              ? "success"
                              : p.status === "Pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td>₹{p.amount}</td>
                      <td>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            payments.map((p) => <PaymentCard key={p.id} item={p} />)
          )}
        </Card.Body>
      </Card>

      {/* Mobile Export Modal */}
      <Modal show={exportModal} onHide={() => setExportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Export Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="w-100 mb-2" variant="outline-success" onClick={exportToExcel}>
            <FaFileExcel /> Export to Excel
          </Button>
          <Button className="w-100" variant="outline-danger" onClick={exportToPDF}>
            <FaFilePdf /> Export to PDF
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ParentPayments;
