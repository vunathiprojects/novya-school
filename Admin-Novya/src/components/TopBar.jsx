

// import React, { useState, useEffect } from 'react';
// import {
//   Navbar,
//   Container,
//   Button,
//   Dropdown,
//   Modal,
//   Form,
//   Offcanvas,
//   Spinner,
//   Badge,
//   InputGroup
// } from 'react-bootstrap';

// import {
//   FaBell,
//   FaEnvelope,
//   FaUser,
//   FaBars,
//   FaTimes,
//   FaSignOutAlt,
//   FaEdit
// } from 'react-icons/fa';

// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const API_BASE = "http://127.0.0.1:8000/api";

// const TopBar = ({ showSidebar, toggleSidebar }) => {
//   const navigate = useNavigate();

//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // Profile fields
//   const [fullName, setFullName] = useState('');
//   const [profileEmail, setProfileEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [schoolName, setSchoolName] = useState('');
//   const [schoolAddress, setSchoolAddress] = useState('');

//   // Errors
//   const [errors, setErrors] = useState({});

//   // Notifications
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loadingNotifications, setLoadingNotifications] = useState(true);

//   const userEmail = localStorage.getItem("profileEmail"); // 📌 Using email for backend

//   // ====================================
//   // LOAD PROFILE FROM BACKEND
//   // ====================================
//   const loadProfile = async () => {
//     if (!userEmail) return;

//     try {
//       const res = await axios.get(`${API_BASE}/profile/${userEmail}/`);
//       const p = res.data;

//       setFullName(p.full_name || "");
//       setPhone(p.phone || "");
//       setSchoolName(p.school_name || "");
//       setSchoolAddress(p.school_address || "");
//       setProfileEmail(userEmail);

//     } catch (error) {
//       console.error("Profile load error:", error);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   // ====================================
//   // VALIDATE
//   // ====================================
//   const validateProfile = () => {
//     let err = {};

//     if (!fullName.trim()) err.fullName = "Full name is required";
//     if (!profileEmail.trim()) err.profileEmail = "Email is required";
//     else if (!profileEmail.includes("@")) err.profileEmail = "Invalid email";

//     if (!phone.trim()) err.phone = "Phone number is required";
//     else if (phone.length !== 10) err.phone = "Must be 10 digits";

//     if (!schoolName.trim()) err.schoolName = "School name required";
//     if (!schoolAddress.trim()) err.schoolAddress = "School address required";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // ====================================
//   // UPDATE PROFILE
//   // ====================================
//   const handleProfileSave = async () => {
//     if (!validateProfile()) return;

//     try {
//       const res = await axios.post(`${API_BASE}/profile/update/${profileEmail}/`, {
//         full_name: fullName,
//         phone,
//         school_name: schoolName,
//         school_address: schoolAddress
//       });

//       if (res.data.message) {
//         // Save in local storage
//         localStorage.setItem("fullName", fullName);
//         localStorage.setItem("phone", phone);
//         localStorage.setItem("schoolName", schoolName);
//         localStorage.setItem("schoolAddress", schoolAddress);

//         setShowProfileModal(false); // CLOSE MODAL
//       }

//     } catch (error) {
//       console.error("Profile update error:", error);
//     }
//   };

