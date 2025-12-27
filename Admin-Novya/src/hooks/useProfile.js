import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8002/api";

/**
 * Custom hook to manage profile data dynamically from backend
 * @returns {Object} Profile state and loading status
 */
export const useProfile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    school_name: '',
    school_address: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    const userEmail = localStorage.getItem("profileEmail");
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/profile/${userEmail}/`);
      const p = res.data;

      setProfile({
        full_name: p.full_name || '',
        phone: p.phone || '',
        school_name: p.school_name || '',
        school_address: p.school_address || '',
        email: userEmail
      });

      // Sync with localStorage for backward compatibility (optional cache)
      if (p.full_name) localStorage.setItem("fullName", p.full_name);
      if (p.phone) localStorage.setItem("phone", p.phone);
      if (p.school_name) localStorage.setItem("schoolName", p.school_name);
      if (p.school_address) localStorage.setItem("schoolAddress", p.school_address);

    } catch (error) {
      console.error("Profile load error:", error);
      setError(error.response?.data?.error || "Failed to load profile");
      
      // Fallback to localStorage if backend fails (for backward compatibility)
      const fallbackProfile = {
        full_name: localStorage.getItem("fullName") || '',
        phone: localStorage.getItem("phone") || '',
        school_name: localStorage.getItem("schoolName") || '',
        school_address: localStorage.getItem("schoolAddress") || '',
        email: userEmail
      };
      setProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []); // Load on mount

  return {
    profile,
    loading,
    error,
    reloadProfile: loadProfile,
    setProfile
  };
};

