
// // import React, { useState, useEffect } from "react";
// // import {
// //   Card,
// //   Table,
// //   Button,
// //   Form,
// //   Modal,
// //   Badge,
// //   Row,
// //   Col,
// //   Dropdown,
// // } from "react-bootstrap";
// // import * as XLSX from "xlsx";
// // import jsPDF from "jspdf";
// // import "jspdf-autotable";

// // const Registrations = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [fadeIn, setFadeIn] = useState(false);
// //   const [users, setUsers] = useState([]);
// //   const [upcomingUsers, setUpcomingUsers] = useState([]);
// //   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       setIsMobile(window.innerWidth < 768);
// //     };

// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   useEffect(() => {
// //     setTimeout(() => setFadeIn(true), 100);

// //     // Sample users (only Student & Parent)
// //     const sampleUsers = [
// //       {
// //         regId: "R001",
// //         firstName: "John",
// //         lastName: "Doe",
// //         phone: "9876543210",
// //         email: "john@example.com",
// //         username: "johndoe",
// //         password: "••••••",
// //         role: "Student",
// //         status: "Pending",
// //         locked: false,
// //         createdAt: new Date().toISOString(),
// //       },
// //       {
// //         regId: "R002",
// //         firstName: "Alice",
// //         lastName: "Smith",
// //         phone: "8765432109",
// //         email: "alice@example.com",
// //         username: "alice123",
// //         password: "••••••",
// //         role: "Parent",
// //         status: "Approved",
// //         locked: false,
// //         createdAt: new Date(
// //           new Date().setDate(new Date().getDate() - 20)
// //         ).toISOString(),
// //       },
// //       {
// //         regId: "R003",
// //         firstName: "Michael",
// //         lastName: "Johnson",
// //         phone: "7654321098",
// //         email: "michael@example.com",
// //         username: "michaelj",
// //         password: "••••••",
// //         role: "Student",
// //         status: "Pending",
// //         locked: false,
// //         createdAt: new Date(
// //           new Date().setDate(new Date().getDate() - 5)
// //         ).toISOString(),
// //       },
// //     ];

// //     // Sample upcoming registrations
// //     const sampleUpcomingUsers = [
// //       {
// //         regId: "UP001",
// //         firstName: "Sarah",
// //         lastName: "Williams",
// //         phone: "6543210987",
// //         email: "sarah@example.com",
// //         username: "sarahw",
// //         password: "••••••",
// //         role: "Student",
// //         status: "Upcoming",
// //         locked: false,
// //         registrationDate: new Date(
// //           new Date().setDate(new Date().getDate() + 3)
// //         ).toISOString(),
// //       },
// //       {
// //         regId: "UP002",
// //         firstName: "David",
// //         lastName: "Brown",
// //         phone: "5432109876",
// //         email: "david@example.com",
// //         username: "davidb",
// //         password: "••••••",
// //         role: "Parent",
// //         status: "Upcoming",
// //         locked: false,
// //         registrationDate: new Date(
// //           new Date().setDate(new Date().getDate() + 7)
// //         ).toISOString(),
// //       },
// //       {
// //         regId: "UP003",
// //         firstName: "Emma",
// //         lastName: "Davis",
// //         phone: "4321098765",
// //         email: "emma@example.com",
// //         username: "emmad",
// //         password: "••••••",
// //         role: "Student",
// //         status: "Upcoming",
// //         locked: false,
// //         registrationDate: new Date(
// //           new Date().setDate(new Date().getDate() + 1)
// //         ).toISOString(),
// //       },
// //     ];

// //     setUsers(sampleUsers);
// //     setUpcomingUsers(sampleUpcomingUsers);
// //   }, []);

// //   const filteredUsers = users.filter((user) =>
// //     Object.values(user).some((val) =>
// //       val.toString().toLowerCase().includes(searchTerm.toLowerCase())
// //     )
// //   );

// //   const filteredUpcomingUsers = upcomingUsers.filter((user) =>
// //     Object.values(user).some((val) =>
// //       val.toString().toLowerCase().includes(searchTerm.toLowerCase())
// //     )
// //   );

// //   // New registrations (last 30 days)
// //   const newRegistrations = filteredUsers.filter((u) => {
// //     const regDate = new Date(u.createdAt);
// //     const diffDays = (new Date() - regDate) / (1000 * 60 * 60 * 24);
// //     return diffDays <= 30;
// //   });

// //   const handleView = (user) => {
// //     setSelectedUser(user);
// //     setShowModal(true);
// //   };