//   // ====================================
//   // Notifications (Dummy Loader)
//   // ====================================
//   const fetchNotifications = () => {
//     setLoadingNotifications(false);
//     setNotifications([]); // blank for now
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const handleEmailClick = () => {
//     window.open("https://mail.google.com", "_blank");
//   };

//   return (
//     <>
//       <Navbar bg="light" variant="light" className="top-nav fixed-top px-2" expand="lg" style={{ zIndex: 1030 }}>
//         <Container fluid className="d-flex justify-content-between align-items-center">

//           {/* LEFT SIDE */}
//           <div className="d-flex align-items-center">
//             <Button variant="link" className="me-2 p-0" onClick={toggleSidebar}>
//               {showSidebar ? <FaTimes className="fs-4" /> : <FaBars className="fs-4" />}
//             </Button>

//             <Navbar.Brand className="fw-bold d-flex align-items-center">
//               <img
//                 src="/NOVYA LOGO (1).png"
//                 alt="NOVYA Logo"
//                 style={{ width: "60px", height: "60px", marginRight: "10px", borderRadius: "5px" }}
//               />
//               <span
//                 className="d-none d-sm-inline fw-bold"
//                 style={{
//                   fontSize: "1.8rem",
//                   background: "linear-gradient(90deg,#6D0DAD,#C316A4,#F02D6D,#FF5E52,#FF8547)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 NOVYA
//               </span>
//             </Navbar.Brand>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="d-flex align-items-center gap-3">
            
//             {/* NOTIFICATION BELL */}
//             <Button variant="link" className="position-relative p-0" onClick={() => setShowNotifications(true)}>
//               <FaBell className="fs-5" />
//               {notifications.length > 0 && (
//                 <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
//                   {notifications.length}
//                 </Badge>
//               )}
//             </Button>

//             {/* EMAIL ICON */}
//             <Button variant="link" className="p-0" onClick={handleEmailClick}>
//               <FaEnvelope className="fs-5" />
//             </Button>

//             {/* USER DROPDOWN */}
//             <Dropdown align="end">
//               <Dropdown.Toggle variant="link" className="p-0">
//                 <FaUser className="fs-5" />
//               </Dropdown.Toggle>

//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => setShowProfileModal(true)}>
//                   <FaEdit className="me-2" /> View / Edit Profile
//                 </Dropdown.Item>

//                 <Dropdown.Divider />

//                 <Dropdown.Item onClick={handleLogout}>
//                   <FaSignOutAlt className="me-2" /> Logout
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>

//         </Container>
//       </Navbar>

//       {/* PROFILE MODAL */}
//       <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Profile</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form>

//             {/* FULL NAME */}
//             <Form.Group className="mb-3">
//               <Form.Label>Full Name *</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 isInvalid={!!errors.fullName}
//               />
//             </Form.Group>

//             {/* EMAIL */}
//             <Form.Group className="mb-3">
//               <Form.Label>Email *</Form.Label>
//               <Form.Control type="email" value={profileEmail} disabled />
//             </Form.Group>

//             {/* PHONE */}
//             <Form.Group className="mb-3">
//               <Form.Label>Phone Number *</Form.Label>
//               <InputGroup>
//                 <InputGroup.Text>+91</InputGroup.Text>
//                 <Form.Control
//                   type="number"
//                   value={phone}
//                   onChange={(e) => {
//                     if (e.target.value.length <= 10) setPhone(e.target.value);
//                   }}
//                   isInvalid={!!errors.phone}
//                 />
//               </InputGroup>
//             </Form.Group>

//             {/* SCHOOL NAME */}
//             <Form.Group className="mb-3">
//               <Form.Label>School Name *</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={schoolName}
//                 onChange={(e) => setSchoolName(e.target.value)}
//                 isInvalid={!!errors.schoolName}
//               />
//             </Form.Group>

//             {/* SCHOOL ADDRESS */}
//             <Form.Group>
//               <Form.Label>School Address *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 value={schoolAddress}
//                 onChange={(e) => setSchoolAddress(e.target.value)}
//                 isInvalid={!!errors.schoolAddress}
//               />
//             </Form.Group>

//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleProfileSave}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* NOTIFICATION DRAWER */}
//       <Offcanvas show={showNotifications} onHide={() => setShowNotifications(false)} placement="end">
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Notifications</Offcanvas.Title>
//         </Offcanvas.Header>

//         <Offcanvas.Body>
//           {loadingNotifications ? (
//             <div className="text-center">
//               <Spinner animation="border" />
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="text-muted">No new notifications</div>
//           ) : (
//             <ul className="list-unstyled">
//               {notifications.map((n, i) => (
//                 <li key={i}>• {n.message}</li>
//               ))}
//             </ul>
//           )}
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// };

// export default TopBar;
import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Container,
  Button,
  Dropdown,
  Modal,
  Form,
  Offcanvas,
  Spinner,
  Badge,
  InputGroup
} from 'react-bootstrap';

