import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Badge,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Button,
} from "react-bootstrap";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
  FaSearch,
} from "react-icons/fa";
import {
  getSchoolTeachers,
  getSchoolStudents,
  getSchoolParents,
} from "../../../api";

const UserManagement = () => {
  // Get selected role from localStorage to determine default tab
  const userRole = localStorage.getItem("userRole") || "Student";
  const defaultTab = userRole === "Teacher" ? "teachers" : userRole === "Parent" ? "parents" : "students";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const adminEmail = localStorage.getItem("profileEmail");
        if (!adminEmail) {
          setError("Admin email not found. Please login again.");
          setLoading(false);
          return;
        }

        // Load all data in parallel
        const [teachersRes, studentsRes, parentsRes] = await Promise.all([
          getSchoolTeachers(adminEmail),
          getSchoolStudents(adminEmail),
          getSchoolParents(adminEmail),
        ]);

        if (teachersRes.error) {
          setError(teachersRes.error);
        } else {
          setTeachers(teachersRes.teachers || []);
        }

        if (studentsRes.error) {
          setError(studentsRes.error);
        } else {
          setStudents(studentsRes.students || []);
        }

        if (parentsRes.error) {
          setError(parentsRes.error);
        } else {
          setParents(parentsRes.parents || []);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.username?.toLowerCase().includes(term)
    );
  };

  const filteredTeachers = filterData(teachers, searchTerm);
  const filteredStudents = filterData(students, searchTerm);
  const filteredParents = filterData(parents, searchTerm);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="user-management-page p-3">
      <h2 className="mb-4">User Management</h2>

      {error && (
        <Alert variant="warning" className="mb-3">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Search Bar */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex align-items-center">
            <FaSearch className="me-2" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab
          eventKey="teachers"
          title={
            <>
              <FaChalkboardTeacher className="me-2" />
              Teachers ({teachers.length})
            </>
          }
        >
          <Card>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Grade</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No teachers found
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.teacher_id}>
                        <td>{teacher.name}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.phone || "N/A"}</td>
                        <td>{teacher.grade || "N/A"}</td>
                        <td>{teacher.department || "N/A"}</td>
                        <td>
                          <Badge
                            bg={
                              teacher.status === "approved"
                                ? "success"
                                : "warning"
                            }
                          >
                            {teacher.status || "pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab
          eventKey="students"
          title={
            <>
              <FaUserGraduate className="me-2" />
              Students ({students.length})
            </>
          }
        >
          <Card>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Grade</th>
                    <th>Parent Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.student_id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone || "N/A"}</td>
                        <td>{student.grade || "N/A"}</td>
                        <td>{student.parent_email || "Not linked"}</td>
                        <td>
                          <Badge
                            bg={
                              student.status === "approved"
                                ? "success"
                                : "warning"
                            }
                          >
                            {student.status || "pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab
          eventKey="parents"
          title={
            <>
              <FaUserFriends className="me-2" />
              Parents ({parents.length})
            </>
          }
        >
          <Card>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Children Count</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No parents found
                      </td>
                    </tr>
                  ) : (
                    filteredParents.map((parent) => (
                      <tr key={parent.parent_id}>
                        <td>{parent.name}</td>
                        <td>{parent.email}</td>
                        <td>{parent.phone || "N/A"}</td>
                        <td>
                          <Badge bg="info">{parent.children_count || 0}</Badge>
                        </td>
                        <td>
                          <Badge
                            bg={
                              parent.status === "approved"
                                ? "success"
                                : "warning"
                            }
                          >
                            {parent.status || "pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserManagement;

