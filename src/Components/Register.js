import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', employee_id: '', password: '', role: ''
  });
  const [message, setMessage] = useState('');




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('employee_id', formData.employee_id);
    form.append('password', formData.password);
    form.append('role', formData.role);

    try {
      const res = await axios.post(
        'https://darkslategrey-shrew-424102.hostingersite.com/api/register.php',
        form
      );
      setMessage(res.data);
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      setMessage("Error occurred: " + (err.response?.data || err.message));
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
      backgroundImage: "url('/images/register.jpg')", 
      backgroundSize: 'cover',
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#fff',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      padding: '35px 30px',
      border: '2px solid #fff',
    },
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
        backgroundColor: '#fdfdfd',
        color: '#2c3e50',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        outline: 'none',
        cursor: 'text',
      },
    select: {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '20px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: '#fdfdfd',
        appearance: 'none', // removes default arrow in some browsers
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '20px',
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
      color: message.includes('successfully') ? '#27ae60' : '#e74c3c',
      fontWeight: '500',
    },
    registerLink: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#2c3e50',
    }  
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
  <div style={{ textAlign: "center", marginBottom: "20px" }}>
    <img 
      src="/logo full.png"
      alt="Logo"
      style={{ width: "300px", height: "100px", objectFit: "contain" }}
    />
  </div>
        <h2 style={styles.heading}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="employee_id"
            type="text"
            placeholder="Employee ID"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <select
            name="role"
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
            <option value="CEO">CEO</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>
        <p style={styles.message}>{message}</p>
        <p style={styles.registerLink}>
  You have Already an account?{' '}
  <Link to="/" style={{ textDecoration: 'underline', color: '#0072ff', fontWeight: 'bold' }}>
    Login
  </Link>
</p>
      </div>
    </div>
  );
};

export default Register;










