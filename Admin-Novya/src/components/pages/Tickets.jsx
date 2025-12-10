// import React, { useState, useEffect } from 'react';
// import { 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Form, 
//   Modal, 
//   Alert, 
//   Container,
//   Row,
//   Col,
//   Accordion
// } from 'react-bootstrap';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { v4 as uuidv4 } from 'uuid';

// const Tickets = () => {
//   const [tickets, setTickets] = useState([]);
//   const [parentTickets, setParentTickets] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editModal, setEditModal] = useState(false);
//   const [parentEditModal, setParentEditModal] = useState(false);
//   const [newTicket, setNewTicket] = useState({ 
//     user: '', 
//     email: '', 
//     issueType: '', 
//     priority: '', 
//     assignedTo: '', 
//     message: '' 
//   });
//   const [newParentTicket, setNewParentTicket] = useState({ 
//     parentName: '', 
//     studentName: '', 
//     studentId: '', 
//     phone: '', 
//     email: '', 
//     message: '' 
//   });
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [selectedParentTicket, setSelectedParentTicket] = useState(null);
//   const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
//   const [expandedTicket, setExpandedTicket] = useState(null);
//   const [expandedParentTicket, setExpandedParentTicket] = useState(null);
//   const [activeTab, setActiveTab] = useState('support'); // 'support' or 'parent'

//   // Sample agents for assignment dropdown
//   const agents = [
//     { id: 1, name: 'John Doe', email: 'john@support.com' },
//     { id: 2, name: 'Jane Smith', email: 'jane@support.com' },
//     { id: 3, name: 'Robert Johnson', email: 'robert@support.com' },
//     { id: 4, name: 'Sarah Williams', email: 'sarah@support.com' }
//   ];

//   useEffect(() => {
//     const data = localStorage.getItem('tickets');
//     const parentData = localStorage.getItem('parentTickets');
    
//     if (data) setTickets(JSON.parse(data));
//     if (parentData) setParentTickets(JSON.parse(parentData));
//   }, []);

//   const saveTickets = (data) => {
//     setTickets(data);
//     localStorage.setItem('tickets', JSON.stringify(data));
//   };

//   const saveParentTickets = (data) => {
//     setParentTickets(data);
//     localStorage.setItem('parentTickets', JSON.stringify(data));
//   };

//   // 🔹 Create Support Ticket
//   const handleCreate = () => {
//     if (!newTicket.user || !newTicket.email || !newTicket.issueType) {
//       setAlert({ show: true, message: '❌ Please fill in required fields', variant: 'danger' });
//       return;
//     }

//     const ticket = {
//       id: uuidv4().substring(0, 8),
//       user: newTicket.user,
//       email: newTicket.email,
//       type: newTicket.issueType,
//       priority: newTicket.priority || 'Medium',
//       status: 'Open',
//       assignedTo: newTicket.assignedTo || 'Unassigned',
//       message: newTicket.message,
//       slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
//       createdAt: new Date().toISOString(),
//       history: [{ message: 'Ticket created', timestamp: new Date().toISOString() }],
//     };

//     const updated = [...tickets, ticket];
//     saveTickets(updated);
//     setNewTicket({ user: '', email: '', issueType: '', priority: '', assignedTo: '', message: '' });
//     setAlert({ show: true, message: '✅ Support ticket created successfully', variant: 'success' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 Create Parent Ticket
//   const handleCreateParentTicket = () => {
//     if (!newParentTicket.parentName || !newParentTicket.studentName || !newParentTicket.email) {
//       setAlert({ show: true, message: '❌ Please fill in required fields', variant: 'danger' });
//       return;
//     }

//     const ticket = {
//       id: uuidv4().substring(0, 8),
//       parentName: newParentTicket.parentName,
//       studentName: newParentTicket.studentName,
//       studentId: newParentTicket.studentId,
//       phone: newParentTicket.phone,
//       email: newParentTicket.email,
//       message: newParentTicket.message,
//       status: 'Pending',
//       assignedTo: newParentTicket.assignedTo || 'Unassigned',
//       createdAt: new Date().toISOString(),
//       history: [{ message: 'Parent inquiry created', timestamp: new Date().toISOString() }],
//     };

