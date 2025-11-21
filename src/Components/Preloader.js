import React from 'react';

const Preloader = () => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      flexDirection: 'column',
    },
    logo: {
      width: '200px',
      height: 'auto',
      marginBottom: '20px',
    },
    spinner: {
      border: '6px solid #f3f3f3',
      borderTop: '6px solid #0072ff',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.overlay}>
      <img src="/logo full.png" alt="Logo" style={styles.logo} />
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Preloader;
