// const API_BASE_URL = "http://127.0.0.1:8000/api";

// // -------------------------
// // SIGNUP ADMIN
// // -------------------------
// export const signupAdmin = async (fullName, email, password) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/signup/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ fullName, email, password }),
//     });

//     // If server returned HTML instead of JSON → handle safely
//     const text = await response.text();
//     let data;

//     try {
//       data = JSON.parse(text);
//     } catch {
//       return { error: "Server Error: Invalid JSON response" };
//     }

//     if (!response.ok) {
//       return { error: data.error || "Signup failed" };
//     }

//     return data;
//   } catch (error) {
//     console.error("Signup Error:", error);
//     return { error: "Network Error" };
//   }
// };

// // -------------------------
// // LOGIN ADMIN
// // -------------------------
// export const loginAdmin = async (email, password) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/login/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const text = await response.text();
//     let data;

//     try {
//       data = JSON.parse(text);
//     } catch {
//       return { error: "Server Error: Invalid JSON response" };
//     }

//     if (!response.ok) {
//       return { error: data.error || "Login failed" };
//     }

//     return data;
//   } catch (error) {
//     console.error("Login Error:", error);
//     return { error: "Network Error" };
//   }
// };


// src/api.js
const API_BASE_URL = "http://127.0.0.1:8002/api";

// Utility to safely parse text -> JSON and return { ok: bool, data: object, error: string }
const safeParse = async (response) => {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return { ok: response.ok, data };
  } catch (err) {
    // server returned HTML or invalid JSON
    return { ok: response.ok, data: null, error: "Server Error: Invalid JSON response" };
  }
};