//     const updated = [...parentTickets, ticket];
//     saveParentTickets(updated);
//     setNewParentTicket({ 
//       parentName: '', 
//       studentName: '', 
//       studentId: '', 
//       phone: '', 
//       email: '', 
//       message: '',
//       assignedTo: ''
//     });
//     setAlert({ show: true, message: '✅ Parent inquiry created successfully', variant: 'success' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 Edit Support Ticket
//   const handleEdit = (ticket) => {
//     setSelectedTicket({ ...ticket });
//     setEditModal(true);
//   };

//   // 🔹 Edit Parent Ticket
//   const handleEditParent = (ticket) => {
//     setSelectedParentTicket({ ...ticket });
//     setParentEditModal(true);
//   };

//   const handleSave = () => {
//     const now = new Date().toISOString();
//     let updatedTickets;

//     const updatedTicket = {
//       ...selectedTicket,
//       history: [...(selectedTicket.history || []), { message: 'Ticket updated', timestamp: now }],
//     };

//     if (updatedTicket.status.toLowerCase() === 'resolved') {
//       updatedTickets = tickets.map((t) =>
//         t.id === updatedTicket.id ? { ...updatedTicket, history: [...updatedTicket.history, { message: 'Resolution email sent to user', timestamp: now }] } : t
//       );
//       setAlert({ show: true, message: `📧 Email sent: Ticket #${updatedTicket.id} resolved`, variant: 'info' });
//     } else {
//       updatedTickets = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
//       setAlert({ show: true, message: '✅ Ticket updated successfully', variant: 'success' });
//     }