import {
  FaBell,
  FaEnvelope,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaEdit
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000/api";

const TopBar = ({ showSidebar, toggleSidebar }) => {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');

  // Errors
  const [errors, setErrors] = useState({});

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // NEW STATE FOR ROLE DROPDOWN
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem("userRole") || "Student");

  const userEmail = localStorage.getItem("profileEmail");

  // =============================
  // ROLE CHANGE HANDLER
  // =============================
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    localStorage.setItem("userRole", role);

    if (role === "Student") navigate("/dashboard");
    if (role === "Teacher") navigate("/teacher/dashboard");
    if (role === "Parent") navigate("/parent/dashboard");
  };

  // ====================================
  // LOAD PROFILE FROM BACKEND
  // ====================================
  const loadProfile = async () => {
    if (!userEmail) return;

    try {
      const res = await axios.get(`${API_BASE}/profile/${userEmail}/`);
      const p = res.data;

      setFullName(p.full_name || "");
      setPhone(p.phone || "");
      setSchoolName(p.school_name || "");
      setSchoolAddress(p.school_address || "");
      setProfileEmail(userEmail);

    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ====================================
  // VALIDATE
  // ====================================
  const validateProfile = () => {
    let err = {};

    if (!fullName.trim()) err.fullName = "Full name is required";
    if (!profileEmail.trim()) err.profileEmail = "Email is required";
    else if (!profileEmail.includes("@")) err.profileEmail = "Invalid email";

    if (!phone.trim()) err.phone = "Phone number is required";
    else if (phone.length !== 10) err.phone = "Must be 10 digits";

    if (!schoolName.trim()) err.schoolName = "School name required";
    if (!schoolAddress.trim()) err.schoolAddress = "School address required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ====================================
  // UPDATE PROFILE
  // ====================================
  const handleProfileSave = async () => {
    if (!validateProfile()) return;

    try {
      const res = await axios.post(`${API_BASE}/profile/update/${profileEmail}/`, {
        full_name: fullName,
        phone,
        school_name: schoolName,
        school_address: schoolAddress
      });

      if (res.data.message) {
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("phone", phone);
        localStorage.setItem("schoolName", schoolName);
        localStorage.setItem("schoolAddress", schoolAddress);

        setShowProfileModal(false);
      }

    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  // ====================================
  // Notifications
  // ====================================
  const fetchNotifications = () => {
    setLoadingNotifications(false);
    setNotifications([]);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEmailClick = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <>
      <Navbar bg="light" variant="light" className="top-nav fixed-top px-2" expand="lg" style={{ zIndex: 1030 }}>
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* LEFT SIDE */}
          <div className="d-flex align-items-center">
            <Button variant="link" className="me-2 p-0" onClick={toggleSidebar}>
              {showSidebar ? <FaTimes className="fs-4" /> : <FaBars className="fs-4" />}
            </Button>

            <Navbar.Brand className="fw-bold d-flex align-items-center">
              <img
                src="/NOVYA LOGO (1).png"
                alt="NOVYA Logo"
                style={{ width: "60px", height: "60px", marginRight: "10px", borderRadius: "5px" }}
              />
              <span
                className="d-none d-sm-inline fw-bold"
                style={{
                  fontSize: "1.8rem",
                  background: "linear-gradient(90deg,#6D0DAD,#C316A4,#F02D6D,#FF5E52,#FF8547)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NOVYA
              </span>
            </Navbar.Brand>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">

            {/* ⭐ ROLE DROPDOWN */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                {selectedRole}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleRoleChange("Student")}>
                  Student
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleRoleChange("Teacher")}>
                  Teacher
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleRoleChange("Parent")}>
                  Parent
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* NOTIFICATION BELL */}
            <Button variant="link" className="position-relative p-0" onClick={() => setShowNotifications(true)}>
              <FaBell className="fs-5" />
              {notifications.length > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </Badge>
              )}
            </Button>

            {/* EMAIL ICON */}
            <Button variant="link" className="p-0" onClick={handleEmailClick}>
              <FaEnvelope className="fs-5" />
            </Button>

            {/* USER DROPDOWN */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="p-0">
                <FaUser className="fs-5" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowProfileModal(true)}>
                  <FaEdit className="me-2" /> View / Edit Profile
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

        </Container>
      </Navbar>

      {/* PROFILE MODAL */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            {/* FULL NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isInvalid={!!errors.fullName}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" value={profileEmail} disabled />
            </Form.Group>

            {/* PHONE */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number *</Form.Label>
              <InputGroup>
                <InputGroup.Text>+91</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={phone}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) setPhone(e.target.value);
                  }}
                  isInvalid={!!errors.phone}
                />
              </InputGroup>
            </Form.Group>

            {/* SCHOOL NAME */}
            <Form.Group className="mb-3">
              <Form.Label>School Name *</Form.Label>
              <Form.Control
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                isInvalid={!!errors.schoolName}
              />
            </Form.Group>

            {/* SCHOOL ADDRESS */}
            <Form.Group>
              <Form.Label>School Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                isInvalid={!!errors.schoolAddress}
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProfileSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* NOTIFICATION DRAWER */}
      <Offcanvas show={showNotifications} onHide={() => setShowNotifications(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {loadingNotifications ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-muted">No new notifications</div>
          ) : (
            <ul className="list-unstyled">
              {notifications.map((n, i) => (
                <li key={i}>• {n.message}</li>
              ))}
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TopBar;