// //   const handleStatusChange = (regId, newStatus) => {
// //     setUsers((prev) =>
// //       prev.map((u) => (u.regId === regId ? { ...u, status: newStatus } : u))
// //     );
// //   };

// //   const handleRoleChange = (regId, newRole) => {
// //     setUsers((prev) =>
// //       prev.map((u) => (u.regId === regId ? { ...u, role: newRole } : u))
// //     );
// //   };

// //   const handleToggleLock = (regId) => {
// //     setUsers((prev) =>
// //       prev.map((u) =>
// //         u.regId === regId ? { ...u, locked: !u.locked } : u
// //       )
// //     );
// //   };

// //   // Export Functions
// //   const exportToExcel = (data, fileName) => {
// //     const ws = XLSX.utils.json_to_sheet(data);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Users");
// //     XLSX.writeFile(wb, fileName);
// //   };

// //   const exportToPDF = (data, fileName, title) => {
// //     const doc = new jsPDF();
// //     doc.text(title, 14, 10);
// //     doc.autoTable({
// //       head: [["Reg ID", "Name", "Email", "Username", "Role", "Status", "Locked"]],
// //       body: data.map((u) => [
// //         u.regId,
// //         `${u.firstName} ${u.lastName}`,
// //         u.email,
// //         u.username,
// //         u.role,
// //         u.status,
// //         u.locked ? "Locked" : "Active",
// //       ]),
// //     });
// //     doc.save(fileName);
// //   };

// //   // Mobile-friendly user card
// //   const UserCard = ({ user, isUpcoming = false }) => (
// //     <Card className="mb-3 shadow-sm">
// //       <Card.Body>
// //         <div className="d-flex justify-content-between align-items-start mb-2">
// //           <div>
// //             <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
// //             <small className="text-muted">ID: {user.regId}</small>
// //           </div>
// //           <Badge
// //             bg={
// //               user.status === "Approved"
// //                 ? "success"
// //                 : user.status === "Rejected"
// //                 ? "danger"
// //                 : user.status === "Upcoming"
// //                 ? "info"
// //                 : "warning"
// //             }
// //           >
// //             {user.status}
// //           </Badge>
// //         </div>
        
// //         <div className="mb-2">
// //           <small><strong>Email:</strong> {user.email}</small>
// //         </div>
// //         <div className="mb-2">
// //           <small><strong>Username:</strong> {user.username}</small>
// //         </div>
// //         <div className="mb-2">
// //           <small><strong>Role:</strong> {user.role}</small>
// //         </div>
        
// //         {isUpcoming ? (
// //           <div className="mb-2">
// //             <small><strong>Registration Date:</strong> {new Date(user.registrationDate).toLocaleDateString()}</small>
// //           </div>
// //         ) : (
// //           <div className="mb-2">
// //             <small><strong>Status:</strong> {user.locked ? "Locked" : "Active"}</small>
// //           </div>
// //         )}
        
// //         <div className="d-flex flex-wrap gap-1 mt-2">
// //           <Button
// //             variant="outline-primary"
// //             size="sm"
// //             onClick={() => handleView(user)}
// //           >
// //             View
// //           </Button>
          
// //           {!isUpcoming && (
// //             <>
// //               <Button
// //                 variant="success"
// //                 size="sm"
// //                 onClick={() => handleStatusChange(user.regId, "Approved")}
// //               >
// //                 Approve
// //               </Button>
// //               <Button
// //                 variant="danger"
// //                 size="sm"
// //                 onClick={() => handleStatusChange(user.regId, "Rejected")}
// //               >
// //                 Reject
// //               </Button>
// //               <Button
// //                 variant={user.locked ? "warning" : "dark"}
// //                 size="sm"
// //                 onClick={() => handleToggleLock(user.regId)}
// //               >
// //                 {user.locked ? "Unlock" : "Lock"}
// //               </Button>
              
// //               <Form.Select
// //                 size="sm"
// //                 value={user.role}
// //                 onChange={(e) => handleRoleChange(user.regId, e.target.value)}
// //                 className="mt-1"
// //               >
// //                 <option>Student</option>
// //                 <option>Parent</option>
// //               </Form.Select>
// //             </>
// //           )}
          
// //           {isUpcoming && (
// //             <Button variant="outline-secondary" size="sm" disabled>
// //               No Actions
// //             </Button>
// //           )}
// //         </div>
// //       </Card.Body>
// //     </Card>
// //   );