//     saveTickets(updatedTickets);
//     setEditModal(false);
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   const handleSaveParent = () => {
//     const now = new Date().toISOString();
    
//     const updatedTicket = {
//       ...selectedParentTicket,
//       history: [...(selectedParentTicket.history || []), { message: 'Inquiry updated', timestamp: now }],
//     };

//     const updatedTickets = parentTickets.map((t) => 
//       t.id === updatedTicket.id ? updatedTicket : t
//     );
    
//     saveParentTickets(updatedTickets);
//     setParentEditModal(false);
//     setAlert({ show: true, message: '✅ Parent inquiry updated successfully', variant: 'success' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 Escalate
//   const handleEscalate = () => {
//     const updated = tickets.map((t) =>
//       t.id === selectedTicket.id
//         ? {
//             ...selectedTicket,
//             priority: 'High',
//             history: [...selectedTicket.history, { message: 'Ticket escalated to High priority', timestamp: new Date().toISOString() }],
//           }
//         : t
//     );
//     saveTickets(updated);
//     setEditModal(false);
//     setAlert({ show: true, message: '⚠️ Ticket escalated to High priority', variant: 'warning' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 Approve/Reject Parent Inquiry
//   const handleStatusChange = (ticket, status) => {
//     const updated = parentTickets.map((t) =>
//       t.id === ticket.id
//         ? {
//             ...t,
//             status: status,
//             history: [...t.history, { message: `Status changed to ${status}`, timestamp: new Date().toISOString() }],
//           }
//         : t
//     );
//     saveParentTickets(updated);
//     setAlert({ show: true, message: `Parent inquiry ${status.toLowerCase()}`, variant: 'info' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 Export to PDF
//   const handleExportPDF = () => {
//     const doc = new jsPDF();
    
//     // Support Tickets
//     doc.text('Support Tickets Report', 14, 10);
//     autoTable(doc, {
//       head: [['ID', 'User', 'Email', 'Status', 'Type', 'Priority', 'Assigned To', 'SLA Deadline']],
//       body: tickets.map((t) => [
//         t.id,
//         t.user,
//         t.email,
//         t.status,
//         t.type,
//         t.priority,
//         t.assignedTo,
//         new Date(t.slaDeadline).toLocaleString(),
//       ]),
//       startY: 20,
//     });
    
//     // Parent Inquiries
//     autoTable(doc, {
//       head: [['ID', 'Parent', 'Student', 'Status', 'Assigned To', 'Created']],
//       body: parentTickets.map((t) => [
//         t.id,
//         t.parentName,
//         t.studentName,
//         t.status,
//         t.assignedTo,
//         new Date(t.createdAt).toLocaleString(),
//       ]),
//       startY: doc.lastAutoTable.finalY + 20,
//     });
    
//     doc.save('tickets_report.pdf');
//     setAlert({ show: true, message: '📊 PDF report downloaded', variant: 'info' });
    
//     setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
//   };

//   // 🔹 SLA Status Color
//   const getSlaBadge = (slaDeadline) => {
//     const now = new Date();
//     const deadline = new Date(slaDeadline);
//     const diffHours = (deadline - now) / (1000 * 60 * 60);

//     if (diffHours < 0) return <Badge bg="danger">❌ Breached</Badge>;
//     if (diffHours < 12) return <Badge bg="warning">⏳ Urgent</Badge>;
//     if (diffHours < 24) return <Badge bg="info">⚠️ Due Soon</Badge>;
//     return <Badge bg="success">✅ On Track</Badge>;
//   };

//   // 🔹 Status Badge Color
//   const getStatusBadge = (status) => {
//     switch(status.toLowerCase()) {
//       case 'open': return <Badge bg="primary">Open</Badge>;
//       case 'in progress': return <Badge bg="warning">In Progress</Badge>;
//       case 'resolved': return <Badge bg="success">Resolved</Badge>;
//       case 'approved': return <Badge bg="success">Approved</Badge>;
//       case 'rejected': return <Badge bg="danger">Rejected</Badge>;
//       case 'pending': return <Badge bg="secondary">Pending</Badge>;
//       default: return <Badge bg="secondary">{status}</Badge>;
//     }
//   };

//   // 🔹 Priority Badge Color
//   const getPriorityBadge = (priority) => {
//     switch(priority.toLowerCase()) {
//       case 'high': return <Badge bg="danger">High</Badge>;
//       case 'medium': return <Badge bg="warning">Medium</Badge>;
//       case 'low': return <Badge bg="info">Low</Badge>;
//       default: return <Badge bg="secondary">{priority}</Badge>;
//     }
//   };

//   // 🔹 Filtering
//   const filteredTickets = tickets.filter(
//     (ticket) =>
//       String(ticket.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredParentTickets = parentTickets.filter(
//     (ticket) =>
//       String(ticket.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
//       {/* 🔹 Title instead of Navbar */}
//       <div className="text-center mb-4">
//         <h2 style={{ fontWeight: 'bold', color: '#2D5D7B' }}>🎟️ Support System</h2>
//       </div>

//       {alert.show && (
//         <Alert variant={alert.variant} className="mb-3" onClose={() => setAlert({ show: false, message: '', variant: '' })} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Tab Navigation */}
//       <Card className="mb-3">
//         <Card.Body className="p-2">
//           <div className="d-flex justify-content-center">
//             <Button 
//               variant={activeTab === 'support' ? 'primary' : 'outline-primary'} 
//               className="me-2"
//               onClick={() => setActiveTab('support')}
//             >
//               Support Tickets
//             </Button>
//             <Button 
//               variant={activeTab === 'parent' ? 'primary' : 'outline-primary'} 
//               onClick={() => setActiveTab('parent')}
//             >
//               Parent Inquiries
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Search */}
//       <Row>
//         <Col>
//           <Card className="mb-3">
//             <Card.Body>
//               <Form.Control
//                 type="text"
//                 placeholder="🔍 Search by ID, name, email or status"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </Card.Body>
//           </Card>

//           {/* 🔹 Rest of the code unchanged ... */}
//           {/* (Forms, Tables, Accordions, Modals remain the same) */}

//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Tickets;

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
 
