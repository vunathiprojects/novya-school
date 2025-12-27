import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Table, Spinner, Alert } from "react-bootstrap";
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
import { getReportsData } from "../../../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Reports = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [classData, setClassData] = useState({});
  const [marksData, setMarksData] = useState({});
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
        
        const result = await getReportsData(adminEmail);
        
        if (result.error) {
          setError(result.error);
          // Fallback to empty data on error
          setClassData({});
          setMarksData({});
        } else {
          setClassData(result.classes || {});
          setMarksData(result.marks || {});
        }
      } catch (err) {
        console.error("Error loading reports data:", err);
        setError("Failed to load reports data");
        setClassData({});
        setMarksData({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const studentsInClass = selectedClass ? (classData[selectedClass] || []) : [];
  const studentInfo = studentsInClass.find((s) => s.id === selectedStudent);
  const studentMarks = marksData[selectedStudent] || [];

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
              {Object.keys(classData).map((cls) => (
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
