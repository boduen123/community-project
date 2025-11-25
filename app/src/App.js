import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Placeholder imports for the dashboard components
import Dashboard from "./page/Mudugudu";
import DashboardBohejuru from "./components/Abayobozi bo hejuru";
import DashboardIsibo from "./components/Isibodashboard";
import DashboardUmunyamabanga from "./components/DashboardUmunyamabanga";

// ===================== MODERN STYLES & ANIMATIONS =====================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    :root {
      --primary: #4f46e5; /* Indigo */
      --primary-hover: #4338ca;
      --secondary: #ec4899; /* Pink */
      --bg-gradient: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      --glass-bg: rgba(255, 255, 255, 0.85);
      --glass-border: 1px solid rgba(255, 255, 255, 0.5);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --text-main: #1e293b;
      --text-muted: #64748b;
      --radius: 16px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-gradient);
      min-height: 100vh;
      color: var(--text-main);
      overflow-x: hidden;
      position: relative;
    }

    /* Animated Background Mesh */
    body::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%);
      animation: rotateBg 30s linear infinite;
      z-index: -1;
      pointer-events: none;
    }

    @keyframes rotateBg {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .page-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    /* Glassmorphism Card */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: var(--glass-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      padding: 2.5rem;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .login-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      max-width: 1000px;
      padding: 0;
      overflow: hidden;
    }

    .brand-section {
      background: rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      position: relative;
    }

    .form-section {
      padding: 3rem;
      background: var(--glass-bg);
      position: relative;
    }

    /* Loading Screen Styles */
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      overflow: hidden;
    }

    .loading-bg-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: floatShape 6s ease-in-out infinite;
    }

    .bg-shape:nth-child(1) {
      width: 100px;
      height: 100px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .bg-shape:nth-child(2) {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .bg-shape:nth-child(3) {
      width: 80px;
      height: 80px;
      bottom: 30%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes floatShape {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }

    .loading-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
    }

    .logo-container {
      margin-bottom: 2rem;
      position: relative;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      position: relative;
      overflow: hidden;
    }

    .logo-icon {
      font-size: 3rem;
      color: white;
      position: relative;
      z-index: 2;
    }

    .logo-ring {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid transparent;
      border-radius: 50%;
      border-top: 2px solid white;
      animation: spin 2s linear infinite;
    }

    .loading-text {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      opacity: 0;
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .loading-subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin-bottom: 2rem;
      opacity: 0;
      animation: fadeInUp 0.8s ease-out 0.3s forwards;
    }

    .progress-container {
      width: 300px;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, white, rgba(255, 255, 255, 0.7));
      border-radius: 10px;
      width: 0;
      position: relative;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .loading-dots {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .loading-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }
    .loading-dot:nth-child(3) { animation-delay: 0s; }

    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0);
      } 40% { 
        transform: scale(1);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Form Styles */
    .form-container {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease-out;
    }

    .form-container.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Book Animation */
    .books-container {
      display: flex;
      gap: 15px;
      perspective: 1000px;
      margin-bottom: 2rem;
    }
    .book {
      width: 60px;
      height: 90px;
      position: relative;
      transform-style: preserve-3d;
      transition: var(--transition);
      cursor: pointer;
    }
    .book:hover { transform: translateY(-10px) scale(1.1); }
    .book-cover {
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      border-radius: 4px;
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
      z-index: 2;
    }
    .book-page {
      background: white;
      position: absolute;
      inset: 2px 2px 2px 0;
      transform-origin: left;
      z-index: 1;
      box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
    }
    /* Simple flip animation on load */
    .book:nth-child(1) { animation: float 3s ease-in-out infinite; }
    .book:nth-child(2) { animation: float 3s ease-in-out infinite 0.5s; }
    .book:nth-child(3) { animation: float 3s ease-in-out infinite 1s; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Inputs */
    .input-wrapper {
      position: relative;
      margin-bottom: 1.5rem;
    }
    
    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      transition: var(--transition);
      z-index: 10;
    }

    .form-control, .form-select {
      padding: 14px 14px 14px 48px;
      border-radius: 12px;
      border: 2px solid transparent;
      background: #f1f5f9;
      font-weight: 500;
      transition: var(--transition);
      font-size: 0.95rem;
    }

    .form-control:focus, .form-select:focus {
      background: white;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
      transform: translateY(-2px);
    }
    
    .form-control:focus ~ .input-icon {
      color: var(--primary);
    }

    /* Buttons */
    .btn-modern {
      padding: 14px;
      border-radius: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      border: none;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .btn-primary-modern {
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      color: white;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .btn-primary-modern:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
      color: white;
    }

    .btn-primary-modern:active { transform: translateY(0); }

    /* Loading Overlay */
    .loader-container {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(5px);
      z-index: 50;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: var(--radius);
    }

    /* Responsive Adjustments */
    @media (max-width: 992px) {
      .login-layout {
        grid-template-columns: 1fr;
        max-width: 500px;
      }
      .brand-section {
        padding: 2rem;
        background: rgba(255,255,255,0.2);
      }
      .books-container { margin-bottom: 1rem; }
      .loading-text { font-size: 1.25rem; }
      .loading-subtitle { font-size: 0.9rem; }
      .progress-container { width: 250px; }
    }

    @media (max-width: 768px) {
      .page-container { padding: 1rem; }
      .glass-card { padding: 1.5rem; }
      .progress-container { width: 200px; }
      .logo-circle { width: 100px; height: 100px; }
      .logo-icon { font-size: 2.5rem; }
    }

    .auth-title {
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    a {
      text-decoration: none;
      color: var(--primary);
      font-weight: 600;
      transition: var(--transition);
    }
    a:hover { color: var(--secondary); }

    /* Skip animation for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .loading-screen,
      .loading-text,
      .loading-subtitle,
      .progress-bar,
      .loading-dot,
      .bg-shape {
        animation: none !important;
        transition: none !important;
      }
    }
  `}</style>
);

// ===================== LOADING SCREEN COMPONENT =====================
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-bg-shapes">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>
      
      <div className="loading-content">
        <motion.div 
          className="logo-container"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 10,
            delay: 0.2 
          }}
        >
          <div className="logo-circle">
            <motion.i 
              className="bi bi-building logo-icon"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="logo-ring"></div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="loading-text">Umudugudu Dashboard</h2>
              <p className="loading-subtitle">Tegereza gato gukora ibikorwa byacu...</p>
              
              <div className="progress-container">
                <motion.div 
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ===================== MAIN APP =====================
function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:role" element={<RoleDashboard />} />
        </Routes>
      </div>
    </>
  );
}

// ===================== LOGIN COMPONENT =====================
const Login = () => {
  const [national_id, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    setShowForm(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!national_id) newErrors.national_id = "Indangamuntu ni ngombwa";
    if (national_id && national_id.length !== 16) newErrors.national_id = "Indangamuntu igomba kuba imibare 16";
    if (!password) newErrors.password = "Ijambo ry'ibanga ni ngombwa";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", { national_id, password });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      navigate(`/dashboard/${res.data.role}`);
    } catch (err) {
      alert(err.response?.data?.error || "Ikosa mu kwinjira!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!showForm && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <motion.div 
        className="glass-card login-layout shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: showForm ? 1 : 0,
          scale: showForm ? 1 : 0.9,
          y: showForm ? 0 : 20
        }}
        transition={{ 
          duration: 0.6,
          delay: showForm ? 0.2 : 0,
          type: "spring",
          stiffness: 100
        }}
        style={{
          display: showForm ? 'grid' : 'none'
        }}
      >
        {/* Left Side - Artistic/Brand */}
        <motion.div 
          className="brand-section text-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ 
            x: showForm ? 0 : -50, 
            opacity: showForm ? 1 : 0 
          }}
          transition={{ 
            duration: 0.6,
            delay: showForm ? 0.4 : 0 
          }}
        >
          <motion.div 
            className="books-container"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: showForm ? 0 : 20, 
              opacity: showForm ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5,
              delay: showForm ? 0.6 : 0 
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="book" 
                initial={{ scale: 0, rotateY: -90 }}
                animate={{ 
                  scale: showForm ? 1 : 0,
                  rotateY: showForm ? 0 : -90
                }}
                transition={{ 
                  duration: 0.6,
                  delay: showForm ? 0.7 + (i * 0.1) : 0,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="book-cover">
                  {i === 0 ? <i className="bi bi-house"></i> : i === 1 ? <i className="bi bi-people"></i> : <i className="bi bi-graph-up"></i>}
                </div>
                <div className="book-page"></div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.h2 
            className="fw-bold mb-2 text-dark"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: showForm ? 0 : 20, 
              opacity: showForm ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5,
              delay: showForm ? 0.8 : 0 
            }}
          >
            Murakaza Neza
          </motion.h2>
          <motion.p 
            className="text-muted small"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: showForm ? 0 : 20, 
              opacity: showForm ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5,
              delay: showForm ? 0.9 : 0 
            }}
          >
            Urubuga rwo gucunga amakuru y'umudugudu mu buryo bw'ikoranabuhanga.
          </motion.p>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="form-section position-relative"
          initial={{ x: 50, opacity: 0 }}
          animate={{ 
            x: showForm ? 0 : 50, 
            opacity: showForm ? 1 : 0 
          }}
          transition={{ 
            duration: 0.6,
            delay: showForm ? 0.3 : 0 
          }}
        >
          {isLoading && (
            <motion.div 
              className="loader-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="spinner-border text-primary" 
                role="status"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: showForm ? 0 : -20, 
              opacity: showForm ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5,
              delay: showForm ? 0.5 : 0 
            }}
          >
            <h3 className="auth-title">Injira muri Konti</h3>
            <p className="text-muted small">Koresha indangamuntu yawe kugirango winjire.</p>
          </motion.div>

          <motion.form 
            onSubmit={handleLogin} 
            noValidate
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: showForm ? 0 : 20, 
              opacity: showForm ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5,
              delay: showForm ? 0.6 : 0 
            }}
          >
            <div className="input-wrapper">
              <motion.input
                className={`form-control ${errors.national_id ? 'is-invalid' : ''}`}
                placeholder="Indangamuntu (16 digits)"
                value={national_id}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0,16))}
                maxLength={16}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                whileFocus={{ scale: 1.02 }}
              />
              <i className="bi bi-person-badge input-icon"></i>
              {errors.national_id && (
                <motion.div 
                  className="invalid-feedback d-block mt-1 text-start"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {errors.national_id}
                </motion.div>
              )}
            </div>

            <div className="input-wrapper">
              <motion.input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Ijambo ry'ibanga"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileFocus={{ scale: 1.02 }}
              />
              <i className="bi bi-key input-icon"></i>
              <motion.button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none"
                style={{ zIndex: 10, marginRight: '10px' }}
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.i 
                  className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}
                  animate={{ rotate: showPassword ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              {errors.password && (
                <motion.div 
                  className="invalid-feedback d-block mt-1 text-start"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {errors.password}
                </motion.div>
              )}
            </div>

            <motion.button 
              className="btn-modern btn-primary-modern mt-2" 
              disabled={isLoading}
              type="submit"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Tegereza...
                </>
              ) : (
                <>
                  Injira Aho Ujya 
                  <motion.i 
                    className="bi bi-arrow-right"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: showForm ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-muted small mb-0">
              Nta konti ufite? <Link to="/register">Iyandikishe Hano</Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

// ===================== REGISTER COMPONENT =====================
const Register = () => {
  const [formData, setFormData] = useState({
    national_id: "",
    fullname: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if(errors[name]) setErrors(prev => ({...prev, [name]: null}));
  };

  const validateForm = () => {
    const newErrors = {};
    const { national_id, fullname, email, telefone, password, confirmPassword, role } = formData;
    
    if (!national_id || national_id.length !== 16) newErrors.national_id = "Imibare 16 irakenewe";
    if (!fullname) newErrors.fullname = "Amazina arasabwa";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email ntiyemewe";
    if (!telefone || !/^07\d{8}$/.test(telefone)) newErrors.telefone = "Telefone igomba kuba 07xxxxxxxx";
    if (!password || password.length < 6) newErrors.password = "Nibura inyuguti 6";
    if (password !== confirmPassword) newErrors.confirmPassword = "Amagambo y'ibanga ntahura";
    if (!role) newErrors.role = "Hitamo inshingano";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/register", formData);
      alert("✅ Kwiyandikisha byagenze neza!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Ikosa mu kwiyandikisha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-card shadow-lg" 
      style={{ maxWidth: '700px' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: showForm ? 1 : 0,
        scale: showForm ? 1 : 0.9
      }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
    >
      {isLoading && (
        <motion.div 
          className="loader-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="spinner-border text-success" 
            role="status"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
      
      <motion.div 
        className="text-center mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: showForm ? 0 : -20, 
          opacity: showForm ? 1 : 0 
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" 
          style={{width: 60, height: 60}}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <motion.i 
            className="bi bi-person-plus-fill fs-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <h3 className="auth-title">Iyandikishe</h3>
        <p className="text-muted small">Uzuzamo amakuru yawe nyayo kugirango ufungure konti.</p>
      </motion.div>

      <form onSubmit={handleRegister} noValidate>
        <motion.div 
          className="grid-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: showForm ? 0 : 20, 
            opacity: showForm ? 1 : 0 
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="national_id"
              className={`form-control ${errors.national_id ? 'is-invalid' : ''}`} 
              placeholder="Indangamuntu (16)" 
              value={formData.national_id}
              onChange={(e) => setFormData(prev => ({...prev, national_id: e.target.value.replace(/\D/g, '').slice(0,16)}))}
              maxLength={16}
            />
            <i className="bi bi-card-heading input-icon"></i>
            {errors.national_id && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.national_id}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="fullname"
              className={`form-control ${errors.fullname ? 'is-invalid' : ''}`} 
              placeholder="Amazina yose" 
              value={formData.fullname}
              onChange={handleChange} 
            />
            <i className="bi bi-person input-icon"></i>
            {errors.fullname && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.fullname}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: showForm ? 0 : 20, 
            opacity: showForm ? 1 : 0 
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              placeholder="Email Aderesi" 
              value={formData.email}
              onChange={handleChange} 
            />
            <i className="bi bi-envelope input-icon"></i>
            {errors.email && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.email}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="telefone"
              className={`form-control ${errors.telefone ? 'is-invalid' : ''}`} 
              placeholder="Telefone (07...)" 
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value.replace(/\D/g, '').slice(0,10)}))}
              maxLength={10}
            />
            <i className="bi bi-telephone input-icon"></i>
            {errors.telefone && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.telefone}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: showForm ? 0 : 20, 
            opacity: showForm ? 1 : 0 
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="password"
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              placeholder="Ijambo ry'ibanga" 
              value={formData.password}
              onChange={handleChange} 
            />
            <i className="bi bi-key input-icon"></i>
            {errors.password && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.password}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="input-wrapper"
            whileFocus={{ scale: 1.02 }}
          >
            <input 
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
              placeholder="Emeza ijambo ry'ibanga" 
              value={formData.confirmPassword}
              onChange={handleChange} 
            />
            <i className="bi bi-shield-lock input-icon"></i>
            {errors.confirmPassword && (
              <motion.div 
                className="invalid-feedback small"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {errors.confirmPassword}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="form-check mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: showForm ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="showPass" 
            checked={showPassword} 
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label className="form-check-label small text-muted" htmlFor="showPass">
            Erekana amagambo y'ibanga
          </label>
        </motion.div>

        <motion.div 
          className="input-wrapper mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: showForm ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <select 
            name="role"
            className={`form-select ${errors.role ? 'is-invalid' : ''}`} 
            value={formData.role}
            onChange={handleChange}
            style={{ paddingLeft: '48px' }}
          >
            <option value="">Hitamo inshingano...</option>
            <option value="Mudugudu">Umukuru w'Umudugudu</option>
            <option value="Isibo">Umuyobozi w'Isibo</option>
            <option value="Umunyamabanga">Umunyamabanga</option>
            <option value="Bohejuru">Umuyobozi wo hejuru</option>
          </select>
          <i className="bi bi-briefcase input-icon"></i>
          {errors.role && (
            <motion.div 
              className="invalid-feedback small"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {errors.role}
            </motion.div>
          )}
        </motion.div>

        <motion.button 
          className="btn-modern" 
          disabled={isLoading} 
          onClick={handleRegister}
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.i 
            className="bi bi-check-lg"
            animate={{ rotate: isLoading ? [0, 360] : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
          />
          Emeza Kwiyandikisha
        </motion.button>
      </form>

      <motion.div 
        className="text-center mt-4 pt-3 border-top"
        initial={{ opacity: 0 }}
        animate={{ opacity: showForm ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-muted small mb-0">
          Ufite konti asanzwe? <Link to="/">Injira Hano</Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

// ===================== ROUTE HANDLER =====================
const RoleDashboard = () => {
  const { role } = useParams();
  
  const DashboardWrapper = ({ children }) => (
    <motion.div 
      className="w-100" 
      style={{minHeight: '80vh', width: '100vw', maxWidth: '100%'}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );

  switch (role) {
    case "Bohejuru": return <DashboardWrapper><DashboardBohejuru /></DashboardWrapper>;
    case "Umunyamabanga": return <DashboardWrapper><DashboardUmunyamabanga /></DashboardWrapper>;
    case "Isibo": return <DashboardWrapper><DashboardIsibo /></DashboardWrapper>;
    default: return <DashboardWrapper><Dashboard /></DashboardWrapper>;
  }
};

export default App;