const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [parentTickets, setParentTickets] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
 
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [activeTab, setActiveTab] = useState('support');
 
  useEffect(() => {
 
    // -----------------------------------------
    // EXISTING DJANGO CONTACT REQUESTS
    // -----------------------------------------
    fetch("http://localhost:8001/api/core/contact/list/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setContactRequests(data);
      })
      .catch(err => console.error("Error fetching contact requests:", err));
 
// -----------------------------------------
// NEW: FETCH PARENT CONTACT REQUESTS (FASTAPI)
// -----------------------------------------
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
        createdAt: item.created_at
      }));
 
      setParentTickets(mapped);
      localStorage.setItem("parentTickets", JSON.stringify(mapped));
    }
  })
  .catch((err) => console.error("Error fetching parent contact list:", err));
 
    // -----------------------------------------
    // LOCAL STORAGE (OLD LOGIC)
    // -----------------------------------------
    const dataLocal = localStorage.getItem('tickets');
    const parentDataLocal = localStorage.getItem('parentTickets');
 
    if (dataLocal) setTickets(JSON.parse(dataLocal));
    if (parentDataLocal) setParentTickets(JSON.parse(parentDataLocal));
 
  }, []);
 
  const saveTickets = (data) => {
    setTickets(data);
    localStorage.setItem('tickets', JSON.stringify(data));
  };
 
  const saveParentTickets = (data) => {
    setParentTickets(data);
    localStorage.setItem('parentTickets', JSON.stringify(data));
  };
 
  const getSlaBadge = (slaDeadline) => {
    if (!slaDeadline) return <Badge bg="secondary">-</Badge>;
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diffHours = (deadline - now) / (1000 * 60 * 60);
 
    if (diffHours < 0) return <Badge bg="danger">❌ Breached</Badge>;
    if (diffHours < 12) return <Badge bg="warning">⏳ Urgent</Badge>;
    if (diffHours < 24) return <Badge bg="info">⚠️ Due Soon</Badge>;
    return <Badge bg="success">✅ On Track</Badge>;
  };
 
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    switch(status.toLowerCase()) {
      case 'open': return <Badge bg="primary">Open</Badge>;
      case 'in progress': return <Badge bg="warning">In Progress</Badge>;
      case 'resolved': return <Badge bg="success">Resolved</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      case 'pending': return <Badge bg="secondary">Pending</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };
 
  const filteredTickets = tickets.filter((ticket) =>
    String(ticket.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const filteredParentTickets = parentTickets.filter((ticket) =>
    String(ticket.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
 
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: 'bold', color: '#2D5D7B' }}>🎟️ Support System</h2>
      </div>
 
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3" onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
 
      <Card className="mb-3">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-center">
            <Button
              variant={activeTab === 'support' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveTab('support')}
            >
              Student Tickets
            </Button>
 
            <Button
              variant={activeTab === 'parent' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('parent')}
            >
              Parent Inquiries
            </Button>
          </div>
        </Card.Body>
      </Card>
 
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="🔍 Search by ID, name, email or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Body>
          </Card>
 
          {activeTab === 'support' && (
            <Card>
              <Card.Header>
                <strong>Student Tickets</strong>
              </Card.Header>
 
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>SLA / Created</th>
                    </tr>
                  </thead>
 
                  <tbody>
 
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.user}</td>
                        <td>{ticket.email}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{ticket.type}</td>
                        <td>{getSlaBadge(ticket.slaDeadline)}</td>
                      </tr>
                    ))}
 
                    {contactRequests.map((req) => (
                      <tr key={`contact-${req.id}`} style={{ background: '#f0f7ff' }}>
                        <td>{req.id}</td>
                        <td>{req.full_name}</td>
                        <td>{req.email}</td>
                        <td><Badge bg="info">New Request</Badge></td>
                        <td>{req.help_topic}</td>
                        <td>{new Date(req.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
 
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
 
          {activeTab === 'parent' && (
            <Card>
              <Card.Header><strong>Parent Inquiries</strong></Card.Header>
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
                    {filteredParentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.parentName}</td>
                        <td>{ticket.studentName}</td>
                        <td>{ticket.email}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
 
        </Col>
      </Row>
    </div>
  );
};
 
export default Tickets;