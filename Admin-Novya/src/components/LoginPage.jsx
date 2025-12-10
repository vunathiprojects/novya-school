

// import React, { useState, useEffect } from 'react';
// import {
//   Form, Button, Card, Container, InputGroup, Modal, Toast, ToastContainer,
// } from 'react-bootstrap';
// import { FaUser, FaLock, FaSignInAlt, FaEnvelope, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useNavigate, Link } from 'react-router-dom';
// import '../App.css';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');
//   const [showPasswordResetFields, setShowPasswordResetFields] = useState(false);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [resetLinkSent, setResetLinkSent] = useState(false);

//   const [toast, setToast] = useState({ show: false, message: '', variant: '' });
//   const [failedAttempts, setFailedAttempts] = useState(0);
//   const [accountLocked, setAccountLocked] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     document.title = "Login | Prime Mind - Your Smart Learning Platform";
//   }, []);

//   // LOGIN NOW USES SIGNUP DATA
//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (accountLocked) {
//       setToast({ show: true, message: "❌ Account locked!", variant: "danger" });
//       return;
//     }

//     const savedUser = JSON.parse(localStorage.getItem("admin_signup_data"));

//     if (!savedUser) {
//       setToast({ show: true, message: "❌ No account found. Please signup.", variant: "danger" });
//       return;
//     }

//     if (email === savedUser.email && password === savedUser.password) {
//       // SUCCESS
//       const lastLogin = new Date().toLocaleString();
//       localStorage.setItem('isAuthenticated', true);
//       localStorage.setItem('lastLogin', lastLogin);
//       localStorage.setItem('profileName', savedUser.fullName);
//       localStorage.setItem('profileEmail', savedUser.email);

//       setToast({ show: true, message: "✅ Login Successful!", variant: "success" });

//       setTimeout(() => navigate('/dashboard'), 1500);
//     } else {
//       // FAILURE
//       setFailedAttempts(prev => {
//         const newCount = prev + 1;
//         if (newCount >= 3) {
//           setAccountLocked(true);
//           setToast({ show: true, message: "❌ Too many failed attempts. Account locked!", variant: "danger" });
//         } else {
//           setToast({ show: true, message: "❌ Invalid credentials", variant: "danger" });
//         }
//         return newCount;
//       });
//     }
//   };

//   // RESET PASSWORD 
//   const validatePassword = (password) => {
//     const minLength = /.{8,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//     if (!minLength.test(password)) return "Password must be at least 8 characters long.";
//     if (!uppercase.test(password)) return "Password must contain at least one uppercase letter.";
//     if (!lowercase.test(password)) return "Password must contain at least one lowercase letter.";
//     if (!number.test(password)) return "Password must contain at least one number.";
//     if (!specialChar.test(password)) return "Password must contain at least one special character.";

//     return null;
//   };

//   const sendResetLink = () => {
//     const savedUser = JSON.parse(localStorage.getItem("admin_signup_data"));

//     if (savedUser && resetEmail === savedUser.email) {
//       setResetLinkSent(true);
//       setToast({ show: true, message: "✅ Reset link sent!", variant: "success" });

//       setTimeout(() => {
//         setShowPasswordResetFields(true);
//         setResetLinkSent(false);
//       }, 1500);
//     } else {
//       setToast({ show: true, message: "❌ Email not registered", variant: "danger" });
//     }
//   };

//   const resetPassword = () => {
//     const error = validatePassword(newPassword);
//     if (error) {
//       setToast({ show: true, message: `❌ ${error}`, variant: "danger" });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setToast({ show: true, message: "❌ Passwords do not match", variant: "danger" });
//       return;
//     }

//     // UPDATE LOCALSTORAGE
//     const savedUser = JSON.parse(localStorage.getItem("admin_signup_data"));
//     savedUser.password = newPassword;
//     localStorage.setItem("admin_signup_data", JSON.stringify(savedUser));

//     setToast({ show: true, message: "✅ Password reset successfully!", variant: "success" });
//     setShowResetModal(false);
//   };

//   return (
//     <div className="login-bg d-flex justify-content-center align-items-center"
//       style={{ minHeight: '100vh', backgroundColor: '#e3f2fd' }}>
//       <Container className="px-3">
//         <Card className="login-card shadow mx-auto" style={{ maxWidth: '400px', borderRadius: '1rem' }}>

//           <div className="text-center mb-3 mt-3">
//             <img src="/NOVYA LOGO (1).png" alt="NOVYA Logo" style={{ width: '80px', borderRadius: '25px' }} />
//             <h4 className="mt-2"
//               style={{
//                 background: 'linear-gradient(90deg,#6D0DAD,#C316A4,#F02D6D,#FF5E52,#FF8547)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 fontWeight: 'bold'
//               }}>
//               Admin Login
//             </h4>
//           </div>

//           <Card.Body>
//             <Form onSubmit={handleLogin}>
              
//               {/* EMAIL */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text><FaUser /></InputGroup.Text>
//                   <Form.Control type="email" value={email}
//                     onChange={(e) => setEmail(e.target.value)} required />
//                 </InputGroup>
//               </Form.Group>

//               {/* PASSWORD */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text><FaLock /></InputGroup.Text>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>

//               <Button type="submit" variant="primary" className="w-100">
//                 Login <FaSignInAlt className="ms-2" />
//               </Button>

//               {/* LINKS */}
//               <div className="d-flex justify-content-between mt-3">
//                 <Button variant="link" size="sm" onClick={() => setShowResetModal(true)}>
//                   Forgot Password?
//                 </Button>