// -------------------------
// SIGNUP ADMIN
// -------------------------
export const signupAdmin = async (fullName, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Signup failed" };

    return parsed.data;
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// LOGIN ADMIN
// -------------------------
export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Login failed" };

    return parsed.data;
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// GET PROFILE
// GET /api/profile/<userId>/
// -------------------------
export const getProfile = async (userId) => {
  if (!userId) return { error: "Missing userId" };

  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load profile" };

    return parsed.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// UPDATE PROFILE
// POST /api/profile/update/<userId>/
// profileData is an object: { full_name, email, phone, school_name, school_address }
// -------------------------
export const updateProfile = async (userId, profileData) => {
  if (!userId) return { error: "Missing userId" };

  try {
    const response = await fetch(`${API_BASE_URL}/profile/update/${userId}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to update profile" };

    return parsed.data;
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// DASHBOARD DATA ENDPOINTS
// -------------------------

// Get Reports Data (for school admin - ALL grades)
export const getReportsData = async (adminEmail) => {
  try {
    const url = adminEmail 
      ? `${API_BASE_URL}/school/student-reports/?admin_email=${encodeURIComponent(adminEmail)}`
      : `${API_BASE_URL}/dashboard/reports/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load reports data" };

    return parsed.data;
  } catch (error) {
    console.error("Reports Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Progress Data (for school admin - ALL grades)
export const getProgressData = async (adminEmail) => {
  try {
    const url = adminEmail 
      ? `${API_BASE_URL}/school/student-progress/?admin_email=${encodeURIComponent(adminEmail)}`
      : `${API_BASE_URL}/dashboard/progress/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load progress data" };

    return parsed.data;
  } catch (error) {
    console.error("Progress Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Payments Data
export const getPaymentsData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.class) params.append("class", filters.class);
    if (filters.search) params.append("search", filters.search);
    if (filters.date) params.append("date", filters.date);

    const url = `${API_BASE_URL}/dashboard/payments/${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load payments data" };

    return parsed.data;
  } catch (error) {
    console.error("Payments Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Overview Data
export const getOverviewData = async (adminEmail) => {
  try {
    const url = adminEmail 
      ? `${API_BASE_URL}/dashboard/overview/?admin_email=${encodeURIComponent(adminEmail)}`
      : `${API_BASE_URL}/dashboard/overview/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load overview data" };

    return parsed.data;
  } catch (error) {
    console.error("Overview Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Attendance Data
export const getAttendanceData = async (adminEmail) => {
  try {
    const url = adminEmail 
      ? `${API_BASE_URL}/school/attendance/?admin_email=${encodeURIComponent(adminEmail)}`
      : `${API_BASE_URL}/dashboard/attendance/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load attendance data" };

    return parsed.data;
  } catch (error) {
    console.error("Attendance Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Tickets Data
export const getTicketsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/tickets/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load tickets data" };

    return parsed.data;
  } catch (error) {
    console.error("Tickets Data Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get Teacher Registrations
export const getTeacherRegistrations = async (adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/teacher-registrations/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load teacher registrations" };

    return parsed.data;
  } catch (error) {
    console.error("Teacher Registrations Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Approve Teacher
export const approveTeacher = async (teacherId, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/teacher/${teacherId}/approve/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to approve teacher" };

    return parsed.data;
  } catch (error) {
    console.error("Approve Teacher Error:", error);
    return { error: "Network Error" };
  }
};

// Reject Teacher
export const rejectTeacher = async (teacherId, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/teacher/${teacherId}/reject/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to reject teacher" };

    return parsed.data;
  } catch (error) {
    console.error("Reject Teacher Error:", error);
    return { error: "Network Error" };
  }
};

// Block/Unblock Teacher
export const blockTeacher = async (teacherId, action, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/teacher/${teacherId}/block/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action }),
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || `Failed to ${action} teacher` };

    return parsed.data;
  } catch (error) {
    console.error("Block Teacher Error:", error);
    return { error: "Network Error" };
  }
};

// Get Parent Registrations
export const getParentRegistrations = async (adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/parent-registrations/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load parent registrations" };

    return parsed.data;
  } catch (error) {
    console.error("Parent Registrations Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Approve Parent
export const approveParent = async (parentId, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/parent/${parentId}/approve/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to approve parent" };

    return parsed.data;
  } catch (error) {
    console.error("Approve Parent Error:", error);
    return { error: "Network Error" };
  }
};

// Reject Parent
export const rejectParent = async (parentId, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/parent/${parentId}/reject/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to reject parent" };

    return parsed.data;
  } catch (error) {
    console.error("Reject Parent Error:", error);
    return { error: "Network Error" };
  }
};

// Block/Unblock Parent
export const blockParent = async (parentId, action, adminEmail) => {
  try {
    const url = `${API_BASE_URL}/school/parent/${parentId}/block/?admin_email=${encodeURIComponent(adminEmail)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action }),
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || `Failed to ${action} parent` };

    return parsed.data;
  } catch (error) {
    console.error("Block Parent Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// SCHOOL ADMIN ENDPOINTS
// -------------------------

// Get all teachers in admin's school
export const getSchoolTeachers = async (adminEmail) => {
  if (!adminEmail) return { error: "Admin email is required" };
  
  try {
    const response = await fetch(`${API_BASE_URL}/school/teachers/?admin_email=${encodeURIComponent(adminEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load teachers data" };

    return parsed.data;
  } catch (error) {
    console.error("School Teachers Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get all students in admin's school
export const getSchoolStudents = async (adminEmail) => {
  if (!adminEmail) return { error: "Admin email is required" };
  
  try {
    const response = await fetch(`${API_BASE_URL}/school/students/?admin_email=${encodeURIComponent(adminEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load students data" };

    return parsed.data;
  } catch (error) {
    console.error("School Students Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// Get all parents linked to students in admin's school
export const getSchoolParents = async (adminEmail) => {
  if (!adminEmail) return { error: "Admin email is required" };
  
  try {
    const response = await fetch(`${API_BASE_URL}/school/parents/?admin_email=${encodeURIComponent(adminEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await safeParse(response);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.ok) return { error: parsed.data?.error || "Failed to load parents data" };

    return parsed.data;
  } catch (error) {
    console.error("School Parents Fetch Error:", error);
    return { error: "Network Error" };
  }
};

// -------------------------
// Optional: export default obj for convenience
// -------------------------
export default {
  signupAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  getReportsData,
  getProgressData,
  getPaymentsData,
  getOverviewData,
  getAttendanceData,
  getTicketsData,
  getSchoolTeachers,
  getSchoolStudents,
  getSchoolParents,
};