// //   // Reusable table renderer for regular users
// //   const renderUserTable = (title, data, fileNamePrefix) => (
// //     <Card
// //       className="m-3 shadow-sm"
// //       style={{
// //         opacity: fadeIn ? 1 : 0,
// //         transition: "opacity 0.5s ease-in",
// //       }}
// //     >
// //       <Card.Body>
// //         <h4 className="text-center mb-3">{title}</h4>

// //         {/* Search & Export */}
// //         <div className="d-flex flex-column flex-md-row justify-content-between mb-3 gap-2">
// //           <Form.Control
// //             type="text"
// //             placeholder="Search by name, email, or role..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             style={{
// //               fontSize: "1rem",
// //               padding: "0.75rem",
// //             }}
// //           />
// //           <div className="d-flex gap-2">
// //             <Dropdown>
// //               <Dropdown.Toggle variant="outline-success" id="dropdown-excel" size="sm">
// //                 Export Excel
// //               </Dropdown.Toggle>
// //               <Dropdown.Menu>
// //                 <Dropdown.Item onClick={() => exportToExcel(data, `${fileNamePrefix}.xlsx`)}>
// //                   {title}
// //                 </Dropdown.Item>
// //               </Dropdown.Menu>
// //             </Dropdown>
// //             <Dropdown>
// //               <Dropdown.Toggle variant="outline-danger" id="dropdown-pdf" size="sm">
// //                 Export PDF
// //               </Dropdown.Toggle>
// //               <Dropdown.Menu>
// //                 <Dropdown.Item onClick={() => exportToPDF(data, `${fileNamePrefix}.pdf`, title)}>
// //                   {title}
// //                 </Dropdown.Item>
// //               </Dropdown.Menu>
// //             </Dropdown>
// //           </div>
// //         </div>

// //         {isMobile ? (
// //           <div>
// //             {data.length > 0 ? (
// //               data.map((user) => (
// //                 <UserCard key={user.regId} user={user} />
// //               ))
// //             ) : (
// //               <div className="text-center py-4" style={{ color: "#888" }}>
// //                 No users found.
// //               </div>
// //             )}
// //           </div>
// //         ) : (
// //           <Table striped bordered hover responsive>
// //             <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
// //               <tr style={{ textAlign: "center" }}>
// //                 <th>Reg ID</th>
// //                 <th>Name</th>
// //                 <th>Email</th>
// //                 <th>Username</th>
// //                 <th>Role</th>
// //                 <th>Status</th>
// //                 <th>Locked</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {data.length > 0 ? (
// //                 data.map((user) => (
// //                   <tr key={user.regId} style={{ textAlign: "center" }}>
// //                     <td>{user.regId}</td>
// //                     <td>
// //                       {user.firstName} {user.lastName}
// //                     </td>
// //                     <td>{user.email}</td>
// //                     <td>{user.username}</td>
// //                     <td>
// //                       <Form.Select
// //                         size="sm"
// //                         value={user.role}
// //                         onChange={(e) =>
// //                           handleRoleChange(user.regId, e.target.value)
// //                         }
// //                       >
// //                         <option>Student</option>
// //                         <option>Parent</option>
// //                       </Form.Select>
// //                     </td>
// //                     <td>
// //                       <Badge
// //                         bg={
// //                           user.status === "Approved"
// //                             ? "success"
// //                             : user.status === "Rejected"
// //                             ? "danger"
// //                             : user.status === "Upcoming"
// //                             ? "info"
// //                             : "warning"
// //                         }
// //                       >
// //                         {user.status}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <Badge bg={user.locked ? "dark" : "secondary"}>
// //                         {user.locked ? "Locked" : "Active"}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       <div className="d-flex flex-wrap gap-1 justify-content-center">
// //                         <Button
// //                           variant="outline-primary"
// //                           size="sm"
// //                           onClick={() => handleView(user)}
// //                         >
// //                           View
// //                         </Button>
// //                         <Button
// //                           variant="success"
// //                           size="sm"
// //                           onClick={() =>
// //                             handleStatusChange(user.regId, "Approved")
// //                           }
// //                         >
// //                           Approve
// //                         </Button>
// //                         <Button
// //                           variant="danger"
// //                           size="sm"
// //                           onClick={() =>
// //                             handleStatusChange(user.regId, "Rejected")
// //                           }
// //                         >
// //                           Reject
// //                         </Button>
// //                         <Button
// //                           variant={user.locked ? "warning" : "dark"}
// //                           size="sm"
// //                           onClick={() => handleToggleLock(user.regId)}
// //                         >
// //                           {user.locked ? "Unlock" : "Lock"}
// //                         </Button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
// //                     No users found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </Table>
// //         )}
// //       </Card.Body>
// //     </Card>
// //   );

