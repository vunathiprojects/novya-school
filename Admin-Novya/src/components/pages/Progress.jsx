
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Table,
//   Badge,
//   Row,
//   Col,
//   Form,
//   InputGroup,
//   Button,
//   Modal,
//   Alert,
//   Collapse,
//   Navbar,
//   Nav,
// } from "react-bootstrap";
// import { Bar } from "react-chartjs-2";
// import {
//   FaSearch,
//   FaEdit,
//   FaTrash,
//   FaDownload,
//   FaMedal,
//   FaAward,
//   FaBars,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Tooltip,
// } from "chart.js";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

// const subjects = ["Math", "Science", "English", "History"];

// // 🔹 Utility: Generate random student data
// const generateStudent = (id, name) => {
//   const scores = {
//     Math: Math.floor(Math.random() * 41) + 60,
//     Science: Math.floor(Math.random() * 41) + 60,
//     English: Math.floor(Math.random() * 41) + 60,
//     History: Math.floor(Math.random() * 41) + 60,
//   };
//   const average = Math.round(
//     (scores.Math + scores.Science + scores.English + scores.History) / 4
//   );
//   const topSubject = Object.keys(scores).reduce((a, b) =>
//     scores[a] > scores[b] ? a : b
//   );
//   const improvement = Math.floor(Math.random() * 21);
//   const completion = Math.floor(Math.random() * 21) + 80;
//   const aiInsight =
//     average > 85
//       ? "High retention"
//       : average < 70
//       ? "Needs support"
//       : "Steady";

//   return {
//     id,
//     name,
//     scores,
//     average,
//     topSubject,
//     improvement,
//     completion,
//     aiInsight,
//   };
// };

// // 🔹 Static data (Class 7–12 with 6 students each)
// const staticData = Array.from({ length: 6 }, (_, classIndex) => {
//   const className = `Class ${classIndex + 7}`;
//   const students = Array.from({ length: 6 }, (_, sIdx) =>
//     generateStudent(
//       `S${classIndex + 7}${sIdx + 1}`,
//       `Student${classIndex + 7}${sIdx + 1}`
//     )
//   );
//   return { className, students };
// });

// const calcSubjectAvg = (students) => {
//   const avg = {};
//   subjects.forEach((sub) => {
//     avg[sub] = Math.round(
//       students.reduce((sum, s) => sum + s.scores[sub], 0) / students.length
//     );
//   });
//   return avg;
// };

