// import React, { useState } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Badge,
//   Tabs,
//   Tab,
// } from "react-bootstrap";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// // -------------------- Mock Data --------------------
// const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", ];

// const STUDENT_DATA = {
//   "Class 7": [
//     { id: "C7S01", name: "Ravi", present: 18, absent: 2 },
//     { id: "C7S02", name: "Meghana", present: 19, absent: 1 },
//     { id: "C7S03", name: "Teja", present: 15, absent: 5 },
//     { id: "C7S04", name: "Aarav", present: 20, absent: 0 },
//   ],
//   "Class 8": [
//     { id: "C8S01", name: "Harsha", present: 16, absent: 4 },
//     { id: "C8S02", name: "Ritu", present: 18, absent: 2 },
//     { id: "C8S03", name: "Anita", present: 20, absent: 0 },
//     { id: "C8S04", name: "Sanjay", present: 17, absent: 3 },
//   ],
//   "Class 9": [
//     { id: "C9S01", name: "Tarun", present: 19, absent: 1 },
//     { id: "C9S02", name: "Deepak", present: 14, absent: 6 },
//     { id: "C9S03", name: "Swathi", present: 18, absent: 2 },
//     { id: "C9S04", name: "Pranay", present: 16, absent: 4 },
//   ],
//   "Class 10": [
//     { id: "C10S01", name: "Akhil", present: 20, absent: 0 },
//     { id: "C10S02", name: "John", present: 19, absent: 1 },
//   ],
 
// };

// const TEACHER_DATA = [
//   { id: "T01", name: "Mr. Ramesh", department: "Math", present: 20, absent: 1, class: "Class 7" },
//   { id: "T02", name: "Ms. Priya", department: "Science", present: 19, absent: 2, class: "Class 8" },
//   { id: "T03", name: "Mr. Vijay", department: "English", present: 18, absent: 3, class: "Class 9" },
//   { id: "T04", name: "Ms. Kavya", department: "History", present: 20, absent: 0, class: "Class 10" },
//   { id: "T05", name: "Mr. Arjun", department: "Physics", present: 17, absent: 4, class: "Class 11" },
//   { id: "T06", name: "Ms. Nisha", department: "Chemistry", present: 18, absent: 3, class: "Class 12" },
// ];

// // -------------------- Utilities --------------------
// const calcSummary = (rows) => {
//   const totalEntities = rows.length;
//   const totalPresent = rows.reduce((s, r) => s + r.present, 0);
//   const totalAbsent = rows.reduce((s, r) => s + r.absent, 0);
//   const avg = Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
//   return { totalEntities, totalPresent, totalAbsent, avg };
// };

// const statusBadge = (pct) => {
//   if (pct >= 85) return <Badge bg="success">Good</Badge>;
//   if (pct >= 70) return <Badge bg="warning">Fair</Badge>;
//   return <Badge bg="danger">Poor</Badge>;
// };

// // -------------------- Component --------------------
// const Attendance = () => {
//   const [activeTab, setActiveTab] = useState("students");
//   const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

//   const students = STUDENT_DATA[selectedClass];
//   const studentSummary = calcSummary(students);

//   const teacherDepartments = ["All", ...new Set(TEACHER_DATA.map((t) => t.department))];
//   const [teacherDept, setTeacherDept] = useState("All");

//   const filteredTeachers =
//     teacherDept === "All" ? TEACHER_DATA : TEACHER_DATA.filter((t) => t.department === teacherDept);

//   const teacherSummary = calcSummary(filteredTeachers);

//   const CHART_COLOR = "#2a9d8f";

//   // -------------------- NEW CLASS-WISE STUDENT GRAPH --------------------
//   const studentClassAvg = CLASSES.map((cls) => {
//     const rows = STUDENT_DATA[cls];
//     const totalPresent = rows.reduce((a, b) => a + b.present, 0);
//     const totalAbsent = rows.reduce((a, b) => a + b.absent, 0);
//     return Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
//   });

//   const studentChart = {
//     labels: CLASSES,
//     datasets: [
//       {
//         label: "Class Avg Attendance %",
//         data: studentClassAvg,
//         backgroundColor: CHART_COLOR,
//       },
//     ],
//   };

//   // -------------------- NEW CLASS-WISE TEACHER GRAPH --------------------
//   const teacherClassAvg = CLASSES.map((cls) => {
//     const rows = TEACHER_DATA.filter((t) => t.class === cls);
//     if (rows.length === 0) return 0;
//     const totalPresent = rows.reduce((a, b) => a + b.present, 0);
//     const totalAbsent = rows.reduce((a, b) => a + b.absent, 0);
//     return Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
//   });

