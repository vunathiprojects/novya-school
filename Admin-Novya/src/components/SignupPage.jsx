// import React, { useState } from "react";
// import {
//   Form,
//   Button,
//   Card,
//   Container,
//   InputGroup,
//   Toast,
//   ToastContainer,
// } from "react-bootstrap";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaKey,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import "../App.css";

// const SignupPage = () => {
//   const navigate = useNavigate();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [toast, setToast] = useState({ show: false, message: "", variant: "" });

//   // Password validation
//   const validatePassword = (password) => {
//     const minLength = /.{8,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

//     if (!minLength.test(password))
//       return "Password must be at least 8 characters long.";
//     if (!uppercase.test(password))
//       return "Password must contain at least one uppercase letter.";
//     if (!lowercase.test(password))
//       return "Password must contain at least one lowercase letter.";
//     if (!number.test(password))
//       return "Password must contain at least one number.";
//     if (!specialChar.test(password))
//       return "Password must contain at least one special character.";

//     return null;
//   };

//   // Signup handler
//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setToast({
//         show: true,
//         message: "❌ Passwords do not match!",
//         variant: "danger",
//       });
//       return;
//     }

//     const passwordError = validatePassword(password);
//     if (passwordError) {
//       setToast({
//         show: true,
//         message: `❌ ${passwordError}`,
//         variant: "danger",
//       });
//       return;
//     }

//     // Save to localStorage for now (later we connect backend)
//     const userData = { fullName, email, password };
//     localStorage.setItem("admin_signup_data", JSON.stringify(userData));

//     setToast({
//       show: true,
//       message: "✅ Account created successfully!",
//       variant: "success",
//     });

//     setTimeout(() => navigate("/"), 1500);
//   };

//   return (
//     <div
//       className="login-bg d-flex justify-content-center align-items-center"
//       style={{ minHeight: "100vh", backgroundColor: "#e3f2fd" }}
//     >
//       <Container className="px-3">
//         <Card
//           className="login-card animated-card shadow mx-auto"
//           style={{ maxWidth: "400px", width: "100%", borderRadius: "1rem" }}
//         >
//           <div className="text-center mb-4 mt-3">
//             <img
//               src="/NOVYA LOGO (1).png"
//               alt="NOVYA Logo"
//               style={{ width: "80px", height: "80px", borderRadius: "30px" }}
//             />
//             <h4
//               className="mt-2"
//               style={{
//                 background:
//                   "linear-gradient(90deg, #6D0DAD, #C316A4, #F02D6D, #FF5E52, #FF8547)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 fontWeight: "bold",
//               }}
//             >
//               Create Admin Account
//             </h4>
//           </div>

//           <Card.Body>
//             <Form onSubmit={handleSignup}>
//               {/* FULL NAME */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Full Name</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text>
//                     <FaUser />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter full name"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     required
//                   />
//                 </InputGroup>
//               </Form.Group>

//               {/* EMAIL */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text>
//                     <FaEnvelope />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </InputGroup>
//               </Form.Group>

//               {/* PASSWORD */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text>
//                     <FaLock />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <InputGroup.Text
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>

//               {/* CONFIRM PASSWORD */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Confirm Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text>
//                     <FaKey />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Re-enter password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </InputGroup>
//               </Form.Group>

//               <Button type="submit" variant="primary" className="w-100">
//                 Create Account
//               </Button>

//               <div className="text-center mt-3">
//                 <Link to="/" className="btn btn-link">
//                   ← Back to Login
//                 </Link>
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Container>

//       {/* TOAST MESSAGE */}
//       <ToastContainer position="top-center" className="p-3">
//         <Toast
//           bg={toast.variant}
//           show={toast.show}
//           delay={3000}
//           autohide
//           onClose={() => setToast({ ...toast, show: false })}
//         >
//           <Toast.Body className="text-white">{toast.message}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </div>
//   );
// };

// export default SignupPage;
import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signupAdmin } from "../api";
import "../App.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) return "Password must be at least 8 characters long.";
    if (!uppercase.test(password)) return "Password must contain at least one uppercase letter.";
    if (!lowercase.test(password)) return "Password must contain at least one lowercase letter.";
    if (!number.test(password)) return "Password must contain at least one number.";
    if (!specialChar.test(password)) return "Password must contain at least one special character.";

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ show: true, message: "❌ Passwords do not match!", variant: "danger" });
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setToast({ show: true, message: `❌ ${pwdError}`, variant: "danger" });
      return;
    }

    const res = await signupAdmin(fullName, email, password);

    if (res.error || res.status === "error") {
      setToast({ show: true, message: res.error || res.message, variant: "danger" });
    } else {
      setToast({ show: true, message: "✅ Account created successfully!", variant: "success" });
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#e3f2fd" }}>
      <Container className="px-3">
        <Card className="login-card animated-card shadow mx-auto"
          style={{ maxWidth: "400px", width: "100%", borderRadius: "1rem" }}>

          <div className="text-center mb-4 mt-3">
            <img src="/NOVYA LOGO (1).png" alt="NOVYA Logo"
              style={{ width: "80px", height: "80px", borderRadius: "30px" }} />
            <h4 className="mt-2"
              style={{
                background: "linear-gradient(90deg, #6D0DAD, #C316A4, #F02D6D, #FF5E52, #FF8547)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold"
              }}>
              Create Admin Account
            </h4>
          </div>

          <Card.Body>
            <Form onSubmit={handleSignup}>
              
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control type="text" value={fullName}
                    onChange={(e) => setFullName(e.target.value)} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control type={showPassword ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required />
                  <InputGroup.Text style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaKey /></InputGroup.Text>
                  <Form.Control type={showPassword ? "text" : "password"}
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    required />
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Create Account
              </Button>

              <div className="text-center mt-3">
                <Link to="/" className="btn btn-link">← Back to Login</Link>
              </div>

            </Form>
          </Card.Body>
        </Card>
      </Container>

      <ToastContainer position="top-center" className="p-3">
        <Toast bg={toast.variant} show={toast.show} delay={3000} autohide
          onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SignupPage;