// //   // Special table renderer for upcoming registrations (read-only)
// //   const renderUpcomingTable = (title, data, fileNamePrefix) => (
// //     <Card
// //       className="m-3 shadow-sm"
// //       style={{
// //         opacity: fadeIn ? 1 : 0,
// //         transition: "opacity 0.5s ease-in",
// //       }}
// //     >
// //       <Card.Body>
// //         <h4 className="text-center mb-3">{title}</h4>

// //         {/* Search & Export */}
// //         <div className="d-flex flex-column flex-md-row justify-content-between mb-3 gap-2">
// //           <Form.Control
// //             type="text"
// //             placeholder="Search by name, email, or role..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             style={{
// //               fontSize: "1rem",
// //               padding: "0.75rem",
// //             }}
// //           />
// //           <div className="d-flex gap-2">
// //             <Dropdown>
// //               <Dropdown.Toggle variant="outline-success" id="dropdown-excel" size="sm">
// //                 Export Excel
// //               </Dropdown.Toggle>
// //               <Dropdown.Menu>
// //                 <Dropdown.Item onClick={() => exportToExcel(data, `${fileNamePrefix}.xlsx`)}>
// //                   {title}
// //                 </Dropdown.Item>
// //               </Dropdown.Menu>
// //             </Dropdown>
// //             <Dropdown>
// //               <Dropdown.Toggle variant="outline-danger" id="dropdown-pdf" size="sm">
// //                 Export PDF
// //               </Dropdown.Toggle>
// //               <Dropdown.Menu>
// //                 <Dropdown.Item onClick={() => exportToPDF(data, `${fileNamePrefix}.pdf`, title)}>
// //                   {title}
// //                 </Dropdown.Item>
// //               </Dropdown.Menu>
// //             </Dropdown>
// //           </div>
// //         </div>

// //         {isMobile ? (
// //           <div>
// //             {data.length > 0 ? (
// //               data.map((user) => (
// //                 <UserCard key={user.regId} user={user} isUpcoming={true} />
// //               ))
// //             ) : (
// //               <div className="text-center py-4" style={{ color: "#888" }}>
// //                 No upcoming registrations found.
// //               </div>
// //             )}
// //           </div>
// //         ) : (
// //           <Table striped bordered hover responsive>
// //             <thead style={{ backgroundColor: "#17a2b8", color: "#fff" }}>
// //               <tr style={{ textAlign: "center" }}>
// //                 <th>Reg ID</th>
// //                 <th>Name</th>
// //                 <th>Email</th>
// //                 <th>Username</th>
// //                 <th>Role</th>
// //                 <th>Status</th>
// //                 <th>Registration Date</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {data.length > 0 ? (
// //                 data.map((user) => (
// //                   <tr key={user.regId} style={{ textAlign: "center" }}>
// //                     <td>{user.regId}</td>
// //                     <td>
// //                       {user.firstName} {user.lastName}
// //                     </td>
// //                     <td>{user.email}</td>
// //                     <td>{user.username}</td>
// //                     <td>{user.role}</td>
// //                     <td>
// //                       <Badge bg="info">
// //                         {user.status}
// //                       </Badge>
// //                     </td>
// //                     <td>
// //                       {new Date(user.registrationDate).toLocaleDateString()}
// //                     </td>
// //                     <td>
// //                       <div className="d-flex justify-content-center gap-1">
// //                         <Button
// //                           variant="outline-primary"
// //                           size="sm"
// //                           onClick={() => handleView(user)}
// //                         >
// //                           View
// //                         </Button>
// //                         <Button
// //                           variant="outline-secondary"
// //                           size="sm"
// //                           disabled
// //                         >
// //                           No Actions
// //                         </Button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
// //                     No upcoming registrations found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </Table>
// //         )}
// //       </Card.Body>
// //     </Card>
// //   );

