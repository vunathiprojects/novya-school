
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

// const subjects = ["Math", "Biology", "Physics", "English", "History"];

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
//                                   <td key={sub}>{(s.scores && s.scores[sub] !== undefined && s.scores[sub] !== null) ? s.scores[sub] : 0}%</td>
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
  Spinner,
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
import { getProgressData } from "../../../api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const subjects = ["Math", "Biology", "Physics", "English", "History"];

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
  const [rawClassData, setRawClassData] = useState([]); // Store raw data from backend
  const [classData, setClassData] = useState([]); // Filtered/transformed data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedExamType, setSelectedExamType] = useState("Average"); // Average, Quarterly, Half-Yearly, Annual
  const [editModal, setEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editClassIdx, setEditClassIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get admin email from localStorage
        const adminEmail = localStorage.getItem("profileEmail");
        if (!adminEmail) {
          setError("Admin email not found. Please login again.");
          setLoading(false);
          return;
        }
        
        const result = await getProgressData(adminEmail);
        
        console.log("Progress API Response:", result);
        console.log("Progress API Response - Full JSON:", JSON.stringify(result, null, 2));
        
        if (result.error) {
          console.error("Progress API Error:", result.error);
          setError(result.error);
          setClassData([]);
        } else {
          // Transform backend data to match frontend format
          // Backend returns: { classes: { "Class 7": [...], "Class 8": [...] } }
          // Store raw data first
          const rawData = [];
          console.log("Result classes:", result.classes);
          if (result.classes && Object.keys(result.classes).length > 0) {
            Object.keys(result.classes).forEach((className) => {
              const students = result.classes[className].map((student) => {
                console.log(`📝 Processing student ${student.name} (ID: ${student.student_id}):`, {
                  school_scores_avg: student.school_scores_avg,
                  school_scores_quarterly: student.school_scores_quarterly,
                  school_scores_halfyearly: student.school_scores_halfyearly,
                  school_scores_annual: student.school_scores_annual,
                });
                
                return {
                  id: `S${student.student_id}`,
                  name: student.name,
                  student_id: student.student_id,
                  average_score: student.average_score || 0,
                  improvement_quarterly: student.improvement_quarterly || 0,
                  improvement_halfyearly: student.improvement_halfyearly || 0,
                  improvement_annual: student.improvement_annual || 0,
                  improvement_avg: student.improvement_avg || 0,
                  completion: student.completion || 0, // From backend: average of all three exam types
                  // Store all exam types for filtering
                  scoresAvg: student.school_scores_avg || {},
                  scoresQuarterly: student.school_scores_quarterly || {},
                  scoresHalfyearly: student.school_scores_halfyearly || {},
                  scoresAnnual: student.school_scores_annual || {},
                };
              });
              
              rawData.push({
                className: className,
                rawStudents: students,
              });
            });
          } else {
            console.warn("No classes found in response or classes object is empty");
          }
          
          console.log("Raw class data:", rawData);
          setRawClassData(rawData);
        }
      } catch (err) {
        console.error("Error loading progress data:", err);
        setError("Failed to load progress data");
        setClassData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Load data once on mount
  
  // Apply exam type filter when it changes
  useEffect(() => {
    if (rawClassData.length === 0) return;
    
    // Apply exam type filter and calculate scores
    const transformedClasses = rawClassData.map((classItem) => {
      const students = classItem.rawStudents.map((student) => {
        // Select scores based on exam type filter
        let scores = {};
        if (selectedExamType === "Quarterly") {
          scores = student.scoresQuarterly || {};
        } else if (selectedExamType === "Half-Yearly") {
          scores = student.scoresHalfyearly || {};
        } else if (selectedExamType === "Annual") {
          scores = student.scoresAnnual || {};
        } else {
          // Average (default)
          scores = student.scoresAvg || {};
        }
        
        console.log(`  📊 Student ${student.name} - Exam Type: ${selectedExamType}, Scores object:`, scores);
        
        // Map to standard subject names - backend now normalizes to: Mathematics, Biology, Physics, English, History, Computer
        // Backend returns normalized subject names, so we can directly map them
        const findScore = (standardName, possibleKeys) => {
          if (!scores || Object.keys(scores).length === 0) {
            console.log(`    ⚠️ No scores object or empty for ${standardName}`);
            return 0;
          }
          
          const scoreKeys = Object.keys(scores);
          console.log(`    🔍 Looking for ${standardName}, available keys:`, scoreKeys);
          
          // First check for exact standard name match (backend normalizes to this)
          // Note: 0 is a valid score, so we check for undefined/null only
          if (scores[standardName] !== undefined && scores[standardName] !== null) {
            console.log(`    ✅ Found exact match: ${standardName} = ${scores[standardName]}`);
            return scores[standardName];
          }
          
          // Fallback: check all possible variations (case-insensitive)
          for (const key of possibleKeys) {
            // Check exact match
            if (scores[key] !== undefined && scores[key] !== null) {
              console.log(`    ✅ Found exact key match: ${key} = ${scores[key]}`);
              return scores[key];
            }
            // Check case-insensitive match
            const foundKey = scoreKeys.find(k => k.toLowerCase().trim() === key.toLowerCase().trim());
            if (foundKey !== undefined && scores[foundKey] !== undefined && scores[foundKey] !== null) {
              console.log(`    ✅ Found case-insensitive match: ${foundKey} = ${scores[foundKey]}`);
              return scores[foundKey];
            }
            // Check partial match (for variations like "Social Studies" matching "social")
            const partialMatch = scoreKeys.find(k => {
              const kLower = k.toLowerCase().trim();
              const keyLower = key.toLowerCase().trim();
              return kLower.includes(keyLower) || keyLower.includes(kLower);
            });
            if (partialMatch !== undefined && scores[partialMatch] !== undefined && scores[partialMatch] !== null) {
              console.log(`    ✅ Found partial match: ${partialMatch} = ${scores[partialMatch]}`);
              return scores[partialMatch];
            }
          }
          console.log(`    ❌ No match found for ${standardName}`);
          return 0;
        };
        
        const mappedScores = {
          Math: findScore("Mathematics", ["Math", "Mathematics", "MATHS", "maths", "Maths", "mathematics", "MATH", "math"]),
          Biology: findScore("Biology", ["Biology", "BIOLOGY", "biology", "bio", "BIO", "Bio", "biological", "BIOLOGICAL", "Science", "SCIENCE", "science"]), // Also check Science as fallback
          Physics: findScore("Physics", ["Physics", "PHYSICS", "physics", "phy", "PHY", "Phy", "physical", "PHYSICAL", "Science", "SCIENCE", "science"]), // Also check Science as fallback
          English: findScore("English", ["English", "ENGLISH", "english", "eng", "ENG", "Eng"]),
          History: findScore("History", ["History", "Social Studies", "SocialScience", "SOCIAL STUDIES", "social studies", "social", "Social", "SOCIAL", "SST", "sst", "SocialStudies"]),
          Hindi: findScore("Hindi", ["Hindi", "HINDI", "hindi", "hin", "HIN", "Hin"]),
          Telugu: findScore("Telugu", ["Telugu", "TELUGU", "telugu", "tel", "TEL", "Tel"]),
        };
        
        // Ensure all subject keys exist with at least 0 value
        const allSubjects = ["Math", "Biology", "Physics", "English", "History", "Hindi", "Telugu"];
        allSubjects.forEach(sub => {
          if (mappedScores[sub] === undefined || mappedScores[sub] === null) {
            mappedScores[sub] = 0;
          }
        });
        
        console.log(`  📊 Mapped scores for ${student.name}:`, mappedScores);
        console.log(`  📊 Mapped scores keys:`, Object.keys(mappedScores));
        console.log(`  📊 Mapped scores values:`, Object.values(mappedScores));
        
        // Find top subject - handle empty scores
        const scoreEntries = Object.entries(mappedScores);
        let topSubject = "N/A";
        if (scoreEntries.length > 0) {
          // Filter out 0 scores for top subject calculation, but keep all scores for display
          const nonZeroScores = scoreEntries.filter(([_, score]) => score > 0);
          if (nonZeroScores.length > 0) {
            const topSubjectEntry = nonZeroScores.reduce((a, b) => 
              mappedScores[a[0]] > mappedScores[b[0]] ? a : b
            );
            topSubject = topSubjectEntry[0] || "N/A";
          } else {
            // If all scores are 0, pick the first subject
            topSubject = scoreEntries[0][0] || "N/A";
          }
        }
        
        // Calculate average of mapped scores (include 0 scores in calculation)
        const scoreValues = Object.values(mappedScores);
        const calculatedAvg = scoreValues.length > 0 
          ? Math.round((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10) / 10
          : student.average_score || 0;
        
        // Calculate improvement based on selected exam type
        let improvement = 0;
        if (selectedExamType === "Quarterly") {
          improvement = student.improvement_quarterly || 0;
        } else if (selectedExamType === "Half-Yearly") {
          improvement = student.improvement_halfyearly || 0;
        } else if (selectedExamType === "Annual") {
          improvement = student.improvement_annual || 0;
        } else {
          // Average
          improvement = student.improvement_avg || 0;
        }
        
        return {
          id: student.id,
          name: student.name,
          scores: mappedScores,
          average: calculatedAvg,
          topSubject: topSubject,
          improvement: improvement,
          completion: student.completion,
          aiInsight: calculatedAvg >= 85 ? "High retention" : calculatedAvg < 70 ? "Needs support" : "Steady",
        };
      });
      
      return {
        className: classItem.className,
        students: students,
        subjectAverages: calcSubjectAvg(students),
      };
    });
    
    setClassData(transformedClasses);
  }, [rawClassData, selectedExamType]); // Re-filter when exam type or raw data changes

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading progress data...</p>
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

  if (!classData || classData.length === 0) {
    return (
      <div className="p-3">
        <Alert variant="info">
          <Alert.Heading>No Data Available</Alert.Heading>
          <p>No student progress data found. Please check if students are registered and approved.</p>
        </Alert>
      </div>
    );
  }

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
                  {sub}: <strong>{(s.scores && s.scores[sub] !== undefined && s.scores[sub] !== null) ? s.scores[sub] : 0}%</strong>
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

              {/* Exam Type Filter */}
              <Form.Select
                className="mb-2"
                style={{ fontSize: "14px", padding: "4px" }}
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
              >
                <option value="Average">Average (All Exams)</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Annual">Annual</option>
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

            <Form.Select
              style={{ width: "180px", fontSize: "14px", padding: "4px" }}
              className="me-2"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="Average">Average (All Exams)</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Annual">Annual</option>
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
