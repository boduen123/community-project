import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Added Bootstrap Icons
import Dashboard from "./page/Mudugudu";
import DashboardBohejuru from "./components/Abayobozi bo hejuru";
import DashboardIsibo from "./components/Isibodashboard";
import DashboardUmunyamabanga from "./components/DashboardUmunyamabanga";

// ===================== ENHANCED GLOBAL STYLES =====================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    :root{
      --bg-start:#007bff;
      --bg-end:#00c6ff;
      --card-bg: rgba(255,255,255,0.95);
      --text:#1f2d3d;
      --muted:#6b7a99;
      --primary:#007bff;
      --primary-700:#0056b3;
      --success:#28a745;
      --success-700:#1e7e34;
      --shadow: 0 15px 35px rgba(0,0,0,0.2);
      --radius: 20px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html, body, #root { height: 100%; }
    body { 
      font-family: 'Poppins', sans-serif; 
      background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
      background-attachment: fixed;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      color: var(--text);
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
    }

    /* Animated background particles */
    body::before {
      content: '';
      position: fixed;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
      pointer-events: none;
      animation: floatBackground 20s ease-in-out infinite;
    }

    @keyframes floatBackground {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-20px, -20px); }
    }

    /* Wrapper helpers */
    .page-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    /* Enhanced Book animation */
    .books { 
      display: flex; 
      justify-content: center; 
      align-items: flex-end; 
      gap: 30px;
      margin-bottom: 40px;
      flex-wrap: wrap;
      padding: 0 16px;
    }
    .book { 
      width: 120px; 
      height: 160px; 
      perspective: 1000px; 
      position: relative;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .book:hover { 
      transform: translateY(-10px) scale(1.05); 
    }
    .cover, .page { 
      width:100%; 
      height:100%; 
      border-radius:8px; 
      position:absolute; 
      top:0; 
      left:0;
      transition: transform 0.5s ease;
    }
    .cover { 
      background: linear-gradient(135deg, #0056b3, #007bff); 
      z-index:3; 
      box-shadow:
        inset 0 0 20px rgba(255,255,255,0.2),
        0 5px 15px rgba(0,0,0,0.4); 
      transform-origin:left; 
      animation:openCover 2s ease forwards;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
    }
    .page { 
      background: linear-gradient(to right, #ffffff, #f8f9fa); 
      z-index:2; 
      box-shadow:0 2px 8px rgba(0,0,0,0.25); 
      transform-origin:left; 
      animation:flipPage 2s ease forwards;
    }
    .book:nth-child(1) .cover { animation-delay:0.2s; }
    .book:nth-child(1) .page { animation-delay:0.2s; }
    .book:nth-child(2) .cover, .book:nth-child(2) .page { animation-delay:0.7s; }
    .book:nth-child(3) .cover, .book:nth-child(3) .page { animation-delay:1.2s; }
    .book:nth-child(4) .cover, .book:nth-child(4) .page { animation-delay:1.7s; }

    @keyframes openCover {
      0%{transform:rotateY(0deg);}
      50%{transform:rotateY(-160deg) scale(1.05);}
      100%{transform:rotateY(-160deg) scale(1);}
    }
    @keyframes flipPage {
      0%{transform:rotateY(0deg);}
      50%{transform:rotateY(-160deg) scale(1.02);}
      100%{transform:rotateY(-160deg) scale(1);}
    }

    /* Enhanced Fade-in */
    .fade-in { 
      opacity:0; 
      animation:fadeInForm 1.1s ease forwards; 
    }
    @keyframes fadeInForm { 
      from {opacity:0; transform:translateY(30px) scale(0.95);} 
      to {opacity:1; transform:translateY(0) scale(1);} 
    }

    /* Enhanced Welcome */
    .welcome-text { 
      color:#fff; 
      font-size:2.2rem; 
      font-weight:700; 
      margin-top:18px; 
      text-shadow: 
        0 2px 10px rgba(0,0,0,0.2),
        0 4px 20px rgba(0,0,0,0.1);
      animation:pulse 2s infinite alternate;
      padding: 0 16px;
      text-align: center;
      background: linear-gradient(45deg, #fff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    @keyframes pulse { 
      from{opacity:0.8; transform:scale(1);} 
      to{opacity:1; transform:scale(1.04);} 
    }

    /* Enhanced Skip animation */
    .skip-btn {
      margin-top: 18px;
      background: rgba(255,255,255,0.2);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.45);
      padding: 12px 24px;
      border-radius: 30px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: var(--transition);
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .skip-btn:hover { 
      background: rgba(255,255,255,0.35); 
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }
    .skip-btn i {
      transition: transform 0.3s ease;
    }
    .skip-btn:hover i {
      transform: translateX(5px);
    }

    /* Enhanced Auth card styling */
    .auth-card { 
      width:100%; 
      max-width:460px; 
      background: var(--card-bg); 
      padding:40px; 
      border-radius:var(--radius); 
      box-shadow:
        0 20px 60px rgba(0,0,0,0.3),
        0 0 0 1px rgba(255,255,255,0.1) inset; 
      backdrop-filter: blur(20px);
      text-align:center;
      border: 1px solid rgba(255,255,255,0.25);
      margin: 0 16px;
      position: relative;
      overflow: hidden;
    }
    
    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--primary), transparent);
      animation: loadingBar 2s linear infinite;
    }
    
    @keyframes loadingBar {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .auth-card h3 { 
      margin-bottom:30px; 
      font-weight:700;
      font-size: 2rem;
      background: linear-gradient(135deg, var(--primary), var(--primary-700));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .auth-card h3 i {
      font-size: 2.2rem;
      -webkit-text-fill-color: var(--primary);
    }

    /* Enhanced form controls */
    .input-group {
      position: relative;
      margin-bottom: 20px;
    }

    .input-group-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      transition: var(--transition);
      z-index: 5;
      font-size: 1.1rem;
    }

    .form-control, .form-select { 
      width:100%; 
      padding:15px 15px 15px 45px; 
      border-radius:12px; 
      border:2px solid #e0e0e0; 
      transition:var(--transition); 
      background: rgba(255,255,255,0.9);
      font-size: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    
    .form-control:focus, .form-select:focus { 
      outline:none; 
      border-color:var(--primary); 
      box-shadow:
        0 0 0 4px rgba(0,123,255,0.15),
        0 6px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
      background: #fff;
    }
    
    .form-control:focus ~ .input-group-icon,
    .form-select:focus ~ .input-group-icon {
      color: var(--primary);
      transform: translateY(-50%) scale(1.1);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
      animation: shake 0.5s;
      padding-right: 45px;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }

    /* Enhanced buttons */
    .btn-primary, .btn-success { 
      padding:16px; 
      font-weight:600; 
      border:none; 
      border-radius:12px; 
      transition:var(--transition); 
      width:100%;
      font-size: 1.05rem;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .btn-primary::before, .btn-success::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .btn-primary:hover::before, .btn-success:hover::before {
      width: 300px;
      height: 300px;
    }
    
    .btn-primary { 
      background: linear-gradient(135deg, var(--primary), var(--primary-700)); 
      color:#fff; 
    }
    .btn-primary:hover { 
      background: linear-gradient(135deg, var(--primary-700), #004085);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,123,255,0.3);
    }
    .btn-success { 
      background: linear-gradient(135deg, var(--success), #20c997); 
      color:#fff; 
    }
    .btn-success:hover { 
      background: linear-gradient(135deg, var(--success-700), #1e7e34);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40,167,69,0.3);
    }
    
    .btn:active {
      transform: translateY(0);
    }

    /* Enhanced links */
    a { 
      color: #fff; 
      text-decoration:none; 
      font-weight: 500;
      transition: var(--transition);
      position: relative;
    }
    .auth-card a { 
      color: var(--primary); 
      text-decoration: none;
    }
    .auth-card a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    .auth-card a:hover::after {
      width: 100%;
    }
    a:hover { 
      opacity: 0.9; 
      color: var(--primary-700);
    }

    /* Enhanced Book cover content */
    .book-cover-content { 
      font-size: 2.5rem; 
      text-align: center; 
      transition: transform 0.3s ease; 
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .book:hover .book-cover-content { 
      transform: scale(1.2) rotate(10deg); 
    }

    /* Enhanced Page content */
    .page-content {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 80%; height: 80%;
      background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.9rem; 
      color: #495057;
      font-weight: 600;
      overflow: hidden;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .page-content::before {
      content: '';
      position: absolute; 
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.03),
        rgba(0,0,0,0.03) 1px,
        transparent 1px,
        transparent 2px
      );
    }

    /* Enhanced Password toggle */
    .password-toggle {
      position: absolute;
      right: 15px; 
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #6c757d;
      z-index: 10;
      background: transparent;
      border: 0;
      padding: 5px;
      font-size: 1.2rem;
      transition: var(--transition);
    }
    .password-toggle:hover { 
      color: var(--primary); 
      transform: translateY(-50%) scale(1.1);
    }

    /* Enhanced Loading overlay */
    .loading-overlay {
      position: absolute; 
      inset: 0;
      background: rgba(255,255,255,0.95);
      display: flex; 
      align-items: center; 
      justify-content: center;
      border-radius: var(--radius);
      z-index: 100;
      backdrop-filter: blur(10px);
    }
    
    .loading-overlay .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.3rem;
    }

    /* Enhanced Form validation */
    .is-invalid { 
      border-color: #dc3545 !important;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .invalid-feedback {
      display: block; 
      width: 100%;
      margin-top: 0.5rem; 
      font-size: 0.875em; 
      color: #dc3545;
      text-align: left;
      animation: slideDown 0.3s ease;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    @keyframes slideDown {
      from { 
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .invalid-feedback::before {
      content: '⚠';
      font-size: 1.1em;
    }

    /* Success state */
    .form-control.is-valid {
      border-color: #28a745;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }

    /* Divider */
    .auth-divider {
      margin: 25px 0;
      text-align: center;
      position: relative;
    }
    
    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
    }
    
    .auth-divider span {
      background: var(--card-bg);
      padding: 0 15px;
      position: relative;
      color: var(--muted);
      font-size: 0.9rem;
    }

    /* Focus visible for keyboard users */
    :focus-visible {
      outline: 3px solid rgba(0,123,255,0.5);
      outline-offset: 2px;
      border-radius: 10px;
    }

    /* Reduce motion preference */
    @media (prefers-reduced-motion: reduce) {
      .book, .cover, .page, .fade-in, .welcome-text { 
        animation: none !important; 
        transition: none !important;
      }
    }

    /* Responsive tweaks */
    @media (max-width: 992px) {
      .book { width: 100px; height: 140px; }
      .welcome-text { font-size: 2rem; }
      .auth-card { padding: 30px; }
    }
    @media (max-width: 576px) {
      .book { width: 84px; height: 114px; }
      .books { gap: 16px; }
      .welcome-text { font-size: 1.6rem; }
      .auth-card { 
        padding: 25px;
        max-width: 95%;
      }
      .auth-card h3 { font-size: 1.6rem; }
    }
  `}</style>
);

// ===================== MAIN APP =====================
function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/:role" element={<RoleDashboard />} />
      </Routes>
    </>
  );
}

// ===================== ENHANCED LOGIN =====================
const Login = () => {
  const [showForm, setShowForm] = useState(false);
  const [national_id, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!national_id) newErrors.national_id = "Indangamuntu ni ngombwa";
    if (national_id && national_id.length !== 16) newErrors.national_id = "Indangamuntu igomba kuba ifite imibare 16";
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
      navigate(`/dashboard/${res.data.role}`);
    } catch (err) {
      alert(err.response?.data?.error || "Ikosa mu kwinjira!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center page-shell text-center position-relative">
      {!showForm ? (
        <div>
          <div className="books">
            {[...Array(4)].map((_, i) => (
              <div className="book" key={i} aria-hidden="true">
                <div className="cover">
                  <div className="book-cover-content">
                    {i === 0 ? '🏠' : i === 1 ? '👥' : i === 2 ? '📊' : '📋'}
                  </div>
                </div>
                <div className="page">
                  <div className="page-content">
                    {i === 0 ? 'Umudugudu' : i === 1 ? 'Abaturage' : i === 2 ? 'Ibyerekeye' : 'Raporo'}
                  </div>
                </div>
                <div className="page" style={{ animationDelay: `${i * 0.2 + 0.1}s` }}></div>
              </div>
            ))}
          </div>
          <div className="welcome-text">📚 Murakaza Neza kumudugudu...</div>
          <button className="skip-btn" onClick={() => setShowForm(true)} aria-label="Komeza winjire utanategereje animasiyo">
            Komeza winjire <i className="bi bi-arrow-right-circle"></i>
          </button>
        </div>
      ) : (
        <div className="auth-card fade-in position-relative" role="dialog" aria-modal="true">
          {isLoading && (
            <div className="loading-overlay" aria-live="polite">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <h3><i className="bi bi-shield-lock"></i> Injira</h3>
          <form onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <i className="bi bi-person-badge input-group-icon"></i>
              <input
                className={`form-control ${errors.national_id ? 'is-invalid' : ''}`}
                placeholder="Indangamuntu (16)"
                value={national_id}
                inputMode="numeric"
                maxLength={16}
                pattern="^\d{16}$"
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0,16))}
                required
                aria-invalid={!!errors.national_id}
                aria-describedby={errors.national_id ? 'nid-error' : undefined}
              />
              {errors.national_id && <div id="nid-error" className="invalid-feedback">{errors.national_id}</div>}
            </div>
            <div className="input-group">
              <i className="bi bi-key input-group-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Ijambo ry'ibanga"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'pwd-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hisha ijambo ry'ibanga" : "Erekana ijambo ry'ibanga"}
                aria-pressed={showPassword}
                title={showPassword ? "Hisha" : "Erekana"}
              >
                <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
              {errors.password && <div id="pwd-error" className="invalid-feedback">{errors.password}</div>}
            </div>
            <button className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Injira...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Injira
                </>
              )}
            </button>
          </form>
          <div className="auth-divider">
            <span>cyangwa</span>
          </div>
          <p className="mt-3 text-muted">
            Nta konti ufite? <Link to="/register"><i className="bi bi-person-plus"></i> Iyandikishe hano</Link>
          </p>
        </div>
      )}
    </div>
  );
};

// ===================== ENHANCED REGISTER =====================
const Register = () => {
  const [national_id, setNationalId] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!national_id) newErrors.national_id = "Indangamuntu ni ngombwa";
    if (national_id && national_id.length !== 16) newErrors.national_id = "Indangamuntu igomba kuba ifite imibare 16";
    if (!fullname) newErrors.fullname = "Amazina ni ngombwa";
    if (!email) newErrors.email = "Email ni ngombwa";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email idafite imiterere ikwiye";
    if (!telefone) newErrors.telefone = "Telefone ni ngombwa";
    if (telefone && !/^07\d{8}$/.test(telefone)) newErrors.telefone = "Telefone igomba gutangirana na 07 ikagira imibare 10";
    if (!password) newErrors.password = "Ijambo ry'ibanga ni ngombwa";
    if (password && password.length < 6) newErrors.password = "Ijambo ry'ibanga rigomba kuba rifite nibura inyuguti 6";
    if (!confirmPassword) newErrors.confirmPassword = "Kwemeza ijambo ry'ibanga ni ngombwa";
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Amagambo y'ibanga ntiyahuranye";
    if (!role) newErrors.role = "Hitamo inshingano";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/register", { 
        national_id, 
        fullname, 
        email, 
        telefone, 
        password, 
        role 
      });
      alert("✅ Kwiyandikisha byagenze neza!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Ikosa mu kwiyandikisha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center page-shell">
      <div className="auth-card fade-in position-relative">
        {isLoading && (
          <div className="loading-overlay" aria-live="polite">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <h3><i className="bi bi-person-plus-fill"></i> Iyandikishe</h3>
        <form onSubmit={handleRegister} noValidate>
          <div className="input-group">
            <i className="bi bi-person-badge input-group-icon"></i>
            <input 
              className={`form-control ${errors.national_id ? 'is-invalid' : ''}`} 
              placeholder="Indangamuntu (16)" 
              value={national_id}
              inputMode="numeric"
              maxLength={16}
              pattern="^\d{16}$"
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0,16))}
              required 
              aria-invalid={!!errors.national_id}
              aria-describedby={errors.national_id ? 'reg-nid-error' : undefined}
            />
            {errors.national_id && <div id="reg-nid-error" className="invalid-feedback">{errors.national_id}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-person input-group-icon"></i>
            <input 
              className={`form-control ${errors.fullname ? 'is-invalid' : ''}`} 
              placeholder="Amazina yose" 
              value={fullname}
              onChange={(e) => setFullname(e.target.value)} 
              required 
              aria-invalid={!!errors.fullname}
              aria-describedby={errors.fullname ? 'fullname-error' : undefined}
            />
            {errors.fullname && <div id="fullname-error" className="invalid-feedback">{errors.fullname}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-envelope input-group-icon"></i>
            <input 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              type="email"
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <div id="email-error" className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-telephone input-group-icon"></i>
            <input 
              className={`form-control ${errors.telefone ? 'is-invalid' : ''}`} 
              placeholder="Telefone (07xxxxxxxx)" 
              value={telefone}
              inputMode="numeric"
              maxLength={10}
              pattern="^07\\d{8}$"
              onChange={(e) => setTelefone(e.target.value.replace(/\D/g, '').slice(0,10))}
              required 
              aria-invalid={!!errors.telefone}
              aria-describedby={errors.telefone ? 'tel-error' : undefined}
            />
            {errors.telefone && <div id="tel-error" className="invalid-feedback">{errors.telefone}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-key input-group-icon"></i>
            <input 
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              placeholder="Ijambo ry'ibanga" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'reg-pwd-error' : undefined}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hisha ijambo ry'ibanga" : "Erekana ijambo ry'ibanga"}
              aria-pressed={showPassword}
              title={showPassword ? "Hisha" : "Erekana"}
            >
              <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
            </button>
            {errors.password && <div id="reg-pwd-error" className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-shield-check input-group-icon"></i>
            <input 
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
              placeholder="Kwemeza ijambo ry'ibanga" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hisha ijambo ry'ibanga" : "Erekana ijambo ry'ibanga"}
              aria-pressed={showConfirmPassword}
              title={showConfirmPassword ? "Hisha" : "Erekana"}
            >
              <i className={`bi bi-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
            </button>
            {errors.confirmPassword && <div id="confirm-error" className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <div className="input-group">
            <i className="bi bi-briefcase input-group-icon"></i>
            <select 
              className={`form-select ${errors.role ? 'is-invalid' : ''}`} 
              value={role}
              onChange={(e) => setRole(e.target.value)} 
              required
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              <option value="">Hitamo inshingano</option>
              <option value="Mudugudu">Umukuru w'Umudugudu</option>
              <option value="Isibo">Umuyobozi w'Isibo</option>
              <option value="Umunyamabanga">Umunyamabanga</option>
              <option value="Bohejuru">Umuyobozi wo hejuru</option>
            </select>
            {errors.role && <div id="role-error" className="invalid-feedback">{errors.role}</div>}
          </div>

          <button className="btn btn-success" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iyandikisha...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i>
                Iyandikishe
              </>
            )}
          </button>
        </form>
        <div className="auth-divider">
          <span>cyangwa</span>
        </div>
        <p className="mt-3 text-muted">
          Ufite konti? <Link to="/"><i className="bi bi-box-arrow-in-right"></i> Injira hano</Link>
        </p>
      </div>
    </div>
  );
};

// ===================== ROLE DASHBOARD =====================
const RoleDashboard = () => {
  const { role } = useParams();
  switch (role) {
    case "Bohejuru": return <DashboardBohejuru />;
    case "Umunyamabanga": return <DashboardUmunyamabanga />;
    case "Isibo": return <DashboardIsibo />;
    default: return <Dashboard />;
  }
};

export default App;