// //   return (
// //     <>
// //       {/* 🔹 Top Stat Cards with Hover Effect */}
// //       <Row className="m-3">
// //         <Col md={4} className="mb-3">
// //           <Card
// //             className="shadow-sm text-center p-3"
// //             style={{
// //               transition: "transform 0.3s, box-shadow 0.3s",
// //               cursor: "pointer",
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = "scale(1.05)";
// //               e.currentTarget.style.boxShadow =
// //                 "0px 4px 20px rgba(0,0,0,0.2)";
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = "scale(1)";
// //               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
// //             }}
// //           >
// //             <h5>🆕 New Registrations</h5>
// //             <h3>{newRegistrations.length}</h3>
// //           </Card>
// //         </Col>
// //         <Col md={4} className="mb-3">
// //           <Card
// //             className="shadow-sm text-center p-3"
// //             style={{
// //               transition: "transform 0.3s, box-shadow 0.3s",
// //               cursor: "pointer",
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = "scale(1.05)";
// //               e.currentTarget.style.boxShadow =
// //                 "0px 4px 20px rgba(0,0,0,0.2)";
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = "scale(1)";
// //               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
// //             }}
// //           >
// //             <h5>👥 Total Users</h5>
// //             <h3>{users.length}</h3>
// //           </Card>
// //         </Col>
// //         <Col md={4} className="mb-3">
// //           <Card
// //             className="shadow-sm text-center p-3"
// //             style={{
// //               transition: "transform 0.3s, box-shadow 0.3s",
// //               cursor: "pointer",
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = "scale(1.05)";
// //               e.currentTarget.style.boxShadow =
// //                 "0px 4px 20px rgba(0,0,0,0.2)";
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = "scale(1)";
// //               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
// //             }}
// //           >
// //             <h5>📅 Upcoming Registrations</h5>
// //             <h3>{upcomingUsers.length}</h3>
// //           </Card>
// //         </Col>
// //       </Row>

// //       {/* Upcoming Registrations Table */}
// //       {renderUpcomingTable(
// //         "📅 Upcoming Registrations",
// //         filteredUpcomingUsers,
// //         "upcoming_registrations"
// //       )}

// //       {/* New Registrations Table */}
// //       {renderUserTable(
// //         "🆕 New Registrations (Last 30 days)",
// //         newRegistrations,
// //         "new_registrations"
// //       )}

// //       {/* Total Users Table */}
// //       {renderUserTable("👥 Total Users", filteredUsers, "total_users")}

// //       {/* Modal for user details */}
// //       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
// //         <Modal.Header closeButton>
// //           <Modal.Title>User Details</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           {selectedUser && (
// //             <>
// //               <p><strong>Registration ID:</strong> {selectedUser.regId}</p>
// //               <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
// //               <p><strong>Email:</strong> {selectedUser.email}</p>
// //               <p><strong>Username:</strong> {selectedUser.username}</p>
// //               <p><strong>Phone:</strong> {selectedUser.phone}</p>
// //               <p><strong>Role:</strong> {selectedUser.role}</p>
// //               <p><strong>Status:</strong> {selectedUser.status}</p>
// //               <p><strong>Account:</strong> {selectedUser.locked ? "Locked" : "Active"}</p>
// //               {selectedUser.registrationDate && (
// //                 <p><strong>Registration Date:</strong> {new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
// //               )}
// //               {selectedUser.createdAt && (
// //                 <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
// //               )}
// //             </>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setShowModal(false)}>
// //             Close
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default Registrations;

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Table,
//   Button,
//   Form,
//   Modal,
//   Badge,
//   Row,
//   Col,
//   Dropdown,
// } from "react-bootstrap";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const Registrations = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [fadeIn, setFadeIn] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [upcomingUsers, setUpcomingUsers] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     setTimeout(() => setFadeIn(true), 100);

//     // Sample users (Student only - no parents)
//     const sampleUsers = [
//       {
//         regId: "R001",
//         firstName: "John",
//         lastName: "Doe",
//         phone: "9876543210",
//         email: "john@example.com",
//         username: "johndoe",
//         password: "••••••",
//         status: "Pending",
//         locked: false,
//         createdAt: new Date().toISOString(),
//       },
//       {
//         regId: "R002",
//         firstName: "Alice",
//         lastName: "Smith",
//         phone: "8765432109",
//         email: "alice@example.com",
//         username: "alice123",
//         password: "••••••",
//         status: "Approved",
//         locked: false,
//         createdAt: new Date(
//           new Date().setDate(new Date().getDate() - 20)
//         ).toISOString(),
//       },
//       {
//         regId: "R003",
//         firstName: "Michael",
//         lastName: "Johnson",
//         phone: "7654321098",
//         email: "michael@example.com",
//         username: "michaelj",
//         password: "••••••",
//         status: "Pending",
//         locked: false,
//         createdAt: new Date(
//           new Date().setDate(new Date().getDate() - 5)
//         ).toISOString(),
//       },
//     ];