//                 <Link to="/signup" className="btn btn-link" style={{ fontSize: "14px" }}>
//                   Create Account
//                 </Link>
//               </div>

//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>

//       {/* TOAST */}
//       <ToastContainer position="top-center" className="p-3">
//         <Toast bg={toast.variant} show={toast.show} delay={3000} autohide
//           onClose={() => setToast({ ...toast, show: false })}>
//           <Toast.Body className="text-white">{toast.message}</Toast.Body>
//         </Toast>
//       </ToastContainer>

//       {/* RESET PASSWORD MODAL */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {!showPasswordResetFields ? (
//             <>
//               <Form.Group>
//                 <Form.Label>Email</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text><FaEnvelope /></InputGroup.Text>
//                   <Form.Control type="email" value={resetEmail}
//                     onChange={(e) => setResetEmail(e.target.value)} />
//                 </InputGroup>
//               </Form.Group>

//               <Button className="mt-3 w-100" variant="primary" onClick={sendResetLink}>
//                 Send Reset Link
//               </Button>
//             </>
//           ) : (
//             <>
//               <p className="text-muted">Enter new password:</p>

//               <Form.Group className="mb-3">
//                 <Form.Label>New Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text><FaKey /></InputGroup.Text>
//                   <Form.Control type="password" value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)} />
//                 </InputGroup>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Confirm Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text><FaKey /></InputGroup.Text>
//                   <Form.Control type="password" value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)} />
//                 </InputGroup>
//               </Form.Group>

//               <Button className="w-100" variant="success" onClick={resetPassword}>
//                 Reset Password
//               </Button>
//             </>
//           )}
//         </Modal.Body>
//       </Modal>

//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from 'react';
import {
  Form, Button, Card, Container, InputGroup, Modal, Toast, ToastContainer,
} from 'react-bootstrap';
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaKey
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from "../api";
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', variant: '' });

  // Forgot Password States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPasswordResetFields, setShowPasswordResetFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await loginAdmin(email, password);

    if (res.error || res.status === "error") {
      setToast({ show: true, message: res.error || res.message, variant: "danger" });
    } else {
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("profileEmail", email);

      setToast({ show: true, message: "✅ Login Successful!", variant: "success" });
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  // PASSWORD VALIDATION
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) return "Password must be at least 8 characters long.";
    if (!uppercase.test(password)) return "Password must contain an uppercase letter.";
    if (!lowercase.test(password)) return "Password must contain a lowercase letter.";
    if (!number.test(password)) return "Password must contain a number.";
    if (!specialChar.test(password)) return "Password must contain a special character.";

    return null;
  };

  // SEND RESET LINK
  const sendResetLink = () => {
    // Only works for LOCAL storage version
    const savedUser = JSON.parse(localStorage.getItem("admin_signup_data"));

    if (savedUser && resetEmail === savedUser.email) {
      setResetLinkSent(true);
      setToast({ show: true, message: "✅ Reset link sent!", variant: "success" });

      setTimeout(() => {
        setShowPasswordResetFields(true);
        setResetLinkSent(false);
      }, 1500);
    } else {
      setToast({ show: true, message: "❌ Email not registered", variant: "danger" });
    }
  };

  // RESET PASSWORD
  const resetPassword = () => {
    const err = validatePassword(newPassword);
    if (err) {
      setToast({ show: true, message: `❌ ${err}`, variant: "danger" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ show: true, message: "❌ Passwords do not match", variant: "danger" });
      return;
    }

    const user = JSON.parse(localStorage.getItem("admin_signup_data"));
    user.password = newPassword;
    localStorage.setItem("admin_signup_data", JSON.stringify(user));

    setToast({ show: true, message: "✅ Password reset successful!", variant: "success" });
    setShowResetModal(false);
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#e3f2fd' }}>
      <Container className="px-3">

        <Card className="login-card animated-card shadow mx-auto"
          style={{ maxWidth: '400px', width: '100%', borderRadius: '1rem' }}>

          <div className="text-center mb-4 mt-3">
            <img src="/NOVYA LOGO (1).png" alt="NOVYA Logo"
              style={{ width: '80px', height: '80px', borderRadius: '30px' }} />
            <h4 className="mt-2" style={{
              background: 'linear-gradient(90deg, #6D0DAD, #C316A4, #F02D6D, #FF5E52, #FF8547)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              Admin Login
            </h4>
          </div>

          <Card.Body>
            <Form onSubmit={handleLogin}>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Login <FaSignInAlt className="ms-2" />
              </Button>

              {/* FORGOT PASSWORD + SIGNUP LINK */}
              <div className="d-flex justify-content-between mt-3">
                <Button variant="link" size="sm" onClick={() => setShowResetModal(true)}>
                  Forgot Password?
                </Button>

                <Link to="/signup" className="btn btn-link" style={{ fontSize: "14px" }}>
                  Create Account
                </Link>
              </div>

            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* TOAST */}
      <ToastContainer position="top-center" className="p-3">
        <Toast bg={toast.variant} show={toast.show} delay={3000} autohide
          onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* RESET PASSWORD MODAL */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
        <Modal.Body>

          {!showPasswordResetFields ? (
            <>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control type="email" value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <Button className="mt-3 w-100" variant="primary" onClick={sendResetLink}>
                Send Reset Link
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted">Enter new password:</p>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaKey /></InputGroup.Text>
                  <Form.Control type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaKey /></InputGroup.Text>
                  <Form.Control type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <Button className="w-100" variant="success" onClick={resetPassword}>
                Reset Password
              </Button>
            </>
          )}

        </Modal.Body>
      </Modal>

    </div>
  );
};

export default LoginPage;
