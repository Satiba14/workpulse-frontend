import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Camera, User, Mail, Phone, Briefcase, Shield, Key, LogOut, 
  CheckCircle2, AlertCircle, Loader2, Calendar,Clock, Activity, Hash, Edit3, X 
} from 'lucide-react';
import Layout from '../components/Layout';
const API_BASE = import.meta.env.VITE_API_BASE_URL; 
const getToken = () => localStorage.getItem('access_token');

export default function Profile() {
  // State Management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Toast / Notifications
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    designation: '',
  });
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Configuration for Axios Headers
  const authHeaders = {
    headers: { Authorization: `Bearer ${getToken()}` }
  };

  // Fetch Profile on Mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/profile/`, authHeaders);
      const data = res.data;
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        designation: data.designation || '',
      });
      setPreviewImage(data.profile_image || null);
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true); // Auto-trigger edit mode if they change image
    }
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "phone") {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phone: digits,
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

 const cancelEdit = () => {
  if (!profile) {
    setIsEditing(false);
    return;
  }

  setIsEditing(false);
  setFormData({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    designation: profile.designation || '',
  });
  setPreviewImage(profile.profile_image || null);
  setSelectedImage(null);
};

  // API Call: Save Profile
  const saveProfile = async () => {
    try {
      setSaving(true);
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('phone', formData.phone);
      submitData.append('designation', formData.designation);
      if (selectedImage) {
        submitData.append('profile_image', selectedImage);
      }

      const res = await axios.put(`${API_BASE}/profile/`, submitData, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      setProfile(res.data);
      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // API Call: Update Password (Placeholder endpoint)
  const updatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return showToast('Passwords do not match', 'error');
    }
    try {
      setPasswordSaving(true);
      await axios.post(`${API_BASE}/profile/change-password/`, passwordForm, authHeaders);
      showToast('Password updated successfully');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  // API Call: Logout all devices (Placeholder endpoint)
  const handleLogoutAll = async () => {
    if (window.confirm("Are you sure you want to log out from all other devices?")) {
      try {
        await axios.post(`${API_BASE}/auth/logout-all/`, {}, authHeaders);
        showToast('Successfully logged out of all other devices');
      } catch (err) {
        showToast('Failed to log out of devices', 'error');
      }
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <Layout bgClass="bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 h-64 rounded-2xl border border-gray-100 dark:border-slate-800"></div>
              <div className="bg-white dark:bg-slate-900 h-48 rounded-2xl border border-gray-100 dark:border-slate-800"></div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 h-80 rounded-2xl border border-gray-100 dark:border-slate-800"></div>
              <div className="bg-white dark:bg-slate-900 h-64 rounded-2xl border border-gray-100 dark:border-slate-800"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Common Input Class
  const inputClass = `w-full px-4 py-2.5 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
    isEditing ? 'border-gray-200 dark:border-slate-700 focus:border-blue-500' : 'border-transparent bg-transparent px-0 py-0 font-medium'
  }`;

  return (
    <Layout bgClass="bg-gray-50/50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto pb-12 h-full overflow-y-auto pr-2">
        
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-bold text-white transition-all transform translate-y-0 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {toast.message}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={24} className="text-blue-600" />
              Admin Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl shadow-sm transition-all">
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl transition-all">
                <X size={15} /> Cancel
              </button>
              <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />} Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card 1: Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 dark:opacity-20"></div>
              
              <div className="relative group mt-4">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 shadow-lg bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors border-2 border-white dark:border-slate-900">
                    <Camera size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{profile?.full_name || 'Admin User'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
              
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">
                  {profile?.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                </span>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">
                  Active
                </span>
              </div>
            </div>

            {/* Card 3: Account Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-5">
                <Activity size={16} className="text-blue-500" /> Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-800/50 pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Calendar size={14} /> Created On</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{profile?.created_at
  ? new Date(profile.created_at).toLocaleDateString()
  : "-" || 'Jan 1, 2026'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-800/50 pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Clock size={14} /> Last Login</div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
  {profile?.last_login
    ? new Date(profile.last_login).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "-"}
</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Hash size={14} /> User ID</div>
                  <span className="text-xs font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{profile?.id?.slice(0, 8) || 'USR-001'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 2: Personal Information */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6">
                <User size={16} className="text-blue-500" /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Full Name</label>
                  {isEditing ? (
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className={inputClass} />
                  ) : (
                    <p className={inputClass}>{profile?.full_name || '—'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Email Address</label>
                  <p className={`${inputClass} text-gray-500 dark:text-gray-400 cursor-not-allowed`} title="Email cannot be changed">{profile?.email || '—'}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Phone Number</label>
                  <div className="relative">
                    {isEditing && <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                    {isEditing ? (
                      <input
                            type="tel"
                            name="phone"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`${inputClass} pl-9`}
                            placeholder="Enter 10 digit phone number"
                            />
                    ) : (
                      <p className={inputClass}>{profile?.phone
  ? `+91 ${profile.phone}`
  : '—'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Designation</label>
                  <div className="relative">
                    {isEditing && <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                    {isEditing ? (
                      <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className={`${inputClass} pl-9`} />
                    ) : (
                      <p className={inputClass}>{profile?.designation || '—'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Security Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6">
                <Key size={16} className="text-blue-500" /> Security Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Current Password</label>
                  <input type="password" name="current_password" value={passwordForm.current_password} onChange={handlePasswordChange} placeholder="Enter current password" 
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">New Password</label>
                  <input type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} placeholder="Enter new password" 
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Confirm Password</label>
                  <input type="password" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} placeholder="Confirm new password" 
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="md:col-span-2 mt-2">
                  <button onClick={updatePassword} disabled={!passwordForm.current_password || !passwordForm.new_password || passwordSaving} 
                    className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />} Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Card 5: Danger Zone */}
            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-1">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-red-500/80 dark:text-red-400/80">Log out from all devices except this one to secure your account.</p>
                </div>
                <button onClick={handleLogoutAll} className="flex-shrink-0 px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 border border-red-200 dark:border-red-800/50">
                  <LogOut size={14} /> Logout All Devices
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}