//     // Sample upcoming registrations
//     const sampleUpcomingUsers = [
//       {
//         regId: "UP001",
//         firstName: "Sarah",
//         lastName: "Williams",
//         phone: "6543210987",
//         email: "sarah@example.com",
//         username: "sarahw",
//         password: "••••••",
//         status: "Upcoming",
//         locked: false,
//         registrationDate: new Date(
//           new Date().setDate(new Date().getDate() + 3)
//         ).toISOString(),
//       },
//       {
//         regId: "UP002",
//         firstName: "David",
//         lastName: "Brown",
//         phone: "5432109876",
//         email: "david@example.com",
//         username: "davidb",
//         password: "••••••",
//         status: "Upcoming",
//         locked: false,
//         registrationDate: new Date(
//           new Date().setDate(new Date().getDate() + 7)
//         ).toISOString(),
//       },
//       {
//         regId: "UP003",
//         firstName: "Emma",
//         lastName: "Davis",
//         phone: "4321098765",
//         email: "emma@example.com",
//         username: "emmad",
//         password: "••••••",
//         status: "Upcoming",
//         locked: false,
//         registrationDate: new Date(
//           new Date().setDate(new Date().getDate() + 1)
//         ).toISOString(),
//       },
//     ];

//     setUsers(sampleUsers);
//     setUpcomingUsers(sampleUpcomingUsers);
//   }, []);

//   const filteredUsers = users.filter((user) =>
//     Object.values(user).some((val) =>
//       val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const filteredUpcomingUsers = upcomingUsers.filter((user) =>
//     Object.values(user).some((val) =>
//       val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // New registrations (last 30 days)
//   const newRegistrations = filteredUsers.filter((u) => {
//     const regDate = new Date(u.createdAt);
//     const diffDays = (new Date() - regDate) / (1000 * 60 * 60 * 24);
//     return diffDays <= 30;
//   });

//   const handleView = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const handleStatusChange = (regId, newStatus) => {
//     setUsers((prev) =>
//       prev.map((u) => (u.regId === regId ? { ...u, status: newStatus } : u))
//     );
//   };

//   const handleToggleLock = (regId) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.regId === regId ? { ...u, locked: !u.locked } : u
//       )
//     );
//   };

//   // Export Functions
//   const exportToExcel = (data, fileName) => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Users");
//     XLSX.writeFile(wb, fileName);
//   };

//   const exportToPDF = (data, fileName, title) => {
//     const doc = new jsPDF();
//     doc.text(title, 14, 10);
//     doc.autoTable({
//       head: [["Reg ID", "Name", "Email", "Username", "Status", "Locked"]],
//       body: data.map((u) => [
//         u.regId,
//         `${u.firstName} ${u.lastName}`,
//         u.email,
//         u.username,
//         u.status,
//         u.locked ? "Locked" : "Active",
//       ]),
//     });
//     doc.save(fileName);
//   };

//   // Mobile-friendly user card
//   const UserCard = ({ user, isUpcoming = false }) => (
//     <Card className="mb-3 shadow-sm">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <div>
//             <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
//             <small className="text-muted">ID: {user.regId}</small>
//           </div>
//           <Badge
//             bg={
//               user.status === "Approved"
//                 ? "success"
//                 : user.status === "Rejected"
//                 ? "danger"
//                 : user.status === "Upcoming"
//                 ? "info"
//                 : "warning"
//             }
//           >
//             {user.status}
//           </Badge>
//         </div>
        
//         <div className="mb-2">
//           <small><strong>Email:</strong> {user.email}</small>
//         </div>
//         <div className="mb-2">
//           <small><strong>Username:</strong> {user.username}</small>
//         </div>
        
//         {isUpcoming ? (
//           <div className="mb-2">
//             <small><strong>Registration Date:</strong> {new Date(user.registrationDate).toLocaleDateString()}</small>
//           </div>
//         ) : (
//           <div className="mb-2">
//             <small><strong>Account Status:</strong> {user.locked ? "Locked" : "Active"}</small>
//           </div>
//         )}
        
//         <div className="d-flex flex-wrap gap-1 mt-2">
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={() => handleView(user)}
//           >
//             View
//           </Button>
          
//           {!isUpcoming && (
//             <>
//               <Button
//                 variant="success"
//                 size="sm"
//                 onClick={() => handleStatusChange(user.regId, "Approved")}
//               >
//                 Approve
//               </Button>
//               <Button
//                 variant="danger"
//                 size="sm"
//                 onClick={() => handleStatusChange(user.regId, "Rejected")}
//               >
//                 Reject
//               </Button>
//               <Button
//                 variant={user.locked ? "warning" : "dark"}
//                 size="sm"
//                 onClick={() => handleToggleLock(user.regId)}
//               >
//                 {user.locked ? "Unlock" : "Lock"}
//               </Button>
//             </>
//           )}
          
