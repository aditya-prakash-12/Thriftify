import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  // Store all form values in state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  // helper for simple regex validation or others can go here


  // Update state on input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic required fields check
    const required = [
      "firstName",
      "username",
      "email",
      "phone",
      "password",
    ];
    for (let field of required) {
      if (!formData[field].trim()) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    // email format simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // phone digits only check
    if (!/^\d{10,15}$/.test(formData.phone)) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }

    // Password match validation
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // optional: password strength
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("https://thriftify-j4ll.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // confirmPassword NOT sent
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          ← Back to Home
        </button>

        <form
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 space-y-8"
          onSubmit={handleSubmit}
        >

          <div>
            <h2 className="text-2xl font-semibold text-white">Create Your Account</h2>
            <p className="text-gray-400 text-sm">
              Register to buy and sell second-hand clothes easily.
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-white mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

          </div>

          {/* Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-white mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-lg text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Register
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Signup;
