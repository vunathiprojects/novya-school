import React, { useState } from "react";
import { Card, Row, Col, Button, Form, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ---------------- UPDATED MOCK DATA ----------------
const CLASS_DATA = {
  "Class 7": [
    { id: "C7S01", name: "Ravi", dob: "12-03-2010", attendance: "88%" },
    { id: "C7S02", name: "Aarav", dob: "21-04-2010", attendance: "91%" },
  ],
  "Class 8": [
    { id: "C8S01", name: "Teja", dob: "11-02-2009", attendance: "94%" },
    { id: "C8S02", name: "Swathi", dob: "09-05-2009", attendance: "89%" },
  ],
  "Class 9": [
    { id: "C9S01", name: "Meghana", dob: "17-07-2008", attendance: "95%" },
    { id: "C9S02", name: "John", dob: "03-11-2008", attendance: "87%" },
  ],
  "Class 10": [
    { id: "C10S01", name: "Divya", dob: "15-01-2007", attendance: "93%" },
    { id: "C10S02", name: "Ajay", dob: "28-08-2007", attendance: "90%" },
  ],
};

// ---------------- UPDATED SUBJECT MARKS ----------------
const MARKS = {
  C7S01: [
    { subject: "Math", marks: 82, grade: "A" },
    { subject: "Science", marks: 90, grade: "A+" },
    { subject: "English", marks: 76, grade: "B+" },
    { subject: "History", marks: 84, grade: "A" },
    { subject: "Chemistry", marks: 88, grade: "A" },
    { subject: "Computer Science", marks: 92, grade: "A+" },
  ],
  C7S02: [
    { subject: "Math", marks: 88, grade: "A" },
    { subject: "Science", marks: 92, grade: "A+" },
    { subject: "English", marks: 81, grade: "A" },
    { subject: "History", marks: 79, grade: "B+" },
    { subject: "Chemistry", marks: 85, grade: "A" },
    { subject: "Computer Science", marks: 90, grade: "A+" },
  ],
  // Add more students if needed
};

const Reports = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const studentsInClass = selectedClass ? CLASS_DATA[selectedClass] : [];
  const studentInfo = studentsInClass.find((s) => s.id === selectedStudent);
  const studentMarks = MARKS[selectedStudent] || [];

  // ---------------- UPDATED CHART ----------------
  const chartData = {
    labels: studentMarks.map((s) => s.subject),
    datasets: [
      {
        label: "Marks",
        backgroundColor: "#2a9d8f", // SAME AS ATTENDANCE COLOR
        data: studentMarks.map((s) => s.marks),
      },
    ],
  };

  // Reduced bargraph height
  const chartOptions = {
    maintainAspectRatio: false,
  };

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {
    const node = document.getElementById("report-card");
    html2canvas(node, { scale: 2 }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, width, height);
      pdf.save("ReportCard.pdf");
    });
  };

  return (
    <div>
      <h2 className="mb-4">📘 Student Report Card </h2>

      {/* CLASS & STUDENT SELECTOR */}
      <Card className="p-3 shadow mb-4">
        <Row>
          <Col md={4}>
            <Form.Label>Select Class</Form.Label>
            <Form.Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent("");
              }}
            >
              <option value="">-- Select Class --</option>
              {Object.keys(CLASS_DATA).map((cls) => (
                <option key={cls}>{cls}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>Select Student</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">-- Select Student --</option>
              {studentsInClass.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col
            md={4}
            className="text-end d-flex align-items-end justify-content-end"
          >
            <Button
              variant="danger"
              disabled={!selectedStudent}
              onClick={exportPDF}
            >
              Export PDF
            </Button>
          </Col>
        </Row>
      </Card>

      {/* REPORT CARD */}
      {selectedStudent && studentInfo && (
        <div id="report-card">
          <Card className="p-4 shadow mb-4">
            <h4 className="mb-3">🎓 Student Information</h4>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Name:</strong> {studentInfo.name}
                </p>
                <p>
                  <strong>Class:</strong> {selectedClass}
                </p>
                <p>
                  <strong>Roll No:</strong> {studentInfo.id}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Date of Birth:</strong> {studentInfo.dob}
                </p>
                <p>
                  <strong>Attendance:</strong> {studentInfo.attendance}
                </p>
              </Col>
            </Row>
          </Card>

          {/* MARKS TABLE */}
          <Card className="p-4 shadow mb-4">
            <h4 className="mb-3">📑 Subject Performance</h4>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentMarks.map((s, i) => (
                  <tr key={i}>
                    <td>{s.subject}</td>
                    <td>{s.marks}</td>
                    <td>{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* PERFORMANCE GRAPH */}
          <Card className="p-4 shadow mb-4" style={{ height: "320px" }}>
            <h4 className="mb-3">📊 Performance Graph</h4>
            <div style={{ height: "240px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>

          {/* REMARKS */}
          <Card className="p-4 shadow mb-4">
            <h4 className="mb-2">📝 Remarks</h4>
            <p>
              Consistent performance. Shows improvement in academic areas and good
              classroom behavior.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