// const Progress = () => {
//   const [classData, setClassData] = useState(staticData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editModal, setEditModal] = useState(false);
//   const [editStudent, setEditStudent] = useState(null);
//   const [editClassIdx, setEditClassIdx] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [expandedClasses, setExpandedClasses] = useState({});
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   // Handle window resize for responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 🔹 Filtering logic
//   const filtered = classData
//     .map((cls, idx) => {
//       const students = cls.students.filter(
//         (s) =>
//           s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           s.id.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       const matchClass = cls.className
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       return {
//         ...cls,
//         students: matchClass ? cls.students : students,
//         subjectAverages: calcSubjectAvg(
//           matchClass ? cls.students : students
//         ),
//       };
//     })
//     .filter((cls) => cls.students.length || !searchTerm);

//   // 🔹 Delete student
//   const handleDelete = (classIdx, studentId) => {
//     const updated = classData.map((cls, idx) => {
//       if (idx === classIdx) {
//         return {
//           ...cls,
//           students: cls.students.filter((s) => s.id !== studentId),
//         };
//       }
//       return cls;
//     });
//     setClassData(updated);
//   };

//   const handleSave = () => {
//     setEditModal(false);
//   };

//   // Toggle class expansion for mobile view
//   const toggleClassExpansion = (classIdx) => {
//     setExpandedClasses(prev => ({
//       ...prev,
//       [classIdx]: !prev[classIdx]
//     }));
//   };

//   // 🔹 Export to PDF
//   const exportToPDF = () => {
//     const input = document.getElementById("progress-report");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("progress_report.pdf");
//     });
//   };

//   // Student card view for mobile
//   const renderStudentCards = (students, classIdx) => {
//     return students.map((s) => (
//       <Card key={s.id} className="mb-3 student-card">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-start mb-2">
//             <div>
//               <h6 className="mb-0">{s.name}</h6>
//               <small className="text-muted">{s.id}</small>
//             </div>
//             <div>
//               <Button
//                 size="sm"
//                 variant="info"
//                 className="me-1"
//                 onClick={() => {
//                   setEditStudent(s);
//                   setEditClassIdx(classIdx);
//                   setEditModal(true);
//                 }}
//               >
//                 <FaEdit />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="danger"
//                 onClick={() => handleDelete(classIdx, s.id)}
//               >
//                 <FaTrash />
//               </Button>
//             </div>
//           </div>
          
//           <Row className="mb-2">
//             {subjects.map((sub) => (
//               <Col xs={6} key={sub} className="mb-1">
//                 <small>{sub}: <strong>{s.scores[sub]}%</strong></small>
//               </Col>
//             ))}
//           </Row>
          
//           <Row>
//             <Col xs={6}>
//               <small>Average: <strong>{s.average}%</strong></small>
//             </Col>
//             <Col xs={6}>
//               <small>Top Subject: {s.topSubject}</small>
//             </Col>
//             <Col xs={6}>
//               <small>
//                 Improvement: {s.improvement}%
//               </small>
//             </Col>
//             <Col xs={6}>
//               <small>Completion: {s.completion}%</small>
//             </Col>
//             <Col xs={6}>
//               <small>AI Insight: {s.aiInsight}</small>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>
//     ));
//   };

//   return (
//     <div className="p-2 p-md-3">
//       {/* Mobile Navigation */}
//       {isMobile && (
//         <Navbar bg="light" expand={false} className="mb-3">
//           <Navbar.Brand>Student Progress</Navbar.Brand>
//           <Button
//             variant="outline-secondary"
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//           >
//             <FaBars />
//           </Button>
//           <Collapse in={showMobileMenu}>
//             <Nav className="flex-column mt-2">
//               <InputGroup className="mb-2">
//                 <InputGroup.Text>
//                   <FaSearch />
//                 </InputGroup.Text>
//                 <Form.Control
//                   placeholder="Search students..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </InputGroup>
//               <Button variant="outline-danger" size="sm" onClick={exportToPDF}>
//                 <FaDownload /> Export PDF
//               </Button>
//             </Nav>
//           </Collapse>
//         </Navbar>
//       )}

//       <Alert variant="info" className="text-center mb-3">
//         📊 AI Insights & Student Progress Tracking (Admin Dashboard)
//       </Alert>

//       {/* 🔹 Search Bar - Desktop */}
//       {!isMobile && (
//         <Row className="justify-content-between align-items-center mb-4">
//           <Col md={6}>
//             <InputGroup>
//               <InputGroup.Text>
//                 <FaSearch />
//               </InputGroup.Text>
//               <Form.Control
//                 placeholder="Search by student ID, name, or class..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//           <Col md="auto">
//             <Button variant="outline-danger" onClick={exportToPDF}>
//               <FaDownload /> Export PDF
//             </Button>
//           </Col>
//         </Row>
//       )}

//       <div id="progress-report">
//         {filtered.map((cls, idx) => (
//           <div key={idx} className="mb-4">
//             <Card className="shadow">
//               <Card.Body>
//                 <div 
//                   className="d-flex justify-content-between align-items-center cursor-pointer"
//                   onClick={() => isMobile && toggleClassExpansion(idx)}
//                 >
//                   <h4 className="mb-0">
//                     {cls.className} - Group Insights
//                   </h4>
//                   {isMobile && (
//                     <Button variant="link" className="p-0">
//                       {expandedClasses[idx] ? <FaChevronUp /> : <FaChevronDown />}
//                     </Button>
//                   )}
//                 </div>
                
//                 <Collapse in={!isMobile || expandedClasses[idx]}>
//                   <div>
//                     <Row className="mt-3 mb-4">
//                       <Col>
//                         <div style={{ height: isMobile ? "200px" : "300px" }}>
//                           <Bar
//                             data={{
//                               labels: subjects,
//                               datasets: [
//                                 {
//                                   label: "Average Score",
//                                   data: subjects.map(
//                                     (sub) => cls.subjectAverages[sub]
//                                   ),
//                                   backgroundColor: [
//                                     "#007bff",
//                                     "#ffc107",
//                                     "#28a745",
//                                     "#dc3545",
//                                   ],
//                                 },
//                               ],
//                             }}
//                             options={{
//                               responsive: true,
//                               maintainAspectRatio: false,
//                               scales: { y: { beginAtZero: true, max: 100 } },
//                               plugins: {
//                                 legend: {
//                                   position: isMobile ? 'bottom' : 'top',
//                                 }
//                               }
//                             }}
//                           />
//                         </div>
//                       </Col>
//                     </Row>

//                     {/* 🔹 Student Table for Desktop, Cards for Mobile */}
//                     {!isMobile ? (
//                       <div className="table-responsive">
//                         <Table hover bordered>
//                           <thead>
//                             <tr>
//                               <th>ID</th>
//                               <th>Name</th>
//                               {subjects.map((s) => (
//                                 <th key={s}>{s}</th>
//                               ))}
//                               <th>Avg</th>
//                               <th>Top</th>
//                               <th>Improvement</th>
//                               <th>Completion</th>
//                               <th>AI Insight</th>
//                               <th>Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {cls.students.map((s) => (
//                               <tr key={s.id}>
//                                 <td>{s.id}</td>
//                                 <td>{s.name}</td>
//                                 {subjects.map((sub) => (
//                                   <td key={sub}>{s.scores[sub]}%</td>
//                                 ))}
//                                 <td>
//                                   <strong>{s.average}%</strong>
//                                 </td>
//                                 <td>{s.topSubject}</td>
//                                 <td>
//                                   {s.improvement}%
//                                 </td>
//                                 <td>{s.completion}%</td>
//                                 <td>{s.aiInsight}</td>
//                                 <td>
//                                   <Button
//                                     size="sm"
//                                     variant="info"
//                                     className="me-1"
//                                     onClick={() => {
//                                       setEditStudent(s);
//                                       setEditClassIdx(idx);
//                                       setEditModal(true);
//                                     }}
//                                   >
//                                     <FaEdit />
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="danger"
//                                     onClick={() => handleDelete(idx, s.id)}
//                                   >
//                                     <FaTrash />
//                                   </Button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </div>
//                     ) : (
//                       <div className="mt-3">
//                         {renderStudentCards(cls.students, idx)}
//                       </div>
//                     )}
//                   </div>
//                 </Collapse>
//               </Card.Body>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* 🔹 Edit Modal */}
//       <Modal show={editModal} centered onHide={() => setEditModal(false)} size={isMobile ? "sm" : "lg"}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Student</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editStudent && (
//             <Form>
//               <Form.Group className="mb-2">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control value={editStudent.name} disabled />
//               </Form.Group>
//               {subjects.map((sub) => (
//                 <Form.Group key={sub} className="mb-2">
//                   <Form.Label>{sub} Score</Form.Label>
//                   <Form.Control
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={editStudent.scores[sub]}
//                     disabled
//                   />
//                 </Form.Group>
//               ))}
//               <Form.Group className="mb-2">
//                 <Form.Label>AI Insight</Form.Label>
//                 <Form.Control value={editStudent.aiInsight} disabled />
//               </Form.Group>
//             </Form>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Progress;

// FULL UPDATED CODE WITH CLASS FILTER (NO OTHER LOGIC MODIFIED)

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Modal,
  Alert,
  Collapse,
  Navbar,
  Nav,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaDownload,
  FaBars,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const subjects = ["Math", "Science", "English", "History"];

const generateStudent = (id, name) => {
  const scores = {
    Math: Math.floor(Math.random() * 41) + 60,
    Science: Math.floor(Math.random() * 41) + 60,
    English: Math.floor(Math.random() * 41) + 60,
    History: Math.floor(Math.random() * 41) + 60,
  };

  const average = Math.round(
    (scores.Math + scores.Science + scores.English + scores.History) / 4
  );

  const topSubject = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const improvement = Math.floor(Math.random() * 21);
  const completion = Math.floor(Math.random() * 21) + 80;
  const aiInsight =
    average > 85 ? "High retention" : average < 70 ? "Needs support" : "Steady";

  return {
    id,
    name,
    scores,
    average,
    topSubject,
    improvement,
    completion,
    aiInsight,
  };
};

// Generate data for Class 7 to 12
const staticData = Array.from({ length: 6 }, (_, idx) => {
  const className = `Class ${idx + 7}`;
  const students = Array.from({ length: 6 }, (_, sIdx) =>
    generateStudent(`S${idx + 7}${sIdx + 1}`, `Student${idx + 7}${sIdx + 1}`)
  );
  return { className, students };
});

const calcSubjectAvg = (students) => {
  const avg = {};
  subjects.forEach((sub) => {
    avg[sub] = Math.round(
      students.reduce((sum, s) => sum + s.scores[sub], 0) / students.length
    );
  });
  return avg;
};

const Progress = () => {
  const [classData, setClassData] = useState(staticData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [editModal, setEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editClassIdx, setEditClassIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const filtered = classData
    .filter((cls) => selectedClass === "All" || cls.className === selectedClass)
    .map((cls) => {
      const students = cls.students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchClass = cls.className
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return {
        ...cls,
        students: matchClass ? cls.students : students,
        subjectAverages: calcSubjectAvg(matchClass ? cls.students : students),
      };
    })
    .filter((cls) => cls.students.length || !searchTerm);

  const handleDelete = (classIdx, studentId) => {
    const updated = classData.map((cls, idx) =>
      idx === classIdx
        ? { ...cls, students: cls.students.filter((s) => s.id !== studentId) }
        : cls
    );
    setClassData(updated);
  };

  const toggleClassExpansion = (id) => {
    setExpandedClasses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const exportToPDF = () => {
    const input = document.getElementById("progress-report");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas, "PNG", 0, 0, w, h);
      pdf.save("progress_report.pdf");
    });
  };

  const renderStudentCards = (students, classIdx) =>
    students.map((s) => (
      <Card key={s.id} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h6>{s.name}</h6>
              <small>{s.id}</small>
            </div>
            <div>
              <Button
                size="sm"
                className="me-1"
                variant="info"
                onClick={() => {
                  setEditStudent(s);
                  setEditClassIdx(classIdx);
                  setEditModal(true);
                }}
              >
                <FaEdit />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(classIdx, s.id)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>

          <Row>
            {subjects.map((sub) => (
              <Col xs={6} key={sub}>
                <small>
                  {sub}: <strong>{s.scores[sub]}%</strong>
                </small>
              </Col>
            ))}
            <Col xs={6}>
              <small>Avg: {s.average}%</small>
            </Col>
            <Col xs={6}>
              <small>Top: {s.topSubject}</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));

  return (
    <div className="p-2 p-md-3">
      {isMobile && (
        <Navbar bg="light" className="mb-3">
          <Navbar.Brand>Student Progress</Navbar.Brand>
          <Button variant="outline-secondary" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <FaBars />
          </Button>
          <Collapse in={showMobileMenu}>
            <Nav className="flex-column mt-2">
              {/* Search */}
              <InputGroup className="mb-2">
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Class Filter */}
              <Form.Select
                className="mb-2"
                style={{ fontSize: "14px", padding: "4px" }}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                {classData.map((cls) => (
                  <option key={cls.className}>{cls.className}</option>
                ))}
              </Form.Select>

              {/* Export */}
              <Button variant="outline-danger" size="sm" onClick={exportToPDF}>
                <FaDownload /> Export PDF
              </Button>
            </Nav>
          </Collapse>
        </Navbar>
      )}

      <Alert variant="info" className="text-center mb-3">
        📊 AI Insights & Student Progress Tracking
      </Alert>

      {/* ------------ Desktop Filters -------------- */}
      {!isMobile && (
        <Row className="align-items-center mb-4">
          {/* LEFT - SEARCH */}
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search by student ID, name, class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* RIGHT - FILTER + EXPORT */}
          <Col md={6} className="d-flex justify-content-end align-items-center">
            <Form.Select
              style={{ width: "160px", fontSize: "14px", padding: "4px" }}
              className="me-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All">All Classes</option>
              {classData.map((cls) => (
                <option key={cls.className}>{cls.className}</option>
              ))}
            </Form.Select>

            <Button variant="outline-danger" onClick={exportToPDF}>
              <FaDownload /> Export
            </Button>
          </Col>
        </Row>
      )}

      {/* ------------ Class Sections -------------- */}
      <div id="progress-report">
        {filtered.map((cls, idx) => (
          <Card className="shadow mb-4" key={idx}>
            <Card.Body>
              <div
                className="d-flex justify-content-between"
                onClick={() => isMobile && toggleClassExpansion(idx)}
              >
                <h4>{cls.className} - Group Insights</h4>
                {isMobile && (
                  <Button variant="link" className="p-0">
                    {expandedClasses[idx] ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                )}
              </div>

              <Collapse in={!isMobile || expandedClasses[idx]}>
                <div>
                  <div style={{ height: isMobile ? "200px" : "300px" }} className="mb-4">
                    <Bar
                      data={{
                        labels: subjects,
                        datasets: [
                          {
                            label: "Average Score",
                            data: subjects.map((sub) => cls.subjectAverages[sub]),
                            backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>

                  {!isMobile ? (
                    <Table hover bordered>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          {subjects.map((s) => (
                            <th key={s}>{s}</th>
                          ))}
                          <th>Avg</th>
                          <th>Top</th>
                          <th>Improve</th>
                          <th>Completion</th>
                          <th>AI Insight</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cls.students.map((s) => (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            {subjects.map((sub) => (
                              <td key={sub}>{s.scores[sub]}%</td>
                            ))}
                            <td><strong>{s.average}%</strong></td>
                            <td>{s.topSubject}</td>
                            <td>{s.improvement}%</td>
                            <td>{s.completion}%</td>
                            <td>{s.aiInsight}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="info"
                                className="me-1"
                                onClick={() => {
                                  setEditStudent(s);
                                  setEditClassIdx(idx);
                                  setEditModal(true);
                                }}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(idx, s.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    renderStudentCards(cls.students, idx)
                  )}
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal show={editModal} centered onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editStudent && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control value={editStudent.name} disabled />
              </Form.Group>

              {subjects.map((sub) => (
                <Form.Group key={sub} className="mb-2">
                  <Form.Label>{sub} Score</Form.Label>
                  <Form.Control value={editStudent.scores[sub]} disabled />
                </Form.Group>
              ))}

              <Form.Group className="mb-2">
                <Form.Label>AI Insight</Form.Label>
                <Form.Control value={editStudent.aiInsight} disabled />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setEditModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Progress;
