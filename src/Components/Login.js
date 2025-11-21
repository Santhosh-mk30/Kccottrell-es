import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Preloader from './Preloader';

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


  const styles = {
    container: {
      position: "relative",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px',
      zIndex: 1,
    },
    videoBackground: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: -1,
    },
   card: {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#ffff', 
  backdropFilter: 'blur(1px)',        
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  padding: '35px 30px',
  border: '2px solid rgba(255,255,255,0.3)',

}
,
    heading: {
      textAlign: 'center',
      color: '#2c3e50',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
    },
    input: {
      width: '90%',
      padding: '12px 15px',
      marginBottom: '15px',
      borderRadius: '10px',
      border: '1px solid #ccc',
      fontSize: '16px',
      backgroundColor: 'rgba(255,255,255,0)', 
      color: '#2c3e50',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(to right, #00c6ff, #0072ff)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    message: {
      marginTop: '15px',
      textAlign: 'center',
      color: message.includes('success') ? '#27ae60' : '#e74c3c',
      fontWeight: '500',
    },
    registerLink: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#2c3e50',
    },
    
  };

  return (
    <>
      {loading && <Preloader />}
      {/* 🔥 Video Background */}
      <video autoPlay loop muted playsInline style={styles.videoBackground}>
        <source src="/videos/background2.mp4" type="video/mp4" />
        <source src="/videos/background.webm" type="video/webm" />
        <source src="/videos/background.ogv" type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src="/logologin.png"
              alt="Logo"
              style={{ width: "300px", height: "100px", objectFit: "contain" }}
            />
          </div>

          <h2 style={styles.heading}>Login</h2>
          <form onSubmit={handleLogin}>
            <input
  type="text"
  placeholder="Employee ID"
  value={employee_id}
  onChange={handleEmployeeChange}
  required
  style={{
    ...styles.input,
    textTransform: "uppercase" // visually caps lock
  }}
/>

            {name && <p style={{ color: '#2980b9', marginTop: '5px' }}>Hii, {name}!</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>

          <p style={styles.message}>{message}</p>
          <p style={styles.registerLink}>
            Don't have an account?{' '}
              <button
  onClick={() => navigate("/silo")}
  style={{
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Silo Calculator
</button>

            <Link to="/register" style={{ textDecoration: 'underline', color: '#0072ff', fontWeight: 'bold' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;









