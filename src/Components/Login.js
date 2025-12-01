import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Preloader from './Preloader';
import './Login.css';

function Login() {
  const [employee_id, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmployeeChange = async (e) => {
    const value = e.target.value;

    setEmployeeId(value);
    if (value.length > 0) {
      try {
        const response = await axios.get(
          `https://darkslategrey-shrew-424102.hostingersite.com/api/get_name.php?employee_id=${value}`
        );
        if (response.data.success) {
          setName(response.data.name);
        } else {
          setName('');
        }
      } catch (err) {
        console.error(err);
        setName('');
      }
    } else {
      setName('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("employee_id", employee_id.toUpperCase()); // always send in CAPS
      form.append("password", password);

      const response = await axios.post(
        'https://darkslategrey-shrew-424102.hostingersite.com/api/employeelogin.php',
        form
      );

      const data = response.data;
      setLoading(false);

      if (data.success) {
        // ✅ Store employee ID and other info in localStorage
        localStorage.setItem("employee_id", employee_id.toUpperCase()); // save in CAPS
        localStorage.setItem("designation", data.designation);
        localStorage.setItem("name", data.name);

        const designation = data.designation?.trim().toLowerCase() || "";

        if (designation === "directr") navigate("/approval");
        else if (designation === "manager") navigate("/certification");
        else if (designation === "sr.manager") navigate("/admin");
        else navigate("/dashboard");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please try again.");
      setLoading(false);
    }
  };





  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const form = new FormData();
  //     form.append("employee_id", employee_id);
  //     form.append("password", password);

  //     const response = await axios.post(
  //       'https://darkslategrey-shrew-424102.hostingersite.com/api/login.php',
  //       form
  //     );

  //     const data = response.data;
  //     setLoading(false);

  //     if (data.success) {
  //       const role = data.role.toLowerCase();
  //       if (role === 'ceo') navigate('/approval');
  //       else if (role === 'manager') navigate('/certification');
  //       else if (role === 'employee') navigate('/dashboard');
  //       else if (role === 'admin') navigate('/admin');
  //       else alert('Unknown role');
  //     } else {
  //       setMessage(data.message || 'Invalid credentials');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage('Login failed. Please try again.');
  //     setLoading(false);
  //   }
  // };


  return (
    <>
      {loading && <Preloader />}
      {/* 🔥 Video Background */}
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/videos/background2.mp4" type="video/mp4" />
        <source src="/videos/background.webm" type="video/webm" />
        <source src="/videos/background.ogv" type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-container">
            <img
              src="/logologin.png"
              alt="Logo"
              className="login-logo"
            />
          </div>

          <h2 className="login-heading">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Employee ID"
              value={employee_id}
              onChange={handleEmployeeChange}
              required
              className="login-input"
              style={{ textTransform: "uppercase" }}
            />

            {name && <p className="welcome-message">Hii, {name}!</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">Login</button>
          </form>

          {message && (
            <p className={message.includes('success') ? "success-message" : "error-message"}>
              {message}
            </p>
          )}

          <div className="register-link">
            Don't have an account?{' '}
            <Link to="/register" className="create-account-link">
              Create Account
            </Link>

            <button
              onClick={() => navigate("/silo")}
              className="silo-btn"
            >
              Silo Calculator
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;








