
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Table,
//   Badge,
//   Button,
//   Form,
//   Alert,
//   Row,
//   Col,
// } from 'react-bootstrap';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { v4 as uuidv4 } from 'uuid';
 
// const Tickets = () => {
//   const [tickets, setTickets] = useState([]);
//   const [parentTickets, setParentTickets] = useState([]);
//   const [contactRequests, setContactRequests] = useState([]);
 
//   const [searchTerm, setSearchTerm] = useState('');
//   const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
//   const [activeTab, setActiveTab] = useState('support');
 
//   useEffect(() => {
 
//     // -----------------------------------------
//     // EXISTING DJANGO CONTACT REQUESTS
//     // -----------------------------------------
//     fetch("http://localhost:8001/api/core/contact/list/")
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) setContactRequests(data);
//       })
//       .catch(err => console.error("Error fetching contact requests:", err));
 
// // -----------------------------------------
// // NEW: FETCH PARENT CONTACT REQUESTS (FASTAPI)
// // -----------------------------------------
// fetch("http://localhost:8000/api/core/parent/contact/list/")
//   .then((res) => res.json())
//   .then((data) => {
//     if (Array.isArray(data)) {
 
//       const mapped = data.map((item) => ({
//         id: item.id,
//         parentName: item.parent_name,
//         studentName: item.student_name,
//         studentId: item.student_id,
//         email: item.email,
//         phone: item.phone_number,
//         message: item.message,
//         status: "pending",
//         createdAt: item.created_at
//       }));
 
//       setParentTickets(mapped);
//       localStorage.setItem("parentTickets", JSON.stringify(mapped));
//     }
//   })
//   .catch((err) => console.error("Error fetching parent contact list:", err));
 
//     // -----------------------------------------
//     // LOCAL STORAGE (OLD LOGIC)
//     // -----------------------------------------
//     const dataLocal = localStorage.getItem('tickets');
//     const parentDataLocal = localStorage.getItem('parentTickets');
 
//     if (dataLocal) setTickets(JSON.parse(dataLocal));
//     if (parentDataLocal) setParentTickets(JSON.parse(parentDataLocal));
 
//   }, []);
 
//   const saveTickets = (data) => {
//     setTickets(data);
//     localStorage.setItem('tickets', JSON.stringify(data));
//   };
 
//   const saveParentTickets = (data) => {
//     setParentTickets(data);
//     localStorage.setItem('parentTickets', JSON.stringify(data));
//   };
 
//   const getSlaBadge = (slaDeadline) => {
//     if (!slaDeadline) return <Badge bg="secondary">-</Badge>;
//     const now = new Date();
//     const deadline = new Date(slaDeadline);
//     const diffHours = (deadline - now) / (1000 * 60 * 60);
 
//     if (diffHours < 0) return <Badge bg="danger">❌ Breached</Badge>;
//     if (diffHours < 12) return <Badge bg="warning">⏳ Urgent</Badge>;
//     if (diffHours < 24) return <Badge bg="info">⚠️ Due Soon</Badge>;
//     return <Badge bg="success">✅ On Track</Badge>;
//   };
 
//   const getStatusBadge = (status) => {
//     if (!status) return <Badge bg="secondary">Unknown</Badge>;
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
 
//   const filteredTickets = tickets.filter((ticket) =>
//     String(ticket.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );
 
//   const filteredParentTickets = parentTickets.filter((ticket) =>
//     String(ticket.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );
 
//   return (
//     <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
 
//       <div className="text-center mb-4">
//         <h2 style={{ fontWeight: 'bold', color: '#2D5D7B' }}>🎟️ Support System</h2>
//       </div>
 
//       {alert.show && (
//         <Alert variant={alert.variant} className="mb-3" onClose={() => setAlert({ show: false })} dismissible>
//           {alert.message}
//         </Alert>
//       )}
 
//       <Card className="mb-3">
//         <Card.Body className="p-2">
//           <div className="d-flex justify-content-center">
//             <Button
//               variant={activeTab === 'support' ? 'primary' : 'outline-primary'}
//               className="me-2"
//               onClick={() => setActiveTab('support')}
//             >
//               Student Tickets
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
 
//           {activeTab === 'support' && (
//             <Card>
//               <Card.Header>
//                 <strong>Student Tickets</strong>
//               </Card.Header>
 
//               <Card.Body>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>User</th>
//                       <th>Email</th>
//                       <th>Status</th>
//                       <th>Type</th>
//                       <th>SLA / Created</th>
//                     </tr>
//                   </thead>
 
//                   <tbody>
 
//                     {filteredTickets.map((ticket) => (
//                       <tr key={ticket.id}>
//                         <td>{ticket.id}</td>
//                         <td>{ticket.user}</td>
//                         <td>{ticket.email}</td>
//                         <td>{getStatusBadge(ticket.status)}</td>
//                         <td>{ticket.type}</td>
//                         <td>{getSlaBadge(ticket.slaDeadline)}</td>
//                       </tr>
//                     ))}
 
//                     {contactRequests.map((req) => (
//                       <tr key={`contact-${req.id}`} style={{ background: '#f0f7ff' }}>
//                         <td>{req.id}</td>
//                         <td>{req.full_name}</td>
//                         <td>{req.email}</td>
//                         <td><Badge bg="info">New Request</Badge></td>
//                         <td>{req.help_topic}</td>
//                         <td>{new Date(req.created_at).toLocaleString()}</td>
//                       </tr>
//                     ))}
 
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           )}
 
//           {activeTab === 'parent' && (
//             <Card>
//               <Card.Header><strong>Parent Inquiries</strong></Card.Header>
//               <Card.Body>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Parent Name</th>
//                       <th>Student</th>
//                       <th>Email</th>
//                       <th>Status</th>
//                       <th>Created</th>
//                     </tr>
//                   </thead>
 
//                   <tbody>
//                     {filteredParentTickets.map((ticket) => (
//                       <tr key={ticket.id}>
//                         <td>{ticket.id}</td>
//                         <td>{ticket.parentName}</td>
//                         <td>{ticket.studentName}</td>
//                         <td>{ticket.email}</td>
//                         <td>{getStatusBadge(ticket.status)}</td>
//                         <td>{new Date(ticket.createdAt).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           )}
 
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
import { getTicketsData } from "../../../api";
import { Spinner } from 'react-bootstrap';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTicketsData();
        
        if (result.error) {
          setError(result.error);
          setTickets([]);
          setContactRequests([]);
        } else {
          setTickets(result.tickets || []);
          setContactRequests(result.contactRequests || []);
        }
      } catch (err) {
        console.error("Error loading tickets data:", err);
        setError("Failed to load tickets data");
        setTickets([]);
        setContactRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveTickets = (data) => {
    setTickets(data);
    // Note: Saving to localStorage is kept for backward compatibility but data comes from backend
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading tickets data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <Alert variant="warning">
          <Alert.Heading>Unable to load data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

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
                  {filteredTickets.length === 0 && contactRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    <>
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
                    </>
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

export default Tickets;