//   const teacherChart = {
//     labels: CLASSES,
//     datasets: [
//       {
//         label: "Class Avg Attendance %",
//         data: teacherClassAvg,
//         backgroundColor: CHART_COLOR,
//       },
//     ],
//   };

//   const exportPDF = async () => {
//     const node = document.getElementById(activeTab === "students" ? "students" : "teachers");
//     const canvas = await html2canvas(node);
//     const pdf = new jsPDF("p", "mm", "a4");
//     const img = canvas.toDataURL("image/png");
//     pdf.addImage(img, "PNG", 5, 5, 200, 0);
//     pdf.save("attendance.pdf");
//   };

//   return (
//     <div>
//       <h2 className="mb-4">Attendance</h2>

//       <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">

//         {/* ---------------- STUDENTS ---------------- */}
//         <Tab eventKey="students" title="Students">
//           <Card className="p-3 mb-3 shadow-sm">
//             <Row>
//               <Col md={4}>
//                 <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//                   {CLASSES.map((c) => (
//                     <option key={c}>{c}</option>
//                   ))}
//                 </Form.Select>
//               </Col>

//               <Col md={8} className="text-end">
//                 <Button variant="outline-danger" onClick={exportPDF}>
//                   Export PDF
//                 </Button>
//               </Col>
//             </Row>
//           </Card>

//           <div id="students">
//             <Row className="g-3 mb-3">
//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Total Students</div>
//                   <h4>{studentSummary.totalEntities}</h4>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Avg %</div>
//                   <h4>{studentSummary.avg}%</h4>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Present</div>
//                   <h4>{studentSummary.totalPresent}</h4>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Absent</div>
//                   <h4>{studentSummary.totalAbsent}</h4>
//                 </Card>
//               </Col>
//             </Row>

//             {/* CLASS-WISE ATTENDANCE GRAPH */}
//             <Card className="p-3 mb-3 shadow-sm">
//               <Bar data={studentChart} height={120} />
//             </Card>

//             <Card className="p-3 shadow-sm">
//               <Table hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>ID</th>
//                     <th>Present</th>
//                     <th>Absent</th>
//                     <th>%</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((s) => {
//                     const pct = Math.round((s.present / (s.present + s.absent)) * 100);
//                     return (
//                       <tr key={s.id}>
//                         <td>{s.name}</td>
//                         <td>{s.id}</td>
//                         <td>{s.present}</td>
//                         <td>{s.absent}</td>
//                         <td>{pct}%</td>
//                         <td>{statusBadge(pct)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </Card>
//           </div>
//         </Tab>

//         {/* ---------------- TEACHERS ---------------- */}
//         <Tab eventKey="teachers" title="Teachers">
//           <Card className="p-3 mb-3 shadow-sm">
//             <Row>
//               <Col md={4}>
//                 <Form.Select value={teacherDept} onChange={(e) => setTeacherDept(e.target.value)}>
//                   {teacherDepartments.map((d) => (
//                     <option key={d}>{d}</option>
//                   ))}
//                 </Form.Select>
//               </Col>

//               <Col md={8} className="text-end">
//                 <Button variant="outline-danger" onClick={exportPDF}>
//                   Export PDF
//                 </Button>
//               </Col>
//             </Row>
//           </Card>

//           <div id="teachers">
//             <Row className="g-3 mb-3">
//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Total Teachers</div>
//                   <h4>{teacherSummary.totalEntities}</h4>
//                 </Card>
//               </Col>

//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Avg %</div>
//                   <h4>{teacherSummary.avg}%</h4>
//                 </Card>
//               </Col>

//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Present</div>
//                   <h4>{teacherSummary.totalPresent}</h4>
//                 </Card>
//               </Col>

//               <Col md={3}>
//                 <Card className="p-3 text-center shadow-sm">
//                   <div>Absent</div>
//                   <h4>{teacherSummary.totalAbsent}</h4>
//                 </Card>
//               </Col>
//             </Row>

//             {/* CLASS-WISE TEACHER ATTENDANCE GRAPH */}
//             <Card className="p-3 mb-3 shadow-sm">
//               <Bar data={teacherChart} height={120} />
//             </Card>

