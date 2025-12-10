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
const API_BASE_URL = "http://127.0.0.1:8000/api";

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
// Optional: export default obj for convenience
// -------------------------
export default {
  signupAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
};