//           {isUpcoming && (
//             <Button variant="outline-secondary" size="sm" disabled>
//               No Actions
//             </Button>
//           )}
//         </div>
//       </Card.Body>
//     </Card>
//   );

//   // Reusable table renderer for regular users
//   const renderUserTable = (title, data, fileNamePrefix) => (
//     <Card
//       className="m-3 shadow-sm"
//       style={{
//         opacity: fadeIn ? 1 : 0,
//         transition: "opacity 0.5s ease-in",
//       }}
//     >
//       <Card.Body>
//         <h4 className="text-center mb-3">{title}</h4>

//         {/* Search & Export */}
//         <div className="d-flex flex-column flex-md-row justify-content-between mb-3 gap-2">
//           <Form.Control
//             type="text"
//             placeholder="Search by name, email, or username..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               fontSize: "1rem",
//               padding: "0.75rem",
//             }}
//           />
//           <div className="d-flex gap-2">
//             <Dropdown>
//               <Dropdown.Toggle variant="outline-success" id="dropdown-excel" size="sm">
//                 Export Excel
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => exportToExcel(data, `${fileNamePrefix}.xlsx`)}>
//                   {title}
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//             <Dropdown>
//               <Dropdown.Toggle variant="outline-danger" id="dropdown-pdf" size="sm">
//                 Export PDF
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => exportToPDF(data, `${fileNamePrefix}.pdf`, title)}>
//                   {title}
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         </div>

//         {isMobile ? (
//           <div>
//             {data.length > 0 ? (
//               data.map((user) => (
//                 <UserCard key={user.regId} user={user} />
//               ))
//             ) : (
//               <div className="text-center py-4" style={{ color: "#888" }}>
//                 No users found.
//               </div>
//             )}
//           </div>
//         ) : (
//           <Table striped bordered hover responsive>
//             <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
//               <tr style={{ textAlign: "center" }}>
//                 <th>Reg ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Username</th>
//                 <th>Status</th>
//                 <th>Locked</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length > 0 ? (
//                 data.map((user) => (
//                   <tr key={user.regId} style={{ textAlign: "center" }}>
//                     <td>{user.regId}</td>
//                     <td>
//                       {user.firstName} {user.lastName}
//                     </td>
//                     <td>{user.email}</td>
//                     <td>{user.username}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           user.status === "Approved"
//                             ? "success"
//                             : user.status === "Rejected"
//                             ? "danger"
//                             : user.status === "Upcoming"
//                             ? "info"
//                             : "warning"
//                         }
//                       >
//                         {user.status}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Badge bg={user.locked ? "dark" : "secondary"}>
//                         {user.locked ? "Locked" : "Active"}
//                       </Badge>
//                     </td>
//                     <td>
//                       <div className="d-flex flex-wrap gap-1 justify-content-center">
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => handleView(user)}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           variant="success"
//                           size="sm"
//                           onClick={() =>
//                             handleStatusChange(user.regId, "Approved")
//                           }
//                         >
//                           Approve
//                         </Button>
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() =>
//                             handleStatusChange(user.regId, "Rejected")
//                           }
//                         >
//                           Reject
//                         </Button>
//                         <Button
//                           variant={user.locked ? "warning" : "dark"}
//                           size="sm"
//                           onClick={() => handleToggleLock(user.regId)}
//                         >
//                           {user.locked ? "Unlock" : "Lock"}
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         )}
//       </Card.Body>
//     </Card>
//   );

//   // Special table renderer for upcoming registrations (read-only)
//   const renderUpcomingTable = (title, data, fileNamePrefix) => (
//     <Card
//       className="m-3 shadow-sm"
//       style={{
//         opacity: fadeIn ? 1 : 0,
//         transition: "opacity 0.5s ease-in",
//       }}
//     >
//       <Card.Body>
//         <h4 className="text-center mb-3">{title}</h4>

//         {/* Search & Export */}
//         <div className="d-flex flex-column flex-md-row justify-content-between mb-3 gap-2">
//           <Form.Control
//             type="text"
//             placeholder="Search by name, email, or username..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               fontSize: "1rem",
//               padding: "0.75rem",
//             }}
//           />
//           <div className="d-flex gap-2">
//             <Dropdown>
//               <Dropdown.Toggle variant="outline-success" id="dropdown-excel" size="sm">
//                 Export Excel
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => exportToExcel(data, `${fileNamePrefix}.xlsx`)}>
//                   {title}
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//             <Dropdown>
//               <Dropdown.Toggle variant="outline-danger" id="dropdown-pdf" size="sm">
//                 Export PDF
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => exportToPDF(data, `${fileNamePrefix}.pdf`, title)}>
//                   {title}
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         </div>