//             <Card className="p-3 shadow-sm">
//               <Table hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Dept</th>
//                     <th>Present</th>
//                     <th>Absent</th>
//                     <th>%</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredTeachers.map((t) => {
//                     const pct = Math.round((t.present / (t.present + t.absent)) * 100);
//                     return (
//                       <tr key={t.id}>
//                         <td>{t.name}</td>
//                         <td>{t.department}</td>
//                         <td>{t.present}</td>
//                         <td>{t.absent}</td>
//                         <td>{pct}%</td>
//                         <td>{statusBadge(pct)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </Card>
//           </div>
//         </Tab>
//       </Tabs>
//     </div>
//   );
// };

// export default Attendance;



import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAttendanceData } from "../../../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// -------------------- Utilities --------------------
const calcSummary = (rows) => {
  const totalEntities = rows.length;
  const totalPresent = rows.reduce((s, r) => s + r.present, 0);
  const totalAbsent = rows.reduce((s, r) => s + r.absent, 0);
  const avg = Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
  return { totalEntities, totalPresent, totalAbsent, avg };
};

const statusBadge = (pct) => {
  if (pct >= 85) return <Badge bg="success">Good</Badge>;
  if (pct >= 70) return <Badge bg="warning">Fair</Badge>;
  return <Badge bg="danger">Poor</Badge>;
};

// -------------------- Component --------------------
const Attendance = () => {
  const [studentData, setStudentData] = useState({});
  const [teacherData, setTeacherData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        const result = await getAttendanceData(adminEmail);
        
        if (result.error) {
          setError(result.error);
          setStudentData({});
          setTeacherData([]);
          setClasses([]);
        } else {
          setStudentData(result.students || {});
          setTeacherData(result.teachers || []);
          setClasses(result.classes || []);
          if (result.classes && result.classes.length > 0) {
            setSelectedClass(result.classes[0]);
          }
        }
      } catch (err) {
        console.error("Error loading attendance data:", err);
        setError("Failed to load attendance data");
        setStudentData({});
        setTeacherData([]);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const students = studentData[selectedClass] || [];
  const studentSummary = calcSummary(students);

  const CHART_COLOR = "#2a9d8f";

  // Class-wise student graph
  const studentClassAvg = classes.map((cls) => {
    const rows = studentData[cls] || [];
    if (rows.length === 0) return 0;
    const totalPresent = rows.reduce((a, b) => a + b.present, 0);
    const totalAbsent = rows.reduce((a, b) => a + b.absent, 0);
    const total = totalPresent + totalAbsent;
    return total > 0 ? Math.round((totalPresent / total) * 100) : 0;
  });

  const studentChart = {
    labels: classes,
    datasets: [
      {
        label: "Class Avg Attendance %",
        data: studentClassAvg,
        backgroundColor: CHART_COLOR,
      },
    ],
  };

  const exportPDF = async () => {
    const node = document.getElementById("attendance-content");
    const canvas = await html2canvas(node);
    const pdf = new jsPDF("p", "mm", "a4");
    const img = canvas.toDataURL("image/png");
    pdf.addImage(img, "PNG", 5, 5, 200, 0);
    pdf.save("student-attendance.pdf");
  };

  return (
    <div>
      <h2 className="mb-4">Attendance</h2>

      <div id="attendance-content">
        <Card className="p-3 mb-3 shadow-sm">
          <Row>
            <Col md={4}>
              <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={8} className="text-end">
              <Button variant="outline-danger" onClick={exportPDF}>
                Export PDF
              </Button>
            </Col>
          </Row>
        </Card>

        <Row className="g-3 mb-3">
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <div>Total Students</div>
              <h4>{studentSummary.totalEntities}</h4>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <div>Avg %</div>
              <h4>{studentSummary.avg}%</h4>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <div>Present</div>
              <h4>{studentSummary.totalPresent}</h4>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <div>Absent</div>
              <h4>{studentSummary.totalAbsent}</h4>
            </Card>
          </Col>
        </Row>

        {/* CLASS-WISE ATTENDANCE GRAPH */}
        <Card className="p-3 mb-3 shadow-sm">
          <Bar data={studentChart} height={120} />
        </Card>

        <Card className="p-3 shadow-sm">
          <Table hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Present</th>
                <th>Absent</th>
                <th>%</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const pct = Math.round((s.present / (s.present + s.absent)) * 100);
                return (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.id}</td>
                    <td>{s.present}</td>
                    <td>{s.absent}</td>
                    <td>{pct}%</td>
                    <td>{statusBadge(pct)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;