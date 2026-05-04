import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    gender: '',
    city: '',
    state: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:4000/api/user/profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Update user state in context and localStorage
        updateUser(data.user);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="profile-page container py-5">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page container py-5">
      <div className="profile-header mb-4">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-4`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-info-grid">
              <div className="info-item">
                <label>First Name:</label>
                <span>{user.firstName}</span>
              </div>
              <div className="info-item">
                <label>Last Name:</label>
                <span>{user.lastName || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Username:</label>
                <span>{user.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{user.gender || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>City:</label>
                <span>{user.city || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>State:</label>
                <span>{user.state || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Country:</label>
                <span>{user.country || 'Not provided'}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="btn-edit-profile"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form className="profile-edit-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .profile-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
        }

        .profile-content {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .info-item span {
          color: #111827;
          font-size: 1rem;
        }

        .profile-actions {
          text-align: center;
        }

        .btn-edit-profile {
          background: #6367ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-edit-profile:hover {
          background: #8494ff;
        }

        .profile-edit-form {
          max-width: 100%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6367ff;
          box-shadow: 0 0 0 3px rgba(99, 103, 255, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-cancel,
        .btn-save {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: white;
          border: 1px solid #d1d5db;
          color: #6b7280;
        }

        .btn-cancel:hover {
          background: #f9fafb;
        }

        .btn-save {
          background: #6367ff;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background: #8494ff;
        }

        .btn-save:disabled,
        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid,
          .profile-info-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .profile-content {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}

export default Profile;