//         {isMobile ? (
//           <div>
//             {data.length > 0 ? (
//               data.map((user) => (
//                 <UserCard key={user.regId} user={user} isUpcoming={true} />
//               ))
//             ) : (
//               <div className="text-center py-4" style={{ color: "#888" }}>
//                 No upcoming registrations found.
//               </div>
//             )}
//           </div>
//         ) : (
//           <Table striped bordered hover responsive>
//             <thead style={{ backgroundColor: "#17a2b8", color: "#fff" }}>
//               <tr style={{ textAlign: "center" }}>
//                 <th>Reg ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Username</th>
//                 <th>Status</th>
//                 <th>Registration Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length > 0 ? (
//                 data.map((user) => (
//                   <tr key={user.regId} style={{ textAlign: "center" }}>
//                     <td>{user.regId}</td>
//                     <td>
//                       {user.firstName} {user.lastName}
//                     </td>
//                     <td>{user.email}</td>
//                     <td>{user.username}</td>
//                     <td>
//                       <Badge bg="info">
//                         {user.status}
//                       </Badge>
//                     </td>
//                     <td>
//                       {new Date(user.registrationDate).toLocaleDateString()}
//                     </td>
//                     <td>
//                       <div className="d-flex justify-content-center gap-1">
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => handleView(user)}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           variant="outline-secondary"
//                           size="sm"
//                           disabled
//                         >
//                           No Actions
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
//                     No upcoming registrations found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         )}
//       </Card.Body>
//     </Card>
//   );

//   return (
//     <>
//       {/* 🔹 Top Stat Cards with Hover Effect */}
//       <Row className="m-3">
//         <Col md={4} className="mb-3">
//           <Card
//             className="shadow-sm text-center p-3"
//             style={{
//               transition: "transform 0.3s, box-shadow 0.3s",
//               cursor: "pointer",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.05)";
//               e.currentTarget.style.boxShadow =
//                 "0px 4px 20px rgba(0,0,0,0.2)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
//             }}
//           >
//             <h5>🆕 New Registrations</h5>
//             <h3>{newRegistrations.length}</h3>
//           </Card>
//         </Col>
//         <Col md={4} className="mb-3">
//           <Card
//             className="shadow-sm text-center p-3"
//             style={{
//               transition: "transform 0.3s, box-shadow 0.3s",
//               cursor: "pointer",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.05)";
//               e.currentTarget.style.boxShadow =
//                 "0px 4px 20px rgba(0,0,0,0.2)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
//             }}
//           >
//             <h5>👥 Total Students</h5>
//             <h3>{users.length}</h3>
//           </Card>
//         </Col>
//         <Col md={4} className="mb-3">
//           <Card
//             className="shadow-sm text-center p-3"
//             style={{
//               transition: "transform 0.3s, box-shadow 0.3s",
//               cursor: "pointer",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.05)";
//               e.currentTarget.style.boxShadow =
//                 "0px 4px 20px rgba(0,0,0,0.2)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.1)";
//             }}
//           >
//             <h5>📅 Upcoming Registrations</h5>
//             <h3>{upcomingUsers.length}</h3>
//           </Card>
//         </Col>
//       </Row>

//       {/* Upcoming Registrations Table */}
//       {renderUpcomingTable(
//         "📅 Upcoming Registrations",
//         filteredUpcomingUsers,
//         "upcoming_registrations"
//       )}

//       {/* New Registrations Table */}
//       {renderUserTable(
//         "🆕 New Registrations (Last 30 days)",
//         newRegistrations,
//         "new_registrations"
//       )}

//       {/* Total Users Table */}
//       {renderUserTable("👥 Total Students", filteredUsers, "total_students")}

//       {/* Modal for user details */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Student Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedUser && (
//             <>
//               <p><strong>Registration ID:</strong> {selectedUser.regId}</p>
//               <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
//               <p><strong>Email:</strong> {selectedUser.email}</p>
//               <p><strong>Username:</strong> {selectedUser.username}</p>
//               <p><strong>Phone:</strong> {selectedUser.phone}</p>
//               <p><strong>Status:</strong> {selectedUser.status}</p>
//               <p><strong>Account:</strong> {selectedUser.locked ? "Locked" : "Active"}</p>
//               {selectedUser.registrationDate && (
//                 <p><strong>Registration Date:</strong> {new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
//               )}
//               {selectedUser.createdAt && (
//                 <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Registrations;